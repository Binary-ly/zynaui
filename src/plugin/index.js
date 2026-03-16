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
import tokens from './tokens.js'
import components from './components/index.js'
import genres from './genres/index.js'
import motion from './utils/motion.js'

export default plugin(
  function({ addBase, theme }) {
    // Use addBase for all rules so they are always generated regardless of
    // content scanning. In v4, addComponents is on-demand (scanned); addBase
    // is always-generated and outputs to @layer base, which utilities still override.
    addBase({ ':root': tokens(theme) })
    addBase(components(theme))
    addBase(motion())
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
