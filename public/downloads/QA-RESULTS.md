# ClassArcade QA results

November 14, 2026. Branch `design/codex-concepts`.

## Summary

Three functioning browser prototypes and a comparison page. Final production build passed TypeScript and Vite compilation. **12 of 12 Playwright tests passed** in 16.2 seconds against the production preview on port 4173. Source code, original artwork, portable HTML, screenshots, research/license notes and design documentation are included.

## Environment and method

Linux cloud workspace, system Chromium, Playwright 1.65.1. Desktop 1600×1000; Chromebook-sized 1366×768; mobile 390×844. Responsive assertions also cover 1024px and 768px widths. Browser skill was loaded, but its required `js` runtime was not available in the tool set; no cloud desktop/preview opening tool was exposed. Used the Playwright validation explicitly requested in the brief. No original user browser or confidential records were accessed.

## Checks

| Check | Result | Evidence |
|---|---|---|
| Page identity | PASS | ClassArcade title, correct concept selected, meaningful main content |
| Blank/error overlay | PASS | Rendered screenshots and game button assertions; no framework overlay |
| Console health | PASS | No page errors in tested flows; final production measurement captured zero console errors |
| Artwork | PASS | All images decoded; zero missing images in nine screenshot states |
| Responsive layout | PASS | No horizontal page overflow at tested widths; inspector stacks on mobile |
| Interaction proof | PASS | Twelve Playwright workflows; machine-readable test-results.json |
| Home accessibility | PASS | axe WCAG 2 A/AA and 2.1 AA tags: zero violations for all three home screens |
| Detail/settings accessibility | PASS | axe scans: zero violations in sampled dialogs |
| Keyboard | PASS | Skip link; Ctrl+K search; Escape; modal focus restoration |
| Reduced motion | PASS | Saved preference persists; system-reduced-motion suppresses constellation animation |
| Portable review HTML | PASS via HTTP | A→B→C→Compare works while every additional request is blocked; zero external resources |
| Direct local HTML file | BLOCKED / UNTESTED | Managed Chromium rejects file:// navigation by policy; not bypassed |

Automated checks do not establish full accessibility conformance. Screen-reader usability, contrast over every changed hero, zoom, and physical-device performance still need owner testing.

## Interaction loops verified

1. Each concept → Library → search Graph Runner → clear → Algebra 1B → Space combat → Equation Zero details → Launch preview → explicit simulated-launch result → return.
2. Favorite Graph Runner → Favorites → reload → favorite remains → create Friday favorites → reject duplicate collection name inside the dialog → switch to B → Collections → selected collection contains its game.
3. Import → invalid manifest → visible error → valid title/version manifest → local metadata list. No executable code is loaded.
4. Settings → reduced motion → reload → preference remains. Teacher role → classroom selection → simulated assignment confirmation.
5. Mobile A → Favorites → Teacher role → Import. Teacher/student controls remain usable when the desktop sidebar is hidden.
6. Library → A–Z sort → Algebra Tycoon first → list view → IT support genre → DeskFault only.
7. Keyboard entry → skip link focus → shortcut search → detail dialog → Escape → original game button regains focus → comparison page shows three concepts.

## Visual refinement

- Replaced the racing hero's enlarged portrait art with a dedicated wide original image.
- Replaced the soft full-screen space crop with a dedicated sharp original space banner.
- Fixed constellation rings extending the phone viewport.
- Fixed native modal return focus during React Strict Mode mounting/unmounting.
- Registered keyboard shortcuts before paint to avoid a first-interaction timing race.
- Exposed mobile utility navigation and role selection, and moved duplicate-name feedback inside the modal layer.
- Generated UI composition reference is in classarcade/docs/design-concepts.webp. Browser implementation retains the requested seven-title library rather than the generator's invented titles/operations. Screenshot review compared the primary compositions, art dominance, restrained accent systems and concept-specific hierarchy. No claim is made that unimplemented generator details are working features.

## Production performance sample

Chromium headless on Linux, 1366x768, 4x CPU slowdown, localhost without network throttling. Single cold browser context per concept; not physical Chromebook benchmark.

| Concept | LCP | CLS | Resource transfer | JS heap snapshot | Console errors |
|---|---:|---:|---:|---:|---:|
| A | 1.088 s | 0.00433 | 1066 KiB | 3.02 MiB | 0 |
| B | 1.244 s | 0.00041 | 995 KiB | 3.20 MiB | 0 |
| C | 0.944 s | 0.00072 | 773 KiB | 3.32 MiB | 0 |

This is one local cold-context sample per concept with 4× CPU throttling, not a statistical benchmark or a real Chromebook result. Resource transfer includes fonts/art/scripts/styles as observed by Chromium; memory is an indicative JS heap snapshot, not total tab RAM. No physical ChromeOS or school-network claim is implied.

Production JavaScript: approximately 395.5 kB raw / 124.5 kB gzip. CSS: approximately 39.2 kB raw / 8.9 kB gzip. Fonts/art are local, and covers are normally lazy-loaded. Portable HTML deliberately embeds everything and is larger than the initial served payload.

## Reproduction

Start `npm run dev -- --port 5173`, then `npm test`. For production, run `npm run build`, `npm run preview -- --port 4173`, and `CLASSARCADE_URL=http://localhost:4173 npm test`. To measure the production sample, generate `npm run portable`, keep the preview on port 4173 running, then run `npm run measure`.

## Evidence files

review-screenshots contains A/B/C desktop and Chromebook full-page captures and actual viewport captures; mobile full-page captures; game details; classroom collections; teacher workspace; and comparison. Primary compositions and sampled responsive screenshots were inspected with the image-viewing tool. Raw test and performance JSON are beside this report.

## Recommendation and remaining risk

Choose A — Command Center for the initial classroom pilot. Its persistent desktop collection navigation and familiar library workflow offer the best balance of efficiency and visual identity. B is strongest for cinematic discovery; C is an exploratory option requiring real skill-graph and usability work.

Remaining boundaries: concept games only; simulated launch/assignment; local persistence only; manifest metadata only; no production PWA cache; Chromium-only validation. See classarcade/docs/LIMITATIONS.md for full details. No public deployment or private-machine access was performed.
