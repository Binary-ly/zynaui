# Changelog

All notable changes to ZynaUI are documented here.

---

## [0.1.0-beta.1] — 2026-03-19

### Initial beta release

#### UI Components (Tailwind plugin)
- `.btn` / `.btn-primary` / `.btn-secondary` / `.btn-ghost` / `.btn-danger` — Button variants with scan-fill, drop-shadow glow, directional easing
- `.btn-sm` / `.btn-lg` / `.btn-icon` — Size modifiers
- `.btn-cut` / `.btn-bevel` / `.btn-round` / `.btn-square` — Shape modifiers
- `.badge` / `.badge-primary` / `.badge-success` / `.badge-danger` / `.badge-warning` / `.badge-info` / `.badge-neutral` — Badge variants
- `.badge-lg` / `.badge-pulse` — Badge size and pulse animation
- `.card` / `.card-dark` / `.card-glow` / `.card-compact` — Card variants with animated corner bars
- `.alert` / `.alert-success` / `.alert-danger` / `.alert-warning` / `.alert-info` — Alert variants with left accent bar
- Two built-in genres: `ops` (military HUD, default) and `cyberpunk`
- Full CSS custom property API — create new variants without editing plugin source
- `prefers-reduced-motion` respected across all animated components

#### Plugin options
- `prefix` — Prepend a string to all component class names (e.g. `{ prefix: 'z-' }` → `.z-btn`)

#### Tailwind theme extension
- `colors.zyna.*` — Brand color + semantic status colors (`text-zyna-success`, `bg-zyna-danger`, etc.)
- `borderRadius.zyna-*` — Corner-radius scale (`rounded-zyna-sm`, `rounded-zyna`, `rounded-zyna-lg`, `rounded-zyna-xl`)

#### Chart Web Components (D3-powered)
- `<zyna-waffle>` — Square-grid waffle chart
- `<zyna-timeline>` — Proportional-circle timeline
- `<zyna-nightingale>` — Nightingale rose chart
- `<zyna-lollipop>` — Horizontal lollipop chart
- `<zyna-orbital>` — Concentric arc orbital chart
- Responsive (ResizeObserver), accessible, SSR-safe

#### React wrapper
- `import { ZynaWaffle, ZynaTimeline, ZynaNightingale, ZynaLollipop, ZynaOrbital } from 'zynaui/react'`
- Typed props accepting native arrays and numbers (not JSON strings)
- `'use client'` directive baked in — works with Next.js App Router out of the box

#### Distribution
- `dist/zyna-plugin.js` / `.cjs` — Tailwind plugin (ESM + CJS)
- `dist/genres.js` / `.cjs` — Genre API (`defineGenre`, `registerGenre`)
- `dist/zyna-charts.js` — Chart Web Components (ESM, D3 external)
- `dist/zyna-charts.iife.js` — Chart Web Components (IIFE, D3 bundled, CDN-ready)
- `dist/react.js` / `.cjs` — React wrapper with IIFE inlined
- `dist/zynaui.css` — Pre-compiled CSS (CDN / vanilla HTML)
- `dist/zyna-charts-stub.cjs` — SSR no-op stub for Node environments
