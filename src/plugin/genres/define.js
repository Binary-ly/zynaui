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
 * rules to exist, registration must happen in a module evaluated by your
 * Tailwind config (e.g. a small plugin file imported from tailwind.config.js
 * or the CSS @plugin entry) before the zynaui plugin executes.
 */
import ops from './ops.js'
import { GENRES } from './index.js'

// Genre names become `html[data-genre="<slug>"]` selectors and the plugin
// derives the slug with name.toLowerCase() — anything with whitespace or
// quotes silently produces a selector that can never match.
function assertValidName(name) {
  const slug = String(name).toLowerCase()
  if (!/^[a-z][a-z0-9_-]*$/.test(slug)) {
    throw new Error(
      `[zynaui] Invalid genre name "${name}" — the lowercased name is used as a ` +
      `data-genre attribute value, so it must match /^[a-z][a-z0-9_-]*$/i ` +
      `(letters, digits, hyphens, underscores — no spaces or quotes).`
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
    : remapSelectors(baseGenre.styles ?? {}, String(baseGenre.name).toLowerCase(), slug)
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
