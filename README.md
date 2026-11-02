# NPRO Partner – NISAN dealer order app

Installable web app for NISAN ELECTRONICS dealers:
**https://santosh723-bit.github.io/nisan-dealer-app/**

- Dealers open the link in Chrome and tap **Install** to get the NISAN icon on their home screen.
- On first use the app shows a 10-character **device code**. The dealer sends it to NISAN; NISAN adds it to the dealer list in the Master app and publishes. Only registered devices can see prices.
- Every time the app opens with internet it loads the latest app and price list. Without internet it shows the last prices, but orders need internet.

## Files
- `index.html` – the dealer app (contains no prices)
- `nisan-data.json` – the price list, locked per registered dealer device
- `manifest.json`, `sw.js`, `icon-*.png` – home-screen icon and offline support

Both `index.html` and `nisan-data.json` are updated by the **PUBLISH → Publish to GitHub now** button in the NISAN Master app. Do not upload the Master app here.
