# Zyna UI

> Tailwind CSS component library + D3-powered chart Web Components
> Built by [Binary Tech Ltd](https://binary.ly) · Open source · MIT License

[![npm version](https://img.shields.io/npm/v/zynaui)](https://www.npmjs.com/package/zynaui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Website](https://img.shields.io/badge/website-zyna.dev-gold)](https://zyna.dev)

---

## What's included

| Package | Description |
|---------|-------------|
| **Tailwind plugin** | Semantic classes: `.btn`, `.card`, `.badge`, `.alert` |
| **Chart Web Components** | 16 charts: `<zyna-waffle>`, `<zyna-timeline>`, `<zyna-nightingale>`, `<zyna-lollipop>`, `<zyna-orbital>`, `<zyna-candlestick>`, `<zyna-gauge>`, `<zyna-line>`, `<zyna-stratum>`, `<zyna-delta>`, `<zyna-resonance>`, `<zyna-tension>`, `<zyna-pulse>`, `<zyna-rupture>`, `<zyna-density>`, `<zyna-cascade>` |

Framework-agnostic. Works in React, Vue, Svelte, Blade, or plain HTML.

---

## UI Components (Tailwind Plugin)

### Installation

```bash
npm install zynaui tailwindcss
```

**Tailwind v3** (`tailwind.config.js`):

```js
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx,vue,svelte}'],
  plugins: [require('zynaui')],
}
```

> **Note:** the plugin uses only the classic `tailwindcss/plugin` API, so v3 is expected to work, but the test suite currently runs against Tailwind v4 only — treat v3 as believed-compatible and report issues if you hit one.

**Tailwind v4** (`app.css`):

```css
@import "tailwindcss";
@plugin "zynaui";
```

---

### Plugin options

#### `prefix`: avoid class name conflicts

If another library in your project already uses `.btn`, `.card`, `.badge`, or `.alert`, add a prefix:

**Tailwind v3:**

```js
plugins: [require('zynaui')({ prefix: 'z-' })]
// → .z-btn, .z-btn-primary, .z-card, .z-badge, .z-alert …
```

**Tailwind v4:**

```css
@plugin "zynaui" {
  prefix: z-;
}
```

---

### Tailwind utilities

ZynaUI extends the Tailwind theme with semantic color and radius tokens, so you can use them as native utility classes:

```html
<!-- Status colors -->
<span class="text-zyna-success">Operational</span>
<span class="text-zyna-danger">Critical</span>
<span class="text-zyna-warning">Degraded</span>
<span class="text-zyna-info">Updating</span>
<span class="text-zyna-muted">Offline</span>

<!-- Brand color -->
<span class="text-zyna">Gold accent</span>

<!-- Corner radius (respects active genre) -->
<div class="rounded-zyna-sm">…</div>
<div class="rounded-zyna">…</div>
<div class="rounded-zyna-lg">…</div>
```

The status and text utilities resolve to CSS variables (e.g. `text-zyna-success` → `color: var(--z-color-success)`) and update automatically when the active genre changes. The brand pair (`text-zyna`, `text-zyna-dark`) is a static hex value in the Tailwind theme, so it does not follow genre switches — use `text-[var(--zyna)]` where you need the live brand colour.

---

### Buttons

```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-danger">Danger</button>

<!-- Sizes -->
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary btn-lg">Large</button>

<!-- Icon button -->
<button class="btn btn-primary btn-icon">
  <svg>…</svg>
</button>
```

**Custom button variant:** set CSS variables, no plugin changes needed:

```css
.btn-plasma {
  --btn-bg:                rgba(139, 0, 255, 0.38);
  --btn-color:             #BF5FFF;
  --btn-filter:            drop-shadow(0 0 8px rgba(139,0,255,0.45));
  --btn-scan-color:        rgba(139, 0, 255, 0.18);
  --btn-hover-filter:      drop-shadow(0 0 22px rgba(139,0,255,1)) brightness(1.10);
  --btn-hover-text-shadow: 0 0 16px rgba(200,100,255,0.7);
}
```

---

### Badges

```html
<span class="badge badge-primary">New</span>
<span class="badge badge-success badge-pulse">Active</span>
<span class="badge badge-danger">Error</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-info">Info</span>
<span class="badge badge-neutral">Draft</span>

<!-- Large -->
<span class="badge badge-primary badge-lg">Featured</span>
```

**Custom badge variant:**

```css
.badge-plasma {
  --badge-bg:    rgba(139, 0, 255, 0.10);
  --badge-color: #BF5FFF;
  --badge-glow:  drop-shadow(0 0 5px rgba(139,0,255,0.45))
                 drop-shadow(0 0 14px rgba(139,0,255,0.14));
}
```

---

### Cards

```html
<div class="card">
  <div class="card-header">System Status</div>
  <div class="card-body">
    <p class="card-title">Card Title</p>
    <p class="card-subtitle">Supporting subtitle</p>
    <p>Body content here.</p>
  </div>
  <div class="card-footer">Footer</div>
</div>

<!-- Variants -->
<div class="card card-dark">…</div>
<div class="card card-glow">…</div>
<div class="card card-compact">…</div>
```

**Custom card variant:**

```css
.card-cyber {
  --card-gradient:      linear-gradient(145deg, rgba(0,20,30,0.97) 0%, rgba(0,10,18,0.97) 100%);
  --card-border-color:  rgba(0,212,255,0.22);
  --card-bracket-color: rgba(0,212,255,0.55);
  --card-bar-gradient:  linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.55) 25%, rgba(0,212,255,0.55) 75%, transparent 100%);
  --card-glow-lo:       rgba(0,212,255,0.12);
  --card-glow-hi:       rgba(0,212,255,0.26);
  --card-animation:     zyna-card-pulse 4s ease-in-out infinite;
}
```

---

### Alerts

```html
<div class="alert alert-success">
  <p class="alert-title">Success</p>
  <p>Your changes have been saved.</p>
</div>

<div class="alert alert-danger">…</div>
<div class="alert alert-warning">…</div>
<div class="alert alert-info">…</div>
```

**Custom alert variant:**

```css
.alert-plasma {
  --alert-bar-color:    #BF5FFF;
  --alert-bg:           rgba(139, 0, 255, 0.055);
  --alert-color:        rgba(191, 95, 255, 0.88);
  --alert-shadow:       0 0 30px rgba(139,0,255,0.08),
                        inset 4px 0 18px rgba(139,0,255,0.05);
  --alert-title-shadow: 0 0 12px rgba(191,95,255,0.65);
}
```

---

## Chart Web Components

### React & Next.js: typed wrapper components

Install the wrapper and get typed React components that accept native arrays and numbers:

```bash
npm install zynaui
```

```tsx
import {
  ZynaWaffle, ZynaTimeline, ZynaNightingale,
  ZynaLollipop, ZynaOrbital, ZynaCandlestick,
  ZynaGauge, ZynaLine, ZynaStratum, ZynaDelta,
  ZynaResonance, ZynaTension, ZynaPulse, ZynaRupture,
  ZynaDensity, ZynaCascade,
} from 'zynaui/react'

export default function Charts() {
  const data = [
    { label: 'Food',    value: 35, color: '#C9A84C' },
    { label: 'Shelter', value: 25, color: '#009EDB', outline: true },
  ]
  return <ZynaWaffle data={data} cols={10} gap={3} />
}
```

The `'use client'` directive is included in the package and works with Next.js App Router without extra setup. The IIFE bundle is inlined, so no file copying or `next/script` setup is needed.

---

### Via bundler (Vue / Svelte / Astro)

The charts import four D3 modules as optional peer dependencies, so install them alongside the package (npm does not install optional peers for you):

```bash
npm install zynaui d3-array d3-scale d3-selection d3-shape
```

```js
import 'zynaui/charts'
```

### Individual chart imports

```js
import 'zynaui/charts/waffle'
import 'zynaui/charts/timeline'
import 'zynaui/charts/nightingale'
import 'zynaui/charts/lollipop'
import 'zynaui/charts/orbital'
import 'zynaui/charts/candlestick'
import 'zynaui/charts/gauge'
import 'zynaui/charts/line'
import 'zynaui/charts/stratum'
import 'zynaui/charts/delta'
import 'zynaui/charts/resonance'
import 'zynaui/charts/tension'
import 'zynaui/charts/pulse'
import 'zynaui/charts/rupture'
import 'zynaui/charts/density'
import 'zynaui/charts/cascade'
```

### Via CDN / Vanilla HTML (no bundler)

Link the pre-compiled CSS and load the IIFE bundle. No build step needed:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/zynaui@0.3/dist/zynaui.css" />
<script src="https://cdn.jsdelivr.net/npm/zynaui@0.3/dist/zyna-charts.iife.js"></script>
```

The stylesheet contains only ZynaUI's tokens, components, and genres — no Tailwind preflight reset — so it is safe to drop into an existing page. Bundler users can equivalently `import 'zynaui/style.css'`. (URLs are pinned to the 0.3 line; unpinned `/npm/zynaui/` floats to whatever `latest` is.)

> **Cascade layers:** every component rule in the stylesheet lives in `@layer base`. Unlayered rules in your own CSS win over layered ones regardless of specificity, so a reset such as `button { background: none; border: 0 }` will strip `.btn` styling. Put your reset in a layer (`@layer reset { … }`) or scope element selectors away from ZynaUI components.

Or if installed via npm:

```html
<link rel="stylesheet" href="node_modules/zynaui/dist/zynaui.css" />
<script src="node_modules/zynaui/dist/zyna-charts.iife.js"></script>
```

---

### `<zyna-waffle>`

Square-grid waffle chart. Each cell is either filled or outline-only.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data` | JSON array | `[]` | `[{ label, value, color?, outline? }]` |
| `color` | hex | `#C9A84C` | Fallback cell color |
| `cols` | number | `10` | Grid columns |
| `gap` | number | `3` | Gap between cells (px) |
| `theme` | `dark`/`light` | `dark` | Color theme |
| `height` | number | auto | Explicit height in px |

```html
<zyna-waffle
  data='[
    { "label": "UK",  "value": 24, "color": "#1A3A6B" },
    { "label": "US",  "value": 28, "color": "#009EDB" },
    { "label": "EU",  "value": 20, "color": "#4A6741", "outline": true }
  ]'
></zyna-waffle>
```

---

### `<zyna-timeline>`

Proportional-circle timeline. Bubble area encodes value.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data` | JSON array | `[]` | `[{ label, value, note? }]` |
| `color` | hex | `#C9A84C` | Accent color for highlighted item |
| `theme` | `dark`/`light` | `dark` | Color theme |
| `highlight` | string | highest value | Label of the item to emphasize |
| `muted-color` | hex | `#8A8478` | Color for non-highlighted items |
| `show-values` | `true`/`false` | `true` | Show the value label under each bubble |
| `label-format` | string | — | D3 number format for value labels (e.g. `'$,.0f'`) |
| `height` | number | auto | Explicit height in px |

```html
<zyna-timeline
  data='[
    { "label": "2019", "value": 120 },
    { "label": "2020", "value": 95, "note": "COVID" },
    { "label": "2021", "value": 180 },
    { "label": "2022", "value": 210 }
  ]'
  highlight="2022"
></zyna-timeline>
```

---

### `<zyna-nightingale>`

Nightingale (rose) chart. Sector radius encodes value.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data` | JSON array | `[]` | `[{ label, value, color? }]` |
| `color` | hex | `#C9A84C` | Fallback sector color |
| `theme` | `dark`/`light` | `dark` | Color theme |
| `show-values` | `true`/`false` | `true` | Show the numeric value on each leader line |
| `label-format` | string | — | D3 number format for value labels |
| `height` | number | auto | Explicit height in px |

```html
<zyna-nightingale
  data='[
    { "label": "Food",      "value": 42, "color": "#C9A84C" },
    { "label": "Shelter",   "value": 31, "color": "#009EDB" },
    { "label": "Education", "value": 18, "color": "#00FFB2" },
    { "label": "Health",    "value": 27, "color": "#FF3366" }
  ]'
></zyna-nightingale>
```

---

### `<zyna-lollipop>`

Horizontal lollipop chart. Line and circle encode value.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data` | JSON array | `[]` | `[{ label, value }]` sorted descending recommended |
| `color` | hex | `#C9A84C` | Accent color for the highlighted item |
| `theme` | `dark`/`light` | `dark` | Color theme |
| `highlight` | string | first item | Label of the item to accent |
| `muted-color` | hex | `--zyna-dark` | Color for non-highlighted stems, dots, and labels |
| `show-values` | `true`/`false` | `true` | Show the value at the end of each stem |
| `label-format` | string | — | D3 number format for value labels |
| `ticks` | number | `5` | Number of x-axis tick marks |
| `height` | number | auto | Explicit height in px |

```html
<zyna-lollipop
  data='[
    { "label": "Libya",  "value": 820 },
    { "label": "Sudan",  "value": 610 },
    { "label": "Syria",  "value": 490 },
    { "label": "Yemen",  "value": 380 }
  ]'
></zyna-lollipop>
```

---

### `<zyna-orbital>`

Concentric arc chart. Each ring is filled as a proportion of a full circle.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data` | JSON array | `[]` | `[{ label, value, color? }]` (`value` is `0`–`1`; out-of-range values are clamped) |
| `color` | hex | `#C9A84C` | Fallback ring color |
| `theme` | `dark`/`light` | `dark` | Color theme |
| `show-values` | `true`/`false` | `true` | Show the label and percentage beside each ring |
| `label-format` | string | percentage | D3 number format applied to the raw `0`–`1` value |
| `ring-thickness` | number | `0.115` | Ring width as a fraction of the outer radius |
| `height` | number | auto | Explicit height in px |

```html
<zyna-orbital
  data='[
    { "label": "Delivered", "value": 0.78, "color": "#C9A84C" },
    { "label": "In Transit","value": 0.55, "color": "#009EDB" },
    { "label": "Planned",   "value": 0.32, "color": "#00FFB2" }
  ]'
></zyna-orbital>
```

---

### `<zyna-candlestick>`

OHLC candlestick chart for time-series price data. Bullish candles (close ≥ open) use the genre's success color; bearish candles use `bear-color`.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data` | JSON array | `[]` | `[{ date, open, high, low, close }]` in chronological order |
| `color` | hex | computed `--zp-success` (`#00FFB2` under Ops) | Bullish candle color |
| `bear-color` | hex | computed `--zp-danger` (`#FF3366` under Ops) | Bearish candle color |
| `theme` | `dark`/`light` | `dark` | Color theme |
| `show-axis` | boolean | `true` | Show/hide axis ticks and labels |
| `label-format` | string | — | D3 number format for y-axis labels (e.g. `'$,.0f'`) |
| `ticks` | number | `5` | Approximate y-axis tick count |
| `height` | number | auto | Explicit height in px |

```html
<zyna-candlestick
  data='[
    { "date": "Apr 1",  "open": 100, "high": 104, "low": 97,  "close": 103 },
    { "date": "Apr 2",  "open": 103, "high": 107, "low": 102, "close": 106 },
    { "date": "Apr 3",  "open": 106, "high": 108, "low": 101, "close": 102 }
  ]'
  label-format="$,.0f"
></zyna-candlestick>
```

---

### `<zyna-gauge>`

Segmented arc gauge for a single reading against a min/max range. Zones past the marker dim automatically so the "up-to-here" reading is clear.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | number | — | Current reading (required) |
| `min` | number | `0` | Range minimum |
| `max` | number | `100` | Range maximum |
| `zones` | JSON array | — | `[{ from, to, color, label? }]` (required) |
| `theme` | `dark`/`light` | `dark` | Color theme |
| `arc-degrees` | number | `180` | Total arc sweep in degrees |
| `start-label` | string | — | Label at the arc start end |
| `end-label` | string | — | Label at the arc end |
| `label` | string | active zone label | Static caption override |
| `label-format` | string | — | D3 number format for the centre value |
| `thickness` | number | auto | Arc thickness in px |
| `dim-opacity` | number | `0.35` | Opacity of zones past the marker |
| `height` | number | auto | Explicit height in px |

```html
<zyna-gauge
  value="64" min="0" max="100"
  zones='[
    { "from": 0,  "to": 30,  "color": "#11864f", "label": "Low" },
    { "from": 30, "to": 60,  "color": "#f1c40f", "label": "Medium" },
    { "from": 60, "to": 80,  "color": "#e67e22", "label": "High" },
    { "from": 80, "to": 100, "color": "#e74c3c", "label": "Critical" }
  ]'
></zyna-gauge>
```

---

### `<zyna-line>`

Multi-series area-line chart. Each series gets its own line and filled region; fills stack between adjacent series for a layered depth effect.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data` | JSON array | `[]` | `[{ label?, color?, values: [{ x, y }] }]` |
| `annotations` | JSON array | `[]` | `[{ series, x, label?, direction? }]` — `direction` is `'up'` or `'down'` |
| `tension` | number | `0` | Curve smoothing: `0` = straight lines, `1` = max Catmull-Rom |
| `y-min` | number | auto | Explicit y-axis lower bound |
| `y-max` | number | auto | Explicit y-axis upper bound |
| `ticks` | number | `4` | Y-axis tick count |
| `theme` | `dark`/`light` | `dark` | Color theme |
| `height` | number | auto | Explicit height in px |

Set `x: ''` on intermediate data points to suppress crowded x-axis labels.

```html
<zyna-line
  data='[
    {
      "label": "Revenue",
      "values": [
        { "x": "Jan", "y": 312 }, { "x": "Feb", "y": 298 },
        { "x": "Mar", "y": 341 }, { "x": "Apr", "y": 367 }
      ]
    },
    {
      "label": "Target", "color": "#4BBFA8",
      "values": [
        { "x": "Jan", "y": 300 }, { "x": "Feb", "y": 310 },
        { "x": "Mar", "y": 320 }, { "x": "Apr", "y": 340 }
      ]
    }
  ]'
  annotations='[{ "series": 0, "x": "Apr", "label": "Peak", "direction": "up" }]'
  tension="0.4"
></zyna-line>
```

---

### `<zyna-stratum>`

Geological core-sample grid. Each entity is a row; the internal segment heights encode its per-period values, so cross-entity patterns emerge from the stacked strata profile.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data` | JSON array | `[]` | `[{ label, values: number[], color? }]` |
| `x-labels` | JSON array | — | One label per period; `''` suppresses that label |
| `scale` | `row`/`global` | `row` | Height normalisation: per-entity or shared |
| `color` | hex | `#C9A84C` | Fallback row color |
| `theme` | `dark`/`light` | `dark` | Color theme |
| `label-format` | string | — | D3 number format for the a11y summary |
| `height` | number | auto | Explicit height in px |

```html
<zyna-stratum
  x-labels='["Q1","Q2","Q3","Q4"]'
  data='[
    { "label": "North", "values": [12, 19, 15, 22] },
    { "label": "South", "values": [8, 11, 20, 17] },
    { "label": "East",  "values": [15, 9, 13, 25] }
  ]'
></zyna-stratum>
```

---

### `<zyna-delta>`

Paired concentric arcs per category: the outer arc is the current value, the inner arc the baseline, and the annular gap is coloured by gain or loss.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data` | JSON array | `[]` | `[{ label, value, baseline, color? }]` |
| `max` | number | data max | Shared scale ceiling (angle = value / max) |
| `arc-degrees` | number | `270` | Total arc sweep in degrees |
| `color` | hex | `#C9A84C` | Accent color |
| `theme` | `dark`/`light` | `dark` | Color theme |
| `label-format` | string | — | D3 number format for the centre delta |
| `height` | number | auto | Explicit height in px |

```html
<zyna-delta
  data='[
    { "label": "Revenue", "value": 82, "baseline": 65 },
    { "label": "Cost",    "value": 40, "baseline": 52 },
    { "label": "Churn",   "value": 12, "baseline": 9 }
  ]'
></zyna-delta>
```

---

### `<zyna-resonance>`

Radial deviation-from-mean diagram. Spokes radiate from a centre; length encodes distance from the mean and fill encodes direction (solid above, hollow below), so deviation is the first-class visual.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data` | JSON array | `[]` | `[{ label, value }]` |
| `mean` | number | computed mean | Explicit centre value |
| `unit` | `percent`/`absolute` | `percent` | Deviation label units |
| `color` | hex | `#C9A84C` | Accent color |
| `theme` | `dark`/`light` | `dark` | Color theme |
| `label-format` | string | — | D3 number format for absolute labels |
| `height` | number | auto | Explicit height in px |

```html
<zyna-resonance
  data='[
    { "label": "Jan", "value": 118 }, { "label": "Feb", "value": 92 },
    { "label": "Mar", "value": 104 }, { "label": "Apr", "value": 87 },
    { "label": "May", "value": 131 }, { "label": "Jun", "value": 96 }
  ]'
></zyna-resonance>
```

---

### `<zyna-tension>`

Ranked before/after comparison. Two ranked columns are joined by curved connectors angled and coloured by the direction and magnitude of each item's rank change.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data` | JSON array | `[]` | `[{ label, before, after }]` |
| `rank-by` | `rank`/`value` | `rank` | `before`/`after` are ranks, or raw values to rank |
| `highlight` | string | — | Label to spotlight; every other connector dims |
| `color` | hex | `#C9A84C` | Accent color |
| `theme` | `dark`/`light` | `dark` | Color theme |
| `height` | number | auto | Explicit height in px |

```html
<zyna-tension
  highlight="Solar"
  data='[
    { "label": "Solar",   "before": 3, "after": 1 },
    { "label": "Wind",    "before": 1, "after": 2 },
    { "label": "Gas",     "before": 2, "after": 4 },
    { "label": "Coal",    "before": 4, "after": 5 },
    { "label": "Nuclear", "before": 5, "after": 3 }
  ]'
></zyna-tension>
```

---

### `<zyna-pulse>`

Stacked ECG / seismograph tracks on a shared timeline — one row per entity, each with its own zero baseline — reading like a score of simultaneous signals.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data` | JSON array | `[]` | `[{ label, values: number[], color? }]` |
| `x-labels` | JSON array | — | One label per point; `''` suppresses that label |
| `amplitude` | number | auto | px of vertical swing per track |
| `marker` | JSON array | — | `[{ x, label? }]` vertical event rules spanning all tracks |
| `color` | hex | `#C9A84C` | Fallback track color |
| `theme` | `dark`/`light` | `dark` | Color theme |
| `height` | number | auto | Explicit height in px |

```html
<zyna-pulse
  x-labels='["00:00","06:00","12:00","18:00","24:00"]'
  marker='[{ "x": "12:00", "label": "Peak load" }]'
  data='[
    { "label": "CPU", "values": [12, 30, 62, 45, 20] },
    { "label": "MEM", "values": [40, 42, 55, 58, 44] },
    { "label": "NET", "values": [5, 25, 48, 30, 10] }
  ]'
></zyna-pulse>
```

---

### `<zyna-rupture>`

Threshold-breach area chart. The fill fractures where the series crosses a threshold — character, colour, and glow all shift past the breach point.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data` | JSON array | `[]` | `[{ x, y }]` (single series) |
| `threshold` | number | — | The breach level (required) |
| `threshold-label` | string | — | Caption drawn on the threshold line |
| `direction` | `above`/`below` | `above` | Breach when rising above or dipping below |
| `color` | hex | `#C9A84C` | Calm (pre-breach) accent color |
| `theme` | `dark`/`light` | `dark` | Color theme |
| `label-format` | string | — | D3 number format for the threshold label |
| `height` | number | auto | Explicit height in px |

```html
<zyna-rupture
  threshold="80"
  threshold-label="SLA limit"
  data='[
    { "x": "Mon", "y": 62 }, { "x": "Tue", "y": 71 },
    { "x": "Wed", "y": 88 }, { "x": "Thu", "y": 95 },
    { "x": "Fri", "y": 79 }
  ]'
></zyna-rupture>
```

---

### `<zyna-density>`

Per-period KDE violin silhouettes on a shared value axis. Each period is a smooth density bulb with a median spine, revealing how the full distribution shifts over time.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data` | JSON array | `[]` | `[{ label, values: number[] }]` (raw samples) |
| `bandwidth` | number | auto | KDE smoothing (Silverman's rule when omitted) |
| `y-min` | number | data extent | y-axis lower bound |
| `y-max` | number | data extent | y-axis upper bound |
| `y-label` | string | — | Rotated axis title on the left |
| `label-format` | string | — | D3 number format for y-axis ticks |
| `theme` | `dark`/`light` | `dark` | Color theme |
| `height` | number | auto | Explicit height in px |

```html
<zyna-density
  y-label="Response time (ms)"
  data='[
    { "label": "Jan", "values": [120, 135, 128, 142, 119, 150, 133] },
    { "label": "Feb", "values": [118, 140, 155, 122, 138, 160, 129] },
    { "label": "Mar", "values": [110, 125, 118, 132, 145, 128, 122] }
  ]'
></zyna-density>
```

---

### `<zyna-cascade>`

Hierarchical split waterfall: a total fractures downward through levels as proportional blocks joined by tapering alluvial ribbons. Set `variant="sankey"` for the molten-sankey look — gradient flows with a soft bloom.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data` | JSON | `—` | Nested `{ label, value?, color?, children? }` (or a bare array of top-level splits). Parent values are summed from leaves when omitted |
| `level-labels` | JSON array | — | Name for each tier, shown down the left edge |
| `min-share` | number | `0.03` | Splits below this fraction of their parent collapse into "Other" |
| `variant` | `waterfall`/`sankey` | `waterfall` | `sankey` = molten gradient flows with a soft bloom |
| `color` | hex | `#C9A84C` | Accent for the first branch |
| `theme` | `dark`/`light` | `dark` | Color theme |
| `label-format` | string | — | D3 number format for block value labels |
| `height` | number | auto | Explicit height in px |

```html
<zyna-cascade
  variant="sankey"
  level-labels='["Total","Region","Programme"]'
  data='{
    "label": "Appeal",
    "children": [
      { "label": "East Africa", "children": [
        { "label": "Food", "value": 38 }, { "label": "WASH", "value": 22 }, { "label": "Health", "value": 15 } ] },
      { "label": "MENA", "children": [
        { "label": "Shelter", "value": 30 }, { "label": "Protection", "value": 18 } ] },
      { "label": "Sahel", "value": 24 }
    ]
  }'
></zyna-cascade>
```

---

## Custom genres

Create a custom visual theme with `defineGenre`. A tokens-only genre is complete on its own; `styles` is optional.

```js
// src/genres/aurora.genre.js
import { defineGenre } from 'zynaui/genres'

export default defineGenre({
  name: 'Aurora',                        // activates via <html data-genre="aurora">
  palette: { brand: '#BF5FFF' },
  tokens: {
    '--zyna':            '#BF5FFF',
    '--z-ease-enter':    'cubic-bezier(0.34, 1.56, 0.64, 1)',
    '--z-duration-fast': '0.14s',
  },
  styles: {                              // optional structural overrides
    'html[data-genre="aurora"]': {
      '--z-btn-clip':   'inset(0)',
      '--z-badge-clip': 'inset(0 round 4px)',
    },
  },
})
```

Genre CSS is compiled at Tailwind build time, so the genre has to be emitted by a module your build evaluates. The self-contained way is a tiny wrapper plugin that compiles just your genres:

```js
// src/genres/zynaui-genres.plugin.js
import plugin from 'tailwindcss/plugin'
import { genresPlugin } from 'zynaui/genres'
import aurora from './aurora.genre.js'

export default plugin(({ addBase }) => {
  addBase(genresPlugin([aurora]))      // only your genres — built-ins are not re-emitted
})
```

```css
@import "tailwindcss";
@plugin "zynaui";
@plugin "./src/genres/zynaui-genres.plugin.js";
```

(Tailwind v3: `import { registerGenre } from 'zynaui/genres'` and call `registerGenre(aurora)` in `tailwind.config.js` before the plugin runs — the config file and the plugin share one genre registry.)

Activate at runtime:

```js
document.documentElement.setAttribute('data-genre', 'aurora')
```

Names are slugified for the attribute value (`'My Genre'` → `data-genre="my-genre"`; `genreSlug()` exposes the rule). `registerGenre(aurora)` adds the genre to the `GENRES` registry for runtime switchers and the genre builder; it does not by itself add CSS.

---

## Build

```bash
npm install
npm run build
```

Outputs:

| File | Format | Use case |
|------|--------|----------|
| `dist/zyna-plugin.cjs` | CommonJS | Tailwind config `require()` |
| `dist/zyna-plugin.js` | ESM | Bundler import |
| `dist/genres.js` | ESM | `import { defineGenre } from 'zynaui/genres'` |
| `dist/zyna-charts.js` | ESM | Bundler `import 'zynaui/charts'` |
| `dist/zyna-charts.iife.js` | IIFE | `<script src>` with no bundler |
| `dist/zyna-charts-stub.cjs` | CJS stub | SSR environments (auto-selected) |
| `dist/react.js` | ESM | `import { ZynaWaffle } from 'zynaui/react'` |
| `dist/zynaui.css` | CSS | Pre-compiled CSS for CDN / vanilla HTML |

```bash
# Build only the Tailwind plugin
npm run build:lib

# Build only the IIFE bundle (CDN)
npm run build:iife

# Build only the docs CSS
npm run build:css
```

---

## CSS Variable API

Every component is controlled through CSS custom properties. Create new variants without touching plugin source:

```css
/* A custom button — just set variables */
.btn-ocean {
  --btn-bg:           linear-gradient(135deg, #006994 0%, #003d5b 100%);
  --btn-color:        #7ED8F6;
  --btn-filter:       drop-shadow(0 0 8px rgba(0,105,148,0.5));
  --btn-hover-filter: drop-shadow(0 0 22px rgba(0,185,255,0.9)) brightness(1.12);
}
```

See the JSDoc at the top of each component file in `src/plugin/components/` for the full variable reference.

---

## Credits

The semantic class naming (`.btn`, `.btn-primary`, `.card`, `.badge`, `.alert`, etc.) is inspired by [DaisyUI](https://daisyui.com) by Pouya Saadeghi. Zyna UI takes that convention and adds a dark, HUD-style aesthetic built on CSS custom properties and clip-path geometry, with D3 chart Web Components on top.

---

## License

MIT © [Binary Tech Ltd](https://binary.ly)
