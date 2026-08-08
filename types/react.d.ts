/**
 * Zyna UI — React wrapper component type definitions
 *
 * Import from 'zynaui/react' to get typed React components that accept
 * native JS arrays and numbers instead of JSON strings.
 *
 * Requires @types/react in your project (standard in any React/Next.js setup).
 */

import type {
  ZynaWaffleItem,
  ZynaTimelineItem,
  ZynaNightingaleItem,
  ZynaLollipopItem,
  ZynaOrbitalItem,
  ZynaCandlestickItem,
  ZynaGaugeZone,
  ZynaLineSeries,
  ZynaLineAnnotation,
  ZynaStratumItem,
  ZynaDeltaItem,
  ZynaResonanceItem,
  ZynaTensionItem,
  ZynaPulseItem,
  ZynaPulseMarker,
  ZynaRupturePoint,
  ZynaDensityItem,
  ZynaCascadeNode,
} from './charts'

import type { HTMLAttributes } from 'react'

type Base = Omit<HTMLAttributes<HTMLElement>, 'color'> & {
  color?: string
  theme?: 'dark' | 'light'
}

export interface ZynaWaffleProps extends Base {
  data: ZynaWaffleItem[]
  /** Number of columns. Default: 10 */
  cols?: number
  /** Gap between cells in pixels. Default: 3 */
  gap?: number
}

export interface ZynaTimelineProps extends Base {
  data: ZynaTimelineItem[]
  /** Label of the item to emphasise. Defaults to highest-value item */
  highlight?: string
  /** Chart height in pixels */
  height?: number
}

export interface ZynaNightingaleProps extends Base {
  data: ZynaNightingaleItem[]
  /** Chart height in pixels */
  height?: number
}

export interface ZynaLollipopProps extends Base {
  data: ZynaLollipopItem[]
  /** Chart height in pixels */
  height?: number
}

export interface ZynaOrbitalProps extends Base {
  data: ZynaOrbitalItem[]
  /** Chart height in pixels */
  height?: number
}

export interface ZynaCandlestickProps extends Base {
  /** Candles in chronological order */
  data: ZynaCandlestickItem[]
  /** Fill colour for bearish candles. Defaults to the computed `--zp-danger` token */
  'bear-color'?: string
  /** Chart height in pixels */
  height?: number
  /** Set to "false" to hide axis ticks and labels. Default: true */
  'show-axis'?: 'true' | 'false' | boolean
  /** D3-style number format for y-axis tick labels (e.g. '$,.0f') */
  'label-format'?: string
  /** Approximate y-axis tick count. Default: 5 */
  ticks?: number
}

export interface ZynaGaugeProps extends Base {
  /** Scalar reading. Clamped to [min, max] when drawing */
  value: number
  /** Minimum of the range. Default: 0 */
  min?: number
  /** Maximum of the range. Default: 100 */
  max?: number
  /** Colour zones covering [min, max] */
  zones: ZynaGaugeZone[]
  /** Optional label at the arc's start end */
  'start-label'?: string
  /** Optional label at the arc's end end */
  'end-label'?: string
  /** Static caption under the value. Defaults to the active zone's label */
  label?: string
  /** D3-style number format for the centre value (e.g. '.1%') */
  'label-format'?: string
  /** Arc thickness in px. Scales with radius when omitted */
  thickness?: number
  /** Total arc sweep in degrees. Default: 180 */
  'arc-degrees'?: number
  /** Opacity applied to zones past the marker. Default: 0.35 */
  'dim-opacity'?: number
  /** Chart height in pixels */
  height?: number
}

export interface ZynaLineProps extends Base {
  data: ZynaLineSeries[]
  /** Annotation markers on specific data points */
  annotations?: ZynaLineAnnotation[]
  /** Chart height in pixels */
  height?: number
  /** Curve tension: 0 = straight lines (default), 1 = maximum smoothing */
  tension?: number
  /** Y-axis lower bound */
  'y-min'?: number
  /** Y-axis upper bound */
  'y-max'?: number
  /** Y-axis tick count. Default: 4 */
  ticks?: number
}

export interface ZynaStratumProps extends Base {
  data: ZynaStratumItem[]
  /** Period labels along the x-axis. '' suppresses that label */
  xLabels?: string[]
  /** Height normalisation: per-entity ('row', default) or shared ('global') */
  scale?: 'row' | 'global'
  /** Chart height in pixels */
  height?: number
  /** D3-style number format for values in the a11y summary */
  'label-format'?: string
}

export interface ZynaDeltaProps extends Base {
  data: ZynaDeltaItem[]
  /** Shared scale ceiling (angle = value / max). Default: data max */
  max?: number
  /** Total arc sweep in degrees. Default: 270 */
  'arc-degrees'?: number
  /** Chart height in pixels */
  height?: number
  /** D3-style number format for the centre delta when a baseline is 0 */
  'label-format'?: string
}

export interface ZynaResonanceProps extends Base {
  data: ZynaResonanceItem[]
  /** Explicit centre value. Default: computed mean */
  mean?: number
  /** Deviation label units: 'percent' (default) or 'absolute' */
  unit?: 'percent' | 'absolute'
  /** Chart height in pixels */
  height?: number
  /** D3-style number format for absolute deviation labels */
  'label-format'?: string
}

export interface ZynaTensionProps extends Base {
  data: ZynaTensionItem[]
  /** 'rank' (default; before/after are ranks) or 'value' (compute ranks) */
  'rank-by'?: 'rank' | 'value'
  /** Label to spotlight; every other connector dims */
  highlight?: string
  /** Chart height in pixels */
  height?: number
}

export interface ZynaPulseProps extends Base {
  data: ZynaPulseItem[]
  /** Point labels along the x-axis. '' suppresses that label */
  xLabels?: string[]
  /** px of vertical swing per track. Default: auto */
  amplitude?: number
  /** Vertical event rules spanning all tracks */
  marker?: ZynaPulseMarker[]
  /** Chart height in pixels */
  height?: number
}

export interface ZynaRuptureProps extends Base {
  data: ZynaRupturePoint[]
  /** The breach level (required) */
  threshold: number
  /** Caption drawn on the threshold line */
  'threshold-label'?: string
  /** 'above' (default) or 'below' (breach when dipping under) */
  direction?: 'above' | 'below'
  /** Chart height in pixels */
  height?: number
  /** D3-style number format for the threshold label value */
  'label-format'?: string
}

export interface ZynaDensityProps extends Base {
  data: ZynaDensityItem[]
  /** KDE smoothing bandwidth. Default: auto (Silverman's rule) */
  bandwidth?: number
  /** y-axis lower bound */
  'y-min'?: number
  /** y-axis upper bound */
  'y-max'?: number
  /** Axis title drawn rotated on the left (e.g. 'Response time (ms)') */
  'y-label'?: string
  /** D3-style number format for the y-axis tick labels */
  'label-format'?: string
  /** Chart height in pixels */
  height?: number
}

export interface ZynaCascadeProps extends Base {
  /** Root node (or an array of top-level splits) */
  data: ZynaCascadeNode | ZynaCascadeNode[]
  /** Names for each tier */
  levelLabels?: string[]
  /** Collapse splits below this fraction of their parent into "Other". Default: 0.03 */
  'min-share'?: number
  /** Chart height in pixels */
  height?: number
  /** D3-style number format for block value labels */
  'label-format'?: string
  /** Visual variant. 'sankey' renders molten gradient flows with a soft bloom; the standard split waterfall is the default. */
  variant?: 'waterfall' | 'sankey'
}

export declare function ZynaWaffle(props: ZynaWaffleProps):          React.ReactElement | null
export declare function ZynaTimeline(props: ZynaTimelineProps):      React.ReactElement | null
export declare function ZynaNightingale(props: ZynaNightingaleProps): React.ReactElement | null
export declare function ZynaLollipop(props: ZynaLollipopProps):      React.ReactElement | null
export declare function ZynaOrbital(props: ZynaOrbitalProps):        React.ReactElement | null
export declare function ZynaCandlestick(props: ZynaCandlestickProps): React.ReactElement | null
export declare function ZynaGauge(props: ZynaGaugeProps):             React.ReactElement | null
export declare function ZynaLine(props: ZynaLineProps):               React.ReactElement | null
export declare function ZynaStratum(props: ZynaStratumProps):         React.ReactElement | null
export declare function ZynaDelta(props: ZynaDeltaProps):             React.ReactElement | null
export declare function ZynaResonance(props: ZynaResonanceProps):     React.ReactElement | null
export declare function ZynaTension(props: ZynaTensionProps):         React.ReactElement | null
export declare function ZynaPulse(props: ZynaPulseProps):             React.ReactElement | null
export declare function ZynaRupture(props: ZynaRuptureProps):         React.ReactElement | null
export declare function ZynaDensity(props: ZynaDensityProps):         React.ReactElement | null
export declare function ZynaCascade(props: ZynaCascadeProps):         React.ReactElement | null
