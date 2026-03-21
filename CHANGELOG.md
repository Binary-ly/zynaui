# Changelog

All notable changes to ZynaUI are documented here.

---

## [0.1.5-beta] (2026-03-21)

### Phosphor genre

- New built-in genre: **Terminal "PHOSPHOR"** — amber CRT phosphor aesthetic: warm near-black surfaces (`#0A0700`), P3 amber brand (`#FF9F0A`), VT323 terminal font
- **Stepped easing** — `steps(6, end)` enter / `steps(4, start)` exit: first genre using discrete step timing for hover transitions, simulating phosphor persistence and digital-clock character refresh. No other design system or genre has shipped stepped motion for interactive UI transitions
- **Left-side chevron button** — left edge indents to a point at vertical center (`polygon(corner 0, 100% 0, 100% 100%, corner 100%, 0 50%)`), reading as a punch-card slot or tape-drive bay entry port
- **Right-side alert bar** — accent indicator on the RIGHT, terminating the text line like a cursor at end-of-line; `">> "` double-chevron prefix. First genre with a right-side alert bar
- **CRT scanlines + vignette** — `body::before`: 1 px horizontal scan lines every 3 px + radial gradient darkening at edges (barrel distortion simulation), CSS-only
- **Animated phosphor sweep beam** — `body::after`: faint amber glow band (200 px, 5.5% peak opacity) scanning top-to-bottom every 8 s via `transform: translateY` animation, simulating the CRT electron gun's raster refresh pass. First CSS genre texture that animates a physical electron beam path
- Sharp rectangular badge (no parallelogram), 9 s scan duration for phosphor persistence effect
- Status colors tuned to secondary phosphor emissions: P1 green success, red alarm danger, yellow-amber warning, P4 blue-white info

### Docs

- VT323 and Share Tech Mono added to the static Google Fonts `<link>` on all 15 docs pages — fonts load upfront with the page rather than being injected dynamically on genre switch
- Roadmap: marked "Genre: Terminal" as done

---

## [0.1.4-beta] (2026-03-21)

### Corporate genre

- New built-in genre: **Corporate "LEDGER"** — warm ivory surfaces (`#F5F4F0`), institutional navy brand (`#1D3557`), document dog-ear button shape, graph-paper grid page texture at 4.5% opacity, `§` legal alert prefix, tight typographic spacing
- `color-scheme: light` applied to flip browser chrome (scrollbars, form controls) in light mode
- Topbar, sidebar, genre panel, and all hover states adapted for light mode using `color-mix` (no hardcoded white overlays)
- Badge variants (primary, success, danger, warning, info, secondary) set to transparent fill with `currentColor` border — no glow
- Badge slant and bevel shapes switch to inner-clip border model: rectangular `box-shadow: inset` was cutting at diagonal corners; inner-clip traces the polygon exactly with a 1px strip
- Card header, card glow, alert bar, and sidebar active indicator tuned for light backgrounds
- SVG logo Z path changed from hardcoded `#f0ebe0` to `var(--text)` to adapt across light and dark genres

### Docs

- Genre builder now syncs to the active genre on page load — previously always initialized to Ops if the `zyna-genre` event fired before the listener registered
- Mobile nav overlay and sidebar off-canvas shadow changed from hardcoded black `rgba(0,0,0,…)` to `color-mix(in oklch, var(--text) X%, transparent)` — correct on both dark and light genres

---

## [0.1.3-beta.1] (2026-03-21)

### Signal Acquisition Search

- Full-text search across all 15 docs pages — instant, zero fetch, hardcoded index
- Weighted scoring: title exact (+120) → class names (+90) → CSS tokens (+85) → title partial (+70) → keywords (+60/35) → description (+25) → section headings (+40) → section content (+15) + contextual page boost (+20) for results in the same section as the current page
- **Token mode** — prefix `--` to filter pages by CSS custom property (e.g. `--btn-bg` → Button page)
- **Command mode** — `/genre <name>` switches the active genre inline and closes search
- **Tab completion** — terminal-style two-stage completion: `/ge` → `Tab` → `/genre `, then `Cyb` → `Tab` → `Cyberpunk`
- Viewport sweep animation on open (one-shot glowing line across full height)
- 7-bar spectrum analyzer in the input row — pulses on keypress, locks on results, flatlines on no signal
- Signal strength bar per result, animated from 0 to relevance %
- Targeting reticle (4 CSS-only corner brackets) on keyboard-selected result
- Type badges: `[COMPONENT]` gold · `[CHART]` cyan · `[GENRE]` purple · `[GUIDE]` muted
- Status indicator: STANDBY / SCANNING… / TOKEN SCAN / COMMAND MODE / N SIGNALS LOCKED / NO SIGNAL
- Last 5 searches persisted in `localStorage`; shown as a recent list when input is empty
- `⌘K` / `Ctrl+K` global shortcut (platform-aware hint); `[ SCAN ]` button in topbar
- `↑↓` navigate, `Enter` lock on, `Escape` abort, full focus trap with `Shift+Tab`
- `aria-activedescendant` updated on keyboard navigation; `aria-live` status region; `role="dialog"` + `aria-modal`

### Docs

- Version badge now reads from `package.json` via `scripts/gen-version.js` — no more manual bumps
- GitHub nav link changed to icon-only (no text)
- Roadmap: marked "Docs: full-text search" as done

---

## [0.1.2-beta.1] (2026-03-21)

### Genre Builder — multi-format export

- JS / CSS / JSON format tabs in the Genre Builder code panel — switch between formats and copy or download any of them
- Download button saves the active format as `<name>.genre.js`, `.css`, or `.json`
- CSS export: full snapshot as a standalone `:root {}` block (global tokens) + `html[data-genre="…"] {}` block (structural overrides) — no `defineGenre` import required
- JSON export: full snapshot matching the `defineGenre()` input shape, with `styles` correctly nested under the `html[data-genre]` selector key
- Integration guide panel: step-by-step instructions for Tailwind v4, Tailwind v3, and plain HTML — opens automatically on first download
- Fixed `--zyna-dark` silently omitted from CSS/JSON exports (value is derived at export time via `darken()`, never stored in state)
- Fixed JSON `styles` flat structure emitting invalid CSS selector keys; now nested under `html[data-genre="…"]`
- Fixed `assert { type: 'json' }` (deprecated) → `with { type: 'json' }` in guide code snippets — prevented Vite/Astro/Nuxt builds from failing
- Fixed guide snippet using `applyGenre` (internal-only) → `document.documentElement.setAttribute('data-genre', '…')`

### Types

- Added missing `genresPlugin()` declaration to `types/genres.d.ts`

---

## [0.1.1-beta.1] (2026-03-20)

### Docs site

- Live changelog page connected to GitHub API (falls back to static data when offline or rate-limited; shows "Rate limited" instead of "Offline" when the API limit is hit)
- GitHub Compare API used to pre-cache diff stats upfront — zero per-hover requests
- CDN installation tab on the landing page
- Changelog link added to nav and footer; sitemap.xml added
- Favicons, web manifest, and OpenGraph/canonical meta tags across all 14 docs pages
- llms.txt and robots.txt added
- Redesigned navbar with numbered topbar groups, sidebar meta tags, count badges, and position breadcrumb
- Mobile-responsive layouts across all doc pages; scrollable code blocks; full-screen mobile nav
- Non-blocking Google Fonts (media swap); deferred below-fold chart scripts for LCP
- Batched DOM reads before writes in scroll handler and genre builder to eliminate layout thrashing

### Deployment

- GitHub Actions workflow auto-deploys `docs/` to Hostinger on push to main
- `docs/dist/` tracked in git so the deploy branch includes bundled genres and chart IIFE

### Plugin

- Genre tokens compiled into `html[data-genre]` CSS rule — genre activation requires no JavaScript at all
- Extracted `tokens.js` and `motion.js` from plugin entry; co-located `@property` and `@keyframes` with each component
- Renamed `card-compact` → `card-sm`; added `badge-sm`, `alert-sm`, `alert-lg` for consistent size modifier naming
- Two-tier token architecture: `bracket-size`/`stroke` exposed as public API; internal tokens use `--z-*` prefix convention
- Removed `:where()` from `.btn` selectors (was blocking variant styling)
- Replaced all `color-mix(in srgb)` with `oklch` across docs and plugin

### Accessibility (full ARIA APG audit)

- Landmark roles (`banner`, `main`, `contentinfo`) added to all pages
- ARIA `tablist`/`tab`/`tabpanel` + roving tabindex + arrow-key navigation on all tab interfaces
- `role="alert"` on all alert elements; `aria-hidden` on all decorative SVG icons
- `aria-label` added to all unlabeled genre builder form controls
- Genre trigger `aria-haspopup` fixed to match `listbox` popup role
- Semantic breadcrumb markup with ARIA landmarks across component and chart pages
- `focus-visible` rings on genre builder inputs and genre trigger button

### Tests

- Test suite expanded to 235 tests (Vitest unit + Web Test Runner browser); snapshot tests replaced with explicit assertions

### Bug fixes

- Badge pulse dot clipped in genre builder — fixed by resetting `clip-path` on `::before`
- View Transitions `AbortError` on rapid genre switches — silenced; initial page load skips transition to prevent abort
- `genresPlugin` prefix wrapping bug fixed
- `_json` null fallback fixed in chart Web Components

---

## [0.1.0-beta.1] (2026-03-19)

### Initial beta release

#### UI Components (Tailwind plugin)
- `.btn` / `.btn-primary` / `.btn-secondary` / `.btn-ghost` / `.btn-danger`: button variants with scan-fill, drop-shadow glow, directional easing
- `.btn-sm` / `.btn-lg` / `.btn-icon`: size modifiers
- `.btn-cut` / `.btn-bevel` / `.btn-round` / `.btn-square`: shape modifiers
- `.badge` / `.badge-primary` / `.badge-success` / `.badge-danger` / `.badge-warning` / `.badge-info` / `.badge-neutral`: badge variants
- `.badge-lg` / `.badge-pulse`: badge size and pulse animation
- `.card` / `.card-dark` / `.card-glow` / `.card-compact`: card variants with animated corner bars
- `.alert` / `.alert-success` / `.alert-danger` / `.alert-warning` / `.alert-info`: alert variants with left accent bar
- Two built-in genres: `ops` (military HUD, default) and `cyberpunk`
- Full CSS custom property API: create new variants without editing plugin source
- `prefers-reduced-motion` respected across all animated components

#### Plugin options
- `prefix`: prepend a string to all component class names (e.g. `{ prefix: 'z-' }` → `.z-btn`)

#### Tailwind theme extension
- `colors.zyna.*`: brand color + semantic status colors (`text-zyna-success`, `bg-zyna-danger`, etc.)
- `borderRadius.zyna-*`: corner-radius scale (`rounded-zyna-sm`, `rounded-zyna`, `rounded-zyna-lg`, `rounded-zyna-xl`)

#### Chart Web Components (D3-powered)
- `<zyna-waffle>`: square-grid waffle chart
- `<zyna-timeline>`: proportional-circle timeline
- `<zyna-nightingale>`: nightingale rose chart
- `<zyna-lollipop>`: horizontal lollipop chart
- `<zyna-orbital>`: concentric arc orbital chart
- Responsive (ResizeObserver), accessible, SSR-safe

#### React wrapper
- `import { ZynaWaffle, ZynaTimeline, ZynaNightingale, ZynaLollipop, ZynaOrbital } from 'zynaui/react'`
- Typed props accepting native arrays and numbers (not JSON strings)
- `'use client'` directive included, compatible with Next.js App Router

#### Distribution
- `dist/zyna-plugin.js` / `.cjs`: Tailwind plugin (ESM + CJS)
- `dist/genres.js` / `.cjs`: genre API (`defineGenre`, `registerGenre`)
- `dist/zyna-charts.js`: chart Web Components (ESM, D3 external)
- `dist/zyna-charts.iife.js`: chart Web Components (IIFE, D3 bundled, CDN-ready)
- `dist/react.js` / `.cjs`: React wrapper with IIFE inlined
- `dist/zynaui.css`: pre-compiled CSS (CDN / vanilla HTML)
- `dist/zyna-charts-stub.cjs`: SSR no-op stub for Node environments
