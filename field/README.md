# Mutual Vend field app

A local-first KSJ 12-door operator app, built with the actual Decentral Park UI kit. Real Web Bluetooth transport, a separate simulated transport, framed protocol decoding, inventory, collection ledger, QR labels, offline shell, and an HTML setup guide.

## Run tomorrow's test

```sh
cd field  # if at the repository root
npm ci
npm run dev
```

Open http://localhost:5173 in Google Chrome on macOS, Windows or Android. The hardware connection needs HTTPS or localhost. For Android over USB, enable USB debugging, accept your computer's authorization, then run `adb reverse tcp:5173 tcp:5173` and open http://localhost:5173 on the phone. A normal LAN HTTP URL does not meet the secure-context requirement. Safari/iOS is not a supported direct Bluetooth path.

Open `public/setup-guide.html` for the complete standalone guide, or the “Field guide” tab in the app. `npm run build` produces a static `dist/` that can be hosted over HTTPS. The production build caches the app for offline use after the first online load. Load the QR scanner once online if you plan to use it offline; the production precache includes its bundle.

## Verification

```sh
npm test
npm run build
npx playwright install chromium  # only if Playwright's browser is missing
npm run test:e2e
npm run test:production
```

The tests use independent protocol fixtures and a fake transport, plus browser flows. They cover malformed/split notifications, 0% battery, both door encodings, handshake rejection, duplicate-command prevention, timeout/disconnect behavior, inventory persistence and practice collection. These are software checks; run the guide's checklist on the real machine.

## Operational rules

* Start with a practice session, then disconnect and select Real machine.
* Connect your own machine, verify the device name, then arm the controls for that session.
* Test a known empty door first. Open once and wait. No automatic unlock retries.
* An OPEN report is controller feedback. Physical delivery is separately confirmed by the operator.
* Timeouts and connection loss are unknown outcomes. Inspect before retrying.
* Door commands 10–12 differ in the PDF and APK. The selectable default is PDF (0A/0B/0C).
* If the board's state polarity is reversed, physically establish open/closed before changing the setting.
* Inventory is local to this origin/browser. Export it before clearing data or moving to another device.
* This is an operator tool. Direct BLE control is not payment authorization. No payments are taken by this app.

## Layout

* `src/protocol.ts`: pure packet builders and incremental decoder.
* `src/transport.ts`: real Web Bluetooth + simulator behind the same interface.
* `src/controller.ts`: session lifecycle, fresh readbacks, serialized commands and logging.
* `src/storage.ts`: versioned, schema-validated local persistence and import.
* `src/App.tsx`, `src/styles.css`: responsive Decentral Park UI.
* `public/setup-guide.html`: self-contained, printable field guide.
* `docs/EVIDENCE.md`: repository comparison, APK feature inventory, and known protocol disagreements.
* `vendor/decentralpark-ui-0.1.0.tgz`: kit build from upstream `7696b1b`.

The project is an additive `field/` app in `communetxyz/mutual-vend-app`, based on its newest frontend branch `feat/sepolia-deploy` (`391f74e`). The older Next.js/web3 code remains at the repository root, outside this app's build. No credentials or original APK/PDF are redistributed. No cloud service, payment processor or running backend is required for field operation.
