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
| **Chart Web Components** | `<zyna-waffle>`, `<zyna-timeline>`, `<zyna-nightingale>`, `<zyna-lollipop>`, `<zyna-orbital>` |

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

These resolve to CSS variables (e.g. `text-zyna-success` → `color: var(--z-color-success)`) and update automatically when the active genre changes.

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
import { ZynaWaffle, ZynaTimeline, ZynaNightingale, ZynaLollipop, ZynaOrbital } from 'zynaui/react'

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
```

### Via CDN / Vanilla HTML (no bundler)

Link the pre-compiled CSS and load the IIFE bundle. No build step needed:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/zynaui/dist/zynaui.css" />
<script src="https://cdn.jsdelivr.net/npm/zynaui/dist/zyna-charts.iife.js"></script>
```

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
| `color` | hex | `#C9A84C` | Accent color for the top item |
| `theme` | `dark`/`light` | `dark` | Color theme |

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
| `data` | JSON array | `[]` | `[{ label, value, color? }]` (`value` is `0`–`1`) |
| `color` | hex | `#C9A84C` | Fallback ring color |
| `theme` | `dark`/`light` | `dark` | Color theme |

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

## Custom genres

Create a custom visual theme with `defineGenre`:

```js
import { defineGenre, registerGenre } from 'zynaui/genres'

const aurora = defineGenre({
  name: 'Aurora',
  palette: { brand: '#BF5FFF' },
  tokens: {
    '--zyna':            '#BF5FFF',
    '--z-ease-enter':    'cubic-bezier(0.34, 1.56, 0.64, 1)',
    '--z-duration-fast': '0.14s',
  },
  styles: {
    'html[data-genre="aurora"]': {
      '--z-btn-clip':   'inset(0)',
      '--z-badge-clip': 'inset(0 round 4px)',
    },
  },
})

registerGenre(aurora)
```

Activate at runtime:

```js
document.documentElement.setAttribute('data-genre', 'aurora')
```

> **Note:** Genre structural styles (`styles`) are compiled into `zynaui.css` at Tailwind build time. Register custom genres before your build step runs so their rules are included in the output.

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
