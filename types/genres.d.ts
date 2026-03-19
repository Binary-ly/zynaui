/**
 * Zyna UI — Genre API
 *
 * Genres are visual paradigms that change the entire aesthetic of all ZynaUI
 * components at once — colors, motion curves, typography, and clip-path geometry.
 *
 * Two genres are built in: `ops` (military HUD, default) and `cyberpunk`.
 * Use `defineGenre` to create custom genres and `registerGenre` to add them
 * to the GENRES array for use with the genre builder.
 *
 * @example
 * ```ts
 * import { defineGenre, registerGenre } from 'zynaui/genres'
 *
 * const aurora = defineGenre({
 *   name: 'Aurora',
 *   palette: { brand: '#BF5FFF' },
 *   tokens: {
 *     '--zyna':            '#BF5FFF',
 *     '--z-ease-enter':    'cubic-bezier(0.34, 1.56, 0.64, 1)',
 *     '--z-duration-fast': '0.14s',
 *   },
 *   styles: {
 *     'html[data-genre="aurora"]': {
 *       '--z-btn-clip':   'inset(0)',
 *       '--z-badge-clip': 'inset(0 round 4px)',
 *     },
 *   },
 * })
 *
 * registerGenre(aurora)
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
  /** Display name (e.g. 'Aurora'). Used as the `data-genre` attribute value in lowercase. */
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
 * at Tailwind build time. To include a custom genre's structural styles in the
 * compiled output, import and register the genre in your Tailwind config before
 * the plugin runs.
 */
export declare function registerGenre(genre: Genre): void

/** All registered genres (built-in + any added via `registerGenre`). */
export declare const GENRES: Genre[]
