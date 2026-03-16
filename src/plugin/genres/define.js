/**
 * defineGenre() — composable genre factory
 *
 * Creates a genre object by merging caller-supplied overrides onto a base genre
 * (default: Ops). The result is compatible with GENRES and applyGenre() — pass
 * it to registerGenre() to make it available in the switcher at runtime.
 *
 * ── tokens vs styles ────────────────────────────────────────────────────────
 * Use `tokens` for global values that the genre builder reads and overrides at
 * runtime via JS setProperty (colors, motion, font). These are set on html.
 *
 * Use `styles` for structural component tokens (--z-btn-*, --z-card-*, etc.)
 * that should activate via the data-genre CSS attribute without JS. Scope them
 * to 'html[data-genre="yourgenre"]' at specificity [0,1,1] so they beat the
 * Ops html defaults at [0,0,1] and the genre builder's inline setProperty
 * still overrides both.
 *
 * @example
 * import { defineGenre, registerGenre } from 'zynaui/genres'
 *
 * const aurora = defineGenre({
 *   name: 'Aurora',
 *   palette: { brand: '#BF5FFF', success: '#00FFB2' },
 *   // Global tokens — picked up by the genre builder
 *   tokens: {
 *     '--zyna':            '#BF5FFF',
 *     '--z-ease-enter':    'cubic-bezier(0.34, 1.56, 0.64, 1)',
 *     '--z-duration-fast': '0.14s',
 *   },
 *   // Structural overrides — activate via data-genre="aurora" on <html>
 *   styles: {
 *     'html[data-genre="aurora"]': {
 *       '--z-btn-clip':    'inset(0)',          // rectangular buttons
 *       '--z-badge-clip':  'inset(0 round 4px)', // pill-ish badges
 *     },
 *   },
 * })
 *
 * registerGenre(aurora)
 * applyGenre('Aurora')
 */
import ops from './ops.js'
import { GENRES } from './index.js'

export function defineGenre({ name, palette = {}, tokens = {}, styles = {}, extends: base }) {
  const baseGenre = base ?? ops
  return {
    name,
    swatches: { ...baseGenre.swatches, ...palette },
    tokens:   { ...baseGenre.tokens,   ...tokens  },
    styles:   { ...baseGenre.styles,   ...styles  },
  }
}

export function registerGenre(genre) {
  if (!GENRES.find(g => g.name === genre.name)) {
    GENRES.push(genre)
  }
}
