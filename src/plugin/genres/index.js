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
import phosphor from './phosphor.js'
import military from './military.js'
import blueprint from './blueprint.js'
import washi from './washi.js'
import laboratory from './laboratory.js'
import atelier from './atelier.js'

export const GENRES = [ops, cyberpunk, corporate, phosphor, military, blueprint, washi, laboratory, atelier]

export { defineGenre, registerGenre } from './define.js'

// Named export (not default) so the public zynaui/genres bundle has only named
// exports — avoids a Rollup "mixed named and default exports" warning in CJS.
// The plugin imports this as { genresPlugin } rather than a default import.
// Merges style rules without clobbering: when two genres declare the same key
// (e.g. every genre wraps its animation kill-switch in the identical
// '@media (prefers-reduced-motion: reduce)' key), the nested rules are merged
// instead of the last genre silently replacing all previous ones. Clones on
// write so the imported genre modules are never mutated.
function mergeRules(target, source) {
  const isObj = v => v && typeof v === 'object' && !Array.isArray(v)
  for (const [key, value] of Object.entries(source)) {
    target[key] = (isObj(target[key]) && isObj(value))
      ? mergeRules({ ...target[key] }, value)
      : value
  }
  return target
}

// Docs-site chrome tokens. The docs genre switcher applies these at runtime
// via setProperty(); they must NOT be compiled into the published plugin CSS —
// generic names like --bg and --text set on the consumer's <html> would hijack
// the identically named variables many downstream codebases already define.
const DOCS_ONLY_TOKENS = new Set([
  '--bg', '--bg2', '--bg3', '--text', '--text2', '--text3',
  '--border', '--border2', '--topbar-bg',
])

export function genresPlugin() {
  const rules = {}
  for (const genre of GENRES) {
    if (genre.styles) mergeRules(rules, genre.styles)

    // Compile genre.tokens into the html[data-genre] CSS rule so that
    // data-genre="cyberpunk" (or any future genre) activates the complete
    // visual identity — colors, motion, font — purely via CSS, with no JS.
    // The genre builder's inline setProperty() still overrides these at runtime.
    // Only applies to genres that already have a data-genre scoped rule in styles;
    // the default Ops genre uses html (no data-genre) and its tokens are on :root.
    if (genre.tokens) {
      const selector = `html[data-genre="${genre.name.toLowerCase()}"]`
      if (rules[selector]) {
        const publicTokens = Object.fromEntries(
          Object.entries(genre.tokens).filter(([k]) => !DOCS_ONLY_TOKENS.has(k))
        )
        // tokens go first so structural styles always take precedence on any overlap
        rules[selector] = { ...publicTokens, ...rules[selector] }
      }
    }
  }
  return rules
}
