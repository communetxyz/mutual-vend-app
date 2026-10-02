/** KSJ wire format cross-checked against the supplied Jan 2024 PDF and Sept 2024 APK.
 * No vendor code is executed or included. See docs/EVIDENCE.md for disagreements.
 */
export type DoorEncoding = "pdf" | "apk";
export type DoorState = "open" | "closed" | "unknown";
export type Packet =
  | { kind: "handshake"; accepted: boolean; raw: number[] }
  | {
      kind: "info";
      version: number;
      batteryPowered: boolean;
      battery: number;
      raw: number[];
    }
  | {
      kind: "locks";
      source: "opened" | "closed" | "query";
      states: DoorState[];
      raw: number[];
    }
  | { kind: "unknown"; raw: number[] };
export const UUIDS = [
  { name: "KSJ · FFC0", service: 0xffc0, write: 0xffc1, notify: 0xffc2 },
  { name: "Legacy · FFF0", service: 0xfff0, write: 0xfff2, notify: 0xfff1 },
] as const;
export const HANDSHAKE = Uint8Array.from([
  0x8e, 0xfb, 0x06, 0x17, 0x0c, 0xa9, 0x68, 0x23, 0x7b, 0x4c, 0xd2, 0x2d, 0xdf,
  0xfa, 0x66, 0x5b, 0x4f, 0xe8,
]);
export const queryInfo = () => Uint8Array.of(0x66, 0xf0, 0xff, 0x77);
export const queryLocks = () => Uint8Array.of(0x66, 0xf1, 0xff, 0x77);
export function unlockDoor(door: number, encoding: DoorEncoding = "pdf") {
  if (!Number.isInteger(door) || door < 1 || door > 12)
    throw new Error("Choose one door from 1 to 12.");
  const code = encoding === "apk" && door >= 10 ? door + 6 : door;
  return Uint8Array.of(0xff, 0x4f, 0x50, 0x45, 0x4e, 0, code, 0xff, 0xff, 0xfe);
}
/** USB packets are from the APK. The PDF's USB table does not specify full framing. */
export const usbPower = (enabled: boolean) =>
  Uint8Array.of(0x88, 0xf0, enabled ? 1 : 0, 0x88);
export const hex = (bytes: Iterable<number>) =>
  Array.from(bytes, (n) => n.toString(16).padStart(2, "0").toUpperCase()).join(
    " ",
  );
export function decode(raw: number[], f0MeansOpen = true): Packet {
  if (raw.length === 6 && raw[0] === 0xe8 && raw[5] === 0x8e)
    return { kind: "handshake", accepted: raw[1] === 0xf0, raw };
  if (
    raw.length === 8 &&
    raw[0] === 0x77 &&
    raw[7] === 0x66 &&
    raw[4] === 0x51 &&
    raw[5] === 0x48 &&
    raw[6] === 0x4c &&
    raw[2] <= 1 &&
    raw[3] <= 100
  )
    return {
      kind: "info",
      version: raw[1],
      batteryPowered: raw[2] === 1,
      battery: raw[3],
      raw,
    };
  if (
    raw.length === 14 &&
    [0x1c, 0x1d, 0x1e].includes(raw[0]) &&
    raw[13] === 0x1b &&
    raw.slice(1, 13).every((n) => n === 0xf0 || n === 0x0f)
  ) {
    return {
      kind: "locks",
      source: raw[0] === 0x1c ? "opened" : raw[0] === 0x1d ? "closed" : "query",
      states: raw
        .slice(1, 13)
        .map((n) => ((n === 0xf0) === f0MeansOpen ? "open" : "closed")),
      raw,
    };
  }
  return { kind: "unknown", raw };
}
/** Notifications may split frames or coalesce several. Resynchronize after malformed bytes. */
export class FrameDecoder {
  private buffer: number[] = [];
  constructor(public f0MeansOpen = true) {}
  reset() {
    this.buffer = [];
  }
  push(bytes: Uint8Array): Packet[] {
    this.buffer.push(...bytes);
    const result: Packet[] = [];
    while (this.buffer.length) {
      const head = this.buffer[0];
      const length =
        head === 0xe8
          ? 6
          : head === 0x77
            ? 8
            : [0x1c, 0x1d, 0x1e].includes(head)
              ? 14
              : 0;
      if (!length) {
        result.push({ kind: "unknown", raw: [this.buffer.shift()!] });
        continue;
      }
      if (this.buffer.length < length) break;
      const packet = decode(this.buffer.slice(0, length), this.f0MeansOpen);
      if (packet.kind === "unknown") {
        result.push({ kind: "unknown", raw: [this.buffer.shift()!] });
        continue;
      }
      this.buffer.splice(0, length);
      result.push(packet);
    }
    return result;
  }
}
