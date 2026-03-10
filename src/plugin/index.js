/**
 * Zyna UI — Tailwind CSS plugin
 * Built by Binary Tech Ltd <hello@binary.ly> · MIT License
 *
 * The semantic class naming convention used here (.btn, .btn-primary, .card,
 * .badge, .alert, etc.) is inspired by DaisyUI (https://daisyui.com) by
 * Pouya Saadeghi. Zyna UI applies this convention with a dark HUD aesthetic,
 * CSS custom-property theming, clip-path geometry, and D3 chart Web Components.
 */
const plugin = require('tailwindcss/plugin')
const components = require('./components')

module.exports = plugin(
  function({ addComponents, addBase, theme }) {
    addBase({
      // ── Theme bridge ─────────────────────────────────────────────────────────
      // Set --zyna / --zyna-dark from the user's Tailwind config so every
      // component automatically adapts when users extend the zyna palette.
      ':root': {
        '--zyna':      theme('colors.zyna.DEFAULT', '#C9A84C'),
        '--zyna-dark': theme('colors.zyna.dark',    '#7A6230'),
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
    addComponents(components(theme))
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
