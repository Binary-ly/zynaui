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

/**
 * The `data-genre` attribute value for a genre name. This is the single
 * source of truth shared by the compiler (selector), defineGenre (name
 * validation, inherited-selector remapping), and runtime switchers, so a
 * genre named "My Genre" compiles to and activates via `data-genre="my-genre"`.
 * @param {string} name
 * @returns {string}
 */
export function genreSlug(name) {
  return String(name).trim().toLowerCase().replace(/\s+/g, '-')
}

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

// ── Element-scoped structural tokens ─────────────────────────────────────────
// A custom property's var() references are substituted where the property is
// DECLARED, not where it is read. Structural tokens declared on <html> whose
// values reference element-level public tokens (--btn-corner, --badge-offset,
// --alert-bar-color …) therefore resolved against html's values — the @property
// initial-value (10px for --btn-corner, white for --alert-bar-color) — and the
// frozen result was inherited by every component: size classes never changed
// the chamfer, genre corner sizes never applied, and Cyberpunk's per-variant
// alert borders and glows rendered white. genresPlugin() emits these tokens on
// the component element instead (genre-scoped via a descendant selector) so
// they resolve against the element's own tokens. The set is fixed so a token
// is scoped the same way in every genre — mixing element-level and inherited
// declarations of one token would let Ops' element value shadow a genre's.
export const ELEMENT_SCOPED_TOKENS = Object.freeze({
  '--z-btn-clip':         '.btn',
  '--z-btn-inner-clip':   '.btn',
  '--z-badge-clip':       '.badge',
  '--z-badge-inner-clip': '.badge',
  '--z-badge-interior':   '.badge',
  '--z-alert-border':     '.alert',
  '--z-alert-bar-glow':   '.alert',
  '--z-alert-texture':    '.alert',
})

// Split one genre's html-level rule into the declarations that stay on html
// and those that must live on the component element, keyed by the element
// selector they are emitted under.
function scopeToElements(decls, genreScope) {
  const kept = {}
  const scoped = {}
  for (const [prop, value] of Object.entries(decls)) {
    const comp = ELEMENT_SCOPED_TOKENS[prop]
    if (!comp) { kept[prop] = value; continue }
    const sel = genreScope ? `:where(${genreScope}) :where(${comp})` : `:where(${comp})`
    ;(scoped[sel] ||= {})[prop] = value
  }
  return { kept, scoped }
}

/**
 * Compile genres into a Tailwind `addBase`-compatible rule object.
 *
 * @param {Array} [genres=GENRES]  Genres to compile. Defaults to the full
 *   registry (built-ins plus anything added via registerGenre). Pass an
 *   explicit list — e.g. `genresPlugin([myGenre])` — from a wrapper plugin to
 *   emit only your own genre's CSS without re-emitting every built-in genre.
 */
export function genresPlugin(genres = GENRES) {
  const rules = {}
  for (const genre of genres) {
    const slug    = genreSlug(genre.name)
    const isOps   = slug === 'ops'
    const htmlSel = isOps ? 'html' : `html[data-genre="${slug}"]`

    if (genre.styles) {
      // Rewrite every html-level rule so element-scoped structural tokens are
      // emitted on the component (see ELEMENT_SCOPED_TOKENS). This covers the
      // genre's own html[data-genre] rule and the plain `html` rule a
      // defineGenre() child inherits from Ops. Built into a fresh object so the
      // imported genre module is never mutated, and so the element rules land
      // right after their html rule in source order.
      const styles = {}
      for (const [sel, decl] of Object.entries(genre.styles)) {
        const m = /^html(\[data-genre="[^"]+"\])?$/.exec(sel)
        if (m && decl && typeof decl === 'object') {
          const { kept, scoped } = scopeToElements(decl, m[1] ? sel : null)
          styles[sel] = kept
          for (const [s, d] of Object.entries(scoped)) styles[s] = { ...(styles[s] || {}), ...d }
        } else {
          styles[sel] = decl
        }
      }
      mergeRules(rules, styles)
    }

    // Compile genre.tokens into the html[data-genre] CSS rule so that
    // data-genre="cyberpunk" (or any future genre) activates the complete
    // visual identity — colors, motion, font — purely via CSS, with no JS.
    // The genre builder's inline setProperty() still overrides these at runtime.
    // The rule is created here when the genre has no structural styles of its
    // own (a tokens-only defineGenre() call is the simplest custom genre and
    // used to compile to nothing). The default Ops genre is the exception: it
    // has no data-genre scope — its tokens live on :root via tokens.js.
    if (genre.tokens && !isOps) {
      const publicTokens = Object.fromEntries(
        Object.entries(genre.tokens).filter(([k]) => !DOCS_ONLY_TOKENS.has(k))
      )
      // tokens go first so structural styles always take precedence on any overlap
      rules[htmlSel] = { ...publicTokens, ...(rules[htmlSel] || {}) }
    }
  }
  return rules
}
