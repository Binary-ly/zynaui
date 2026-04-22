/**
 * Zyna UI — Chart Web Component type definitions
 *
 * Covers all 7 chart elements: <zyna-waffle>, <zyna-timeline>,
 * <zyna-nightingale>, <zyna-lollipop>, <zyna-orbital>,
 * <zyna-candlestick>, <zyna-gauge>.
 *
 * Augments the global HTMLElementTagNameMap for TypeScript DOM lib usage
 * and declares React JSX intrinsic elements for React 18+ / Preact / Solid.
 */

// ── Data item shapes ──────────────────────────────────────────────────────────

export interface ZynaWaffleItem {
  label: string
  /** Number of cells this segment fills */
  value: number
  /** CSS colour string. Falls back to the `color` attribute */
  color?: string
  /** Render as outline-only (no fill) */
  outline?: boolean
}

export interface ZynaTimelineItem {
  label: string
  value: number
  /** Short annotation rendered on a dashed leader line above the circle */
  note?: string
}

export interface ZynaNightingaleItem {
  label: string
  value: number
  /** CSS colour string for this sector */
  color?: string
}

export interface ZynaLollipopItem {
  label: string
  value: number
}

export interface ZynaOrbitalItem {
  label: string
  /** Proportion of the full circle — must be between 0 and 1 */
  value: number
  /** CSS colour string for this ring */
  color?: string
}

<<<<<<< HEAD
export interface ZynaCandlestickItem {
  /** Period identifier rendered on the x-axis. ISO date string or any label. */
  date: string
  open: number
  high: number
  low: number
  close: number
=======
export interface ZynaLinePoint {
  /** Tick label shown on the x-axis. Pass '' to suppress the label for that point */
  x: string
  /** Y value */
  y: number
}

export interface ZynaLineSeries {
  /** Legend label for this series */
  label?: string
  /** CSS colour string. Defaults to the built-in palette */
  color?: string
  /** Data points for this series */
  values: ZynaLinePoint[]
}

export interface ZynaLineAnnotation {
  /** 0-based index into the data array identifying which series */
  series: number
  /** Must match a data point's x value exactly */
  x: string
  /** Text displayed near the dot */
  label?: string
  /** Renders a ▲ (up) or ▼ (down) triangle above the dot */
  direction?: 'up' | 'down'
>>>>>>> 5b68ef0 (Add <zyna-line> multi-series area-line chart)
}

// ── Attribute interfaces ──────────────────────────────────────────────────────

interface ZynaChartBase {
  /** Accent colour (any valid CSS colour). Default: #C9A84C */
  color?: string
  /** Colour theme. Default: 'dark' */
  theme?: 'dark' | 'light'
  class?: string
  id?: string
  style?: string
  slot?: string
}

export interface ZynaWaffleAttributes extends ZynaChartBase {
  /** JSON-serialised array of {@link ZynaWaffleItem} */
  data?: string
  /** Number of columns in the grid. Default: 10 */
  cols?: string | number
  /** Gap between cells in pixels. Default: 3 */
  gap?: string | number
}

export interface ZynaTimelineAttributes extends ZynaChartBase {
  /** JSON-serialised array of {@link ZynaTimelineItem} */
  data?: string
  /** Label of the item to emphasise. Defaults to the highest-value item */
  highlight?: string
}

export interface ZynaNightingaleAttributes extends ZynaChartBase {
  /** JSON-serialised array of {@link ZynaNightingaleItem} */
  data?: string
}

export interface ZynaLollipopAttributes extends ZynaChartBase {
  /** JSON-serialised array of {@link ZynaLollipopItem}. Sort descending for best layout */
  data?: string
}

export interface ZynaOrbitalAttributes extends ZynaChartBase {
  /** JSON-serialised array of {@link ZynaOrbitalItem}. Each `value` must be 0–1 */
  data?: string
}

export interface ZynaCandlestickAttributes extends ZynaChartBase {
  /** JSON-serialised array of {@link ZynaCandlestickItem}, chronological order */
  data?: string
  /** Fill colour for bearish candles (close < open). Default: #B03A2E */
  'bear-color'?: string
  /** Explicit height in px. Auto-derived from width when omitted */
  height?: string | number
  /** Set to "false" to hide axis ticks and labels. Default: true */
  'show-axis'?: 'true' | 'false' | boolean
  /** D3-style number format for y-axis tick labels (e.g. '$,.0f', ',.2f') */
  'label-format'?: string
  /** Approximate number of y-axis tick marks. Default: 5 */
  ticks?: string | number
}

export interface ZynaGaugeZone {
  /** Lower bound of this zone (inclusive) */
  from: number
  /** Upper bound of this zone (exclusive, except on the final zone) */
  to: number
  /** Segment fill colour */
  color: string
  /** Band label shown under the value when this zone is active */
  label?: string
}

export interface ZynaGaugeAttributes extends ZynaChartBase {
  /** Scalar reading (required). Clamped to [min, max] when drawing */
  value?: string | number
  /** Minimum of the range. Default: 0 */
  min?: string | number
  /** Maximum of the range. Default: 100 */
  max?: string | number
  /** JSON array of {from, to, color, label} zones (required) */
  zones?: string | ZynaGaugeZone[]
  /** Optional label at the arc's start end */
  'start-label'?: string
  /** Optional label at the arc's end end */
  'end-label'?: string
  /** Static caption under the value. When omitted, the active zone's label is used */
  label?: string
  /** D3-style number format for the centre value (e.g. '.1%', ',.2f') */
  'label-format'?: string
  /** Arc thickness in px. Scales with radius when omitted */
  thickness?: string | number
  /** Total arc sweep in degrees. Default: 180 */
  'arc-degrees'?: string | number
  /** Opacity applied to zones past the marker. Default: 0.35 */
  'dim-opacity'?: string | number
  /** Explicit height in px. Auto-derived from width when omitted */
  height?: string | number
}

export interface ZynaLineAttributes {
  /** JSON-serialised array of {@link ZynaLineSeries} */
  data?: string
  /** JSON-serialised array of {@link ZynaLineAnnotation} */
  annotations?: string
  /** Curve tension: 0 = straight lines (default), 1 = maximum smoothing */
  tension?: string | number
  /** Explicit y-axis lower bound */
  'y-min'?: string | number
  /** Explicit y-axis upper bound */
  'y-max'?: string | number
  /** Number of y-axis ticks. Default: 4 */
  ticks?: string | number
  /** Explicit height in px */
  height?: string | number
  /** Colour theme. Default: 'dark' */
  theme?: 'dark' | 'light'
  class?: string
  id?: string
  style?: string
  slot?: string
}

// ── Global HTMLElementTagNameMap augmentation (DOM / vanilla TS) ──────────────

declare global {
  interface HTMLElementTagNameMap {
    'zyna-waffle':      HTMLElement
    'zyna-timeline':    HTMLElement
    'zyna-nightingale': HTMLElement
    'zyna-lollipop':    HTMLElement
    'zyna-orbital':     HTMLElement
    'zyna-candlestick': HTMLElement
    'zyna-gauge':       HTMLElement
    'zyna-line':        HTMLElement
  }
}

// ── React JSX intrinsic elements (React 18+, Preact, Solid) ──────────────────
// Place this file in your tsconfig `types` array or import it once in a .d.ts
// shim to enable autocomplete for <zyna-*> elements in JSX/TSX files.

declare namespace React {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'zyna-waffle':      ZynaWaffleAttributes      & { ref?: React.Ref<HTMLElement> }
      'zyna-timeline':    ZynaTimelineAttributes    & { ref?: React.Ref<HTMLElement> }
      'zyna-nightingale': ZynaNightingaleAttributes & { ref?: React.Ref<HTMLElement> }
      'zyna-lollipop':    ZynaLollipopAttributes    & { ref?: React.Ref<HTMLElement> }
      'zyna-orbital':     ZynaOrbitalAttributes     & { ref?: React.Ref<HTMLElement> }
      'zyna-candlestick': ZynaCandlestickAttributes & { ref?: React.Ref<HTMLElement> }
      'zyna-gauge':       ZynaGaugeAttributes       & { ref?: React.Ref<HTMLElement> }
      'zyna-line':        ZynaLineAttributes        & { ref?: React.Ref<HTMLElement> }
    }
  }
}
