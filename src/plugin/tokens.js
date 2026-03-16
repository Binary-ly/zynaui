import ops from './genres/ops.js'

/**
 * Root design tokens — Tier 1 primitives and Tier 2 semantic tokens.
 *
 * Returned as a plain object consumed by addBase({ ':root': tokens(theme) })
 * in the plugin entry point. Extracted here so index.js is a pure orchestration
 * file (single responsibility: plugin registration + wiring).
 *
 * Token naming tiers:
 *   --zp-*    Primitives (raw values: corner sizes, ease curves, palette). Internal.
 *   --z-*     Genre structural tokens. Set on html by genre CSS selectors;
 *             end users should not set these directly.
 *   --btn-*   Public element-level tokens per component (--btn-bg, --card-border-color, etc.).
 *   --card-*  Each falls back to its --z-* genre token so the genre controls the default
 *   --badge-* and element overrides are purely opt-in.
 *   --alert-*
 */
export default function tokens(theme) {
  return {
    '--zyna':      theme('colors.zyna.DEFAULT', '#C9A84C'),
    '--zyna-dark': theme('colors.zyna.dark',    '#7A6230'),

    // ── Tier 1: Shape primitives ──────────────────────────────────────────────
    '--zp-corner-sm':     '7px',
    '--zp-corner-md':     '10px',
    '--zp-corner-lg':     '13px',
    '--zp-corner-xl':     '16px',
    '--zp-corner-badge':  '5px',
    '--zp-corner-badge-lg': '6px',
    '--zp-corner-card':   '16px',

    // ── Tier 1: Motion primitives ─────────────────────────────────────────────
    '--zp-ease-standard': 'cubic-bezier(0.22, 1, 0.36, 1)',
    '--zp-ease-snap':     'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    '--zp-ease-out':      'cubic-bezier(0.16, 1, 0.3, 1)',

    // ── Tier 2: Semantic shape tokens (genre-swappable) ───────────────────────
    '--z-corner-sm': 'var(--zp-corner-sm)',
    '--z-corner':    'var(--zp-corner-md)',
    '--z-corner-lg': 'var(--zp-corner-lg)',
    '--z-corner-xl': 'var(--zp-corner-xl)',

    // ── Tier 2: Semantic motion tokens (genre-swappable) ─────────────────────
    '--z-ease':      'var(--zp-ease-standard)',
    '--z-ease-snap': 'var(--zp-ease-snap)',
    '--z-ease-out':  'var(--zp-ease-out)',
    // --z-duration-* come from ops.tokens spread below

    // ── Tier 1: Color primitives ──────────────────────────────────────────────
    '--zp-success': '#00FFB2',
    '--zp-danger':  '#FF3366',
    '--zp-warning': '#FFB800',
    '--zp-info':    '#00D4FF',
    '--zp-text':    '#F0EBE0',

    // ── Tier 2: Typography ────────────────────────────────────────────────────
    '--z-font-mono': "'DM Mono', 'Fira Code', ui-monospace, monospace",

    // ── Tier 2: Text colors ───────────────────────────────────────────────────
    '--z-color-text':         'color-mix(in oklch, var(--zp-text) 90%, transparent)',
    '--z-color-text-muted':   'color-mix(in oklch, var(--zp-text) 55%, transparent)',
    '--z-color-text-dim':     'color-mix(in oklch, var(--zp-text) 65%, transparent)',
    '--z-color-text-solid':   'var(--zp-text)',
    '--z-color-text-inverse': '#050407',

    // ── Tier 2: Semantic status colors ────────────────────────────────────────
    '--z-color-success': 'var(--zp-success)',
    '--z-color-danger':  'var(--zp-danger)',
    '--z-color-warning': 'var(--zp-warning)',
    '--z-color-info':    'var(--zp-info)',

    // ── Tier 2: Borders & overlays ────────────────────────────────────────────
    '--z-color-border':     'rgba(255,255,255,0.05)',
    '--z-color-border-dim': 'rgba(255,255,255,0.035)',
    '--z-color-overlay':    'rgba(255,255,255,0.04)',

    // ── Tier 2: Inset surfaces (outlined variant interior fills) ─────────────
    '--z-surface-inset':              '#0C0B14',
    '--z-surface-inset-hover':        '#0E0D18',
    '--z-surface-inset-danger':       '#0C0508',
    '--z-surface-inset-danger-hover': '#100608',

    // ── Tier 2: Card surface gradients ────────────────────────────────────────
    '--z-surface-card':      'linear-gradient(145deg, rgba(18,16,28,0.97) 0%, rgba(10,9,18,0.97) 100%)',
    '--z-surface-card-deep': 'linear-gradient(145deg, rgba(5,4,10,0.99) 0%, rgba(3,2,7,0.99) 100%)',

    // ── Tier 2: Shadows ───────────────────────────────────────────────────────
    '--z-shadow-card':      '0 24px 70px rgba(0,0,0,0.60), 0 0 0 1px rgba(255,255,255,0.02)',
    '--z-shadow-card-deep': '0 30px 80px rgba(0,0,0,0.80), inset 0 1px 0 rgba(255,255,255,0.02)',

    // ── Global motion defaults — Ops baseline ─────────────────────────────────
    // ops.tokens contains motion/easing tokens (--z-duration-*, --z-ease-*).
    // Component structural tokens (--z-btn-*, --z-card-*, etc.) are declared on
    // the html element via ops.styles['html'] and overridden by genre CSS selectors.
    ...ops.tokens,
  }
}
