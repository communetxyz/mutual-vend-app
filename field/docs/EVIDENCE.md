# Repository and protocol audit

Inspected 2026-10-02. Dates below are commit dates; repository `pushed_at` is not a release date.

## Which repository is latest?

| Repository | Default branch | Newest relevant work inspected | Assessment |
|---|---|---|---|
| `communetxyz/mutual-vend-app` | `main`, `d4122f4` (2025-09-29) | `feat/sepolia-deploy`, `391f74e` (2026-02-12) | Latest frontend branch. Existing PR #2 is still open; it is not merged into main. This implementation branches from it. |
| `communetxyz/mutual-vend-be` | `main`, `478bca1` (2025-09-14) | `websocket-architecture`, `250ac6e` (2026-01-23); `rpi-lock-control`, `7321803` same day | These are different alternatives. Main automates an AVA website through Selenium and maps only three tracks. The RPi branch adds GPIO locks. Neither implements this KSJ BLE protocol. |
| `communetxyz/mutual-vend-sc` | `dev`, `023b6ad` (2025-09-14) | `feat/tests-and-deploy`, `57acc0d` (2026-02-12) | Newer unmerged contract work exists beyond dev: contract tests, deploy scripts, crowdfunding/ZK contracts and BreadKit integration. Commit titles do not establish deployment or hardware integration. |
| `RonTuretzky/mutual-vend-sc` | `dev`, `023b6ad` | Same SHA as upstream dev | Fork is identical at its only branch, and older than upstream feature work. No need to treat it as the latest codebase. |
| `decentralparknyc/decentralpark-ui-kit` | `main`, `7696b1b` (2026-07-09) | Same | Used actual packaged Button, Logo, Heading1, theme and bundled fonts; package tarball retained in `vendor/`. |

The field app lives in the existing frontend repository under `field/`, with its own locked build. The old Next.js/web3 app is preserved. The new field build does not compile or depend on those older pages. There is no new backend dependency for direct browser-to-machine BLE. No existing smart-contract deployment was changed or verified. No money, wallet permissions, vendor ownership, or account settings were changed.

## APK findings

Input: `base.apk.1`, approximately 14 MB, extracted locally only. No vendor source/assets are republished. Its manifest identifies `东莞KSJ蓝牙工具` (Dongguan KSJ Bluetooth Tool), version 1.0.0, `__UNI__883A608`; bundled asset dates are 2024-09-26. It is a Uni-app/Vue app with three routes: login, Bluetooth search, and device control. Static inspection is evidence of implemented paths, not a successful live vendor session.

The app exposes vendor login (`/push/index/login`), discovery/filtering, connection/disconnection, manual and automatic handshake, device information/battery, twelve individual door buttons, USB on/off and a clearable raw log. An all-open button is disabled. A new-name input is read-only. A QR helper and an uncalled `/index/getcmd` helper exist, but no active rename/provisioning action was found. Do not infer working SaaS management or customer checkout from this service-tool APK. Vendor credentials are not stored, printed in the deliverables, or embedded in the application. The replacement's direct BLE controls do not require vendor login.

## Interoperability details

* KSJ: service FFC0, write FFC1, notify/read FFC2 (full Bluetooth base UUID). These are visible in the PDF photograph and APK.
* Legacy fallback: FFF0, write FFF2, notify/read FFF1 (APK). Actual availability depends on the board.
* Handshake: 18 bytes beginning `8E FB 06 17` and ending `66 5B 4F E8`. The PDF prose is garbled; the photographed characteristic and APK agree. Expected positive reply in the photograph: `E8 F0 00 00 00 8E`. The app requires the six-byte framed reply with positive `F0`; write success alone never authenticates. Unknown firmware replies fail closed for diagnosis.
* Door command: `FF 4F 50 45 4E 00 NN FF FF FE`. PDF specifies numeric 1–12 (01–0C). APK uses 01–09, then 10, 11, 12 **hex**. This is a real disagreement. The default is PDF; choose APK only as an explicit alternative after a physical check. No all-door command is exposed.
* Query device: `66 F0 FF 77`. Valid device reply is 8 bytes: `77 version batteryFlag percentage 51 48 4C 66`. Battery 0% is preserved; external power is labeled separately.
* Query doors: `66 F1 FF 77`. Lock-state frames are 14 bytes, 1C/1D/1E header, 12 F0/0F states, 1B trailer. All three are parsed, including fragmented/coalesced notifications. Default sensor interpretation is F0=open, 0F=closed, with an explicitly labeled invert setting for physical verification.
* USB: APK sends `88 F0 01 88` for on and `88 F0 00 88` for off. The PDF's last-page image instead lists 09, 0A, and 20+hours without complete framing. Only the fully observed APK commands are exposed; timed USB is not implemented. USB state cannot be positively confirmed from the supplied evidence, so the app reports “written; check physically.”
* Before unlocking, the app requests fresh door status and requires that door closed. After one write it awaits a matching open-state report. An unrelated door report is not success. Disconnect invalidates all displayed door states. A timeout never automatically resends an unlock.

## Feature comparison

| Feature | Replacement | Boundary |
|---|---|---|
| Nearby-device discovery | Browser device picker, KSJ/B000/YJKJ + services, optional all-device chooser | Web Bluetooth does not expose arbitrary MAC-address connection or the APK's RSSI list. |
| Connect / handshake / disconnect | Implemented with connection cleanup, pending-operation cancellation and expected-device-name checking | Requires actual hardware confirmation. |
| Battery / external power | Validated framed decoder; zero-percent supported | Firmware/sensor accuracy unverified. |
| Twelve individual doors | Both explicit encodings, closed-state prerequisite, fresh matching feedback | Physical door-to-number mapping must be checked. |
| USB on / off | APK byte sequence, explicit confirmation | No verified USB ACK; no timed USB. |
| QR labeling | Camera scan and pasted QR URL; no automatic navigation | Local label only; no cloud binding or controller rename. |
| Logs | Timestamped TX/RX/event entries, raw hex, JSON export | Last 500 messages per browser session, exported with mode. |
| Inventory and collection | 12 compartments per machine, labels/prices/counts, manual collection confirmation, backup/import | Local operator records; no stock sensor and no cloud sync. |
| Testing | Simulator, timeout/disconnect injection, per-mode field checklist | A practice pass is not hardware validation. |
| Offline use | Precached production app and guide after first online visit | Camera/Bluetooth permissions and browser support still apply. |
| Vendor login | Replaced by browser Bluetooth permission for local operation | Supplied vendor account has not been authenticated; no vendor SaaS calls. |
| Payments / web3 | Existing older code preserved outside `field/` | No integrated payment-to-KSJ dispense flow or customer access control claimed. |

## Sources

* User-supplied Bluetooth protocol PDF, update 2024-01-04, including the final-page photograph and USB table.
* User-supplied APK assets, read statically and never executed.
* Remote Git branch SHAs and local Git histories, fetched 2026-10-02.
* [Chrome Web Bluetooth documentation](https://developer.chrome.com/docs/capabilities/bluetooth): secure contexts, chooser/user gesture, advertised filters, optional services, notification subscriptions.
* [MDN Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API): browser support constraints.

The Alibaba page did not expose readable product details to the fetcher. Hardware assumptions come from the supplied PDF and APK, not unverified storefront marketing.

## Input identity (SHA-256)

* APK: `65833f5c8a5d335f3f92836ca5155fafc153e32346f26cd8f8cc95ff4bd0c9c5`
* PDF: `57ca86090fefed3919d34181a6c62778c127df89b8df06bf8737d3b554d08d3a`
* Packaged UI kit: `0b4020a9329e959f27006e32b52c71d02c4fabbb801d55890b14602ebf8e175e`
