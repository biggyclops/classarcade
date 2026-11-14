# Research and licensing notes

Research date: November 14, 2026. Public sources only. No competitor workspace or production system was accessed.

## Launcher references

| Reference | Public evidence studied | Application to ClassArcade |
|---|---|---|
| [Steam library](https://store.steampowered.com/libraryupdate) | Recently played, custom shelves, collections, detail hubs, header artwork | A: persistent navigation, resume shelf, portrait covers; shared detail surface |
| [Xbox PC app / Game Pass](https://www.xbox.com/en-US/apps/xbox-app-on-pc) | Controller-oriented mode, quick access to play, aggregated library; official UI illustrations described on page | B: single-world focus and direct play action; not a copy of Xbox chrome |
| [Epic Games Launcher](https://launcher.epicgames.com/) | Grid/details views, visual collections, per-game controls, search and genre filtering | Shared library filters, list/grid switch, collections and detail dialog |
| [GOG GALAXY](https://www.gog.com/galaxy), [official collections article](https://www.gog.com/es/news/6_cool_things_you_can_do_in_gog_galaxy_20_that_you_might_have_missed) | Unified library and sidebar collection organization | A: classroom collections alongside personal collections; import metadata separated from execution |
| [PlayStation 5 official FAQ](https://blog.playstation.com/2020/11/09/ps5-the-ultimate-faq/comment-page-10/) | Game library and individual game hubs; selected-title focus in public guide imagery | B: minimal top-level navigation and cinematic focus |
| [Playnite](https://github.com/JosefNemec/Playnite) | Desktop/fullscreen application separation, theme architecture, library manager | Separate UI concept surfaces on shared data model |
| [Heroic](https://github.com/Heroic-Games-Launcher/HeroicGamesLauncher) | React frontend, Library/Game/Settings/Loading/Accessibility screens, library context module | Reusable React primitives and honest metadata-import boundary |
| [Pegasus](https://github.com/mmatyas/pegasus-frontend) | Qt/QML frontend, theme loading, fullscreen handling, explicit font loaders and scaling baseline in `src/frontend/main.qml` | Local fonts, reusable content model, display-conscious layout rather than heavy web effects |

This was a focused public-source research pass, not hands-on testing of installed commercial launchers. Product pages and GitHub content were read; brand artwork and code were not imported.

## Professional interface references

- [Darshan Shah — Game Launcher, Dribbble](https://dribbble.com/shots/17727529-Game-Launcher-UI-Design): public page and palette metadata studied; dark base, restrained cool accent and warm art contrast informed the research discussion. No assets copied.
- [Behance — Game Launcher UI/UX Concept](https://www.behance.net/gallery/162602983/Game-Launcher-UIUX-Concept), [Game Launcher UI](https://www.behance.net/gallery/111938031/Game-Launcher-UI): search-index previews located. Direct Behance access returned HTTP 403; detailed visual inspection was unavailable.
- [Figma Community — Gaming Landing Page Freebie](https://www.figma.com/community/file/1280853109194723536/Gaming-Landing-Page-Freebie): discovered through public reference listings; the direct file was inaccessible through available tools. No Figma assets were downloaded or reused. A landing-page resource is adjacent inspiration rather than a launcher specification.

The generated three-screen board in `design-concepts.webp` was the composition reference. Implementation deliberately retains the requested seven-title library rather than the image generator's invented extra titles or operations. The UI is rendered with code; original art is separate.

## Repository inspection and license checks

Read public root contents, README material and license endpoints. Inspected Playnite's source tree (`Playnite.DesktopApp`, `Playnite.FullscreenApp`, theme/control/view-model folders); Heroic's React frontend screen structure and Library files; Pegasus's QML frontend entry point. This is architectural inspection, not a source audit.

| Repository | License verified in repository license content | Use in this project |
|---|---|---|
| JosefNemec/Playnite | MIT | Research only; no copied source or assets |
| Heroic-Games-Launcher/HeroicGamesLauncher | GPL-3.0 | Research only; no copied source or assets |
| mmatyas/pegasus-frontend | GPL v3 or later, plus supplementary terms under section 7 | Research only; no copied source or assets |

Pegasus's GitHub API identifier was `NOASSERTION`; the license file itself explicitly states GPL v3-or-later and additional trademark and liability terms. Those terms must be considered before any future code reuse. No permissions to use existing launcher branding are inferred from source licenses.

## Included assets and dependencies

- Game images: original generated artwork made for this brief, using the available image-generation tool. Seven game compositions, an extra space vista, a dedicated wide racing image, and a sharp full-screen space-combat banner. WebP derivatives are shipped; original PNG sheets are included with review deliverables. No paid stock was purchased. Generated artwork is not represented as exclusive or copyright-registered.
- UI logo: code-rendered ClassArcade text and a Lucide gamepad symbol, not a copied launcher mark. Game title typography is code-rendered.
- DM Sans / Barlow Condensed: SIL Open Font License 1.1; included notices. Converted from supplied TTF to WOFF without redesigning the fonts.
- Runtime dependencies: React, React DOM, scheduler, Motion, Framer Motion, motion-dom and motion-utils: MIT; lucide-react: ISC; tslib: 0BSD. Exact resolved versions are in `package-lock.json`. License texts are collected in `THIRD-PARTY-NOTICES.txt`.
- Build/test tooling: Vite MIT, TypeScript Apache-2.0, Playwright Apache-2.0, axe-core MPL-2.0; dependency package distributions retain their own notices.

Infrastructure names in the brief were treated as optional existing resources. This environment exposes no Atlas/Hades/Mini-Beast/Hermes connections or credentials. No access was attempted to private hosts. Artwork used the available generator; development and headless Chromium testing used this isolated cloud workspace. No public site was deployed.
