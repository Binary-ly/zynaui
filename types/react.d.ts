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
  ZynaLineSeries,
  ZynaLineAnnotation,
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
  /** Gap between cells in pixels. Default: 2 */
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

export declare function ZynaWaffle(props: ZynaWaffleProps):          React.ReactElement | null
export declare function ZynaTimeline(props: ZynaTimelineProps):      React.ReactElement | null
export declare function ZynaNightingale(props: ZynaNightingaleProps): React.ReactElement | null
export declare function ZynaLollipop(props: ZynaLollipopProps):      React.ReactElement | null
export declare function ZynaOrbital(props: ZynaOrbitalProps):        React.ReactElement | null
export declare function ZynaLine(props: ZynaLineProps):               React.ReactElement | null
