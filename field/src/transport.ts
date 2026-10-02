import { HANDSHAKE, UUIDS } from "./protocol";
export interface Transport {
  kind: "bluetooth" | "simulation";
  name: string;
  profile: string;
  connect(
    onData: (bytes: Uint8Array) => void,
    onDisconnect: () => void,
  ): Promise<void>;
  write(bytes: Uint8Array): Promise<void>;
  disconnect(): void;
}
export class WebBluetoothTransport implements Transport {
  kind = "bluetooth" as const;
  name = "";
  profile = "";
  private device?: BluetoothDevice;
  private writeCharacteristic?: BluetoothRemoteGATTCharacteristic;
  private notifyCharacteristic?: BluetoothRemoteGATTCharacteristic;
  private notification?: EventListener;
  private disconnected?: EventListener;
  constructor(
    private showAll = false,
    private expectedName = "",
  ) {}
  async connect(onData: (bytes: Uint8Array) => void, onDisconnect: () => void) {
    if (!window.isSecureContext)
      throw new Error(
        "Bluetooth needs HTTPS or localhost. Use the setup guide for Android USB forwarding.",
      );
    if (!navigator.bluetooth)
      throw new Error(
        "This browser has no Web Bluetooth. Use Google Chrome on Android, macOS or Windows.",
      );
    const optionalServices = UUIDS.map((p) => p.service);
    this.device = await navigator.bluetooth.requestDevice(
      this.showAll
        ? { acceptAllDevices: true, optionalServices }
        : {
            filters: [
              { namePrefix: "KSJ" },
              { namePrefix: "B000" },
              { namePrefix: "YJKJ" },
              { services: [0xffc0] },
              { services: [0xfff0] },
            ],
            optionalServices,
          },
    );
    this.name = this.device.name || "Unnamed Bluetooth device";
    if (this.expectedName && this.name !== this.expectedName)
      throw new Error(
        `Expected ${this.expectedName}, but selected ${this.name}. Select the correct device or update the machine settings while disconnected.`,
      );
    this.disconnected = () => {
      this.writeCharacteristic = undefined;
      onDisconnect();
    };
    this.device.addEventListener("gattserverdisconnected", this.disconnected);
    try {
      const server = await this.device.gatt?.connect();
      if (!server)
        throw new Error("The device does not expose Bluetooth GATT.");
      let selected = false;
      for (const profile of UUIDS) {
        let service: BluetoothRemoteGATTService;
        try {
          service = await server.getPrimaryService(profile.service);
        } catch {
          continue;
        }
        // Once a known service is found, do not silently swap on a notification/permission failure.
        this.writeCharacteristic = await service.getCharacteristic(
          profile.write,
        );
        this.notifyCharacteristic = await service.getCharacteristic(
          profile.notify,
        );
        this.notification = (event) => {
          const view = (event.target as BluetoothRemoteGATTCharacteristic)
            .value;
          if (view)
            onData(
              new Uint8Array(view.buffer, view.byteOffset, view.byteLength),
            );
        };
        this.notifyCharacteristic.addEventListener(
          "characteristicvaluechanged",
          this.notification,
        );
        await this.notifyCharacteristic.startNotifications();
        this.profile = profile.name;
        selected = true;
        break;
      }
      if (!selected)
        throw new Error(
          "No KSJ FFC0 or legacy FFF0 service found. Confirm the selected device is your machine.",
        );
    } catch (error) {
      this.disconnect();
      throw error;
    }
  }
  async write(bytes: Uint8Array) {
    const c = this.writeCharacteristic;
    if (!c || !this.device?.gatt?.connected)
      throw new Error(
        "Bluetooth is disconnected. Reconnect before sending a command.",
      );
    const payload = Uint8Array.from(bytes);
    if (c.properties.write) await c.writeValueWithResponse(payload);
    else if (c.properties.writeWithoutResponse)
      await c.writeValueWithoutResponse(payload);
    else
      throw new Error("The selected Bluetooth characteristic is not writable.");
  }
  disconnect() {
    if (this.notification)
      this.notifyCharacteristic?.removeEventListener(
        "characteristicvaluechanged",
        this.notification,
      );
    if (this.disconnected)
      this.device?.removeEventListener(
        "gattserverdisconnected",
        this.disconnected,
      );
    this.device?.gatt?.disconnect();
    this.writeCharacteristic = undefined;
    this.notifyCharacteristic = undefined;
  }
}
export class SimulatedTransport implements Transport {
  kind = "simulation" as const;
  name = "Practice machine";
  profile = "Simulated KSJ · no hardware";
  private receiver?: (bytes: Uint8Array) => void;
  private disconnected?: () => void;
  private states = Array(12).fill(0x0f);
  private timers = new Set<ReturnType<typeof setTimeout>>();
  private authenticated = false;
  fault: "none" | "timeout" | "disconnect" = "none";
  async connect(onData: (bytes: Uint8Array) => void, onDisconnect: () => void) {
    this.receiver = onData;
    this.disconnected = onDisconnect;
  }
  private emit(bytes: number[]) {
    const timer = setTimeout(() => {
      this.timers.delete(timer);
      this.receiver?.(Uint8Array.from(bytes));
    }, 30);
    this.timers.add(timer);
  }
  async write(bytes: Uint8Array) {
    if (!this.receiver) throw new Error("Simulator disconnected.");
    if (this.fault === "disconnect") {
      this.disconnect();
      this.disconnected?.();
      throw new Error("Simulated connection loss.");
    }
    if (this.fault === "timeout") return;
    if (
      bytes.length === HANDSHAKE.length &&
      bytes.every((b, i) => b === HANDSHAKE[i])
    ) {
      this.authenticated = true;
      this.emit([0xe8, 0xf0, 0, 0, 0, 0x8e]);
      return;
    }
    if (!this.authenticated) return;
    if (bytes[0] === 0x66 && bytes[1] === 0xf0)
      this.emit([0x77, 2, 1, 82, 0x51, 0x48, 0x4c, 0x66]);
    if (bytes[0] === 0x66 && bytes[1] === 0xf1)
      this.emit([0x1e, ...this.states, 0x1b]);
    if (bytes[0] === 0xff) {
      let door = bytes[6];
      if (door >= 16) door -= 6;
      if (door < 1 || door > 12) throw new Error("Invalid simulator door.");
      this.states[door - 1] = 0xf0;
      this.emit([0x1c, ...this.states, 0x1b]);
    }
  }
  closeDoor(door: number) {
    this.states[door - 1] = 0x0f;
    this.emit([0x1d, ...this.states, 0x1b]);
  }
  disconnect() {
    for (const timer of this.timers) clearTimeout(timer);
    this.timers.clear();
    this.receiver = undefined;
    this.authenticated = false;
  }
}
