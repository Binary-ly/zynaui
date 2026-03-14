/**
 * defineGenre() — composable genre factory
 *
 * Creates a genre object by merging caller-supplied overrides onto a base genre
 * (default: Ops). The result is compatible with GENRES and applyGenre() — pass
 * it to registerGenre() to make it available in the switcher at runtime.
 *
 * @example
 * import { defineGenre, registerGenre } from 'zynaui/genres'
 * import ops from 'zynaui/genres/ops'
 *
 * const aurora = defineGenre({
 *   name: 'Aurora',
 *   palette: { brand: '#BF5FFF', success: '#00FFB2' },
 *   tokens: {
 *     '--zyna':            '#BF5FFF',
 *     '--z-ease-enter':    'cubic-bezier(0.34, 1.56, 0.64, 1)',
 *     '--z-duration-fast': '0.14s',
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
