# Changelog

All notable changes to ZynaUI are documented here.

---

## [Unreleased]

Repair pass from a full line-by-line audit of the plugin, charts, React wrapper, types, tests, and docs. Every fix below was reproduced before it was changed and is now covered by a test.

### Fixed — plugin CSS

- **Phosphor's `.btn-lg` was cut shallower than its default button.** The size classes read the global `--z-corner-sm` (7px) and `--z-corner-lg` (13px), but Phosphor's chevron is 14px deep by default and Washi's cut is 11px, so a large Phosphor button lost depth and a large Washi button gained 2px. Size classes now read `--z-btn-corner-sm` / `--z-btn-corner-lg`, which Ops maps to the global scale (unchanged everywhere else) and which Phosphor (10 / 18px) and Washi (8 / 14px) set around their own default.
- **`.card-bevel` had no shadow in any genre.** Its filter ended in `drop-shadow(0 0 0 1px …)`, a spread radius that `drop-shadow()` does not accept, so the browser dropped the whole declaration and the bevel card (whose `box-shadow` is clipped away by design) sat flat on the page. The filter now reads a `--z-card-bevel-filter` genre token: Ops keeps the 24px / 70px depth shadow, and every other genre carries a single drop-shadow that mirrors its own `--z-shadow-card`, so a bevel card in Corporate or Washi gets the same soft lift as a plain card there.
- **Badge borders stopped at every notch, chamfer, and diagonal.** The eight non-Ops genres drew their 1px badge border with an inset `box-shadow`, which traces the border box, so Military's punch notch, Washi's chamfer, Blueprint's top notch, Laboratory's arrow, Atelier's left notch, and the `.badge-slant` / `.badge-bevel` modifiers in Cyberpunk and Phosphor all showed a border that ran straight through the cut. Those genres now use the rim model the light genres already used for slant and bevel: the element paints `currentColor` (`--z-badge-rim`) and `::before` fills the interior with the `--badge-bg` tint over the page (`--z-badge-interior`), cut by `--z-badge-inner-clip`, so the border follows the clip shape on every variant, size, and shape. `.badge-pulse` draws its dot with `::after` instead of `::before` so the interior fill still applies; a pulse badge shows the pulse in place of the scan sweep. The five per-genre slant/bevel overrides are gone (`--z-badge-inset` makes the modifiers' inner clips 1px in rim genres).
- **Cyberpunk's `.badge-slant` and `.badge-bevel` were cut 14px deep on a 22px badge.** The genre overrode `--zp-corner-badge` to 14px, which only the slant and bevel modifiers read: the slant sheared at roughly 32° and the bevel's chamfers crossed, leaving tick marks at both tips. The override is removed, so Cyberpunk's modifiers use the same 5px cut as every other genre; its default rectangular badge is unaffected.
- **Badge notches ignored `.badge-sm` and `.badge-lg`.** Military, Blueprint, Washi, Laboratory, and Atelier hardcoded their notch, chamfer, and arrow depths in pixels, so a small badge carried the same 8–10px cut as the default (Atelier's small badge had its text touching the notch tip) and a large one looked no different. The size classes now set a `--badge-scale` multiplier (0.6× / 1.2×) that both the slant (`--badge-offset`, unchanged at Ops's 3px / 6px) and each genre's own cut depth (`--z-badge-cut`) go through, so the notch scales with the badge while the `.badge-slant` / `.badge-bevel` modifiers keep their depth. `--zp-corner-badge-lg` is gone.
- **Genre structural tokens that reference element-level tokens were frozen at `<html>`'s values.** A custom property substitutes its `var()` references where it is *declared*, so `--z-btn-clip` on `html` resolved `var(--btn-corner)` against html's `@property` initial value (10px) and every button inherited a 10px chamfer regardless of `.btn-sm` / `.btn-lg` / `.btn-icon` or the genre's own `--z-btn-corner` (Phosphor's 14px chevron, Washi's 11px cut never applied). The same freeze turned Cyberpunk's and Phosphor's per-variant alert borders and bar glows white, and killed Washi's ink-bleed alert texture. `genresPlugin()` now emits these tokens (`--z-btn-clip`, `--z-btn-inner-clip`, `--z-badge-clip`, `--z-badge-inner-clip`, `--z-alert-border`, `--z-alert-bar-glow`, `--z-alert-texture`) on the component element via `:where(html[data-genre="…"]) :where(.btn)`-style rules, so they resolve per element. Visual baselines updated accordingly.
- **Reduced-motion never disabled button transitions.** The override used `:where(.btn)` at zero specificity against a base `.btn` rule that declares `transition`, so it lost the cascade in every genre. It now uses the bare class (matching the forced-colors rule) and also covers `.btn:hover::after`.
- **Phosphor re-enabled badge animations for reduced-motion users.** Its badge easing overrides sat later in source order at the same specificity as the reduced-motion rules; the genre's reduced-motion block now re-asserts `animation: none` for the scan and the opacity-only pulse fade.
- **The `prefix` option corrupted decimal keyframe steps.** `applyPrefix` rewrote `85.001%` in Laboratory's sawtooth sweep to `85.z-001%`, an invalid selector the browser dropped. Keyframe bodies are no longer rewritten.
- **Laboratory and Atelier buttons ignored size classes** (their clips hardcoded 10px) and their `.alert-round` had no indicator ring (`--z-alert-bar-width: 0`). Both now read `var(--btn-corner)` and carry a real 3px bar width.

### Fixed — genre API

- **Tokens-only custom genres compiled to nothing.** `genresPlugin()` only merged a genre's tokens into a rule that a `styles` block had already created; `defineGenre({ name, tokens })` now compiles to a complete `html[data-genre="…"]` rule.
- **Multi-word genre names threw.** The docs genre builder exports `name: 'My Genre'` targeting `html[data-genre="my-genre"]`, but `defineGenre` rejected any name with a space. Names are now slugified consistently everywhere (`genreSlug()` is exported); the compiler, validator, selector remapping, and the docs switcher all use the same rule.
- `genresPlugin(genres?)` accepts an explicit list so a wrapper plugin can emit only its own genres instead of re-emitting all nine built-ins.

### Fixed — charts

- **`<zyna-timeline>` notes ran into each other in narrow containers.** Every note was centred on its point on one row, so at 320px four consecutive notes ("Ceasefire", "Berlin II", "Peak Crisis", "Derna Floods") printed over one another, and a note on the first or last point could leave the SVG. Notes are now measured after they are set; a note that would overlap the previous one is lifted onto a second row above the rail, and a note at either edge is anchored inward.
- **`<zyna-nightingale>` leader line ran through the label straight below the chart.** Every leader left the label block from underneath the value. For the centre-anchored label at the bottom that is the far side, so the line climbed straight through the label and value text on its way to the sector. That one leader now leaves over the label; side labels extend away from the centre and keep their elbow under the value.
- **Axis and tick labels failed WCAG AA contrast in ten charts.** The dark-theme muted colour (`#5A5050`) was 2.6:1 on the page and the light-theme one (`#8A8478`) 3.4:1, below the 4.5:1 small-text minimum, so candlestick dates, density and delta ticks, cascade row labels, lollipop ticks and non-highlighted labels, pulse and stratum axes, rupture thresholds, resonance's σ / μ marks, and tension's rank labels were all hard to read. Every chart now takes the colour from a shared `_muted()` on the base class (`#8A8478` dark / `#6B6560` light), which clears 5:1 on every built-in genre page.
- **`<zyna-candlestick>` and `<zyna-density>` collapsed rows with duplicate labels.** Their band/point scales were built from label strings, which d3 de-duplicates, so two candles on the same date or two periods called "Q1" drew on top of each other. Both scales are now index-based.
- **`<zyna-cascade>` block labels went dark on non-hex accents.** The luminance helper only parsed hex; `rgb()`, `hsl()`, `oklch()`, and named colours now resolve through a canvas context, with the theme text colour as the fallback. Its injected preference/forced-colors `<style>` is also scoped to the instance's own SVG instead of matching any `.cs-block` in the host page.
- **`<zyna-gauge>` drew nothing when long end labels met a narrow container** — the label reservation drove the radius negative and every segment degenerated to `M0,0Z`. The reservation is capped and the radius floored.
- **`<zyna-orbital>` values outside 0–1** wrapped into a full ring labelled "150%" or drew the arc backwards; they are now clamped, including in the accessibility summary.
- **Every chart re-rendered on every `<html>` class change** (scroll locks, focus-visible polyfills, route transitions). A class mutation now re-renders only when a token the chart reads actually changed; `data-genre` changes always re-render.

### Fixed — React wrapper and types

- **React 19 dropped `show-axis={false}`** (and any boolean pass-through prop): React 19 removes a custom-element attribute whose value is `false`, so the candlestick axis stayed visible. Wrapper pass-through props are normalised so booleans reach the element as `"true"` / `"false"`.
- `types/charts.d.ts` now declares the attributes the original five charts always accepted (`height`, `show-values`, `label-format`, `muted-color`, `ticks`, `ring-thickness`, `highlight`), `show-axis` is typed as a string on the raw element, and `zynaui/react` augments `React.JSX.IntrinsicElements` so bare `<zyna-*>` tags type-check under React 19.

### Fixed — tests and tooling

- The Playwright config's `deviceScaleFactor: 2` and 1200×900 viewport were silently overridden by the `Desktop Chrome` device preset spread in the project block, and the tolerance comment reasoned about a scale-2 image that never existed — `toHaveScreenshot` captures at CSS scale regardless of the context's scale factor. The config now states `scale: 'css'` explicitly, keeps the CI-proven 64px budget, and documents that every baseline is captured at the preset's 1280×720 (the genre page textures are phase-locked to the viewport size, so the dead settings are removed rather than resurrected). Blueprint, Washi, Laboratory, and Atelier — previously absent from the visual matrix — are now covered, and every genre asserts that size classes change the chamfer and that `.alert-round` keeps its ring.
- The package smoke test now checks all sixteen charts' exports, subpaths, and React wrappers, and that `registerGenre()` reaches `genresPlugin()`.
- `test-results/.last-run.json` is no longer tracked.

### Docs

- README, `llms.txt`, and the landing page corrected: candlestick `color` defaults to the success token (not the brand colour); the bundler path lists the four D3 peers that npm does not install for you; `text-zyna` is a static hex and does not follow genre switches; the original five charts' full attribute tables; the cascade-layer caveat for the CDN stylesheet; all sixteen charts in the React example and the stats/footer; CDN URLs pinned to the 0.3 line; the stale claim that `[role="button"]` / `[role="alert"]` are styled without a class (removed in 0.2.4) is gone; the custom-genre guide now shows the wrapper-plugin route with `genresPlugin([genre])`.
- The landing page's noise overlay no longer sits on `body::before`, where it replaced the genre page textures (Cyberpunk scanlines, Corporate grid) on that page.
- Genre builder: the left-bar preset still applied the invalid ten-value `border-radius` fixed in 0.1.8; the preview now applies element-scoped tokens through an unlayered rule on the preview tree (so size classes preview correctly and the live genre no longer shadows the builder's shape); the CSS export declares element-scoped tokens on the component selector; the Tailwind v3 snippet no longer mixes `import` with `require`; the unsupported "scope a genre to a `<div>`" snippet is gone.
- The 0.2.1 entry below described an interactive crosshair and snap-to-candle tooltip on `<zyna-candlestick>`; that feature never shipped in a published build and the entry has been corrected.

---

## [0.3.0-beta] (2026-08-08) — chart expansion

Eight new D3-powered chart Web Components, built on the existing `ZynaChart` base (three-tier resize debounce, genre `MutationObserver`, element-scoped token resolution, `_applyA11y` text alternatives). Each ships with its lib entry, a `./charts/<name>` subpath export (with the Node/SSR stub), a typed React wrapper, hand-written `.d.ts`, a web-test-runner suite, and a docs page. The chart family grows from 8 to 16.

### Added — charts

- **`<zyna-tension>`** — ranked before/after comparison; curved connectors coloured and weighted by rank change, a `highlight` spotlight, and `rank-by="value"` to rank raw values.
- **`<zyna-delta>`** — paired concentric arcs (current vs baseline) with a 45° hatched gain/loss band and the signed % change in the ring centre; `max`, `arc-degrees`.
- **`<zyna-stratum>`** — geological core-sample grid; per-period segment heights encode values so the read survives monochrome genres; `x-labels`, `scale="row|global"`.
- **`<zyna-resonance>`** — radial deviation from the mean; spoke length = |deviation|, solid/filled above vs dashed/hollow below, dashed ±1σ ring; `mean`, `unit="percent|absolute"`.
- **`<zyna-pulse>`** — stacked ECG/seismograph tracks on a shared timeline; per-track baselines, `amplitude`, and vertical event `marker`s spanning all tracks; `x-labels`.
- **`<zyna-rupture>`** — threshold-breach area chart that fractures at the interpolated crossing (jagged seam, danger fill + glow past the breach); `threshold`, `threshold-label`, `direction="above|below"`.
- **`<zyna-density>`** — per-period KDE violin silhouettes (Epanechnikov kernel, Silverman bandwidth) with a median spine; `bandwidth`, `y-min`/`y-max`.
- **`<zyna-cascade>`** — hierarchical split waterfall; proportional blocks joined by tapering alluvial ribbons; `level-labels`, `min-share`, depth capped at 4. A `variant="sankey"` ("molten sankey") re-skins the same layout with vertical source→flow gradient ribbons and a soft coloured bloom on each node bar, per branch colour and theme-aware. (Static like the rest of the family; hover-to-highlight-ancestry is deferred to the future interactivity pass.)

All eight expose `role="img"` plus a data-derived `aria-label`, re-skin on `data-genre`/theme changes, self-default their host `display` for CDN/standalone use, and are covered by the shared new-chart test pattern (12–17 tests each — 103 new tests, cascade carrying extra coverage for its molten-sankey variant). Wired through `src/charts/index.js`, the IIFE bundle, `vite.config.js` entries, the `package.json` export map + `sideEffects` + SSR stub, the plugin `display:block` host rule, `types/charts.d.ts` + `types/react.d.ts`, and the docs (per-chart pages, gallery cards, nav, search index, sitemap, llms.txt).

### Fixed — visual QA pass

Rendered every new chart at normal, edge, narrow-width, and light-theme extremes (headless screenshots) and fixed what surfaced:

- **cascade** — block value labels now fit their block (truncating `label… value` → `value` → nothing) instead of overflowing narrow blocks; label colour is chosen by block luminance so it stays legible on light or dark blocks in either theme.
- **cascade** — accessibility & performance hardening for both variants: the molten-sankey bloom is grouped one filter per branch colour rather than one per bar; the dark-theme palette violet was darkened (`#7A6ABF` → `#6E5EA8`) so its on-block label clears WCAG AA; and the chart degrades gracefully under Windows High-Contrast (a Canvas/CanvasText wireframe), `prefers-reduced-transparency` / `prefers-contrast: more`, and print (opaque solid ribbons, bloom dropped). Sankey ribbons also use sRGB filter interpolation and a stronger light-theme tail so the alluvial join stays visible.
- **density** — the silhouette is drawn as a smooth Catmull-Rom curve spanning the full shared domain: each period is a bulb at its data that tapers to thin vertical whisker lines running to the top and bottom of the plot (a shared-axis violin), not a jagged floating polygon. Violins are width-normalised per period (a broad, low-density period no longer renders as a sliver), and the default KDE bandwidth is nudged up (≈1.25× Silverman) so shapes stay smooth at small sample sizes while keeping bimodal modes separate. A labelled y-axis (value ticks + horizontal gridlines, plus an optional `y-label` title and `label-format`) makes the shared value scale readable — previously the vertical scale was implicit.
- **resonance** — item labels sit on a single outer ring instead of piling onto the centre when spokes are short; absolute-unit labels are rounded (no raw floats).
- **tension** — long labels truncate to the gutter instead of clipping past the container.
- **rupture** / **pulse** — the first and last x-axis labels anchor inward so they no longer clip at the plot edges.

---

## [0.2.4-beta] (2026-07-05)

Repair release — fixes every blocker found in a full library audit. If you are on 0.2.3-beta, upgrade: that version shipped broken TypeScript definitions and a broken React path.

### Fixed — release blockers

- **`types/charts.d.ts` shipped with unresolved git merge conflict markers** (introduced by a botched rebase in 0.2.3-beta), breaking TypeScript compilation for every consumer of `zynaui/charts` and `zynaui/react`. `ZynaCandlestickItem` is restored alongside the `ZynaLine*` interfaces.
- **`types/index.d.ts` did not compile**: `export =` mixed with named exports (TS2309), and a `tailwindcss/types/config` import that only resolves on Tailwind v3. Public types now re-export through the merged namespace with local structural types.
- **`ZynaCandlestick` and `ZynaGauge` React wrappers were documented but did not exist** — added, with `ZynaCandlestickProps` / `ZynaGaugeProps` types.
- **`<zyna-candlestick>`, `<zyna-gauge>`, and `<zyna-line>` never sized or resized** — they were missing from the plugin's `display: block` host rule. The base class now also self-defaults host display for CDN/standalone usage with no plugin CSS.
- **Per-chart subpath imports (`zynaui/charts/line` etc.) crashed Node/SSR** — they lacked the `node` export condition. All eight subpaths now resolve to the server stub, which also exports named no-op classes so Node ESM named imports parse (`types` conditions added too).
- **Five of six genres' `prefers-reduced-motion` blocks were silently deleted** by a shallow `Object.assign` merge on the identical media-query key — the full-viewport sweep animations kept running for reduced-motion users. Genre styles now deep-merge.

### Fixed — accessibility

- All eight charts now expose a text alternative: `role="img"` plus a data-derived `aria-label` (your own `aria-label` attribute always wins), with `aria-hidden` on the SVG so tick values are no longer announced as a garbled stream. `<zyna-gauge>` implements the W3C APG meter pattern (`role="meter"`, `aria-valuemin/max/now`, `aria-valuetext`).
- New `forced-colors: active` rules give button, badge, card, and alert real borders so their boundaries survive Windows High Contrast mode.
- The `.badge-pulse` status dot now degrades to an opacity-only fade under reduced motion instead of disappearing — reduced motion means no movement, not no information.
- Removed the bare `[role="button"]` and `[role="alert"]` selectors that restyled third-party widgets (Radix/Headless UI triggers, toast libraries) at un-prefixable specificity. Styling is opt-in via `.btn` / `.alert`; pair the class with the ARIA role in markup.

### Fixed — theming and CSS hygiene

- Docs-chrome tokens (`--bg`, `--text`, `--border`, …) are no longer compiled into the published plugin CSS, where they hijacked identically named variables in consumer codebases.
- `dist/zynaui.css` is now built from a plugin-only entry: no Tailwind preflight reset, no repo-scanned utilities. The CDN stylesheet is safe to drop into an existing page.
- New `--z-chart-theme` token: the five light genres set it to `light`, and charts without an explicit `theme` attribute follow it. Charts also re-render when `data-genre` (or a class) changes on `<html>` — the `zyna-genre` event is no longer required.
- Timeline baseline/rail, orbital percentage text, and lollipop tick colors were hardcoded dark values; all are theme-aware now. Chart brand tokens resolve from the element scope, so container-level `--zyna` overrides reach charts.
- `defineGenre({ extends })` now remaps inherited `data-genre` selectors to the new genre (previously a genre extending cyberpunk inherited dead or leaking cyberpunk-scoped rules). Genre names are validated against the selector contract.
- `.alert-round` composes its inset ring with the public `--alert-shadow` token instead of discarding it (`--alert-shadow` default changed from `none` to a no-op transparent shadow to keep shadow lists valid).

### Fixed — chart runtime

- Attribute changes coalesce into a single microtask render with a same-value short-circuit — a five-attribute element no longer renders five times on upgrade, and identical React re-serialisations are free. The initial-render rAF is cancelled on disconnect.
- Malformed `data` JSON gets its own console warning instead of the misleading "No data provided". Non-numeric OHLC rows are skipped with a warning; a single `NaN` point no longer corrupts an entire line path; waffle totals are NaN-safe; lollipop clamps negative values into the domain; gauge zones are sorted and its warning names the actual `value`/`zones` inputs.
- The React wrapper detects CSP-blocked inline-script injection and logs an actionable error instead of rendering blank charts forever; it also skips the inline IIFE when `zynaui/charts` is already registered.

### Docs

- Corrected the `bear-color` default everywhere it was documented (it is the computed `--zp-danger`, `#FF3366` under Ops — not `#B03A2E` or `#FF5252`). llms.txt now lists all nine genres instead of two. README CDN URLs are pinned to the 0.2 line, Tailwind v3 is honestly labelled as believed-compatible-but-untested, and the custom-genre build-time registration contract is documented in `defineGenre`.

### Release-hygiene notes

- 0.2.3-beta was published to npm without a changelog entry; its contents were the version bump, llms.txt updates, and CDN URL alignment — plus, inadvertently, the merge-conflict-broken types this release fixes.
- 0.2.2-beta (the `<zyna-line>` entry below) was tagged in this changelog but never published to npm; `<zyna-line>` first shipped to the registry in 0.2.3-beta.

---

## [0.2.2-beta] (2026-04-22)

### Chart: Line `<zyna-line>`

New chart: **multi-series area-line chart** with stacked filled regions, smooth Catmull-Rom curve control, annotation markers, and an auto-generated legend.

- **Multi-series** — pass any number of series via `data: [{ label?, color?, values: [{x, y}] }]`. Each series gets its own line and fill region.
- **Stacked fills** — the area below the bottom series is filled; each subsequent series fills the gap between itself and the series below it, giving a layered depth effect.
- **Tension control** — `tension` attribute (0–1): `0` = straight segments (default), `1` = maximum Catmull-Rom smoothing.
- **Annotation markers** — per-point `annotations` array: filled dot + optional `▲`/`▼` triangle + label per data point. `series` index targets the correct line.
- **Auto legend** — rendered below the x-axis when any series has a `label`. Swatch line + dot per entry, evenly spaced.
- **Genre-aware palette** — first series defaults to `var(--zyna)` so it always matches the active genre. Remaining slots use a fixed palette; all can be overridden per-series via `color`.
- **y-min / y-max** — explicit axis bound overrides for locked scales.
- **`label-format`-compatible** — x-axis labels rendered from the `x` key in each data point; set `x: ''` on intermediate points to suppress crowding.
- React wrapper, TypeScript definitions (`ZynaLineSeries`, `ZynaLineAnnotation`, `ZynaLineAttributes`, `ZynaLineProps`), and docs page included.

---

## [0.2.1-beta] (2026-04-17)

### Two new chart Web Components: `<zyna-candlestick>` and `<zyna-gauge>`

Chart count goes from 5 to 7. Both new elements use only the existing peer deps (`d3-selection`, `d3-array`, `d3-scale`, `d3-shape`) — no new runtime dependencies. Both share the same resize/debounce lifecycle and `theme` / `label-format` conventions as the other five charts.

- **`<zyna-candlestick>`** — OHLC candlestick chart. Data is `[{ date, open, high, low, close }]` in chronological order. Bullish candles (close ≥ open) use the `color` attribute (defaults to the active genre's success token `--zp-success`); bearish candles use `bear-color` (defaults to `--zp-danger`). `scaleBand` on x, `scaleLinear` on y with 5% vertical padding. Y-axis gridlines and x-axis labels every Nth candle so long series stay legible. `show-axis="false"` hides all axis ticks and labels. *(Correction: this entry originally also promised an interactive crosshair with a snap-to-candle tooltip; that feature was never in a published build.)*
- **`<zyna-gauge>`** — segmented half-gauge. Colour bands are a `zones` JSON array of `{ from, to, color, label }`; `value`, `min`, and `max` are separate scalar attributes. Configurable arc sweep via `arc-degrees` (default `180`). A dot marker sits on the arc at the value's position; zones past the marker render at `dim-opacity` (default `0.35`) so the "up-to-here" reading is clear without a needle. The active zone's `label` auto-renders as the caption; pass the `label` attribute to override with a static string. `start-label` and `end-label` sit just outside the arc ends. Out-of-range values clamp to `[min, max]`.

---

## [0.2.0-beta] (2026-04-06)

### Semver API stability contract: public CSS variable surface locked

ZynaUI's public CSS custom property API is now formally declared and locked under semver. This is the API hardening milestone that allows projects to depend on ZynaUI without risk of silent CSS breakage on upgrade.

**83 public tokens are now locked.** Renaming or removing any of them requires a major version bump. Adding new public tokens is a minor release. Changing a default value as a bug fix is a patch.

- **`docs/css-api.md`** — Complete reference of all 83 public tokens and 80 internal tokens, with type, default value, and purpose for each. Includes the semver policy table and examples for creating custom component variants and custom genres.
- **`types/index.d.ts`** — TypeScript union types for the full public token surface: `ZynaPublicToken` (all 83), plus granular types `ZynaBrandToken`, `ZynaShapeToken`, `ZynaMotionToken`, `ZynaTypographyToken`, `ZynaColorToken`, `ZynaSurfaceToken`, `ZynaButtonToken`, `ZynaBadgeToken`, `ZynaCardToken`, `ZynaAlertToken`. Use these in TypeScript projects for token name validation.
- **`src/plugin/tokens.js`** — Inline contract header documenting the public/internal split at the source level so genre authors and contributors have the full map at hand.

**Public token counts by category:**

| Category | Count | Tokens |
|---|---|---|
| Brand | 2 | `--zyna`, `--zyna-dark` |
| Shape | 4 | `--z-corner-sm/[md]/lg/xl` |
| Motion | 10 | `--z-duration-*` (4), `--z-ease-*` (6) |
| Typography | 1 | `--z-font-mono` |
| Colors | 12 | text (5), status (4), border/overlay (3) |
| Surfaces | 9 | page, inset (4), card (2), shadow (2) |
| Button | 14 | `--btn-*` |
| Badge | 8 | `--badge-*` |
| Card | 18 | `--card-*` |
| Alert | 5 | `--alert-*` |
| **Total** | **83** | |

**Internal tokens (80) — not for user override:**
`--zp-*` primitives (15), `--z-btn-*` genre structural (5), `--z-badge-*` genre structural (7), `--z-card-*` genre structural (25), `--z-alert-*` genre structural (14), docs chrome (14 — consumed only by the ZynaUI docs site, not by any component).

**Why this matters:** No other Tailwind-plugin component library (DaisyUI, FlyonUI, or others) formally declares which CSS variables are stable public API. Users of those libraries override internal variables and get silently broken by minor releases. ZynaUI is now the first plugin-based component library with a formal CSS variable stability contract.

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
