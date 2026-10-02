import { it, expect } from "vitest";
import { initialSaved, parseBackup, labelFromQr } from "../src/storage";
it("round-trips a local inventory backup", () => {
  const d = initialSaved();
  expect(parseBackup(JSON.stringify(d))).toEqual(d);
});
it("rejects duplicate doors and invalid stock counts", () => {
  const d = initialSaved();
  d.machines[0].slots[1].door = 1;
  expect(() => parseBackup(JSON.stringify(d))).toThrow();
  d.machines[0].slots[1].door = 2;
  d.machines[0].slots[1].quantity = -1;
  expect(() => parseBackup(JSON.stringify(d))).toThrow();
});
it("recovers an interrupted collection as unknown, never successful", () => {
  const d = initialSaved();
  d.orders.push({
    id: "1",
    at: new Date().toISOString(),
    machineId: d.selectedId,
    door: 1,
    product: "Kit",
    price: 250,
    currency: "USD",
    mode: "bluetooth",
    status: "pending",
    note: "",
  });
  expect(parseBackup(JSON.stringify(d)).orders[0].status).toBe("unknown");
});
it("rejects unrecognized versions, missing machines and oversized backups", () => {
  const d = initialSaved();
  expect(() => parseBackup(JSON.stringify({ ...d, version: 2 }))).toThrow();
  expect(() =>
    parseBackup(JSON.stringify({ ...d, selectedId: "absent" })),
  ).toThrow();
  expect(() => parseBackup(" ".repeat(2000001))).toThrow();
});
it("extracts labels without navigating QR URLs or accepting executable schemes", () => {
  expect(labelFromQr("https://example.com/machine/KSJ123?secret=abc")).toBe(
    "KSJ123",
  );
  expect(labelFromQr("KSJ-123")).toBe("KSJ-123");
  expect(() => labelFromQr("javascript:alert(1)")).toThrow();
});
