/**
 * Genre registry — collects all genre definitions.
 *
 * Each genre file exports:
 *   name     — display name
 *   tokens   — CSS custom property overrides (set on html at runtime by docs/_genres.js)
 *   swatches — preview colour swatches for the genre switcher UI
 *   styles   — structural CSS rules scoped to html[data-genre="..."]
 *              (compiled into zynaui.css via addBase in the plugin)
 *
 * To add a new genre: create src/plugin/genres/yourgenre.js and import it here.
 * To create a custom genre at runtime, use defineGenre() + registerGenre().
 */
import ops from './ops.js'
import cyberpunk from './cyberpunk.js'

export const GENRES = [ops, cyberpunk]

export { defineGenre, registerGenre } from './define.js'

export default function genres() {
  const rules = {}
  for (const genre of GENRES) {
    if (genre.styles) Object.assign(rules, genre.styles)
  }
  return rules
}
