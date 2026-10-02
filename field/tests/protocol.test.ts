import { describe, it, expect } from "vitest";
import {
  FrameDecoder,
  HANDSHAKE,
  decode,
  hex,
  unlockDoor,
  queryInfo,
  queryLocks,
  usbPower,
} from "../src/protocol";
describe("KSJ protocol fixtures from supplied PDF and APK", () => {
  it("matches the photographed 18-byte handshake, not the garbled PDF prose", () => {
    expect(hex(HANDSHAKE)).toBe(
      "8E FB 06 17 0C A9 68 23 7B 4C D2 2D DF FA 66 5B 4F E8",
    );
  });
  it("keeps PDF and APK door 10–12 encodings distinct", () => {
    expect(hex(unlockDoor(10, "pdf"))).toBe("FF 4F 50 45 4E 00 0A FF FF FE");
    expect(unlockDoor(12, "apk")[6]).toBe(0x12);
    expect(unlockDoor(9, "apk")[6]).toBe(9);
  });
  it.each([0, 13, -1, 1.5, NaN, Infinity])(
    "rejects invalid/all-door command %s",
    (door) => {
      expect(() => unlockDoor(door)).toThrow();
    },
  );
  it("matches query and APK USB commands", () => {
    expect(hex(queryInfo())).toBe("66 F0 FF 77");
    expect(hex(queryLocks())).toBe("66 F1 FF 77");
    expect(hex(usbPower(true))).toBe("88 F0 01 88");
    expect(hex(usbPower(false))).toBe("88 F0 00 88");
  });
  it("preserves zero battery and external-power information", () => {
    expect(decode([0x77, 2, 1, 0, 0x51, 0x48, 0x4c, 0x66])).toMatchObject({
      kind: "info",
      battery: 0,
      batteryPowered: true,
    });
    expect(decode([0x77, 2, 0, 0, 0x51, 0x48, 0x4c, 0x66])).toMatchObject({
      batteryPowered: false,
    });
  });
  it("does not treat arbitrary incoming bytes as a success", () => {
    expect(decode([0xe8, 0x0f, 0, 0, 0, 0x8e])).toMatchObject({
      accepted: false,
    });
    expect(decode([0x77, 2, 1, 255, 0x51, 0x48, 0x4c, 0x66]).kind).toBe(
      "unknown",
    );
    expect(decode([0x1c, ...Array(12).fill(0), 0x1b]).kind).toBe("unknown");
  });
  it("assembles split/coalesced frames and respects sensor polarity", () => {
    const d = new FrameDecoder();
    expect(d.push(Uint8Array.of(0x77, 2, 1))).toEqual([]);
    const decoded = d.push(
      Uint8Array.from([
        82,
        0x51,
        0x48,
        0x4c,
        0x66,
        0x1e,
        0xf0,
        ...Array(11).fill(0x0f),
        0x1b,
      ]),
    );
    expect(decoded).toHaveLength(2);
    expect(decoded[1]).toMatchObject({
      kind: "locks",
      states: ["open", ...Array(11).fill("closed")],
    });
    expect(decode([0x1e, ...Array(12).fill(0xf0), 0x1b], false)).toMatchObject({
      states: Array(12).fill("closed"),
    });
  });
  it("recovers from noise and malformed frames", () => {
    const d = new FrameDecoder();
    const packets = d.push(
      Uint8Array.from([
        0x55, 0x77, 0, 0, 0, 0, 0, 0, 0x77, 2, 1, 50, 0x51, 0x48, 0x4c, 0x66,
      ]),
    );
    expect(packets.at(-1)).toMatchObject({ kind: "info", battery: 50 });
  });
  it("can reset an incomplete notification at disconnect", () => {
    const d = new FrameDecoder();
    d.push(Uint8Array.of(0x1c, 0xf0));
    d.reset();
    expect(d.push(Uint8Array.of(0xe8, 0xf0, 0, 0, 0, 0x8e))[0]).toMatchObject({
      kind: "handshake",
      accepted: true,
    });
  });
});
