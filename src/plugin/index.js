/**
 * Zyna UI — Tailwind CSS plugin
 * Built by Binary Tech Ltd <hello@binary.ly> · MIT License
 *
 * The semantic class naming convention used here (.btn, .btn-primary, .card,
 * .badge, .alert, etc.) is inspired by DaisyUI (https://daisyui.com) by
 * Pouya Saadeghi. Zyna UI applies this convention with a dark HUD aesthetic,
 * CSS custom-property theming, clip-path geometry, and D3 chart Web Components.
 *
 * Plugin options (all optional):
 *   prefix  — Prepend a string to every ZynaUI class name. Use this to avoid
 *             collisions with other CSS frameworks.
 *             e.g. { prefix: 'z-' } → .z-btn, .z-card, .z-badge, .z-alert
 */
import plugin from 'tailwindcss/plugin'
import tokens from './tokens.js'
import components from './components/index.js'
import { genresPlugin } from './genres/index.js'
import motion from './utils/motion.js'
import { applyPrefix } from './utils/prefix.js'

export default plugin.withOptions(
  // Added 2026-03-19 (DaisyUI gap audit): switched from plugin() to plugin.withOptions()
  // so users can pass options — primarily `prefix` to avoid class name conflicts with
  // Bootstrap, Bulma, or any other library that uses .btn, .card, .badge, .alert.
  (options = {}) => {
    const { prefix = '' } = options
    return function({ addBase, theme }) {
      // Use addBase for all rules so they are always generated regardless of
      // content scanning. In v4, addComponents is on-demand (scanned); addBase
      // is always-generated and outputs to @layer base, which utilities still override.
      addBase({ ':root': tokens(theme) })
      addBase(applyPrefix(components(theme), prefix))
      addBase(applyPrefix(motion(), prefix))
      addBase(applyPrefix(genresPlugin(), prefix))
      // Added 2026-03-17 during framework integration testing: custom elements are
      // display:inline by default. That gives clientWidth=0, which causes the
      // ResizeObserver jitter guard (< 3px) to swallow the first observation and the
      // rAF fallback to skip render — charts never draw. display:block gives them
      // block layout so clientWidth reflects the parent container width.
      addBase({
        'zyna-waffle, zyna-timeline, zyna-nightingale, zyna-lollipop, zyna-orbital': {
          display: 'block',
        },
      })
    }
  },
  // Added 2026-03-19 (DaisyUI gap audit): extended Tailwind theme with ZynaUI's
  // semantic status colors and corner-radius tokens so users can write native
  // Tailwind utilities like text-zyna-success, bg-zyna-danger, rounded-zyna-lg
  // instead of arbitrary value escapes like text-[var(--z-color-success)].
  () => ({
    theme: {
      extend: {
        colors: {
          zyna: {
            DEFAULT: '#C9A84C',
            dark:    '#7A6230',
            // Semantic status colors — reference CSS variables so they respond
            // to genre switches at runtime (e.g. a genre can redefine --z-color-danger)
            success: 'var(--z-color-success)',
            danger:  'var(--z-color-danger)',
            warning: 'var(--z-color-warning)',
            info:    'var(--z-color-info)',
            text:    'var(--z-color-text)',
            muted:   'var(--z-color-text-muted)',
          },
        },
        borderRadius: {
          // ZynaUI corner tokens — e.g. rounded-zyna, rounded-zyna-lg
          // These resolve to the same values as the --z-corner-* CSS variables,
          // respecting genre overrides automatically.
          'zyna-sm': 'var(--z-corner-sm)',
          'zyna':    'var(--z-corner)',
          'zyna-lg': 'var(--z-corner-lg)',
          'zyna-xl': 'var(--z-corner-xl)',
        },
      },
    },
  })
)
