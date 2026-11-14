# ClassArcade — Immersive Gaming

Selected concept B, packaged as a standalone browser launcher. The concept comparison controls have been removed. Home, cinematic game selection, library search/filtering, favorites, collections, details, simulated launches, manifest metadata import, settings and teacher/student navigation remain.

```sh
npm ci
npm run dev -- --port 5173
npm run build
npm run portable
```

`npm run portable` creates `../ClassArcade-Immersive.html` with embedded artwork/fonts/runtime. The source runs in Vite. Favorites and settings use the existing ClassArcade browser namespace so previously saved preferences remain available on the same origin.

Tests: start the app, then `npm test`; use `CLASSARCADE_URL` to select another local test origin. Local system Chromium is used when available; otherwise install Playwright Chromium.

This is an interactive launcher prototype. The seven games and classroom assignments remain synthetic concepts; no actual educational gameplay is included. Full design, research/license and milestone limitations are retained in docs from the original three-concept review. Original three-concept source remains in the separate original repository and earlier download.
