# ZynaUI CSS Variable Public API — v0.2.0 Stability Contract

This document declares the **public CSS custom property surface** of ZynaUI.

**The contract:**
Variables listed as **Public** will not be renamed, removed, or have their meaning changed
without a major version bump (`0.x → 1.0`, `1.x → 2.0`, etc.).

Variables listed as **Internal** are implementation details of the genre system.
They may be renamed or restructured in any minor release. Do not set or read
them in your own stylesheets.

**Effective from:** v0.2.0
**Total public tokens:** 83
**Total internal tokens:** 80

---

## Public API — 83 tokens

### Brand (2)

| Variable | Type | Default (Ops) | Purpose |
|---|---|---|---|
| `--zyna` | `<color>` | `#C9A84C` | Primary brand color. Used by all components for gold accents, glows, and fills. Set via `colors.zyna.DEFAULT` in your Tailwind config. |
| `--zyna-dark` | `<color>` | `#7A6230` | Dark variant of the brand color. Used in gradients and hover states. |

---

### Shape (4)

| Variable | Type | Default | Purpose |
|---|---|---|---|
| `--z-corner-sm` | `<length>` | `7px` | Corner radius for small-size components (`btn-sm`, `btn-icon`). |
| `--z-corner` | `<length>` | `10px` | Default corner radius. Drives button clip-path geometry. |
| `--z-corner-lg` | `<length>` | `13px` | Corner radius for large-size components (`btn-lg`). |
| `--z-corner-xl` | `<length>` | `16px` | Corner radius for cards (`card-round`). |

---

### Motion (10)

Genres override all 10 motion tokens to express their unique pacing character.
Override any of these on `:root` or a scoped selector to adjust global timing.

| Variable | Type | Default (Ops) | Purpose |
|---|---|---|---|
| `--z-duration-fast` | `<time>` | `0.18s` | Fastest transition duration. Used for color and transform snaps. |
| `--z-duration-base` | `<time>` | `0.22s` | Standard transition duration. Used for filter and background. |
| `--z-duration-slow` | `<time>` | `0.28s` | Slow transition. Used for scan sweeps and deliberate state changes. |
| `--z-duration-pulse` | `<time>` | `2s` | Looping animation period. Used for badge pulse and card glow. |
| `--z-ease-enter` | `<easing-function>` | `cubic-bezier(0.22, 1, 0.36, 1)` | Easing when transitioning INTO a state (hover-in). Deceleration "landing". |
| `--z-ease-exit` | `<easing-function>` | `cubic-bezier(0.55, 0, 1, 0.45)` | Easing when transitioning OUT of a state (hover-out). Acceleration "lift-off". |
| `--z-ease-spring` | `<easing-function>` | `cubic-bezier(0.34, 1.4, 0.64, 1)` | Spring with modest overshoot. Used for badge scan and pulse ring. |
| `--z-ease` | `<easing-function>` | `cubic-bezier(0.22, 1, 0.36, 1)` | General-purpose smooth deceleration easing. |
| `--z-ease-snap` | `<easing-function>` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Quick snap easing. Reaches final value rapidly. |
| `--z-ease-out` | `<easing-function>` | `cubic-bezier(0.16, 1, 0.3, 1)` | Strong deceleration easing. Overshoots slightly then settles. |

---

### Typography (1)

| Variable | Type | Default | Purpose |
|---|---|---|---|
| `--z-font-mono` | `<string>` | `'DM Mono', 'Fira Code', ui-monospace, monospace` | Monospace font stack. Used by all component text: buttons, badges, card headers, alert titles. Override to set your project's mono font across all ZynaUI components at once. |

---

### Colors (12)

#### Text

| Variable | Type | Default (Ops) | Purpose |
|---|---|---|---|
| `--z-color-text` | `<color>` | `90% opacity text` | Primary body text color. |
| `--z-color-text-muted` | `<color>` | `55% opacity text` | Secondary text. Default button and badge label color. WCAG AA ≥4.5:1 on dark. |
| `--z-color-text-dim` | `<color>` | `65% opacity text` | Tertiary text. Alert body color. WCAG AA ≥4.5:1 on dark. |
| `--z-color-text-solid` | `<color>` | Full opacity text | Card titles. Full-weight text. |
| `--z-color-text-inverse` | `<color>` | `#050407` | Text on primary-colored backgrounds (e.g. `btn-primary` label). |

#### Status

| Variable | Type | Default (Ops) | Purpose |
|---|---|---|---|
| `--z-color-success` | `<color>` | `#00FFB2` | Success state color. Used by `badge-success`, `alert-success`. |
| `--z-color-danger` | `<color>` | `#FF3366` | Danger/error state color. Used by `badge-danger`, `alert-danger`, `btn-danger`. |
| `--z-color-warning` | `<color>` | `#FFB800` | Warning state color. Used by `badge-warning`, `alert-warning`. |
| `--z-color-info` | `<color>` | `#00D4FF` | Info state color. Used by `badge-info`, `alert-info`. |

#### Borders & Overlays

| Variable | Type | Default (Ops) | Purpose |
|---|---|---|---|
| `--z-color-border` | `<color>` | `rgba(255,255,255,0.05)` | Standard border color. Card borders, header borders. |
| `--z-color-border-dim` | `<color>` | `rgba(255,255,255,0.035)` | Dimmer border. Used in dark card variant and `alert-neutral`. |
| `--z-color-overlay` | `<color>` | `rgba(255,255,255,0.04)` | Translucent overlay fill. Default ghost button and badge backgrounds. |

---

### Surfaces (9)

| Variable | Type | Default (Ops) | Purpose |
|---|---|---|---|
| `--z-surface-page` | `<color>` | `#09080F` | Page background color. Set on `<html>` by the plugin. |
| `--z-surface-inset` | `<color>` | `#0C0B14` | Interior fill for outlined button/badge variants at rest. |
| `--z-surface-inset-hover` | `<color>` | `#0E0D18` | Interior fill for outlined variants on hover. |
| `--z-surface-inset-danger` | `<color>` | `#0C0508` | Interior fill for `btn-danger` outlined variant at rest. |
| `--z-surface-inset-danger-hover` | `<color>` | `#100608` | Interior fill for `btn-danger` outlined variant on hover. |
| `--z-surface-card` | `<color\|gradient>` | Dark gradient | Default card surface gradient. Falls back from `--card-gradient`. |
| `--z-surface-card-deep` | `<color\|gradient>` | Deeper dark gradient | Deep/void card surface gradient. Used by `card-dark`. |
| `--z-shadow-card` | `<shadow>` | Multi-layer drop shadow | Standard card box-shadow. Falls back from `--card-shadow`. |
| `--z-shadow-card-deep` | `<shadow>` | Deeper drop shadow | Deep card box-shadow. Used by `card-dark`. |

---

### Button component (14)

Set on `.btn-*` variant classes or your own custom class alongside `.btn`.

| Variable | Registered | Default | Purpose |
|---|---|---|---|
| `--btn-bg` | `@property *` | `transparent` | Background (solid color, gradient, or multi-layer). |
| `--btn-color` | `@property <color>` | muted text | Label text color. |
| `--btn-filter` | — | `none` | Resting drop-shadow / glow filter. |
| `--btn-scan-color` | `@property <color>` | `rgba(255,255,255,0.07)` | Scan-fill sweep accent color (the shimmer on hover). |
| `--btn-hover-bg` | — | falls back to `--btn-bg` | Hover background. If unset, resting background is kept. |
| `--btn-hover-color` | — | falls back to `--btn-color` | Hover text color. If unset, resting color is kept. |
| `--btn-hover-filter` | — | `none` | Hover glow + brightness filter. |
| `--btn-hover-text-shadow` | — | `none` | Hover text luminescence (text-shadow). |
| `--btn-active-filter` | — | `none` | Filter applied on `:active` press. |
| `--btn-focus-color` | — | 65% brand | Focus-visible ring color. |
| `--btn-corner` | `@property <length>` | `--z-corner` | Corner cut depth. Shape modifiers and size classes set this automatically. |
| `--btn-interior` | `@property <color>` | `transparent` | Interior fill for outlined variants. Transparent for solid buttons. |
| `--btn-hover-interior` | — | falls back to `--btn-interior` | Hover interior fill for outlined variants. |
| `--btn-inner-clip` | — | genre default | Inner clip-path polygon for the outlined interior. Set automatically by shape modifiers. |

---

### Badge component (8)

Set on `.badge-*` variant classes or your own custom class alongside `.badge`.

| Variable | Registered | Default | Purpose |
|---|---|---|---|
| `--badge-bg` | `@property <color>` | `rgba(255,255,255,0.04)` | Background tint. |
| `--badge-color` | `@property <color>` | muted text | Text and dot color. |
| `--badge-glow` | — | `none` | Drop-shadow filter (traces the badge shape). |
| `--badge-scan-color` | — | `rgba(255,255,255,0.18)` | Scan-sweep highlight color. |
| `--badge-dot-size` | — | `5px` | Pulse status dot diameter. `.badge-sm` sets `4px`, `.badge-lg` sets `6px`. |
| `--badge-interior` | — | `transparent` | Interior fill for `.badge-outline`. |
| `--badge-offset` | `@property <length>` | `5px` | Parallelogram slant depth. Shape modifiers set this automatically. |
| `--badge-inner-clip` | — | genre default | Inner clip-path for the outlined interior border technique. |

---

### Card component (18)

Set on `.card-*` variant classes or your own custom class alongside `.card`.

| Variable | Registered | Default | Purpose |
|---|---|---|---|
| `--card-gradient` | — | genre surface | Base color gradient (texture and genre overlay stack on top). |
| `--card-border-color` | `@property <color>` | `rgba(255,255,255,0.05)` | Border color. |
| `--card-shadow` | — | genre shadow | Box-shadow. |
| `--card-bracket-color` | — | 42% brand | Corner L-bracket stroke color. |
| `--card-bracket-size` | — | `20px` | Corner bracket arm length. |
| `--card-bracket-stroke` | — | `1.5px` | Corner bracket line thickness. |
| `--card-bar-gradient` | — | genre bar | Top power-bar gradient. Takes priority over the genre bar default. |
| `--card-bar-shadow` | — | genre bar glow | Top power-bar box-shadow glow. |
| `--card-animation` | — | `none` | CSS animation shorthand. Set to `zyna-card-pulse var(--z-card-glow-duration) ease-in-out infinite` for a pulsing glow. |
| `--card-glow-lo` | `@property <color>` | `rgba(0,0,0,0)` | Pulse glow color at rest (used by `zyna-card-pulse` keyframe). |
| `--card-glow-hi` | `@property <color>` | `rgba(0,0,0,0)` | Pulse glow color at peak (used by `zyna-card-pulse` keyframe). |
| `--card-header-border` | — | genre border | Card header bottom border color. |
| `--card-header-bg` | — | genre header bg | Card header background tint. |
| `--card-header-color` | — | genre header text | Card header text color. |
| `--card-header-dot-color` | — | genre dot color | Status dot color in the card header. |
| `--card-header-dot-shadow` | — | genre dot glow | Status dot box-shadow glow. |
| `--card-header-text-shadow` | — | `none` | Card header text luminescence. |
| `--card-title-text-shadow` | — | `none` | `.card-title` text luminescence. |

---

### Alert component (5)

Set on `.alert-*` variant classes or your own custom class alongside `.alert`.

| Variable | Registered | Default | Purpose |
|---|---|---|---|
| `--alert-bar-color` | `@property <color>` | `rgba(255,255,255,0.10)` | Accent bar color (left/top/right/bottom edge — position is genre-defined). |
| `--alert-bg` | `@property <color>` | `rgba(255,255,255,0.02)` | Background tint. |
| `--alert-color` | `@property <color>` | dim text | Body text color. WCAG AA ≥4.5:1 on dark. |
| `--alert-shadow` | — | `none` | Box-shadow (near glow + inset depth). |
| `--alert-title-shadow` | — | `none` | `.alert-title` text luminescence. |

---

## Internal tokens — 80 tokens (do not use)

These tokens are implementation details. They are set by the genre system on the
`html` element and overridden by `html[data-genre="X"]` selectors. Setting them in
your own stylesheets will produce unexpected results and may break in any minor release.

### Primitive tokens (15) — `--zp-*`

Raw values that feed semantic tokens. Never referenced directly by user code.

```
--zp-corner-sm     --zp-corner-md      --zp-corner-lg      --zp-corner-xl
--zp-corner-badge  --zp-corner-badge-lg --zp-corner-card
--zp-ease-standard --zp-ease-snap      --zp-ease-out
--zp-success       --zp-danger         --zp-warning         --zp-info
--zp-text
```

### Button genre structural (5) — `--z-btn-*`

Control the default button shape, clip geometry, and active scale for each genre.
Use `--btn-corner` and `--btn-inner-clip` (public) to override shape on individual elements.

```
--z-btn-clip        --z-btn-corner      --z-btn-inner-clip
--z-btn-active-scale  --z-btn-scan-stop
```

### Badge genre structural (7) — `--z-badge-*`

Control the default badge shape, padding, and scan timing for each genre.
Use `--badge-offset`, `--badge-bg`, `--badge-color` (public) to override individual badges.

```
--z-badge-clip       --z-badge-radius         --z-badge-padding
--z-badge-letter-spacing  --z-badge-inset-shadow  --z-badge-scan-duration
--z-badge-inner-clip
```

### Card genre structural (25) — `--z-card-*`

Control card surface, texture, bar appearance, and header dot for each genre.
Use `--card-gradient`, `--card-bar-gradient`, `--card-header-color` etc. (public) to override individual cards.

```
--z-card-clip          --z-card-filter          --z-card-texture
--z-card-gradient      --z-card-border-color    --z-card-shadow
--z-card-bracket-color --z-card-bracket-size    --z-card-bracket-stroke
--z-card-bar-height    --z-card-bar-bg          --z-card-bar-shadow
--z-card-header-bg     --z-card-header-border   --z-card-header-color
--z-card-header-letter-spacing                  --z-card-header-text-shadow
--z-card-header-dot-size  --z-card-header-dot-bg  --z-card-header-dot-shadow
--z-card-header-dot-animation                   --z-card-title-text-shadow
--z-card-glow-duration --z-card-default-glow-lo --z-card-default-glow-hi
```

### Alert genre structural (14) — `--z-alert-*`

Control alert shape, bar position, prefix symbol, and texture for each genre.
Use `--alert-bar-color`, `--alert-bg`, `--alert-color` (public) to override individual alerts.

```
--z-alert-radius        --z-alert-bar-width     --z-alert-prefix
--z-alert-bg-opacity    --z-alert-border        --z-alert-prefix-opacity
--z-alert-bar-glow      --z-alert-texture       --z-alert-padding-top
--z-alert-padding-left  --z-alert-bar-inset     --z-alert-bar-w
--z-alert-bar-h         --z-alert-bar-radius
```

### Docs chrome tokens (10) — internal to the ZynaUI documentation site

These tokens are consumed by the ZynaUI docs site stylesheet (`docs.css`).
They are not consumed by any component. Do not reference them in your project.

```
--bg   --bg2   --bg3   --text   --text2   --text3   --border   --border2
--topbar-bg   --z-topbar-border   --z-topbar-glow   --z-sidebar-active-shadow
--z-panel-bg  --z-panel-shadow
```

---

## Semver policy

| Change type | Version bump required |
|---|---|
| Rename or remove a **public** token | Major (`0.x → 1.0`) |
| Change the **meaning** of a public token | Major |
| Change the **default value** of a public token in a way that visually breaks existing uses | Major |
| Add a **new public** token | Minor |
| Change the default value of a public token as a bug fix | Patch |
| Any change to an **internal** token | Any — no constraint |
| Add, remove, or rename an **internal** token | Any — no constraint |

---

## How to create a custom component variant

Use only public tokens:

```css
/* Custom button variant — set only public --btn-* tokens */
.btn-plasma {
  --btn-bg:                rgba(139, 0, 255, 0.38);
  --btn-color:             #BF5FFF;
  --btn-filter:            drop-shadow(0 0 8px rgba(139,0,255,0.45));
  --btn-scan-color:        rgba(139, 0, 255, 0.18);
  --btn-hover-filter:      drop-shadow(0 0 22px rgba(139,0,255,1)) brightness(1.10);
  --btn-hover-text-shadow: 0 0 16px rgba(200,100,255,0.7);
}

/* Custom card variant — set only public --card-* tokens */
.card-ember {
  --card-gradient:      linear-gradient(145deg, #1a0800 0%, #0d0400 100%);
  --card-border-color:  rgba(255, 80, 0, 0.22);
  --card-bracket-color: rgba(255, 80, 0, 0.55);
  --card-bar-gradient:  linear-gradient(90deg, transparent, rgba(255,80,0,0.6), transparent);
  --card-glow-lo:       rgba(255, 80, 0, 0.10);
  --card-glow-hi:       rgba(255, 80, 0, 0.28);
  --card-animation:     zyna-card-pulse 4s ease-in-out infinite;
}
```

---

## How to create a custom genre

Use the public `defineGenre()` API from `zynaui/genres`. Genre files set internal
structural tokens — that is their entire purpose. If you are authoring a genre,
you are expected to read and set internal tokens.

```js
import { defineGenre } from 'zynaui/genres'

export default defineGenre({
  name: 'Neon',
  swatches: { brand: '#FF00FF' },
  tokens: {
    '--zyna':            '#FF00FF',
    '--zyna-dark':       '#CC00CC',
    '--z-duration-base': '0.14s',
    /* ... other public tokens ... */
  },
  styles: {
    'html[data-genre="neon"]': {
      /* Internal structural tokens are valid here — this IS a genre */
      '--z-btn-clip':   'polygon(...)',
      '--z-alert-prefix': '">> "',
    }
  }
})
```
