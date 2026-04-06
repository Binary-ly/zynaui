# Changelog

All notable changes to ZynaUI are documented here.

---

## [0.1.11-beta] (2026-04-06)

### Genre: Atelier "MAISON"

New built-in genre: **Atelier "MAISON"** — luxury editorial fashion houses. 22-karat gold (`#B8920A` — the amber-gold of hot-stamp foil on Hermès and Chanel archive cards) on warm ecru vellum (`#F5EFDF` — Arches 300 gsm cream, HSL 38°, 51% sat, 91% lightness). Slowest motions, widest sweep, and highest typographic refinement in ZynaUI.

- **Both-right-corners chamfered button (luxury ribbon label)** — flat left edge, both right corners cut at equal 45° angles. A right-shouldered ribbon form: the silhouette of a woven satin garment label or a gold-foil price tag on a Hermès belt. Shape survey: Ops=opposing diagonal; Corporate=top-right only; Phosphor=left chevron; Military=opposing diagonal; Blueprint=top-right step; Washi=top-left only; Laboratory=both bottom corners (different side). Atelier is the only genre with both RIGHT corners cut. First ribbon-label button in any CSS design system.
- **Left-center V-notch badge (couture price-tag ribbon hole)** — a rectangle with a triangular V-notch (10 px deep, 10 px tall) cut from the left-center edge. Physical luxury price tags (Chanel, Hermès, Dior) are punched with a ribbon-notch; this badge is that punched tag. Badge survey: Corporate/Phosphor=rectangles; Military/Washi=corner chamfers; Blueprint=top-center V-notch (different axis); Laboratory=right-pointing arrow. Atelier's notch is on the LEFT (not top), a new shape class. First left-notch badge in any CSS design system.
- **Right partial-height alert bar** — accent bar on the RIGHT edge at 15%–85% vertical (`inset: 15% 0 15% auto`, `width: 3px`). References the short gold annotation mark drawn in the right margin of couture pattern cards — not a full-height page boundary rule, but a crop-height approval mark. Alert bar survey: Ops/Corporate/Washi=left full; Phosphor=right full; Military=bottom; Blueprint=left partial-height; Laboratory=top. Atelier is the only genre with right partial-height.
- **"» " alert prefix (right guillemet, U+00BB)** — the French right double guillemet is the standard editorial quotation and section-continuation mark in Parisian fashion typography. It reads as "the point of view continues here." Distinct from Phosphor's ASCII ">>" (two separate characters, different cultural register). First guillemet used as a UI alert prefix in any design system.
- **Laid paper dual-axis page texture** — THE ONLY DUAL-AXIS PAGE TEXTURE IN ZYNAUI. Two crossing `repeating-linear-gradient` layers: horizontal laid lines at 4 px pitch (0°) + vertical chain lines at 40 px pitch (90°). Reproduces hand-made paper structure (Arches, Fabriano, Moulin du Roy): closely-spaced horizontal wires of the paper mould and the coarser vertical wires binding it. The ONLY genre with two crossing gradient axes for page texture.
- **Gold leaf shimmer sweep (120 px, 28 s)** — WIDEST AND SLOWEST SWEEP IN ZYNAUI. A 120 px wide warm-gold gradient (peak 12% opacity at center) traverses the viewport at ease-in-out over 28 s. Reproduces the roll of oblique reflected light across hot-stamped gold foil on an atelier title card. Sweep survey: Phosphor=3px/8s; Military=2px/12s; Blueprint=1px/14s; Laboratory=3px/9s; Washi=8px/18s; Atelier=120px/28s. Every parameter is a genre maximum.
- **Silk drape motion (slowest in ZynaUI)** — 0.20s fast, 0.38s base (longest in ZynaUI), 0.52s slow (longest in ZynaUI). Enter `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (silk unfurl: slow start, flowing arc, gentle land), exit `cubic-bezier(0.55, 0, 1, 0.45)` (silk gather: smooth acceleration, precise arrest), spring `cubic-bezier(0.34, 1.26, 0.64, 1)` (garment settle: barely-perceptible overshoot, elegant rest). The most restrained spring in ZynaUI.
- **Centered gold fade card bar** — 2 px, `linear-gradient(to right, transparent 0%, var(--zyna) 40%, var(--zyna) 60%, transparent 100%)`. Reaches full brand-gold at center, reproducing the centered rule on luxury letterheads and name cards. Distinct from Ops's center-weighted gradient (Ops peaks at 55% opacity; Atelier reaches full opacity). First center-to-full-opacity rule in any CSS design system.
- **Warm ecru palette** — ecru vellum page (`#F5EFDF`, HSL 38°), parchment sidebar (`#EDE3C8`), warm ink brown-black text (`#1C1208`), amber-brown secondary (`#5C3D00`), gold-brown tertiary (`#8C6B20`). Status colors in French fine-arts pigment vocabulary: sap green (bookbinder's green), alizarin crimson (1868 synthetic red lake), yellow ochre (iron oxide, oldest known pigment), Prussian blue (first synthetic pigment, 1704).

---

## [0.1.10-beta] (2026-04-06)

### Genre: Laboratory "LABBOOK"

New built-in genre: **Laboratory "LABBOOK"** — precision analytical instruments and dot-grid laboratory notebooks. Cobalt titanate teal (`#0090B0` — CoTiO₃, the teal of UV filter glass, Keysight oscilloscope housings, and Eppendorf tube lids) on teal-white clinical surface (`#EDFAFC`). HSL 195° hue — a full 20–25° rotation away from Corporate's navy (220°) and Blueprint's prussian (215°), reading as a distinct colour at a glance.

- **Both-bottom-corners chamfered button (inverted trapezoid)** — flat top, both bottom corners cut at equal 45° angles. No ZynaUI genre cuts both bottom corners: Ops cuts opposing diagonal; Corporate top-right only; Phosphor left-chevron; Military opposing diagonal; Blueprint top-right step; Washi top-left only. Laboratory is the only genre with a flat top and symmetric bottom chamfers. References the DIN VDE 0868 trapezoidal instrument push-button standard and the cross-section of an Eppendorf microcentrifuge tube cap.
- **Right-pointing arrow badge** — a right-pointing pentagon (straight top, left, bottom; two diagonal edges converging to a right-hand tip at 50% height). No ZynaUI badge has any arrow shape. References directional labels on analytical instrument sample flow paths (HPLC, GC, spectrophotometer) and the arrow-profile batch-code tags on laboratory reagent bottle racks. First right-pointing arrow badge in any CSS design system.
- **Top-edge alert bar** — the accent bar runs along the TOP of the alert (`inset: 0 0 auto 0`, `height: 3px`). Alert bar position survey: Ops/Corporate/Washi=left full; Phosphor=right; Military=bottom; Blueprint=left partial-height. Laboratory is the only genre with a top-positioned bar, referencing the horizontal section-header ruling at the top of each laboratory notebook entry. First top-bar alert in any CSS design system.
- **"∴ " alert prefix (therefore, U+2234)** — the therefore symbol concludes scientific observations in every branch of lab science ("∴ the compound is an ester"). No other ZynaUI genre uses ∴. First scientific logical symbol used as a UI alert prefix in any design system.
- **Radial-gradient dot-grid page texture** — THE ONLY RADIAL-GRADIENT PAGE TEXTURE IN ZYNAUI. All other genres use repeating-linear-gradient. A `radial-gradient(circle, ...)` array at 8 px pitch places 1 px circular dots matching the 2 mm dot grid of Leuchtturm1917 and Rhodia dotPad laboratory notebooks.
- **Oscilloscope sawtooth retrace sweep** — THE ONLY SAWTOOTH ANIMATION IN ZYNAUI. A 3 px vertical beam traverses left-to-right (85% of cycle), then instantly resets to origin with opacity 0 (flyback blanking, exactly as CRT oscilloscopes blank the Z-axis during retrace), holds blanked for 9% of cycle, then resumes. No other ZynaUI sweep retraces.
- **Galvanometer critically damped motion** — fastest base durations in ZynaUI (0.11s fast, 0.18s base). Enter `cubic-bezier(0.22, 1.58, 0.44, 1)` (galvanometer coil energising), exit `cubic-bezier(0.40, 0, 1.00, 1)` (crisp instrument release), spring `cubic-bezier(0.18, 1.85, 0.38, 1)` (under-damped transient + magnetic brake settle). Every easing maps to a measurable galvanometer behaviour.
- **Fine vertical spectral lines card texture** — pure 90° vertical lines at 6 px pitch only (no horizontal component). Perpendicular to Blueprint's horizontal schedule rules. References spectrophotometric cuvette column spacing and GC column plate-height graduation marks.
- **Dual-beam spectrophotometer card bar** — 4 px total height: 1 px solid teal (signal beam) + 2 px transparent gap + 1 px 42%-teal (reference beam). First dual-line card bar in any CSS design system. References the dual optical path of a double-beam UV/Vis spectrophotometer.

---

## [0.1.9-beta] (2026-04-05)

### Genre: Washi "BRUSHWORK"

New built-in genre: **Washi "BRUSHWORK"** — the visual language of Japanese handmade paper (和紙) and sumi ink calligraphy. Shu-iro cinnabar vermilion (`#C93C23` — Tōrii Vermilion, Pantone 7597 C) on kozo washi cream (`#F7F0E6`), warm sumi ink brown-black text.

- **Top-left single chamfer button** — only the top-left corner is cut diagonally, reproducing the nyū-hō (入鋒) — the initial placement of the brush on paper before the stroke begins. Every shodo character starts at the top-left; the chamfer is that starting point made physical. No other genre or design system uses a single top-left corner chamfer on a button.
- **Bottom-right chamfer badge (tanzaku slip)** — tanzaku (短冊) are the long rectangular slips used for haiku, tanka poetry, and Tanabata wish-writing; they carry a diagonal bottom-right cut to distinguish them as composed artifacts. First badge with a bottom-right corner chamfer in any design system.
- **"「 " alert prefix (kagikakko)** — Japanese corner bracket (U+300C) replaces a Western typographic symbol. In Japanese document conventions, 「text」 signals an annotated note — the opening bracket alone signals "an important annotation begins here." Never used as a UI alert prefix anywhere.
- **Shimi ink-bleed alert texture** — on absorbent washi, sumi ink spreads beyond the brushstroke edge into the fiber network (滲み, shimi). `--z-alert-texture` applies a horizontal gradient bleeding the bar colour at 10% opacity leftward into the alert body at exactly the 16 px spread radius of ink on kozo washi. The bar is the brushstroke; the gradient is the shimi. No other genre uses the texture token this way.
- **Calligraphic motion (nyū-hō / shū-hō / shimi)** — all three easings map to named phases in shodo brushwork practice: enter `cubic-bezier(0.06, 0.92, 0.16, 1)` (brush strikes paper with high initial force then settles), exit `cubic-bezier(0.70, 0, 0.94, 0.42)` (brush slows then lifts cleanly), spring `cubic-bezier(0.22, 1.35, 0.36, 1)` (ink spreads beyond intent then contracts as it dries). Every easing has a real physical referent in calligraphy technique.
- **Kozo fiber network page texture** — three `repeating-linear-gradient` layers at off-axis angles (8°, −5°, 83°) simulate the long irregular kozo fibers visible in handmade washi when held to light (透かし見, sukashimi). Not a grid, not scanlines — an organic fiber structure. No design system has used off-axis multi-angle gradients to simulate natural paper fiber directionality.
- **Diagonal brushstroke sweep at −12°** — `body::after` is 12 px wide, 200 vh tall, rotated −12° from vertical (the natural angle of the calligrapher's arm sweep), translating left-to-right every 18 s at linear speed. The only diagonal sweep animation in ZynaUI; the only sweep that references a calligraphic body motion. Duration 18 s: calligraphy is unhurried, each stroke considered.
- **Sashiko diamond stitch card texture** — two `repeating-linear-gradient` layers at ±45° form a diamond grid at 12 px pitch (hishi-moyō, 菱模様) — the simplest sashiko running-stitch pattern. At 1.8% opacity each, the combined textile structure gives cards tactile depth that reads as handcrafted rather than printed. No design system has rendered Japanese textile stitching as a card texture.
- **Tapered brushstroke card bar** — 3 px height, heavy cinnabar at the left (nyū-hō, brush presses down on entry), gradient fading to transparent at the right (枯れ, kare — the brush running dry). References the way sumi ink fades as the brush exhausts its ink supply.
- **Single cinnabar brush-stroke sidebar** — `inset 4px 0 0 var(--zyna)`: the exact width of a calligraphy brush stroke at reading scale. One mark, no secondary line, no glow. A seal mark is fixed and complete.
- Status colors drawn from Japanese natural dye vocabulary: tokiwa-iro (常盤色, evergreen pine `#2D6B3C`), akane-iro (茜色, madder crimson `#9B1A0A`), yamabuki-iro (山吹色, golden kerria `#B07A00`), nando-iro (納戸色, indigo storage blue `#3A6B8A`).

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
