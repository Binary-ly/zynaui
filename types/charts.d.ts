/**
 * Zyna UI — Chart Web Component type definitions
 *
 * Covers all 5 chart elements: <zyna-waffle>, <zyna-timeline>,
 * <zyna-nightingale>, <zyna-lollipop>, <zyna-orbital>.
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

// ── Global HTMLElementTagNameMap augmentation (DOM / vanilla TS) ──────────────

declare global {
  interface HTMLElementTagNameMap {
    'zyna-waffle':      HTMLElement
    'zyna-timeline':    HTMLElement
    'zyna-nightingale': HTMLElement
    'zyna-lollipop':    HTMLElement
    'zyna-orbital':     HTMLElement
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
    }
  }
}
