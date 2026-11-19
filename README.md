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

## Add browser games

Put each self-contained HTML game in `public/games/<game-name>/`. Every game folder needs an `index.html` and `game.json`; copy `public/games/_template/` to start. `npm run dev` and `npm run build` automatically discover valid game folders and add them to the ClassArcade library. Games run in a sandboxed browser frame, so Chromebook users do not download or install anything.

## Next Chapter

`public/games/next-chapter/` is a playable life simulation built from `next-chapter/client.jsx`, `model.mjs`, and `style.css`. Run `npm run chapter:test` for financial and classroom access tests. The in-game planner experiments without spending money; committing runs the same verified math/decision workflow as ordinary choices. Auto totals can be disabled per class.

GitHub Pages hosts the launcher and game. Shared classrooms use the existing ClassArcade Sites Worker API (`/api/next-chapter`) with D1. `npm run build:host` builds both; `npm run build` keeps the normal GitHub Pages output. `npm run dev` uses a local SQLite database under ignored `.nc-local/` and Vite middleware. The local database has no production users. Teacher registration requires an owner-created invitation; the first owner uses the server-side `ADMIN_INVITE`, bound to `OWNER_EMAIL`. Bootstrap registration stops working after the owner exists. Passwords/PINs use PBKDF2; session tokens are stored as hashes in D1, expire after seven days, and remain in per-tab session storage in the client.

See [Next Chapter implementation notes](docs/NEXT-CHAPTER.md) for provider limits and operations.
