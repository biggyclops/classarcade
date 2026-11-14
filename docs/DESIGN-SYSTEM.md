# ClassArcade design system

## Intent

A gaming library first. Educational relevance is expressed through game mechanics and classroom collections, not school-themed imagery or achievement widgets. The seven fictional worlds share original cinematic artwork and live, code-rendered title treatments. No store branding or third-party game art is reused.

## Foundation

| Token | A — Command Center | B — Immersive Gaming | C — Next Generation |
|---|---|---|---|
| Background | `#101216` | `#0c121c` | `#0c1518` |
| Navigation | `#14161b` | `#0e1520` | `#0e191c` |
| Accent | `#bcacf4` | `#d0d8f1` | `#a3e1cd` |
| Accent text | `#171123` | `#122139` | `#112923` |
| Primary text | `#f1f1f4` | shared | shared |
| Muted text | `#a1a4b2` | shared with blue emphasis | shared with green emphasis |
| Border | `#292c35` | translucent white | subdued mint |
| Container | sidebar + shelves | full-bleed scene + rail | spatial canvas + inspector |

Radii: 2–5px on media and controls, 7–8px on hero/dialog; circular profile and play affordances only. Spacing follows approximately 4/8/12/16/24/32/48px increments. Borders define surfaces without heavy drop shadows. UI controls use Lucide outlines at 14–20px. Filled play symbols and stars indicate action/selected state.

## Typography

DM Sans for navigation, descriptions, and utility controls; Barlow Condensed for game identities and cinematic display titles. Both are self-hosted. Desktop welcome titles are 28–32px; cinematic titles are 68–104px; section titles 14–16px. Small tracked text is reserved for peripheral metadata, not essential actions. Game title styles vary deliberately: italic racing lettering, tracked noir, compressed parkour, wide-tracked space lettering, gold business, mint hacker, monospace IT. Prototype typography should receive student readability testing, especially on low-resolution panels.

## Components and state

- Shared `GameCard`: button-based cover opens details; separate favorite toggle avoids nested controls. Hover lift and artwork scale are subtle. Keyboard focus is visible. Favorites are always discoverable on touch layouts.
- `Dialog`: native modal with focus containment, Escape dismissal, explicit label, close control, and return focus. Detail art, structured metadata and launch action are shared across concepts.
- Primary action: filled concept accent; secondary action: dark translucent fill and border; text action: no enclosing surface; disabled actions remain visibly unavailable.
- Search: instant local filtering by title, genre or skill; Ctrl/Cmd+K focuses it. Collection and genre filters combine. Clear filters resets query and selections.
- Collections: classroom collections are seeded; personal collections require a unique name and at least one title. The current milestone provides creation and filtering, not collection editing/deletion.
- Import: file chooser → bounded JSON parse → title/version validation → metadata preview → short loading state → local manifest list. Imports do not execute files.
- Launch: original artwork → explicit simulated-launch confirmation → local recent-history update. The concept boundary is stated before and after launch.

## Three compositions

A prioritizes fast repeat sessions with familiar left navigation and compact portrait shelves. B uses a single focus world, animated crossfade and a world-selection rail. C treats the library as an exploratory map with a persistent right inspector. It intentionally exchanges scan speed for curiosity. Shared data and utility flows allow meaningful comparison without implementing three unrelated codebases.

## Motion and accessibility

Motion transitions use roughly 180–500ms. Cards lift 5px. Cinematic focus fades/scales slightly; constellation dots drift very slowly. System `prefers-reduced-motion` and the saved app preference disable decorative animation and transitions. No autoplay sound; optional tone fires only on a user-initiated simulated launch.

Native controls, labels, skip link, main/navigation landmarks, visible focus, and dialog semantics support keyboard access. Posters have empty alternate text because the surrounding game buttons already name each title. Automated axe checks are evidence for tested states, not a claim of full accessibility conformance.

## Responsive behavior

At small laptop widths, navigation and gaps compact, then shelves wrap. At 700px, A's sidebar becomes a compact utility row; classroom collections remain accessible from Collections and library filters. B's focus rail scrolls horizontally. C's inspector moves below the constellation, and decorative rings are clipped to the canvas. The role selector remains available on small screens.

## Recommendation

Choose **A — Command Center** for the first classroom pilot. It balances title discovery with straightforward repeat usage, makes classroom collections persistently visible on desktop, and needs less explanation than the spatial interface. Borrow B's game-focus transitions for a future full-screen mode. Test C as an optional discovery view after the actual skill graph and learning prerequisites are defined.

This recommendation is expert judgment based on the prototype review, not a user-study result or a competitive benchmark against Antigravity.
