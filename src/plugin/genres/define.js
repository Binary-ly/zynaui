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
 *
 * ── Build-time vs runtime ───────────────────────────────────────────────────
 * genresPlugin() compiles genre CSS when Tailwind runs. registerGenre() in
 * app code executed *after* the build cannot add CSS — for the data-genre
 * rules to exist, the genre must be compiled by a module your Tailwind build
 * evaluates. The self-contained way is a tiny wrapper plugin that emits just
 * your genre: `addBase(genresPlugin([aurora]))` — no registry sharing needed.
 * (registerGenre() before the zynaui plugin runs also works when both modules
 * load through the same loader, but the explicit list is the reliable path.)
 *
 * A `styles` block is optional: a tokens-only genre compiles to a complete
 * html[data-genre="…"] rule carrying its tokens.
 */
import ops from './ops.js'
import { GENRES, genreSlug } from './index.js'

// Genre names become `html[data-genre="<slug>"]` selectors via genreSlug()
// (trim, lowercase, whitespace → hyphen — the same rule the docs genre builder
// uses, so a builder export named "My Genre" activates as "my-genre"). Anything
// the slug rule cannot make selector-safe (quotes, brackets, symbols) would
// silently produce a selector that can never match, so reject it up front.
function assertValidName(name) {
  const slug = genreSlug(name)
  if (!/^[a-z][a-z0-9_-]*$/.test(slug)) {
    throw new Error(
      `[zynaui] Invalid genre name "${name}" — it is slugified (lowercased, ` +
      `whitespace → "-") into a data-genre attribute value, which must match ` +
      `/^[a-z][a-z0-9_-]*$/ (letters, digits, hyphens, underscores — no quotes or symbols).`
    )
  }
  return slug
}

// Rewrites inherited selectors from the base genre's data-genre scope to the
// new genre's — without this, a genre extending e.g. cyberpunk inherits rules
// keyed 'html[data-genre="cyberpunk"]' that can never match its own attribute
// value (dead weight), or leak cyberpunk styling when both genres coexist.
// Recurses so selectors nested inside @media blocks are remapped too.
function remapSelectors(styles, fromSlug, toSlug) {
  const fromToken = `[data-genre="${fromSlug}"]`
  const toToken   = `[data-genre="${toSlug}"]`
  const out = {}
  for (const [key, value] of Object.entries(styles)) {
    const newKey = key.includes(fromToken) ? key.split(fromToken).join(toToken) : key
    out[newKey] = (value && typeof value === 'object' && !Array.isArray(value))
      ? remapSelectors(value, fromSlug, toSlug)
      : value
  }
  return out
}

export function defineGenre({ name, palette = {}, tokens = {}, styles = {}, extends: base }) {
  const slug      = assertValidName(name)
  const baseGenre = base ?? ops
  // Ops's structural rules are global (html / :root) and inherit as-is — the
  // deep merge in genresPlugin() collapses them back into one rule. Non-Ops
  // bases get their data-genre-scoped selectors remapped to this genre.
  const inheritedStyles = baseGenre === ops
    ? { ...baseGenre.styles }
    : remapSelectors(baseGenre.styles ?? {}, genreSlug(baseGenre.name), slug)
  return {
    name,
    swatches: { ...baseGenre.swatches, ...palette },
    tokens:   { ...baseGenre.tokens,   ...tokens  },
    styles:   { ...inheritedStyles,    ...styles  },
  }
}

export function registerGenre(genre) {
  assertValidName(genre.name)
  if (!GENRES.find(g => g.name === genre.name)) {
    GENRES.push(genre)
  }
}
