# ClassArcade — three browser prototypes

One library. Endless learning.

## Review in a browser

Open `../ClassArcade-review.html` in Chrome or Edge. This portable file embeds React, styles, fonts, and original artwork; it needs no build or external service. Managed browsers may block local HTML files. In that case serve the output folder locally with `python -m http.server 5173`, then visit `http://localhost:5173/ClassArcade-review.html`.

The portable file was verified through HTTP with every additional network request blocked. Direct `file://` navigation was blocked by the test environment's browser policy, so direct-file behavior is not claimed as tested.

The source app runs with:

```sh
npm ci
npm run dev -- --port 5173
```

Open `http://localhost:5173`. Use A / B / C in the review bar, or Compare. Deep links: `?concept=a`, `?concept=b`, `?concept=c`, and `#compare`.

```sh
npm run build
npm run preview -- --port 4173
npm run portable
npm test
```

Tests use `/usr/bin/chromium` when present and otherwise use Playwright's bundled Chromium. On another machine run `npx playwright install chromium` first, or set the executable path to your Chromium installation.

## The concepts

- **A — Command Center:** desktop library navigation, classroom collections, a racing spotlight, recently played shelf, portrait game covers. Recommended for everyday classroom use.
- **B — Immersive Gaming:** full-bleed changing game artwork, large title typography, minimal navigation, cinematic world selector, landscape covers.
- **C — Next Generation:** an interactive skill constellation, seven game nodes, a selected-world inspector, mint technical styling. The network is an illustrative design concept, not a validated skill recommendation model.

## Working interactions

Home; library; text search; genre and collection filters; alphabetic sort; list/grid views; details; favorites; custom collections with game selection; recently played; JSON manifest validation/import; preferences; optional launch tone; reduced motion; student/teacher navigation; simulated classroom assignment; simulated launch; concept comparison.

All seven specified concept titles are present. Algebra 1A, Algebra 1B, and Individualized Instruction are seeded classroom collections. Favorites, recent history, custom collections, import metadata, settings, and simulated assignments use a versioned localStorage namespace. No student records, accounts, analytics, or remote APIs are used. Browser storage restrictions can prevent persistence while leaving the prototype usable.

## Deliverables

- `src/`: React / TypeScript source with separate concept surfaces and shared card, artwork, dialog, button, data, and asset utilities.
- `public/art/`: seven original game artworks, a space vista, and dedicated racing and space-combat banners.
- `public/fonts/`: locally hosted Barlow Condensed and DM Sans; OFL notices in `docs/`.
- `docs/DESIGN-SYSTEM.md`: tokens, interaction rules, responsive behavior, comparison, recommendation.
- `docs/RESEARCH.md`: research sources, repository inspection, license checks, access limits.
- `docs/LIMITATIONS.md`: milestone boundaries and infrastructure substitutions.
- `tests/`: 12 Playwright checks, including axe accessibility scans.
- `../review-screenshots/`: desktop, Chromebook, mobile, comparison and interaction evidence.
- `../test-results.json`, `../performance-results.json`, `../QA-RESULTS.md`: machine-readable results and review notes.
- `../ClassArcade-review.html`: self-contained review build.

Branch: `design/codex-concepts`. No public deployment, paid assets, production modifications, or access to the other team's work.
