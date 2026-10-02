import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { Button, Logo, Heading1 } from "@decentralpark/ui";
import {
  Bluetooth,
  ArrowUpRight,
  Package,
  Activity,
  BookOpen,
  Settings,
  ArrowDownToLine,
  Plus,
  Power,
  RefreshCw,
  Unplug,
  Check,
  ChevronRight,
  LockKeyhole,
  FlaskConical,
  AlertTriangle,
  X,
  ScanLine,
  MapPin,
  CheckCircle2,
  DoorOpen,
  Trash2,
} from "lucide-react";
import { MachineController } from "./controller";
import { WebBluetoothTransport, SimulatedTransport } from "./transport";
import {
  load,
  save,
  newMachine,
  download,
  parseBackup,
  money,
  labelFromQr,
  checklistSteps,
  machineSchema,
  type Machine,
  type Slot,
  type Order,
} from "./storage";
import { hex, unlockDoor } from "./protocol";
const controller = new MachineController();
const emptySamples = [
  "Toothbrush kit",
  "Period care",
  "Hand sanitizer",
  "Earplugs",
  "Tissues",
  "Soap",
  "Lip balm",
  "Face mask",
  "Bandages",
  "Comb",
  "Snack bar",
  "Water",
];
function errorText(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
export default function App() {
  const [loaded] = useState(load);
  const [data, setData] = useState(loaded.data);
  const [storageError, setStorageError] = useState(loaded.error || "");
  const [view, setView] = useState<
    "machine" | "inventory" | "activity" | "guide"
  >("machine");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"bluetooth" | "simulation">("bluetooth");
  const [armed, setArmed] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [settings, setSettings] = useState(false);
  const [editSlot, setEditSlot] = useState<Slot | null>(null);
  const [selection, setSelection] = useState<{
    door: number;
    kind: "test" | "collect";
  } | null>(null);
  const [usb, setUsb] = useState<boolean | null>(null);
  const [pending, setPending] = useState<Order | null>(null);
  const [qr, setQr] = useState(false);
  const [installEvent, setInstallEvent] = useState<Event | null>(null);
  const simulator = useRef<SimulatedTransport>();
  const importRef = useRef<HTMLInputElement>(null);
  const snapshot = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    controller.getSnapshot,
  );
  const machine = data.machines.find((m) => m.id === data.selectedId)!;
  const ready = snapshot.status === "ready";
  const connected = snapshot.status !== "disconnected";
  const busy = snapshot.busy;
  const canAct = ready && !busy && (mode === "simulation" || armed);
  const machineOrders = data.orders.filter(
    (o) => o.machineId === machine.id && o.mode === mode,
  );
  const stocked = machine.slots.filter(
    (s) => s.quantity > 0 && s.enabled,
  ).length;
  const checkKey = (id: string) => `${machine.id}:${mode}:${id}`;
  const checked = checklistSteps.filter(
    ([id]) => data.checklist[checkKey(id)],
  ).length;
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);
  useEffect(() => {
    if (!storageError)
      try {
        save(data);
      } catch (e) {
        setStorageError(
          `Browser storage failed: ${errorText(e)}. Export a backup now.`,
        );
      }
  }, [data, storageError]);
  useEffect(() => {
    if (snapshot.status === "disconnected") {
      setArmed(false);
      setPending(null);
    }
  }, [snapshot.status]);
  useEffect(() => {
    const before = (event: BeforeUnloadEvent) => {
      if (controller.getSnapshot().busy) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", before);
    return () => window.removeEventListener("beforeunload", before);
  }, []);
  async function act(fn: () => Promise<unknown>, success?: string) {
    setError("");
    setNotice("");
    try {
      await fn();
      if (success) setNotice(success);
    } catch (e) {
      setError(errorText(e));
    }
  }
  function updateMachine(next: Machine) {
    setData((d) => ({
      ...d,
      machines: d.machines.map((m) => (m.id === next.id ? next : m)),
    }));
  }
  async function connect() {
    setArmed(false);
    await act(
      async () => {
        const transport =
          mode === "simulation"
            ? (simulator.current = new SimulatedTransport())
            : new WebBluetoothTransport(showAll, machine.bluetoothName);
        await controller.connect(transport, machine.f0MeansOpen);
        if (mode === "bluetooth" && !machine.bluetoothName)
          updateMachine({ ...machine, bluetoothName: transport.name });
      },
      mode === "simulation"
        ? "Practice session ready. No Bluetooth commands leave this browser."
        : "Connected and handshake acknowledged. Check the readback, then arm the controls.",
    );
  }
  function changeMode(next: "bluetooth" | "simulation") {
    if (connected || busy) return;
    setMode(next);
    setArmed(false);
    setError("");
    setNotice("");
  }
  function updateOrder(id: string, patch: Partial<Order>) {
    setData((d) => ({
      ...d,
      orders: d.orders.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    }));
  }
  async function confirmOpen() {
    if (!selection || !canAct) return;
    const { door, kind } = selection;
    setSelection(null);
    const slot = machine.slots.find((s) => s.door === door)!;
    let order: Order | undefined;
    if (kind === "collect") {
      if (slot.quantity < 1 || !slot.name || !slot.enabled) {
        setError("This compartment is not available.");
        return;
      }
      order = {
        id: crypto.randomUUID(),
        at: new Date().toISOString(),
        machineId: machine.id,
        door,
        product: slot.name,
        price: slot.price,
        currency: machine.currency,
        mode,
        status: "pending",
        note: "Operator-assisted collection; no payment collected by this app.",
      };
      // Persist intent before an actuator command. Refuse to vend if recording fails.
      try {
        const next = {
          ...data,
          orders: [order, ...data.orders].slice(0, 2000),
        };
        save(next);
        setData(next);
      } catch (e) {
        setError(
          `Could not record intent; no door command sent. ${errorText(e)}`,
        );
        return;
      }
    }
    setError("");
    setNotice("");
    try {
      await controller.open(door, machine.encoding);
      if (order) {
        const opened = { ...order, status: "opened" as const };
        updateOrder(order.id, { status: "opened" });
        setPending(opened);
      }
      setNotice(
        `Door ${door}: controller reports OPEN. Check the actual door and close it by hand when finished.`,
      );
    } catch (e) {
      if (order)
        updateOrder(order.id, { status: "unknown", note: errorText(e) });
      setError(errorText(e));
    }
  }
  function collected(order: Order) {
    const current = data.orders.find((o) => o.id === order.id);
    if (!current || current.status === "collected") return;
    setData((d) => ({
      ...d,
      orders: d.orders.map((o) =>
        o.id === order.id
          ? {
              ...o,
              status: "collected" as const,
              note: "Collection confirmed by the operator; no payment processed.",
            }
          : o,
      ),
      machines:
        order.mode === "simulation"
          ? d.machines
          : d.machines.map((m) =>
              m.id === order.machineId
                ? {
                    ...m,
                    slots: m.slots.map((s) =>
                      s.door === order.door
                        ? { ...s, quantity: Math.max(0, s.quantity - 1) }
                        : s,
                    ),
                  }
                : m,
            ),
    }));
    setPending(null);
    setNotice(
      mode === "simulation"
        ? "Practice collection recorded. Real inventory was unchanged."
        : "Collection recorded; compartment quantity reduced by one.",
    );
  }
  function exportSession() {
    download(
      `mutual-vend-session-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          mode,
          machine,
          session: {
            ...snapshot,
            logs: snapshot.logs.filter((l) => l.mode === mode),
          },
          orders: machineOrders,
          checklist: checklistSteps.map(([id, label]) => ({
            step: label,
            done: !!data.checklist[checkKey(id)],
          })),
          hardwareVerification:
            "Only operator-recorded observations; simulation does not validate the physical machine.",
        },
        null,
        2,
      ),
    );
  }
  function addMachine() {
    const m = newMachine(data.machines.length + 1);
    setData((d) => ({ ...d, machines: [...d.machines, m], selectedId: m.id }));
    setSettings(true);
  }
  const nav = [
    { key: "machine", label: "Machine", icon: Bluetooth },
    { key: "inventory", label: "Inventory", icon: Package },
    { key: "activity", label: "Activity", icon: Activity },
    { key: "guide", label: "Field guide", icon: BookOpen },
  ] as const;
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          href="#"
          className="brand"
          onClick={(e) => {
            e.preventDefault();
            setView("machine");
          }}
        >
          <Logo color="white" size={44} />
          <span>
            mutual
            <br />
            <b>vend.</b>
          </span>
        </a>
        <div className="sidebar-label">YOUR FIELD STATION</div>
        <nav aria-label="Main navigation">
          {nav.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              aria-current={view === key ? "page" : undefined}
              onClick={() => setView(key)}
            >
              <Icon size={19} />
              {label}
              {view === key && <ChevronRight size={16} />}
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="orb">
            <Package size={24} />
          </span>
          <h3>
            Small things.
            <br />
            Shared access.
          </h3>
          <p>A little infrastructure for the things people need.</p>
          <a href="https://decentralpark.nyc" target="_blank" rel="noreferrer">
            By Decentral Park <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="version">KSJ 12-DOOR · FIELD APP 1.0</div>
      </aside>
      <main className="main">
        <header className="topbar">
          <div className="crumb">
            Mutual Vend <span>/</span> {nav.find((n) => n.key === view)?.label}
          </div>
          <div className="top-actions">
            <span className={`pill ${mode === "simulation" ? "practice" : ""}`}>
              <span className="status-dot" />
              {mode === "simulation" ? "Practice mode" : "Local Bluetooth"}
            </span>
            <button
              className="icon-button"
              aria-label="Machine settings"
              onClick={() => setSettings(true)}
              disabled={connected || busy}
            >
              <Settings size={19} />
            </button>
          </div>
        </header>
        <div className="workspace">
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                {view === "machine"
                  ? "COMMUNITY VENDING, WITHIN REACH"
                  : view === "inventory"
                    ? "A PLACE FOR THE EVERYDAY"
                    : view === "activity"
                      ? "EVERY ACTION, ACCOUNTED FOR"
                      : "READY FOR THE REAL WORLD"}
              </div>
              <Heading1 className="page-title">
                {view === "machine"
                  ? "Your machine, connected."
                  : view === "inventory"
                    ? "Stock the good stuff."
                    : view === "activity"
                      ? "The session ledger."
                      : "First connection. First open."}
              </Heading1>
              <p>
                {view === "machine"
                  ? "Connect nearby. Check the doors. Make the everyday a little more accessible."
                  : view === "inventory"
                    ? "Name each compartment, count what is inside, and keep the next refill simple."
                    : view === "activity"
                      ? "See what was sent, what the controller reported, and what still needs a check."
                      : "A guided bench test for your KSJ machine. Take it one door at a time."}
              </p>
            </div>
            <Button
              variant="light"
              size="sm"
              onClick={exportSession}
              leftIcon={<ArrowDownToLine size={16} />}
            >
              Export session
            </Button>
          </div>
          {storageError && (
            <div role="alert" className="notice error">
              <AlertTriangle size={20} />
              <div>
                {storageError}
                <button
                  onClick={() =>
                    download(
                      "mutual-vend-recovery.txt",
                      localStorage.getItem("mutual-vend-field-v1") || "",
                      "text/plain",
                    )
                  }
                >
                  Export original storage
                </button>
                <button onClick={() => setStorageError("")}>
                  Use current data and resume saving
                </button>
              </div>
            </div>
          )}
          {error && (
            <div role="alert" className="notice error">
              <AlertTriangle size={20} />
              <span>{error}</span>
              <button onClick={() => setError("")} aria-label="Dismiss error">
                <X size={17} />
              </button>
            </div>
          )}
          {notice && (
            <div role="status" className="notice">
              <CheckCircle2 size={20} />
              <span>{notice}</span>
              <button onClick={() => setNotice("")} aria-label="Dismiss notice">
                <X size={17} />
              </button>
            </div>
          )}
          {mode === "simulation" && (
            <div className="practice-banner">
              <FlaskConical size={18} />
              <strong>Practice session</strong>
              <span>
                No hardware connected. Door states and battery are simulated.
                Real stock is unchanged.
              </span>
            </div>
          )}
          <div className="machine-strip">
            <div className="machine-ident">
              <span className="machine-icon">
                <Package size={22} />
              </span>
              <div>
                <label className="sr-only" htmlFor="machine-select">
                  Selected machine
                </label>
                <select
                  id="machine-select"
                  value={machine.id}
                  disabled={connected || busy}
                  onChange={(e) =>
                    setData((d) => ({ ...d, selectedId: e.target.value }))
                  }
                >
                  {data.machines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <span>
                  <MapPin size={12} />
                  {machine.location}
                </span>
              </div>
            </div>
            <div className="machine-meta">
              <span>12 compartments</span>
              <span>{machine.encoding.toUpperCase()} command profile</span>
              <button
                onClick={addMachine}
                disabled={connected || busy || data.machines.length >= 30}
              >
                <Plus size={15} /> Add machine
              </button>
            </div>
          </div>
          {view === "machine" && (
            <>
              <div className="dashboard-grid">
                <section className="connection-card">
                  <div className="section-kicker">
                    <Bluetooth size={18} /> CONNECTION
                  </div>
                  <h2>
                    {ready
                      ? "Hello, " +
                        (mode === "simulation"
                          ? "practice machine."
                          : "neighbor.")
                      : snapshot.status === "connecting"
                        ? "Finding your machine…"
                        : snapshot.status === "handshaking"
                          ? "Getting acquainted…"
                          : "Let’s meet your machine."}
                  </h2>
                  <p>
                    {ready
                      ? "Your session is active. Read back the door states before your first test."
                      : "Choose a connection below. Stay within a few meters and close the original app first."}
                  </p>
                  <div className="segmented" aria-label="Connection mode">
                    <button
                      aria-pressed={mode === "bluetooth"}
                      disabled={connected || busy}
                      onClick={() => changeMode("bluetooth")}
                    >
                      <Bluetooth size={16} />
                      Real machine
                    </button>
                    <button
                      aria-pressed={mode === "simulation"}
                      disabled={connected || busy}
                      onClick={() => changeMode("simulation")}
                    >
                      <FlaskConical size={16} />
                      Try a simulation
                    </button>
                  </div>
                  <dl className="connection-details">
                    <div>
                      <dt>Session</dt>
                      <dd>
                        <span className={`pill ${ready ? "success" : ""}`}>
                          {ready
                            ? "✓ Handshake confirmed"
                            : snapshot.status === "disconnected"
                              ? "○ Disconnected"
                              : snapshot.status}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt>Device</dt>
                      <dd>
                        {connected
                          ? snapshot.name
                          : machine.bluetoothName ||
                            "Choose in Bluetooth picker"}
                      </dd>
                    </div>
                    <div>
                      <dt>Service</dt>
                      <dd>
                        {connected
                          ? snapshot.profile || "Discovering…"
                          : "FFC0 / FFF0 auto-detect"}
                      </dd>
                    </div>
                    <div>
                      <dt>Power</dt>
                      <dd>
                        {snapshot.info
                          ? snapshot.info.batteryPowered
                            ? `${snapshot.info.battery}% battery`
                            : "External power"
                          : "Not read yet"}
                      </dd>
                    </div>
                    <div>
                      <dt>Last readback</dt>
                      <dd>
                        {snapshot.lastRead
                          ? new Date(snapshot.lastRead).toLocaleTimeString()
                          : "Waiting for device"}
                      </dd>
                    </div>
                  </dl>
                  {!connected && mode === "bluetooth" && (
                    <label className="checkbox-line">
                      <input
                        type="checkbox"
                        checked={showAll}
                        onChange={(e) => setShowAll(e.target.checked)}
                      />{" "}
                      Show all nearby devices if KSJ is missing
                    </label>
                  )}
                  <div className="connection-buttons">
                    {!connected ? (
                      <Button
                        onClick={connect}
                        disabled={busy}
                        leftIcon={
                          mode === "simulation" ? (
                            <FlaskConical size={18} />
                          ) : (
                            <Bluetooth size={18} />
                          )
                        }
                      >
                        {mode === "simulation"
                          ? "Start practice session"
                          : "Connect machine"}
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={() =>
                            act(
                              () => controller.refresh(),
                              "Device information refreshed.",
                            )
                          }
                          disabled={!ready || busy}
                          leftIcon={<RefreshCw size={17} />}
                        >
                          Refresh status
                        </Button>
                        <button
                          className="icon-button bordered"
                          aria-label="Disconnect machine"
                          onClick={() => {
                            controller.disconnect();
                            setArmed(false);
                          }}
                        >
                          <Unplug size={18} />
                        </button>
                      </>
                    )}
                  </div>
                  {!connected && (
                    <p className="small-note">
                      Chrome on Android, Mac or Windows. Use HTTPS or localhost.{" "}
                      <button onClick={() => setView("guide")}>
                        Setup help <ArrowUpRight size={12} />
                      </button>
                    </p>
                  )}
                </section>
                <section className="cabinet-card">
                  <div className="cabinet-top">
                    <span className="section-kicker">THE CABINET</span>
                    <span className="pill">
                      {ready
                        ? `${snapshot.doors.filter((d) => d === "closed").length} / 12 closed`
                        : "Live readback pending"}
                    </span>
                  </div>
                  <div className="cabinet">
                    <div className="cabinet-brand">
                      <Logo size={25} color="pine" />
                      <span>mutual vend.</span>
                      <i>12</i>
                    </div>
                    <div className="cabinet-doors">
                      {machine.slots.map((slot) => (
                        <button
                          key={slot.door}
                          className={`cabinet-door ${snapshot.doors[slot.door - 1]}`}
                          aria-label={`Test door ${slot.door}, ${snapshot.doors[slot.door - 1]}`}
                          disabled={
                            !canAct ||
                            snapshot.doors[slot.door - 1] !== "closed"
                          }
                          onClick={() =>
                            setSelection({ door: slot.door, kind: "test" })
                          }
                        >
                          <span className="door-number">
                            {String(slot.door).padStart(2, "0")}
                          </span>
                          <span className="door-glyph">
                            {snapshot.doors[slot.door - 1] === "open" ? (
                              <DoorOpen size={22} />
                            ) : (
                              <Package size={22} />
                            )}
                          </span>
                          <span className="door-caption">
                            {snapshot.doors[slot.door - 1]}
                          </span>
                          <i />
                        </button>
                      ))}
                    </div>
                    <div className="cabinet-foot">
                      <span>TAKE WHAT YOU NEED. KEEP IT GOING.</span>
                      <span>↗</span>
                    </div>
                  </div>
                  <p className="cabinet-note">
                    {mode === "simulation"
                      ? "Simulated controller states"
                      : "Controller states · verify door numbering on the hardware"}
                  </p>
                </section>
              </div>
              <section className="controls-bar">
                <div>
                  <LockKeyhole size={22} />
                  <div>
                    <h3>
                      {mode === "simulation"
                        ? "Practice controls"
                        : armed
                          ? "Controls armed for this session"
                          : "Arm the controls when you’re ready"}
                    </h3>
                    <p>
                      {mode === "simulation"
                        ? "Open a door, then use “Close simulated doors” to reset."
                        : "You must be beside your own machine. Arming resets on disconnect."}
                    </p>
                  </div>
                </div>
                {mode === "simulation" ? (
                  <Button
                    size="sm"
                    variant="light"
                    disabled={!ready || busy}
                    onClick={() => {
                      for (let d = 1; d <= 12; d++)
                        simulator.current?.closeDoor(d);
                    }}
                  >
                    Close simulated doors
                  </Button>
                ) : (
                  <label className="arm-switch">
                    <input
                      type="checkbox"
                      checked={armed}
                      disabled={!ready || busy}
                      onChange={(e) => setArmed(e.target.checked)}
                    />
                    <span>{armed ? "Armed" : "I’m beside my machine"}</span>
                  </label>
                )}
              </section>
              <div className="stats-grid">
                <article>
                  <span>Stocked compartments</span>
                  <strong>
                    {stocked}
                    <small> / 12</small>
                  </strong>
                  <button onClick={() => setView("inventory")}>
                    Manage inventory <ArrowUpRight size={15} />
                  </button>
                </article>
                <article>
                  <span>
                    Collected this{" "}
                    {mode === "simulation" ? "practice" : "machine"}
                  </span>
                  <strong>
                    {
                      machineOrders.filter((o) => o.status === "collected")
                        .length
                    }
                    <small> items</small>
                  </strong>
                  <button onClick={() => setView("activity")}>
                    View the ledger <ArrowUpRight size={15} />
                  </button>
                </article>
                <article>
                  <span>Field checks completed</span>
                  <strong>
                    {checked}
                    <small> / {checklistSteps.length}</small>
                  </strong>
                  <button onClick={() => setView("guide")}>
                    Run the checklist <ArrowUpRight size={15} />
                  </button>
                </article>
              </div>
              <details className="utility-panel">
                <summary>
                  <Power size={18} /> Device tools{" "}
                  <span>USB, handshake & troubleshooting</span>
                </summary>
                <div className="utility-content">
                  <p>
                    USB uses the APK’s four-byte command. A successful write
                    does not prove that the port changed. Check it with a USB
                    load.
                  </p>
                  <div className="button-row">
                    <Button
                      size="sm"
                      variant="light"
                      disabled={!canAct}
                      onClick={() => setUsb(true)}
                    >
                      USB on
                    </Button>
                    <Button
                      size="sm"
                      variant="light"
                      disabled={!canAct}
                      onClick={() => setUsb(false)}
                    >
                      USB off
                    </Button>
                    <Button
                      size="sm"
                      variant="light"
                      disabled={!ready || busy}
                      onClick={() =>
                        act(
                          () => controller.handshake(),
                          "Handshake and available readbacks refreshed.",
                        )
                      }
                    >
                      Repeat handshake
                    </Button>
                  </div>
                  {mode === "simulation" && (
                    <label className="field">
                      Simulated failure
                      <select
                        aria-label="Simulated failure"
                        disabled={!ready || busy}
                        onChange={(e) => {
                          if (simulator.current)
                            simulator.current.fault = e.target.value as
                              "none" | "timeout" | "disconnect";
                        }}
                      >
                        <option value="none">Normal replies</option>
                        <option value="timeout">No replies (timeout)</option>
                        <option value="disconnect">
                          Disconnect on next command
                        </option>
                      </select>
                    </label>
                  )}
                </div>
              </details>
            </>
          )}
          {view === "inventory" && (
            <>
              <div className="section-head">
                <div>
                  <h2>Twelve doors. Your essentials.</h2>
                  <p>
                    Inventory is an operator record stored in this browser. The
                    controller cannot count products.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="light"
                  onClick={() => {
                    if (machine.slots.every((s) => !s.name && !s.quantity))
                      updateMachine({
                        ...machine,
                        slots: machine.slots.map((s, i) => ({
                          ...s,
                          name: emptySamples[i],
                        })),
                      });
                    else
                      setNotice(
                        "Suggested labels are only added to a completely empty catalog. Edit individual slots instead.",
                      );
                  }}
                >
                  Add suggested labels
                </Button>
              </div>
              <div className="inventory-grid">
                {machine.slots.map((slot) => (
                  <article className="product-card" key={slot.door}>
                    <div className="product-top">
                      <span className="door-tag">
                        DOOR {String(slot.door).padStart(2, "0")}
                      </span>
                      <span className="pill">
                        {!slot.enabled
                          ? "Paused"
                          : slot.quantity === 0
                            ? "Empty"
                            : slot.quantity < 3
                              ? "Low stock"
                              : "Stocked"}
                      </span>
                    </div>
                    <div className="product-art">
                      <Package size={42} strokeWidth={1.2} />
                      <span>{slot.category}</span>
                    </div>
                    <h3>{slot.name || "An open possibility"}</h3>
                    <div className="product-detail">
                      <span>{slot.quantity} recorded inside</span>
                      <strong>{money(slot.price, machine.currency)}</strong>
                    </div>
                    {slot.notes && <p className="product-note">{slot.notes}</p>}
                    <div className="product-actions">
                      <Button
                        size="sm"
                        variant="light"
                        disabled={busy}
                        onClick={() => setEditSlot(slot)}
                      >
                        Edit stock
                      </Button>
                      <button
                        disabled={
                          !canAct ||
                          !slot.enabled ||
                          !slot.name ||
                          slot.quantity < 1 ||
                          snapshot.doors[slot.door - 1] !== "closed" ||
                          !!pending
                        }
                        onClick={() =>
                          setSelection({ door: slot.door, kind: "collect" })
                        }
                      >
                        Collect <ArrowUpRight size={15} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              <div className="footnote">
                Prices are reference labels. This field app does not collect
                payments. Real stock decreases only when you confirm collection;
                simulated collection never changes real stock.
              </div>
            </>
          )}
          {view === "activity" && (
            <>
              <div className="section-head">
                <div>
                  <h2>Collection ledger</h2>
                  <p>
                    Operator-confirmed collection and controller-reported
                    opening are separate events.
                  </p>
                </div>
                <span className="pill">
                  {machineOrders.length} records · {mode}
                </span>
              </div>
              {machineOrders.length === 0 ? (
                <div className="empty-state">
                  <Package size={34} />
                  <h3>A clean start.</h3>
                  <p>
                    Collections will appear here. You can test a door without
                    changing inventory.
                  </p>
                </div>
              ) : (
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Compartment</th>
                        <th>Item</th>
                        <th>Status</th>
                        <th>Resolve</th>
                      </tr>
                    </thead>
                    <tbody>
                      {machineOrders.map((o) => (
                        <tr key={o.id}>
                          <td>{new Date(o.at).toLocaleString()}</td>
                          <td>Door {o.door}</td>
                          <td>{o.product}</td>
                          <td>
                            <span className="pill">{o.status}</span>
                            <div className="table-note">{o.note}</div>
                          </td>
                          <td>
                            {["opened", "unknown", "pending"].includes(
                              o.status,
                            ) && (
                              <div className="button-row">
                                <button onClick={() => setPending(o)}>
                                  Inspect & resolve
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="section-head log-heading">
                <div>
                  <h2>Device conversation</h2>
                  <p>
                    Raw bytes, timestamps and direction. Last 500 entries;
                    included in session export.
                  </p>
                </div>
                <button
                  className="text-button"
                  disabled={busy}
                  onClick={() => controller.clearLogs()}
                >
                  <Trash2 size={15} /> Clear log
                </button>
              </div>
              <div className="log-console" aria-label="Device log">
                {snapshot.logs.length === 0 ? (
                  <p>
                    No messages yet. Connect a machine or start a practice
                    session.
                  </p>
                ) : (
                  snapshot.logs.map((log) => (
                    <div className="log-line" key={log.id}>
                      <time>{new Date(log.at).toLocaleTimeString()}</time>
                      <span className="log-direction">
                        {log.direction === "sent"
                          ? "TX →"
                          : log.direction === "received"
                            ? "RX ←"
                            : "INFO"}
                        <small>
                          {log.mode === "simulation" ? "SIM" : "BLE"}
                        </small>
                      </span>
                      <div>
                        {log.message}
                        {log.hex && <code>{log.hex}</code>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
          {view === "guide" && (
            <>
              <div className="guide-intro">
                <BookOpen size={36} />
                <div>
                  <h2>Your first field session</h2>
                  <p>
                    Tomorrow’s physical test is October 3, 2026 (Tokyo). Start
                    with an empty door. A simulator pass is preparation; the
                    hardware checks below establish what actually works.
                  </p>
                  <a
                    className="inline-link"
                    href="./setup-guide.html"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open the complete HTML setup guide{" "}
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
              <div className="checklist-progress">
                <span>
                  {checked} of {checklistSteps.length} checks recorded for{" "}
                  {mode === "simulation" ? "practice" : "this machine"}
                </span>
                <progress value={checked} max={checklistSteps.length} />
              </div>
              <div className="checklist">
                {checklistSteps.map(([id, label], index) => (
                  <label key={id}>
                    <input
                      type="checkbox"
                      checked={!!data.checklist[checkKey(id)]}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          checklist: {
                            ...d.checklist,
                            [checkKey(id)]: e.target.checked,
                          },
                        }))
                      }
                    />
                    <span className="step-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{label}</span>
                    {data.checklist[checkKey(id)] && <Check size={20} />}
                  </label>
                ))}
              </div>
              <div className="guide-notes">
                <article>
                  <h3>Doors 10–12 need a check.</h3>
                  <p>
                    The PDF uses 0A / 0B / 0C. The APK uses 10 / 11 / 12 (hex).
                    Default: PDF. If those doors do not respond, disconnect,
                    change the profile in settings, reconnect and test each
                    once.
                  </p>
                </article>
                <article>
                  <h3>A timeout means “unknown.”</h3>
                  <p>
                    Do not repeatedly tap Open. Inspect the door, close it,
                    refresh its state and then decide whether to retry. The app
                    never automatically retries an unlock.
                  </p>
                </article>
                <article>
                  <h3>Private to this browser.</h3>
                  <p>
                    No vendor login is needed for direct Bluetooth. Catalogs and
                    checklists stay here. Export a backup before changing
                    devices or clearing browser data.
                  </p>
                </article>
              </div>
              <div className="button-row">
                <Button
                  variant="light"
                  size="sm"
                  onClick={() =>
                    download(
                      "mutual-vend-backup.json",
                      JSON.stringify(data, null, 2),
                    )
                  }
                >
                  Export inventory backup
                </Button>
                <Button
                  variant="light"
                  size="sm"
                  disabled={connected || busy}
                  onClick={() => importRef.current?.click()}
                >
                  Import backup
                </Button>
                {installEvent && (
                  <Button
                    variant="light"
                    size="sm"
                    onClick={async () => {
                      await (
                        installEvent as Event & { prompt: () => Promise<void> }
                      ).prompt();
                      setInstallEvent(null);
                    }}
                  >
                    Install app
                  </Button>
                )}
              </div>
            </>
          )}
          <footer className="workspace-footer">
            <span>
              <Logo size={20} color="pine" />
              Built with Decentral Park UI
            </span>
            <span>Local first. People always.</span>
          </footer>
        </div>
      </main>
      <input
        type="file"
        className="sr-only"
        ref={importRef}
        accept="application/json,.json"
        aria-label="Import inventory backup"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          try {
            if (file.size > 2000000) throw new Error("Backup exceeds 2 MB.");
            const parsed = parseBackup(await file.text());
            if (
              window.confirm(
                `Replace this browser’s inventory with ${parsed.machines.length} machine(s) from the backup? Export your current data first if needed.`,
              )
            ) {
              save(parsed);
              setData(parsed);
              setStorageError("");
              setNotice(
                "Backup restored. Reconnect to obtain fresh hardware states.",
              );
            }
          } catch (err) {
            setError("Import rejected: " + errorText(err));
          }
          e.target.value = "";
        }}
      />
      {settings && (
        <SettingsModal
          machine={machine}
          disabled={connected || busy}
          onClose={() => setSettings(false)}
          onScan={() => setQr(true)}
          onSave={(m) => {
            updateMachine(m);
            setSettings(false);
            setNotice("Machine settings saved to this browser.");
          }}
        />
      )}
      {qr && (
        <Scanner
          onClose={() => setQr(false)}
          onResult={(text) => {
            try {
              updateMachine({ ...machine, qrLabel: labelFromQr(text) });
              setQr(false);
              setSettings(false);
              setNotice(
                "QR label saved locally. Select the matching device in the Bluetooth picker; this does not rename or bind the controller.",
              );
            } catch (e) {
              setError(errorText(e));
            }
          }}
        />
      )}
      {editSlot && (
        <SlotModal
          slot={editSlot}
          currency={machine.currency}
          onClose={() => setEditSlot(null)}
          onSave={(slot) => {
            updateMachine({
              ...machine,
              slots: machine.slots.map((s) =>
                s.door === slot.door ? slot : s,
              ),
            });
            setEditSlot(null);
          }}
        />
      )}
      {selection && (
        <Modal
          title={`${selection.kind === "test" ? "Test" : "Collect from"} door ${selection.door}`}
          onClose={() => setSelection(null)}
        >
          <p>
            {mode === "simulation"
              ? "This opens a simulated compartment."
              : "This sends one unlock command to the connected machine."}{" "}
            Verify the number on the physical cabinet.
          </p>
          <dl className="confirm-details">
            <div>
              <dt>Machine</dt>
              <dd>{machine.name}</dd>
            </div>
            <div>
              <dt>Device</dt>
              <dd>{snapshot.name}</dd>
            </div>
            <div>
              <dt>Profile</dt>
              <dd>{machine.encoding.toUpperCase()}</dd>
            </div>
          </dl>
          <code className="command-preview">
            {hex(unlockDoor(selection.door, machine.encoding))}
          </code>
          <p className="small-note">
            No automatic retry. No payment is processed.{" "}
            {selection.kind === "test"
              ? "This test does not change inventory."
              : "You will confirm item collection separately."}
          </p>
          <div className="modal-actions">
            <Button variant="light" onClick={() => setSelection(null)}>
              Cancel
            </Button>
            <Button disabled={!canAct} onClick={confirmOpen}>
              Open door {selection.door} once
            </Button>
          </div>
        </Modal>
      )}
      {usb !== null && (
        <Modal
          title={`Turn USB ${usb ? "on" : "off"}?`}
          onClose={() => setUsb(null)}
        >
          <p>
            Uses the APK command on {snapshot.name}. Verify the result with a
            USB load; the device’s USB acknowledgment is undocumented.
          </p>
          <div className="modal-actions">
            <Button variant="light" onClick={() => setUsb(null)}>
              Cancel
            </Button>
            <Button
              disabled={!canAct}
              onClick={() => {
                const value = usb;
                setUsb(null);
                void act(
                  () => controller.setUsb(value),
                  "USB command written. Physically check the port; no confirmed state is available.",
                );
              }}
            >
              Send USB command
            </Button>
          </div>
        </Modal>
      )}
      {pending && (
        <Modal
          title={`Inspect door ${pending.door}`}
          onClose={() => setPending(null)}
        >
          <p>
            {pending.status === "unknown"
              ? "The command result was uncertain. Inspect the actual compartment."
              : "The controller reported the door open."}{" "}
            Did you physically take one {pending.product}?
          </p>
          <p>
            Confirming records one collection
            {mode === "simulation"
              ? " in the practice ledger. Real stock is unchanged."
              : " and reduces the recorded stock by one."}{" "}
            It does not record a payment.
          </p>
          <div className="modal-actions">
            <Button
              variant="light"
              onClick={() => {
                updateOrder(pending.id, {
                  status: "cancelled",
                  note: "Operator inspected: no item taken. Stock unchanged.",
                });
                setPending(null);
              }}
            >
              No item taken
            </Button>
            <Button onClick={() => collected(pending)}>I took one item</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    dialog.current?.showModal();
    return () => dialog.current?.close();
  }, []);
  return (
    <dialog
      ref={dialog}
      className="modal"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      aria-label={title}
    >
      <div className="modal-head">
        <h2>{title}</h2>
        <button
          aria-label="Close dialog"
          className="icon-button"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
function SettingsModal({
  machine,
  disabled,
  onSave,
  onClose,
  onScan,
}: {
  machine: Machine;
  disabled: boolean;
  onSave: (m: Machine) => void;
  onClose: () => void;
  onScan: () => void;
}) {
  const [draft, setDraft] = useState(machine);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    try {
      onSave(machineSchema.parse(draft));
    } catch (err) {
      setError(errorText(err));
    }
  }
  return (
    <Modal title="Machine settings" onClose={onClose}>
      <form onSubmit={submit}>
        <fieldset disabled={disabled}>
          <label className="field">
            Machine name
            <input
              required
              maxLength={80}
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </label>
          <label className="field">
            Location
            <input
              maxLength={120}
              value={draft.location}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
            />
          </label>
          <label className="field">
            Expected Bluetooth name
            <input
              maxLength={120}
              value={draft.bluetoothName}
              onChange={(e) =>
                setDraft({ ...draft, bluetoothName: e.target.value })
              }
              placeholder="Saved after the first connection"
            />
            <small>
              Must match the picker selection. Clear only if your controller’s
              name changed.
            </small>
          </label>
          <div className="form-grid">
            <label className="field">
              Door command profile
              <select
                value={draft.encoding}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    encoding: e.target.value as "pdf" | "apk",
                  })
                }
              >
                <option value="pdf">PDF: 10–12 = 0A / 0B / 0C</option>
                <option value="apk">APK: 10–12 = 10 / 11 / 12</option>
              </select>
            </label>
            <label className="field">
              Reference currency
              <select
                value={draft.currency}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    currency: e.target.value as Machine["currency"],
                  })
                }
              >
                {["USD", "JPY", "EUR", "CNY"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="field">
            Door sensor interpretation
            <select
              value={String(draft.f0MeansOpen)}
              onChange={(e) =>
                setDraft({ ...draft, f0MeansOpen: e.target.value === "true" })
              }
            >
              <option value="true">0xF0 = open (PDF default)</option>
              <option value="false">0xF0 = closed (inverted hardware)</option>
            </select>
            <small>
              Change only after checking a known open and closed door.
            </small>
          </label>
          <label className="field">
            Machine QR label
            <input
              value={draft.qrLabel}
              maxLength={200}
              onChange={(e) => setDraft({ ...draft, qrLabel: e.target.value })}
            />
          </label>
          <div className="qr-input">
            <input
              aria-label="QR URL or machine label"
              value={text}
              placeholder="Paste a QR URL or label"
              onChange={(e) => setText(e.target.value)}
            />
            <button
              type="button"
              onClick={() => {
                try {
                  setDraft({ ...draft, qrLabel: labelFromQr(text) });
                  setError("");
                } catch (e) {
                  setError(errorText(e));
                }
              }}
            >
              Use label
            </button>
          </div>
          <button className="text-button" type="button" onClick={onScan}>
            <ScanLine size={16} /> Scan QR with camera
          </button>
          <p className="small-note">
            Labels are local. The supplied APK’s rename field is read-only;
            vendor provisioning is not documented.
          </p>
        </fieldset>
        {disabled && (
          <p className="notice">Disconnect before changing machine settings.</p>
        )}
        {error && (
          <p role="alert" className="error-text">
            {error}
          </p>
        )}
        <div className="modal-actions">
          <Button type="button" variant="light" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={disabled}>
            Save settings
          </Button>
        </div>
      </form>
    </Modal>
  );
}
function SlotModal({
  slot,
  currency,
  onSave,
  onClose,
}: {
  slot: Slot;
  currency: string;
  onSave: (slot: Slot) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(slot);
  const [price, setPrice] = useState((slot.price / 100).toFixed(2));
  const [quantity, setQuantity] = useState(String(slot.quantity));
  const [error, setError] = useState("");
  return (
    <Modal title={`Door ${slot.door} · inventory`} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const q = Number(quantity);
          if (
            !/^\d+(\.\d{1,2})?$/.test(price) ||
            !/^\d+$/.test(quantity) ||
            q > 999 ||
            Number(price) > 10000
          ) {
            setError(
              "Enter a whole stock count from 0–999 and a price from 0–10,000 (up to two decimals).",
            );
            return;
          }
          onSave({
            ...draft,
            quantity: q,
            price: Math.round(Number(price) * 100),
          });
        }}
      >
        <label className="field">
          Product name
          <input
            maxLength={80}
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="What is behind this door?"
          />
        </label>
        <div className="form-grid">
          <label className="field">
            Quantity inside
            <input
              inputMode="numeric"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </label>
          <label className="field">
            Reference price ({currency})
            <input
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>
        </div>
        <label className="field">
          Category
          <select
            value={draft.category}
            onChange={(e) =>
              setDraft({
                ...draft,
                category: e.target.value as Slot["category"],
              })
            }
          >
            {["Care", "Snacks", "Drinks", "Other"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Stocking notes
          <textarea
            maxLength={500}
            value={draft.notes}
            onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            placeholder="Size, expiry date, or refill instructions"
          />
        </label>
        <label className="checkbox-line">
          <input
            type="checkbox"
            checked={draft.enabled}
            onChange={(e) => setDraft({ ...draft, enabled: e.target.checked })}
          />
          Available for operator-assisted collection
        </label>
        {error && (
          <p role="alert" className="error-text">
            {error}
          </p>
        )}
        <div className="modal-actions">
          <Button variant="light" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save compartment</Button>
        </div>
      </form>
    </Modal>
  );
}
function Scanner({
  onResult,
  onClose,
}: {
  onResult: (text: string) => void;
  onClose: () => void;
}) {
  const [error, setError] = useState("");
  const resultRef = useRef(onResult);
  resultRef.current = onResult;
  useEffect(() => {
    let disposed = false;
    let scanner: import("html5-qrcode").Html5Qrcode | undefined;
    let started = false;
    (async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (disposed) return;
        scanner = new Html5Qrcode("qr-camera");
        await scanner.start(
          { facingMode: "environment" },
          { fps: 6, qrbox: 220 },
          (text) => {
            if (!disposed) resultRef.current(text);
          },
          () => {},
        );
        started = true;
        if (disposed) await scanner.stop();
      } catch (e) {
        if (!disposed)
          setError(
            "Camera unavailable: " +
              errorText(e) +
              ". Paste the QR URL in settings instead.",
          );
      }
    })();
    return () => {
      disposed = true;
      if (scanner && started) void scanner.stop().catch(() => {});
    };
  }, []);
  return (
    <Modal title="Scan machine QR" onClose={onClose}>
      <div id="qr-camera" />
      {error && <p role="alert">{error}</p>}
      <p className="small-note">
        Only the label is saved. Scanned links are never opened automatically.
      </p>
    </Modal>
  );
}
