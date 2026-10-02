import { afterEach, describe, it, expect, vi } from "vitest";
import { WebBluetoothTransport } from "../src/transport";
function fixture({
  legacy = false,
  writeResponse = true,
  name = "KSJ-test",
  missing = false,
} = {}) {
  const notify = Object.assign(new EventTarget(), {
    startNotifications: vi.fn(async () => {}),
    value: undefined as DataView | undefined,
  });
  const writer = {
    properties: { write: writeResponse, writeWithoutResponse: !writeResponse },
    writeValueWithResponse: vi.fn(async () => {}),
    writeValueWithoutResponse: vi.fn(async () => {}),
  };
  const service = {
    getCharacteristic: vi.fn(async (id: number) =>
      id === (legacy ? 0xfff2 : 0xffc1) ? writer : notify,
    ),
  };
  const server = {
    getPrimaryService: vi.fn(async (id: number) => {
      if (missing || id !== (legacy ? 0xfff0 : 0xffc0))
        throw new Error("Service absent");
      return service;
    }),
  };
  const device = Object.assign(new EventTarget(), {
    name,
    gatt: {
      connected: true,
      connect: vi.fn(async () => server),
      disconnect: vi.fn(),
    },
  });
  const requestDevice = vi.fn(async (_options: RequestDeviceOptions) => device);
  vi.stubGlobal("window", { isSecureContext: true });
  vi.stubGlobal("navigator", { bluetooth: { requestDevice } });
  return { notify, writer, service, server, device, requestDevice };
}
afterEach(() => vi.unstubAllGlobals());
describe("browser transport wiring", () => {
  it("selects FFC0, subscribes before writing, and requests both optional services", async () => {
    const f = fixture();
    const t = new WebBluetoothTransport();
    const receive = vi.fn();
    await t.connect(receive, vi.fn());
    expect(f.requestDevice.mock.calls[0][0]).toMatchObject({
      optionalServices: [0xffc0, 0xfff0],
    });
    expect(f.notify.startNotifications).toHaveBeenCalledOnce();
    expect(t.profile).toBe("KSJ · FFC0");
    await t.write(Uint8Array.of(1, 2));
    expect(f.writer.writeValueWithResponse).toHaveBeenCalledOnce();
    f.notify.value = new DataView(Uint8Array.of(9, 8, 7, 6).buffer, 1, 2);
    f.notify.dispatchEvent(new Event("characteristicvaluechanged"));
    expect(receive).toHaveBeenCalledWith(Uint8Array.of(8, 7));
    t.disconnect();
    f.notify.dispatchEvent(new Event("characteristicvaluechanged"));
    expect(receive).toHaveBeenCalledOnce();
  });
  it("supports the APK fallback service and write-without-response characteristic", async () => {
    const f = fixture({ legacy: true, writeResponse: false });
    const t = new WebBluetoothTransport(true);
    await t.connect(vi.fn(), vi.fn());
    expect(t.profile).toBe("Legacy · FFF0");
    expect(f.service.getCharacteristic.mock.calls.map((c) => c[0])).toEqual([
      0xfff2, 0xfff1,
    ]);
    await t.write(Uint8Array.of(1));
    expect(f.writer.writeValueWithoutResponse).toHaveBeenCalledOnce();
    t.disconnect();
  });
  it("rejects a different named machine before GATT connection", async () => {
    const f = fixture();
    const t = new WebBluetoothTransport(false, "KSJ-other");
    await expect(t.connect(vi.fn(), vi.fn())).rejects.toThrow(
      "Expected KSJ-other",
    );
    expect(f.device.gatt.connect).not.toHaveBeenCalled();
  });
  it("cleans up on missing services and refuses commands after disconnect", async () => {
    const f = fixture({ missing: true });
    const t = new WebBluetoothTransport();
    await expect(t.connect(vi.fn(), vi.fn())).rejects.toThrow("No KSJ");
    expect(f.device.gatt.disconnect).toHaveBeenCalledOnce();
    await expect(t.write(Uint8Array.of(1))).rejects.toThrow("disconnected");
  });
  it("explains insecure origins and missing browser support", async () => {
    vi.stubGlobal("window", { isSecureContext: false });
    const t = new WebBluetoothTransport();
    await expect(t.connect(vi.fn(), vi.fn())).rejects.toThrow("HTTPS");
    vi.stubGlobal("window", { isSecureContext: true });
    vi.stubGlobal("navigator", {});
    await expect(t.connect(vi.fn(), vi.fn())).rejects.toThrow(
      "no Web Bluetooth",
    );
  });
});
