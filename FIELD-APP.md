# KSJ machine field app

The new implementation for the supplied KSJ APK and 12-door Bluetooth protocol is in [`field/`](field/README.md).

```sh
cd field
npm ci
npm run dev
```

Open http://localhost:5173 in Google Chrome. Start with simulation, then follow [`field/public/setup-guide.html`](field/public/setup-guide.html) for the real machine.

The root Next.js app is the older web3 prototype. It is preserved and is not required to run this field app. The previous AVA backend controls a different machine. See [`field/docs/EVIDENCE.md`](field/docs/EVIDENCE.md) for the repository/branch comparison and protocol findings.
