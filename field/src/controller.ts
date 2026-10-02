import {
  FrameDecoder,
  HANDSHAKE,
  hex,
  queryInfo,
  queryLocks,
  unlockDoor,
  usbPower,
  type Packet,
  type DoorState,
  type DoorEncoding,
} from "./protocol";
import type { Transport } from "./transport";
export type Log = {
  id: string;
  at: string;
  direction: "sent" | "received" | "event";
  message: string;
  hex?: string;
  mode: "bluetooth" | "simulation";
};
export type Snapshot = {
  status: "disconnected" | "connecting" | "handshaking" | "ready";
  busy: boolean;
  mode: "bluetooth" | "simulation";
  name: string;
  profile: string;
  doors: DoorState[];
  info?: Extract<Packet, { kind: "info" }>;
  lastRead?: string;
  logs: Log[];
};
type Waiter = {
  match: (p: Packet) => boolean;
  resolve: (p: Packet) => void;
  reject: (e: Error) => void;
  timer: ReturnType<typeof setTimeout>;
};
export class MachineController {
  private transport?: Transport;
  private decoder = new FrameDecoder();
  private listeners = new Set<() => void>();
  private waiters = new Set<Waiter>();
  private generation = 0;
  private timeout: number;
  private locksFresh = false;
  private state: Snapshot = {
    status: "disconnected",
    busy: false,
    mode: "bluetooth",
    name: "No machine connected",
    profile: "",
    doors: Array(12).fill("unknown"),
    logs: [],
  };
  constructor(timeout = 5000) {
    this.timeout = timeout;
  }
  getSnapshot = () => this.state;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  private patch(patch: Partial<Snapshot>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((fn) => fn());
  }
  log(
    message: string,
    direction: Log["direction"] = "event",
    bytes?: Uint8Array,
  ) {
    this.patch({
      logs: [
        ...this.state.logs,
        {
          id: crypto.randomUUID(),
          at: new Date().toISOString(),
          direction,
          message,
          hex: bytes ? hex(bytes) : undefined,
          mode: this.state.mode,
        },
      ].slice(-500),
    });
  }
  clearLogs() {
    this.patch({ logs: [] });
  }
  private receive = (bytes: Uint8Array) => {
    this.log("Bluetooth notification", "received", bytes);
    for (const packet of this.decoder.push(bytes)) {
      if (packet.kind === "info")
        this.patch({ info: packet, lastRead: new Date().toISOString() });
      if (packet.kind === "locks") {
        this.locksFresh = true;
        this.patch({
          doors: packet.states,
          lastRead: new Date().toISOString(),
        });
      }
      for (const waiter of [...this.waiters])
        if (waiter.match(packet)) {
          this.waiters.delete(waiter);
          waiter.resolve(packet);
        }
    }
  };
  private async exchange(
    bytes: Uint8Array,
    label: string,
    match: (packet: Packet) => boolean,
    timeout = this.timeout,
  ): Promise<Packet> {
    const transport = this.transport;
    if (!transport) throw new Error("No machine connected.");
    let waiter!: Waiter;
    let rejectDeadline!: (error: Error) => void;
    const deadline = new Promise<never>((_resolve, reject) => {
      rejectDeadline = reject;
    });
    const reply = new Promise<Packet>((resolve, reject) => {
      waiter = {
        match,
        resolve,
        reject,
        timer: setTimeout(() => {
          const error = new Error(
            `${label}: no matching reply or completed write. The result is unknown; inspect the machine before retrying.`,
          );
          rejectDeadline(error);
          reject(error);
        }, timeout),
      };
      this.waiters.add(waiter);
    });
    this.log(label, "sent", bytes);
    try {
      // Bound both the GATT write and reply. A hung native write cannot keep controls busy forever.
      const [, packet] = await Promise.race([
        Promise.all([transport.write(bytes), reply]),
        deadline,
      ]);
      return packet;
    } finally {
      clearTimeout(waiter.timer);
      this.waiters.delete(waiter);
    }
  }

  private async exclusive<T>(action: () => Promise<T>) {
    if (this.state.busy)
      throw new Error("Another command is in progress. Wait for its result.");
    this.patch({ busy: true });
    try {
      return await action();
    } finally {
      this.patch({ busy: false });
    }
  }
  async connect(transport: Transport, f0MeansOpen = true) {
    if (this.state.status !== "disconnected" || this.state.busy)
      throw new Error("Disconnect the current session first.");
    this.transport = transport;
    this.decoder = new FrameDecoder(f0MeansOpen);
    this.locksFresh = false;
    const generation = ++this.generation;
    this.patch({
      status: "connecting",
      mode: transport.kind,
      info: undefined,
      doors: Array(12).fill("unknown"),
      lastRead: undefined,
    });
    await this.exclusive(async () => {
      try {
        await transport.connect(
          (bytes) => {
            if (this.generation === generation) this.receive(bytes);
          },
          () => {
            if (this.generation === generation)
              this.disconnect(
                "Connection lost. Any in-flight door command has an unknown result.",
              );
          },
        );
        if (this.generation !== generation) {
          transport.disconnect();
          throw new Error("Connection cancelled.");
        }
        this.patch({
          name: transport.name,
          profile: transport.profile,
          status: "handshaking",
        });
        await this.authenticate();
      } catch (error) {
        this.disconnect();
        throw error;
      }
    });
  }
  private async authenticate() {
    const ack = await this.exchange(
      HANDSHAKE,
      "Handshake",
      (p) => p.kind === "handshake",
    );
    if (ack.kind !== "handshake" || !ack.accepted)
      throw new Error("The controller rejected the handshake.");
    this.patch({ status: "ready" });
    this.log(
      "Handshake acknowledged. Hardware controls are available after arming.",
    );
    // Info/status queries are optional on some firmware. Handshake remains the readiness gate.
    try {
      await this.readInfoInternal();
    } catch (error) {
      this.log(String(error));
    }
    if (this.state.status === "ready")
      try {
        await this.readLocksInternal();
      } catch (error) {
        this.log(String(error));
      }
  }
  private ready() {
    if (this.state.status !== "ready")
      throw new Error("Connect and complete the handshake first.");
  }
  private readInfoInternal() {
    return this.exchange(
      queryInfo(),
      "Read device information",
      (p) => p.kind === "info",
    );
  }
  private readLocksInternal() {
    return this.exchange(
      queryLocks(),
      "Read door states",
      (p) => p.kind === "locks" && p.source === "query",
    );
  }
  async refresh() {
    return this.exclusive(async () => {
      this.ready();
      await this.readInfoInternal();
      await this.readLocksInternal();
    });
  }
  async readDoors() {
    return this.exclusive(async () => {
      this.ready();
      await this.readLocksInternal();
    });
  }
  async handshake() {
    return this.exclusive(async () => {
      this.ready();
      this.patch({ status: "handshaking", doors: Array(12).fill("unknown") });
      try {
        await this.authenticate();
      } catch (error) {
        this.disconnect("Handshake failed. Reconnect before further commands.");
        throw error;
      }
    });
  }
  async open(door: number, encoding: DoorEncoding) {
    // Validate before touching hardware.
    const command = unlockDoor(door, encoding);
    return this.exclusive(async () => {
      this.ready();
      await this.readLocksInternal();
      if (!this.locksFresh || this.state.doors[door - 1] !== "closed")
        throw new Error(
          `Door ${door} is not confirmed closed. Close it and refresh before opening.`,
        );
      await this.exchange(
        command,
        `Open door ${door} · ${encoding.toUpperCase()} profile`,
        (p) => p.kind === "locks" && p.states[door - 1] === "open",
      );
      this.log(
        `Door ${door}: controller reported OPEN. Product collection still requires a visual check.`,
      );
    });
  }
  async setUsb(enabled: boolean) {
    return this.exclusive(async () => {
      this.ready();
      const bytes = usbPower(enabled);
      this.log(
        `USB ${enabled ? "on" : "off"} requested (APK command)`,
        "sent",
        bytes,
      );
      await this.transport!.write(bytes);
      this.log(
        "USB command written. This protocol has no verified USB acknowledgment; check the port physically.",
      );
    });
  }
  disconnect(message = "Disconnected.") {
    ++this.generation;
    this.transport?.disconnect();
    this.transport = undefined;
    this.decoder.reset();
    this.locksFresh = false;
    for (const w of this.waiters) {
      clearTimeout(w.timer);
      w.reject(new Error(message));
    }
    this.waiters.clear();
    this.patch({
      status: "disconnected",
      doors: Array(12).fill("unknown"),
      info: undefined,
      lastRead: undefined,
    });
    this.log(message);
  }
}
