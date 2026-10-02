# Validation and handoff

Local verification on 2026-10-02:

- 35 unit/integration tests passed: protocol fixtures, handshake failure, zero battery, both door profiles, frame resynchronization, same-door readback, busy locks, timeouts including hung native writes, disconnect cleanup, real browser transport wiring with mocked GATT, backup validation and interrupted-operation recovery.
- TypeScript strict compilation and production Vite/PWA build passed.
- 8 Playwright workflow tests passed across desktop Chrome and emulated Android viewport: simulated door lifecycle, stock editing, collection, persistence, export, failure recovery and settings validation. The added mocked-Bluetooth browser flow verifies that real-mode controls require arming and stock changes only after collection confirmation; it does not touch hardware.
- 2 production-browser tests passed: app/guide load offline under the service worker, notes persist, no page runtime errors, no horizontal mobile overflow, and zero automated WCAG A/AA violations on the initial app and standalone guide.
- Desktop and mobile app layouts were visually inspected. Status meaning uses text/icons as well as color.
- Shell launcher passed `zsh -n`.
- Credential markers from the supplied account/vendor config were absent from the new source/documents. APK, PDF, extracted vendor code and private account details are excluded from the repository and deployment.
- Dependency audit: no high/critical findings after pinning transitive `ws` to a patched compatible 8.x version. Moderate advisories remain in the UI kit's unused wallet peer tree. The field production app does not initialize wallets or call vendor account services.

## Not established here

No physical KSJ connection, actual door movement, latch numbering, USB port state, battery accuracy, or paid checkout was verified. The independent fixtures and simulator exercise software logic only. The static APK analysis did not authenticate the vendor account or validate its cloud service.

## Field acceptance

Run the HTML guide against the real machine on October 3. Record the Bluetooth name, board/firmware version, working door profile, sensor polarity and each physical outcome. Preserve the exported session JSON on failures before reconnecting. Source evidence and protocol ambiguities are in EVIDENCE.md.
