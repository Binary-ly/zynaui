/**
 * Zyna UI — Tailwind CSS plugin
 * Built by Binary Tech Ltd <hello@binary.ly> · MIT License
 *
 * The semantic class naming convention used here (.btn, .btn-primary, .card,
 * .badge, .alert, etc.) is inspired by DaisyUI (https://daisyui.com) by
 * Pouya Saadeghi. Zyna UI applies this convention with a dark HUD aesthetic,
 * CSS custom-property theming, clip-path geometry, and D3 chart Web Components.
 */
import plugin from 'tailwindcss/plugin'
import components from './components/index.js'
import genres from './genres/index.js'
import ops from './genres/ops.js'

export default plugin(
  function({ addBase, theme }) {
    addBase({
      // ── Theme bridge ─────────────────────────────────────────────────────────
      // Set --zyna / --zyna-dark from the user's Tailwind config so every
      // component automatically adapts when users extend the zyna palette.
      ':root': {
        '--zyna':      theme('colors.zyna.DEFAULT', '#C9A84C'),
        '--zyna-dark': theme('colors.zyna.dark',    '#7A6230'),

        // ── Tier 1: Shape primitives ────────────────────────────────────────
        '--zp-corner-sm':     '7px',
        '--zp-corner-md':     '10px',
        '--zp-corner-lg':     '13px',
        '--zp-corner-xl':     '16px',
        '--zp-corner-badge':  '5px',
        '--zp-corner-badge-lg': '6px',
        '--zp-corner-card':   '16px',

        // ── Tier 1: Motion primitives ───────────────────────────────────────
        '--zp-ease-standard': 'cubic-bezier(0.22, 1, 0.36, 1)',
        '--zp-ease-snap':     'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        '--zp-ease-out':      'cubic-bezier(0.16, 1, 0.3, 1)',

        // ── Tier 2: Semantic shape tokens (genre-swappable) ─────────────────
        '--z-corner-sm': 'var(--zp-corner-sm)',
        '--z-corner':    'var(--zp-corner-md)',
        '--z-corner-lg': 'var(--zp-corner-lg)',
        '--z-corner-xl': 'var(--zp-corner-xl)',

        // ── Tier 2: Semantic motion tokens (genre-swappable) ────────────────
        '--z-ease':      'var(--zp-ease-standard)',
        '--z-ease-snap': 'var(--zp-ease-snap)',
        '--z-ease-out':  'var(--zp-ease-out)',
        // --z-duration-* come from ops.tokens spread below

        // ── Tier 1: Color primitives ──────────────────────────────────────────
        '--zp-success': '#00FFB2',
        '--zp-danger':  '#FF3366',
        '--zp-warning': '#FFB800',
        '--zp-info':    '#00D4FF',
        '--zp-text':    '#F0EBE0',

        // ── Tier 2: Typography ───────────────────────────────────────────────
        '--z-font-mono': "'DM Mono', 'Fira Code', ui-monospace, monospace",

        // ── Tier 2: Text colors ──────────────────────────────────────────────
        '--z-color-text':         'color-mix(in srgb, var(--zp-text) 90%, transparent)',
        '--z-color-text-muted':   'color-mix(in srgb, var(--zp-text) 55%, transparent)',
        '--z-color-text-dim':     'color-mix(in srgb, var(--zp-text) 65%, transparent)',
        '--z-color-text-solid':   'var(--zp-text)',
        '--z-color-text-inverse': '#050407',

        // ── Tier 2: Semantic status colors ───────────────────────────────────
        '--z-color-success': 'var(--zp-success)',
        '--z-color-danger':  'var(--zp-danger)',
        '--z-color-warning': 'var(--zp-warning)',
        '--z-color-info':    'var(--zp-info)',

        // ── Tier 2: Borders & overlays ───────────────────────────────────────
        '--z-color-border':     'rgba(255,255,255,0.05)',
        '--z-color-border-dim': 'rgba(255,255,255,0.035)',
        '--z-color-overlay':    'rgba(255,255,255,0.04)',

        // ── Tier 2: Inset surfaces (outlined variant interior fills) ─────────
        '--z-surface-inset':              '#0C0B14',
        '--z-surface-inset-hover':        '#0E0D18',
        '--z-surface-inset-danger':       '#0C0508',
        '--z-surface-inset-danger-hover': '#100608',

        // ── Tier 2: Card surface gradients ───────────────────────────────────
        '--z-surface-card':      'linear-gradient(145deg, rgba(18,16,28,0.97) 0%, rgba(10,9,18,0.97) 100%)',
        '--z-surface-card-deep': 'linear-gradient(145deg, rgba(5,4,10,0.99) 0%, rgba(3,2,7,0.99) 100%)',

        // ── Tier 2: Shadows ──────────────────────────────────────────────────
        '--z-shadow-card':      '0 24px 70px rgba(0,0,0,0.60), 0 0 0 1px rgba(255,255,255,0.02)',
        '--z-shadow-card-deep': '0 30px 80px rgba(0,0,0,0.80), inset 0 1px 0 rgba(255,255,255,0.02)',

        // ── Structural genre tokens — Ops defaults ────────────────────────────
        // ops.js is the single source of truth for all structural defaults.
        // Cyberpunk (and any future genre) overrides these via JS setProperty.
        ...ops.tokens,
      },

      // Register component CSS variables with explicit types so the browser can:
      //  1. Skip inheriting them down the DOM tree (inherits: false)
      //  2. Native-interpolate typed values (color, length) for future WAAPI use
      '@property --btn-bg':                { syntax: '"*"',       inherits: 'false', initialValue: 'transparent' },
      '@property --btn-color':             { syntax: '"<color>"', inherits: 'false', initialValue: 'rgba(240,235,224,0.55)' },
      // NOTE: --btn-hover-bg and --btn-hover-interior are intentionally NOT registered with @property.
      // They rely on the CSS fallback var(--btn-hover-bg, var(--btn-bg)) to cascade from their
      // sibling variables when not explicitly set. @property with initial-value would break this
      // because the property would always resolve to its initial-value instead of triggering the fallback.
      '@property --btn-hover-color':       { syntax: '"<color>"', inherits: 'false', initialValue: 'rgba(240,235,224,0.9)' },
      '@property --btn-scan-color':        { syntax: '"<color>"', inherits: 'false', initialValue: 'rgba(255,255,255,0.07)' },
      '@property --btn-interior':          { syntax: '"<color>"', inherits: 'false', initialValue: 'transparent' },
      // NOTE: --btn-focus-color and --card-bracket-color are intentionally NOT
      // registered with @property. Their actual values use color-mix(in srgb,
      // var(--zyna) …) which is not a static literal and cannot be used as an
      // @property initial-value. Omitting the registration is safe — the
      // component rules always set these variables explicitly.
      '@property --card-border-color':     { syntax: '"<color>"', inherits: 'false', initialValue: 'rgba(255,255,255,0.05)' },
      '@property --card-bracket-size':     { syntax: '"<length>"', inherits: 'false', initialValue: '20px' },
      '@property --card-glow-lo':          { syntax: '"<color>"', inherits: 'false', initialValue: 'rgba(0,0,0,0)' },
      '@property --card-glow-hi':          { syntax: '"<color>"', inherits: 'false', initialValue: 'rgba(0,0,0,0)' },

      // Shape tokens — <length> type, inherits:true so ::before pseudo-elements resolve them
      '@property --btn-corner':   { syntax: '"<length>"', inherits: 'true', initialValue: '10px' },
      '@property --badge-offset': { syntax: '"<length>"', inherits: 'true', initialValue: '0.55rem' },

      // Badge scan sweep — slides a bright strip across the parallelogram shape
      '@keyframes zyna-badge-scan': {
        '0%, 18%':   { transform: 'translateX(0)' },
        '52%, 100%': { transform: 'translateX(340%)' },
      },
      // Badge pulse dot — scale + expanding box-shadow ring that fades out
      '@keyframes zyna-pulse-ring': {
        '0%':   { opacity: '1',    transform: 'scale(1)',    boxShadow: '0 0 0 0 currentColor' },
        '45%':  { opacity: '0.65', transform: 'scale(1.15)', boxShadow: '0 0 0 4px transparent' },
        '100%': { opacity: '1',    transform: 'scale(1)',    boxShadow: '0 0 0 0 transparent' },
      },
      // Legacy pulse (kept for compatibility)
      '@keyframes zyna-pulse': {
        '0%, 100%': { opacity: '1',    transform: 'scale(1)' },
        '50%':      { opacity: '0.35', transform: 'scale(0.7)' },
      },
      // Button scan-line (available for custom use)
      '@keyframes zyna-scan': {
        '0%':   { transform: 'translateX(-100%)' },
        '100%': { transform: 'translateX(200%)' },
      },
      // Card glow pulse — animates filter: drop-shadow() rather than box-shadow,
      // so Chrome can GPU-composite the animation (box-shadow always triggers CPU repaint).
      // The card's resting depth shadow stays in the static box-shadow property.
      // Uses --card-glow-lo / --card-glow-hi CSS variables so any variant can produce
      // a different-coloured pulse by setting those two variables alongside --card-animation.
      '@keyframes zyna-card-pulse': {
        '0%, 100%': {
          filter: 'drop-shadow(0 0 18px var(--card-glow-lo)) drop-shadow(0 0 6px var(--card-glow-lo))',
        },
        '50%': {
          filter: 'drop-shadow(0 0 38px var(--card-glow-hi)) drop-shadow(0 0 14px var(--card-glow-hi))',
        },
      },
    })
    // Use addBase for all component styles so they are always generated regardless
    // of content scanning. In v4, addComponents is on-demand (scanned); addBase
    // is always-generated and outputs to @layer base, which utilities still override.
    addBase(components(theme))
    addBase(genres())
  },
  {
    theme: {
      extend: {
        colors: {
          zyna: {
            DEFAULT: '#C9A84C',
            dark:    '#7A6230',
          },
        },
      },
    },
  }
)
