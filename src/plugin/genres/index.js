/**
 * Genre registry — collects all genre definitions.
 *
 * Each genre file exports:
 *   name     — display name
 *   tokens   — CSS custom property overrides (colors, motion, font).
 *              Read by the genre builder's JS to populate UI controls and drive
 *              applyPreview() setProperty calls. Also compiled into the genre's
 *              html[data-genre] CSS rule (see genres() below) so that setting the
 *              attribute activates the full genre — colors + motion + font +
 *              structure — without requiring any JavaScript.
 *   swatches — preview colour swatches for the genre switcher UI
 *   styles   — structural CSS rules scoped to html[data-genre="..."]
 *              (compiled into zynaui.css via addBase in the plugin)
 *
 * To add a new genre: create src/plugin/genres/yourgenre.js and import it here.
 * To create a custom genre at runtime, use defineGenre() + registerGenre().
 */
import ops from './ops.js'
import cyberpunk from './cyberpunk.js'
import corporate from './corporate.js'

export const GENRES = [ops, cyberpunk, corporate]

export { defineGenre, registerGenre } from './define.js'

// Named export (not default) so the public zynaui/genres bundle has only named
// exports — avoids a Rollup "mixed named and default exports" warning in CJS.
// The plugin imports this as { genresPlugin } rather than a default import.
export function genresPlugin() {
  const rules = {}
  for (const genre of GENRES) {
    if (genre.styles) Object.assign(rules, genre.styles)

    // Compile genre.tokens into the html[data-genre] CSS rule so that
    // data-genre="cyberpunk" (or any future genre) activates the complete
    // visual identity — colors, motion, font — purely via CSS, with no JS.
    // The genre builder's inline setProperty() still overrides these at runtime.
    // Only applies to genres that already have a data-genre scoped rule in styles;
    // the default Ops genre uses html (no data-genre) and its tokens are on :root.
    if (genre.tokens) {
      const selector = `html[data-genre="${genre.name.toLowerCase()}"]`
      if (rules[selector]) {
        // tokens go first so structural styles always take precedence on any overlap
        rules[selector] = { ...genre.tokens, ...rules[selector] }
      }
    }
  }
  return rules
}
