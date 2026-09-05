/**
 * Zyna UI — Genre API
 *
 * Genres are visual paradigms that change the entire aesthetic of all ZynaUI
 * components at once — colors, motion curves, typography, and clip-path geometry.
 *
 * Nine genres are built in: Ops (default), Cyberpunk, Corporate, Phosphor,
 * Military, Blueprint, Washi, Laboratory, and Atelier. Use `defineGenre` to
 * create custom genres, `genresPlugin([...])` to compile them from a Tailwind
 * wrapper plugin, and `registerGenre` to add them to the GENRES registry for
 * runtime switchers and the genre builder.
 *
 * @example
 * ```ts
 * import { defineGenre } from 'zynaui/genres'
 *
 * export const aurora = defineGenre({
 *   name: 'Aurora',                       // activates via <html data-genre="aurora">
 *   palette: { brand: '#BF5FFF' },
 *   tokens: {                             // a tokens-only genre is complete on its own
 *     '--zyna':            '#BF5FFF',
 *     '--z-ease-enter':    'cubic-bezier(0.34, 1.56, 0.64, 1)',
 *     '--z-duration-fast': '0.14s',
 *   },
 *   styles: {                             // optional structural overrides
 *     'html[data-genre="aurora"]': {
 *       '--z-btn-clip':   'inset(0)',
 *       '--z-badge-clip': 'inset(0 round 4px)',
 *     },
 *   },
 * })
 * ```
 */

/** A colour-swatch preview map for the genre switcher UI. */
export type GenreSwatches = Record<string, string>

/** CSS custom property overrides (colors, motion, font). */
export type GenreTokens = Record<string, string>

/**
 * Structural CSS rules scoped to element selectors.
 * Use `html[data-genre="your-genre"]` at specificity [0,1,1] to override
 * the Ops defaults on `html` at [0,0,1].
 */
export type GenreStyles = Record<string, Record<string, string>>

/** A fully resolved genre object. */
export interface Genre {
  name: string
  swatches: GenreSwatches
  tokens: GenreTokens
  styles: GenreStyles
}

/** Options for constructing a new genre via `defineGenre`. */
export interface DefineGenreOptions {
  /**
   * Display name (e.g. 'Aurora' or 'My Genre'). Its slug — see {@link genreSlug} —
   * is the `data-genre` attribute value ('aurora', 'my-genre').
   */
  name: string
  /** Override specific swatch preview colors. Merged onto base genre swatches. */
  palette?: GenreSwatches
  /**
   * Global CSS custom property overrides (colors, motion, font).
   * These are set on `:root` / `html` and are readable by the genre builder.
   * Merged onto base genre tokens.
   */
  tokens?: GenreTokens
  /**
   * Structural component CSS rules.
   * These are compiled into `zynaui.css` and activated by the `data-genre` attribute.
   * Merged onto base genre styles.
   */
  styles?: GenreStyles
  /** Base genre to extend. Defaults to the built-in Ops genre. */
  extends?: Genre
}

/**
 * Create a custom genre by merging overrides onto a base genre (default: Ops).
 *
 * The returned object is compatible with `registerGenre()` and the genre builder's
 * `applyGenre()` function.
 */
export declare function defineGenre(options: DefineGenreOptions): Genre

/**
 * Add a custom genre to the GENRES registry.
 *
 * **Note**: `registerGenre` mutates the in-memory GENRES array at runtime.
 * It does NOT affect the compiled CSS — genre styles are baked into `zynaui.css`
 * at Tailwind build time. To compile a custom genre, emit it from a wrapper
 * plugin with `genresPlugin([myGenre])` (see below); `registerGenre` is for
 * runtime switchers and the genre builder, which read GENRES.
 */
export declare function registerGenre(genre: Genre): void

/** All registered genres (built-in + any added via `registerGenre`). */
export declare const GENRES: Genre[]

/**
 * The `data-genre` attribute value for a genre name: trimmed, lowercased,
 * whitespace collapsed to hyphens ('My Genre' → 'my-genre'). The compiler,
 * `defineGenre`, and runtime switchers all use this one rule.
 */
export declare function genreSlug(name: string): string

/**
 * Compile genres into a Tailwind `addBase`-compatible rule object.
 *
 * With no argument, every genre in the GENRES registry is compiled (this is
 * what the zynaui plugin itself does). Pass an explicit list from a wrapper
 * plugin to compile only your own genres without re-emitting the built-ins:
 *
 * @example
 * ```ts
 * import plugin from 'tailwindcss/plugin'
 * import { genresPlugin } from 'zynaui/genres'
 * import myGenre from './my-genre.genre.js'
 *
 * export default plugin(({ addBase }) => {
 *   addBase(genresPlugin([myGenre]))
 * })
 * ```
 */
export declare function genresPlugin(genres?: Genre[]): Record<string, Record<string, string>>
