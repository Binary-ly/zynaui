/**
 * Zyna UI — Chart Web Component type definitions
 *
 * Covers all 16 chart elements: <zyna-waffle>, <zyna-timeline>,
 * <zyna-nightingale>, <zyna-lollipop>, <zyna-orbital>, <zyna-candlestick>,
 * <zyna-gauge>, <zyna-line>, <zyna-tension>, <zyna-delta>, <zyna-stratum>,
 * <zyna-resonance>, <zyna-pulse>, <zyna-rupture>, <zyna-density>, <zyna-cascade>.
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

export interface ZynaCandlestickItem {
  /** Period identifier rendered on the x-axis. ISO date string or any label. */
  date: string
  open: number
  high: number
  low: number
  close: number
}

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
}

export interface ZynaStratumItem {
  /** Entity name shown on the left */
  label: string
  /** One value per time period; each cell's height encodes its value */
  values: number[]
  /** CSS colour string for this row. Falls back to the `color` attribute */
  color?: string
}

export interface ZynaDeltaItem {
  /** Category name shown under the ring */
  label: string
  /** Current-period value (outer arc) */
  value: number
  /** Baseline value to compare against (inner arc) */
  baseline: number
  /** CSS colour string for the current arc. Falls back to the `color` attribute */
  color?: string
}

export interface ZynaResonanceItem {
  /** Item name shown at the spoke tip */
  label: string
  /** Value compared against the mean */
  value: number
}

export interface ZynaTensionItem {
  /** Item name shown at both ends */
  label: string
  /** Rank or value in the "before" column */
  before: number
  /** Rank or value in the "after" column */
  after: number
}

export interface ZynaPulseItem {
  /** Track name shown on the left */
  label: string
  /** One value per point; oscillates above/below the track baseline */
  values: number[]
  /** CSS colour string for this track. Falls back to the palette */
  color?: string
}

export interface ZynaPulseMarker {
  /** Matches an x-label or a 0-based point index */
  x: string | number
  /** Text drawn at the top of the vertical rule */
  label?: string
}

export interface ZynaRupturePoint {
  /** X-axis label for this point */
  x: string | number
  /** Y value tested against the threshold */
  y: number
}

export interface ZynaDensityItem {
  /** Period name shown on the x-axis */
  label: string
  /** Raw samples; a KDE silhouette is estimated from them */
  values: number[]
}

export interface ZynaCascadeNode {
  /** Node name */
  label?: string
  /** Value. Optional for parents — summed from children when omitted */
  value?: number
  /** CSS colour string for this branch. Inherited by descendants */
  color?: string
  /** Child splits (nesting capped at depth 4) */
  children?: ZynaCascadeNode[]
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
  /** Explicit height in px. Auto-derived from the row count when omitted */
  height?: string | number
}

export interface ZynaTimelineAttributes extends ZynaChartBase {
  /** JSON-serialised array of {@link ZynaTimelineItem} */
  data?: string
  /** Label of the item to emphasise. Defaults to the highest-value item */
  highlight?: string
  /** Colour for non-highlighted items. Default: #8A8478 */
  'muted-color'?: string
  /** Set to "false" to hide the value label under each bubble. Default: true */
  'show-values'?: 'true' | 'false'
  /** D3-style number format for value labels (e.g. '$,.0f', '.1%') */
  'label-format'?: string
  /** Explicit height in px. Auto-derived from width when omitted */
  height?: string | number
}

export interface ZynaNightingaleAttributes extends ZynaChartBase {
  /** JSON-serialised array of {@link ZynaNightingaleItem} */
  data?: string
  /** Set to "false" to hide the numeric value on each leader line. Default: true */
  'show-values'?: 'true' | 'false'
  /** D3-style number format for value labels */
  'label-format'?: string
  /** Explicit height in px. Auto-derived from width when omitted */
  height?: string | number
}

export interface ZynaLollipopAttributes extends ZynaChartBase {
  /** JSON-serialised array of {@link ZynaLollipopItem}. Sort descending for best layout */
  data?: string
  /** Label of the item to accent. Default: the first item */
  highlight?: string
  /** Colour for non-highlighted stems, dots, and labels. Default: `--zyna-dark` */
  'muted-color'?: string
  /** Set to "false" to hide the value at the end of each stem. Default: true */
  'show-values'?: 'true' | 'false'
  /** D3-style number format for value labels */
  'label-format'?: string
  /** Number of x-axis tick marks. Default: 5 */
  ticks?: string | number
  /** Explicit height in px. Auto-derived from the row count when omitted */
  height?: string | number
}

export interface ZynaOrbitalAttributes extends ZynaChartBase {
  /** JSON-serialised array of {@link ZynaOrbitalItem}. Each `value` is clamped into 0–1 */
  data?: string
  /** Set to "false" to hide the label and percentage text. Default: true */
  'show-values'?: 'true' | 'false'
  /** D3-style number format applied to the raw 0–1 value. Default: percentage */
  'label-format'?: string
  /** Ring width as a fraction of the outer radius. Default: 0.115 */
  'ring-thickness'?: string | number
  /** Explicit height in px. Auto-derived from width when omitted */
  height?: string | number
}

export interface ZynaCandlestickAttributes extends ZynaChartBase {
  /** JSON-serialised array of {@link ZynaCandlestickItem}, chronological order */
  data?: string
  /** Fill colour for bearish candles (close < open). Defaults to the computed `--zp-danger` token (#FF3366 under the default Ops genre) */
  'bear-color'?: string
  /** Explicit height in px. Auto-derived from width when omitted */
  height?: string | number
  /**
   * Set to "false" to hide axis ticks and labels. Default: true.
   * A string, not a boolean: React 19 removes a custom-element attribute whose
   * value is boolean `false`, so `show-axis={false}` would silently show the
   * axis. (The `zynaui/react` wrappers accept booleans and stringify them.)
   */
  'show-axis'?: 'true' | 'false'
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

export interface ZynaStratumAttributes extends ZynaChartBase {
  /** JSON-serialised array of {@link ZynaStratumItem} */
  data?: string
  /** JSON-serialised array of period labels. '' suppresses that label */
  'x-labels'?: string
  /** Height normalisation: per-entity ('row', default) or shared ('global') */
  scale?: 'row' | 'global'
  /** Explicit height in px. Auto-derived from row count when omitted */
  height?: string | number
  /** D3-style number format applied to values in the a11y summary */
  'label-format'?: string
}

export interface ZynaDeltaAttributes extends ZynaChartBase {
  /** JSON-serialised array of {@link ZynaDeltaItem} */
  data?: string
  /** Shared scale ceiling (angle = value / max). Default: data max */
  max?: string | number
  /** Total arc sweep in degrees. Default: 270 */
  'arc-degrees'?: string | number
  /** Explicit height in px. Auto-derived from width when omitted */
  height?: string | number
  /** D3-style number format for the centre delta when a baseline is 0 */
  'label-format'?: string
}

export interface ZynaResonanceAttributes extends ZynaChartBase {
  /** JSON-serialised array of {@link ZynaResonanceItem} */
  data?: string
  /** Explicit centre value. Default: the computed mean */
  mean?: string | number
  /** Deviation label units: 'percent' (default) or 'absolute' */
  unit?: 'percent' | 'absolute'
  /** Explicit height in px. Auto-derived from width when omitted */
  height?: string | number
  /** D3-style number format for absolute deviation labels */
  'label-format'?: string
}

export interface ZynaTensionAttributes extends ZynaChartBase {
  /** JSON-serialised array of {@link ZynaTensionItem} */
  data?: string
  /** 'rank' (default; before/after are ranks) or 'value' (compute ranks) */
  'rank-by'?: 'rank' | 'value'
  /** Label to spotlight; every other connector dims */
  highlight?: string
  /** Explicit height in px. Auto-derived from item count when omitted */
  height?: string | number
}

export interface ZynaPulseAttributes extends ZynaChartBase {
  /** JSON-serialised array of {@link ZynaPulseItem} */
  data?: string
  /** JSON-serialised array of point labels. '' suppresses that label */
  'x-labels'?: string
  /** px of vertical swing per track. Default: auto */
  amplitude?: string | number
  /** JSON-serialised array of {@link ZynaPulseMarker} vertical event rules */
  marker?: string
  /** Explicit height in px. Auto-derived from track count when omitted */
  height?: string | number
}

export interface ZynaRuptureAttributes extends ZynaChartBase {
  /** JSON-serialised array of {@link ZynaRupturePoint} (single series) */
  data?: string
  /** The breach level (required) */
  threshold?: string | number
  /** Caption drawn on the threshold line */
  'threshold-label'?: string
  /** 'above' (default) or 'below' (breach when dipping under) */
  direction?: 'above' | 'below'
  /** Explicit height in px. Auto-derived from width when omitted */
  height?: string | number
  /** D3-style number format for the threshold label value */
  'label-format'?: string
}

export interface ZynaDensityAttributes extends ZynaChartBase {
  /** JSON-serialised array of {@link ZynaDensityItem} */
  data?: string
  /** KDE smoothing bandwidth. Default: auto (Silverman's rule) */
  bandwidth?: string | number
  /** y-axis lower bound. Default: data extent */
  'y-min'?: string | number
  /** y-axis upper bound. Default: data extent */
  'y-max'?: string | number
  /** Axis title drawn rotated on the left (e.g. 'Response time (ms)') */
  'y-label'?: string
  /** D3-style number format for the y-axis tick labels */
  'label-format'?: string
  /** Explicit height in px. Auto-derived from width when omitted */
  height?: string | number
}

export interface ZynaCascadeAttributes extends ZynaChartBase {
  /** JSON-serialised {@link ZynaCascadeNode} root (or an array of top-level splits) */
  data?: string
  /** JSON-serialised array naming each tier */
  'level-labels'?: string
  /** Collapse splits below this fraction of their parent into "Other". Default: 0.03 */
  'min-share'?: string | number
  /** Explicit height in px. Auto-derived from width when omitted */
  height?: string | number
  /** D3-style number format for block value labels */
  'label-format'?: string
  /** Visual variant. 'sankey' renders molten gradient flows with a soft bloom; the standard split waterfall is the default. */
  variant?: 'waterfall' | 'sankey'
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
    'zyna-stratum':     HTMLElement
    'zyna-delta':       HTMLElement
    'zyna-resonance':   HTMLElement
    'zyna-tension':     HTMLElement
    'zyna-pulse':       HTMLElement
    'zyna-rupture':     HTMLElement
    'zyna-density':     HTMLElement
    'zyna-cascade':     HTMLElement
  }
}

// ── JSX intrinsic elements (React ≤18 global JSX, Preact, Solid) ─────────────
// Augments the *global* JSX namespace so <zyna-*> tags type-check in TSX.
// React 19 reads `React.JSX` instead of the global namespace; that augmentation
// lives in types/react.d.ts (it must import 'react', which this file cannot
// require), so React 19 users get bare <zyna-*> tags typed by importing
// anything from `zynaui/react`.

type ZynaElementRef =
  | ((instance: HTMLElement | null) => void)
  | { current: HTMLElement | null }
  | null

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'zyna-waffle':      ZynaWaffleAttributes      & { ref?: ZynaElementRef }
      'zyna-timeline':    ZynaTimelineAttributes    & { ref?: ZynaElementRef }
      'zyna-nightingale': ZynaNightingaleAttributes & { ref?: ZynaElementRef }
      'zyna-lollipop':    ZynaLollipopAttributes    & { ref?: ZynaElementRef }
      'zyna-orbital':     ZynaOrbitalAttributes     & { ref?: ZynaElementRef }
      'zyna-candlestick': ZynaCandlestickAttributes & { ref?: ZynaElementRef }
      'zyna-gauge':       ZynaGaugeAttributes       & { ref?: ZynaElementRef }
      'zyna-line':        ZynaLineAttributes        & { ref?: ZynaElementRef }
      'zyna-stratum':     ZynaStratumAttributes     & { ref?: ZynaElementRef }
      'zyna-delta':       ZynaDeltaAttributes       & { ref?: ZynaElementRef }
      'zyna-resonance':   ZynaResonanceAttributes   & { ref?: ZynaElementRef }
      'zyna-tension':     ZynaTensionAttributes     & { ref?: ZynaElementRef }
      'zyna-pulse':       ZynaPulseAttributes       & { ref?: ZynaElementRef }
      'zyna-rupture':     ZynaRuptureAttributes     & { ref?: ZynaElementRef }
      'zyna-density':     ZynaDensityAttributes     & { ref?: ZynaElementRef }
      'zyna-cascade':     ZynaCascadeAttributes     & { ref?: ZynaElementRef }
    }
  }
}
