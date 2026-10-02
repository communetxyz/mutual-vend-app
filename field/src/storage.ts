import { z } from "zod";
export const slotSchema = z.object({
  door: z.number().int().min(1).max(12),
  name: z.string().max(80),
  quantity: z.number().int().min(0).max(999),
  price: z.number().int().min(0).max(1000000),
  category: z.enum(["Care", "Snacks", "Drinks", "Other"]),
  notes: z.string().max(500),
  enabled: z.boolean(),
});
export const machineSchema = z.object({
  id: z.string().min(1).max(80),
  name: z.string().min(1).max(80),
  location: z.string().max(120),
  bluetoothName: z.string().max(120),
  qrLabel: z.string().max(200),
  encoding: z.enum(["pdf", "apk"]),
  f0MeansOpen: z.boolean(),
  currency: z.enum(["USD", "JPY", "EUR", "CNY"]),
  slots: z
    .array(slotSchema)
    .length(12)
    .refine(
      (s) => new Set(s.map((x) => x.door)).size === 12,
      "Each door must occur exactly once.",
    ),
});
export const orderSchema = z.object({
  id: z.string(),
  at: z.string().datetime(),
  machineId: z.string(),
  door: z.number().int().min(1).max(12),
  product: z.string(),
  price: z.number().int().nonnegative(),
  currency: z.string(),
  mode: z.enum(["bluetooth", "simulation"]),
  status: z.enum(["pending", "opened", "collected", "unknown", "cancelled"]),
  note: z.string().max(500),
});
const schema = z
  .object({
    version: z.literal(1),
    machines: z.array(machineSchema).min(1).max(30),
    selectedId: z.string(),
    orders: z.array(orderSchema).max(2000),
    checklist: z.record(z.boolean()),
  })
  .superRefine((data, ctx) => {
    if (new Set(data.machines.map((m) => m.id)).size !== data.machines.length)
      ctx.addIssue({ code: "custom", message: "Machine IDs must be unique." });
    if (!data.machines.some((m) => m.id === data.selectedId))
      ctx.addIssue({ code: "custom", message: "Selected machine is missing." });
  });
export type Machine = z.infer<typeof machineSchema>;
export type Slot = z.infer<typeof slotSchema>;
export type Order = z.infer<typeof orderSchema>;
export type Saved = z.infer<typeof schema>;
const key = "mutual-vend-field-v1";
export function newMachine(index = 1): Machine {
  return {
    id: crypto.randomUUID(),
    name: `Machine ${String(index).padStart(2, "0")}`,
    location: "Add a location",
    bluetoothName: "",
    qrLabel: "",
    encoding: "pdf",
    f0MeansOpen: true,
    currency: "USD",
    slots: Array.from({ length: 12 }, (_, i) => ({
      door: i + 1,
      name: "",
      quantity: 0,
      price: 0,
      category: "Care",
      notes: "",
      enabled: true,
    })),
  };
}
export function initialSaved(): Saved {
  const m = newMachine();
  return {
    version: 1,
    machines: [m],
    selectedId: m.id,
    orders: [],
    checklist: {},
  };
}
export function parseBackup(text: string): Saved {
  if (text.length > 2000000) throw new Error("Backup exceeds 2 MB.");
  const data = schema.parse(JSON.parse(text));
  return {
    ...data,
    orders: data.orders.map((o) =>
      o.status === "pending"
        ? {
            ...o,
            status: "unknown",
            note: "App closed during an operation. Inspect the machine before retrying.",
          }
        : o,
    ),
  };
}
export function load(): { data: Saved; error?: string } {
  try {
    const text = localStorage.getItem(key);
    return { data: text ? parseBackup(text) : initialSaved() };
  } catch {
    return {
      data: initialSaved(),
      error:
        "Saved data could not be read. The original backup in browser storage has not been overwritten. Export it before saving new data.",
    };
  }
}
export function save(data: Saved) {
  schema.parse(data);
  localStorage.setItem(key, JSON.stringify(data));
}
export function download(
  name: string,
  text: string,
  type = "application/json",
) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export const money = (cents: number, currency: string) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(
    cents / 100,
  );
export function labelFromQr(text: string): string {
  const value = text.trim();
  if (!value || value.length > 1000)
    throw new Error(
      "Enter a machine QR URL or label (up to 1,000 characters).",
    );
  if (/^https?:\/\//i.test(value)) {
    const url = new URL(value);
    return decodeURIComponent(
      url.pathname.split("/").filter(Boolean).pop() || url.hostname,
    ).slice(0, 200);
  }
  if (!/^[\w: .-]{1,200}$/.test(value))
    throw new Error("Use a machine label or an http/https QR URL.");
  return value;
}
export const checklistSteps = [
  ["power", "Power the machine; inspect the doors and remove loose stock."],
  [
    "baseline",
    "Close every door and check the CLOSED readback against the hardware.",
  ],
  ["first", "Open empty door 1 once; see OPEN, then close it and see CLOSED."],
  [
    "all",
    "Check doors 2–9 individually, then verify 10–12 with the selected command profile.",
  ],
  [
    "battery",
    "Check battery or external-power reporting against the original app.",
  ],
  [
    "usb",
    "Test USB on and off with a harmless USB load, if the machine has USB.",
  ],
  [
    "reconnect",
    "Disconnect and reconnect; confirm fresh handshake and door states.",
  ],
  [
    "collection",
    "Try one stocked compartment and record collection only after taking the item.",
  ],
  [
    "export",
    "Export the session log, inventory backup and results for review.",
  ],
] as const;
