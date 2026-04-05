# Changelog

All notable changes to ZynaUI are documented here.

---

## [0.1.8-beta] (2026-04-05)

### Genre: Blueprint "SCHEMATIC"

New built-in genre: **Blueprint "SCHEMATIC"** — precision ISO engineering drawing aesthetic: prussian blue (`#1B3A6B`) on drafting vellum (`#EDF2FA`), DM Mono notation font, dual-tier metric grid page texture.

- **Right-angle stepped notch button** — top-right corner is cut as a 90° step (width = corner, height = corner), reproducing a machined shoulder, PCB routing keepout step, or precision tolerance feature. No other genre or design system uses a right-angle orthogonal step cut on an interactive element. The shape reads as a manufactured part, not a design choice.
- **Top-center V-notch badge** — a downward-pointing triangular cut at the midpoint of the top edge, exactly reproducing the datum feature symbol opening in ISO 1101 / ASME Y14.5 GD&T annotation. First badge in any design system with a top-center notch; extra top padding (0.38 rem) keeps text clear of the 5 px notch.
- **Partial-height left witness line alert bar** — the alert bar spans 15 %→85 % of the component height (inset: 15% auto 15% 0), anchored to the content region rather than pinned edge-to-edge. References ISO 128 dimension practice: witness lines project only from the feature they measure. First partial-height alert bar in any CSS design system.
- **`"⊗ "` alert prefix** — circled times symbol (U+2297): the into-page orthographic vector marker, used in engineering drawings to indicate a force or reference terminating into the page. Unique across all design systems.
- **Constant-velocity (linear) motion** — both enter and exit use `linear` timing. A drafting arm, pantograph, or CMM probe moves at constant speed with no acceleration or deceleration. The only genre in ZynaUI using linear() for interactive UI transitions.
- **Dual-tier precision metric grid body texture** — four CSS gradient layers: horizontal + vertical at 5 px (minor) and 25 px (major), a 5:1 subdivision ratio matching ISO metric drafting paper standard. Distinct from Corporate's single-tier 24 px graph-paper grid.
- **Horizontal pen plotter sweep** — `body::after`: a faint 3 px prussian-blue vertical slit crossing the viewport left-to-right every 14 s, simulating an HP 7475A pen plotter head traversing the drawing surface at constant speed. The only horizontal sweep animation in ZynaUI; the only genre sweep on a light background.
- **Double witness-line sidebar indicator** — three stacked inset box-shadows (`inset 2px … var(--zyna)` / `inset 4px … var(--bg)` / `inset 6px … faint-prussian`) produce two 2 px prussian lines separated by a 2 px gap — the extension/witness line pair used in ISO 128 dimension callouts. Never implemented in any design system or UI library.
- **Ruled schedule-line card texture** — `repeating-linear-gradient` at 18 px horizontal spacing, giving each card the appearance of a blank engineering parts list or schedule table ready for annotation.
- **Solid title-block card bar** — 2 px solid prussian bar with no gradient fade, referencing the hard-edge top border of an ISO drawing sheet title block.
- Status colors grounded in engineering inspection vocabulary: tolerance green (pass), rejection red (non-conformance), reference amber (informational dimension), annotation prussian (info callout).
- `prefers-reduced-motion` override placed last in addBase source order to win over the plotter sweep animation — same pattern as Phosphor and Military.

### Bug Fixes (Charts)

- **`zyna-waffle`**: `parseInt` on `cols` and `gap` attributes can return `NaN` when the attribute value is `''` — `NaN > 0` and `NaN >= 0` both evaluate to `false`, causing `cols` to fall through to `NaN` and `gap` to `NaN`, then propagating `NaN` into the cell-size arithmetic. Added explicit guards: `colsRaw > 0 ? colsRaw : 10` and `gapRaw >= 0 ? gapRaw : 3`. Added `if (cs <= 0) return` to prevent rendering into a container too narrow for the requested column count.
- **`zyna-lollipop`**: `parseInt` on the `ticks` attribute returns `NaN` for empty/invalid values. Added `tickCountRaw > 0 ? tickCountRaw : 5` guard.
- **`zyna-orbital`**: with 6+ data items, `spacing = outerR * 0.21` causes inner rings to have negative radii, producing degenerate arc paths. Replaced with `Math.min(outerR * 0.21, (outerR - ringTW) / (data.length - 1))` — preserves the default 0.21 factor for ≤5 items, scales down automatically for more without requiring consumer intervention.
- **`zyna-nightingale`**: D3's `join()` appends enter nodes at the end of the parent, after any existing siblings. When new data items were added, the `.ng-cap` center circle (appended once at creation) was buried under newly-joined sector groups and rendered invisible. Fixed by calling `cap.raise()` after the join so the cap is always the last child (rendered on top), regardless of how many sectors are added or removed.

### Bug Fixes (Genre)

- **Ops `--z-alert-bar-radius`**: the previous value `'var(--z-alert-radius) 0 0 var(--z-alert-radius)'` caused CSS variable substitution to expand `--z-alert-radius: '0 3px 3px 0'` into a 10-value `border-radius` shorthand, which is invalid CSS and was silently ignored — the bar radius fell back to `0` on all browsers but the intent was to round the left-facing corners of the left-side alert bar. Fixed to the literal `'3px 0 0 3px'`.

### Docs

- **Genre section on landing page**: fixed palette strip not rendering for dynamically activated genres — strip now re-renders on every `zyna-genre` event regardless of whether the genre was already active.
- **`ZynaWaffle` React wrapper**: corrected default `gap` value passed from the React component to the Web Component.
- Updated visual regression baselines for 6 Ops alert snapshots affected by the `--z-alert-bar-radius` fix.

### Roadmap

- Marked Blueprint "SCHEMATIC" as done

---

## [0.1.7-beta] (2026-03-22)

### Search

- Fixed contextual boost applying to zero-match queries — unrelated searches no longer return false 100% results
- Removed fabricated CSS token names from the search index; all component token arrays now reflect actual compiled tokens
- Removed non-compiled variant classes (`btn-plasma`, `badge-plasma`, `card-cyber`, `alert-plasma`) from the index — these are custom-example classes defined in docs pages, not in `dist/zynaui.css`

### Roadmap

- Added 4 planned light genres: Blueprint "SCHEMATIC", Washi "BRUSHWORK", Laboratory "LABBOOK", Atelier "MAISON"
- Marked Playwright visual regression suite as done

---

## [0.1.6-beta] (2026-03-21)

### Military genre

- New built-in genre: **Ground Operations "FIELDCRAFT"** — tactical olive surfaces (`#131510`), ranger olive brand (`#8B9E4B`), Share Tech Mono field-radio typography
- **Opposing diagonal chamfer button** — top-left AND bottom-right corners cut simultaneously, creating a dogtag / military ID card shape. No other genre or design system uses opposing-diagonal double chamfer on interactive elements
- **Bottom accent bar on alerts** — first genre with a bottom-edge bar, referencing NATO ground symbology where a baseline below a unit marker indicates defensive position. Completes the four-direction set: Ops (left), Phosphor (right), Cyberpunk (top), Military (bottom)
- **`"◈ "` alert prefix** — filled diamond, the NATO standard control point and waypoint marker on tactical overlays. Unique across all design systems
- **Bottom-left notch badge** — `polygon(0 0, 100% 0, 100% 100%, 8px 100%, 0 calc(100% - 8px))`: a punch-hole notch at the lower-left corner, like a physical field identification tab or barcode label binding hole. First badge shape with a bottom-left corner clip
- **Dual-axis crosshatch page texture** — body::before: 45° + −45° diagonal repeating gradients combine into a diamond grid at 3% opacity, referencing NATO tactical overlay paper, USGS topographic map hatching, and camouflage netting silhouette patterns
- **Upward terrain surveillance sweep** — body::after: olive-green glow band (`rgba(139,158,75,0.035)` peak) ascending bottom-to-top every 12 s, opposite direction from Phosphor's downward CRT scan. Simulates ground-based LiDAR / surface surveillance radar sweeping upward through terrain
- **Card acetate overlay texture** — `repeating-linear-gradient(45deg, ...)` applied as `--z-card-texture`: each card reads as a laminated field map covered with tactical acetate overlay paper
- **Solid 2px stencil card bar** — `--z-card-bar-bg: var(--zyna)` with no gradient fade. Every other genre fades the top card rule; Military stencils are hard-edged
- Ballistic motion: `cubic-bezier(0.16, 1, 0.3, 1)` enter (rangefinder locking on target), `cubic-bezier(0.4, 0, 1, 1)` exit. No spring, no overshoot — military equipment doesn't bounce in UI
- Status colors grounded in operational vocabulary: vegetation green success, infrared-flare red danger, amber-signal-flare warning, topo-map-water-feature info
- `prefers-reduced-motion` override placed inside military.js (after animation declaration) to win CSS source order over the genre's sweep beam — same pattern as Phosphor

### Roadmap

- Marked "Genre: Military" as done

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
