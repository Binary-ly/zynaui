import type { PluginCreator, Config } from 'tailwindcss/types/config'

/**
 * Configuration options for the Zyna UI Tailwind plugin.
 */
export interface ZynaUIOptions {
  /**
   * Prefix string prepended to every ZynaUI component class name.
   *
   * Use this when another CSS library in your project already defines
   * `.btn`, `.card`, `.badge`, or `.alert`.
   *
   * @example
   * // tailwind.config.js (v3)
   * plugins: [require('zynaui')({ prefix: 'z-' })]
   * // → .z-btn, .z-btn-primary, .z-card, .z-badge, .z-alert …
   *
   * @example
   * // app.css (v4)
   * @plugin "zynaui" {
   *   prefix: z-;
   * }
   *
   * @default ''
   */
  prefix?: string
}

// ─── Public CSS Variable API — locked from v0.2.0 ────────────────────────────
//
// These are the CSS custom properties that form the stable public API surface
// of ZynaUI. They will not be renamed, removed, or have their meaning changed
// without a major version bump.
//
// Full reference: docs/css-api.md
// Semver policy:  rename/remove = major bump; add new = minor; bug-fix value = patch

/**
 * Brand tokens — the primary brand color pair.
 * Override `--zyna` by setting `colors.zyna.DEFAULT` in your Tailwind config.
 */
export type ZynaBrandToken =
  | '--zyna'
  | '--zyna-dark'

/**
 * Shape tokens — global corner radius scale.
 * Components reference these via `--btn-corner`, `--badge-offset`, etc.
 */
export type ZynaShapeToken =
  | '--z-corner-sm'
  | '--z-corner'
  | '--z-corner-lg'
  | '--z-corner-xl'

/**
 * Motion tokens — animation durations and easing curves.
 * Genres override all of these to express their unique pacing character.
 * Override on `:root` or a scoped selector to adjust timing globally.
 */
export type ZynaMotionToken =
  | '--z-duration-fast'
  | '--z-duration-base'
  | '--z-duration-slow'
  | '--z-duration-pulse'
  | '--z-ease-enter'
  | '--z-ease-exit'
  | '--z-ease-spring'
  | '--z-ease'
  | '--z-ease-snap'
  | '--z-ease-out'

/**
 * Typography token — monospace font stack used by all ZynaUI components.
 * Override to set your project's mono font across buttons, badges, cards, and alerts.
 */
export type ZynaTypographyToken =
  | '--z-font-mono'

/**
 * Color tokens — semantic text, status, border, and overlay colors.
 * All components consume these; genres override them to establish their palette.
 */
export type ZynaColorToken =
  | '--z-color-text'
  | '--z-color-text-muted'
  | '--z-color-text-dim'
  | '--z-color-text-solid'
  | '--z-color-text-inverse'
  | '--z-color-success'
  | '--z-color-danger'
  | '--z-color-warning'
  | '--z-color-info'
  | '--z-color-border'
  | '--z-color-border-dim'
  | '--z-color-overlay'

/**
 * Surface tokens — page background, inset fills, card gradients, and shadows.
 * Components fall back to these when no element-level token is set.
 */
export type ZynaSurfaceToken =
  | '--z-surface-page'
  | '--z-surface-inset'
  | '--z-surface-inset-hover'
  | '--z-surface-inset-danger'
  | '--z-surface-inset-danger-hover'
  | '--z-surface-card'
  | '--z-surface-card-deep'
  | '--z-shadow-card'
  | '--z-shadow-card-deep'

/**
 * Button component tokens — set on `.btn-*` variant classes or your own custom class.
 *
 * @example
 * ```css
 * .btn-plasma {
 *   --btn-bg:           rgba(139, 0, 255, 0.38);
 *   --btn-color:        #BF5FFF;
 *   --btn-hover-filter: drop-shadow(0 0 22px rgba(139,0,255,1)) brightness(1.10);
 * }
 * ```
 */
export type ZynaButtonToken =
  | '--btn-bg'
  | '--btn-color'
  | '--btn-filter'
  | '--btn-scan-color'
  | '--btn-hover-bg'
  | '--btn-hover-color'
  | '--btn-hover-filter'
  | '--btn-hover-text-shadow'
  | '--btn-active-filter'
  | '--btn-focus-color'
  | '--btn-corner'
  | '--btn-interior'
  | '--btn-hover-interior'
  | '--btn-inner-clip'

/**
 * Badge component tokens — set on `.badge-*` variant classes or your own custom class.
 *
 * @example
 * ```css
 * .badge-plasma {
 *   --badge-bg:    rgba(139, 0, 255, 0.10);
 *   --badge-color: #BF5FFF;
 *   --badge-glow:  drop-shadow(0 0 5px rgba(139,0,255,0.45));
 * }
 * ```
 */
export type ZynaBadgeToken =
  | '--badge-bg'
  | '--badge-color'
  | '--badge-glow'
  | '--badge-scan-color'
  | '--badge-dot-size'
  | '--badge-interior'
  | '--badge-offset'
  | '--badge-inner-clip'

/**
 * Card component tokens — set on `.card-*` variant classes or your own custom class.
 *
 * @example
 * ```css
 * .card-ember {
 *   --card-gradient:      linear-gradient(145deg, #1a0800 0%, #0d0400 100%);
 *   --card-border-color:  rgba(255, 80, 0, 0.22);
 *   --card-bar-gradient:  linear-gradient(90deg, transparent, rgba(255,80,0,0.6), transparent);
 *   --card-glow-lo:       rgba(255, 80, 0, 0.10);
 *   --card-glow-hi:       rgba(255, 80, 0, 0.28);
 *   --card-animation:     zyna-card-pulse 4s ease-in-out infinite;
 * }
 * ```
 */
export type ZynaCardToken =
  | '--card-gradient'
  | '--card-border-color'
  | '--card-shadow'
  | '--card-bracket-color'
  | '--card-bracket-size'
  | '--card-bracket-stroke'
  | '--card-bar-gradient'
  | '--card-bar-shadow'
  | '--card-animation'
  | '--card-glow-lo'
  | '--card-glow-hi'
  | '--card-header-border'
  | '--card-header-bg'
  | '--card-header-color'
  | '--card-header-dot-color'
  | '--card-header-dot-shadow'
  | '--card-header-text-shadow'
  | '--card-title-text-shadow'

/**
 * Alert component tokens — set on `.alert-*` variant classes or your own custom class.
 *
 * @example
 * ```css
 * .alert-plasma {
 *   --alert-bar-color: #BF5FFF;
 *   --alert-bg:        rgba(139, 0, 255, 0.055);
 *   --alert-color:     rgba(191, 95, 255, 0.88);
 *   --alert-shadow:    0 0 30px rgba(139,0,255,0.08), inset 4px 0 18px rgba(139,0,255,0.05);
 * }
 * ```
 */
export type ZynaAlertToken =
  | '--alert-bar-color'
  | '--alert-bg'
  | '--alert-color'
  | '--alert-shadow'
  | '--alert-title-shadow'

/**
 * Union of all 83 public CSS custom properties in ZynaUI's stable API surface.
 *
 * These tokens are guaranteed not to be renamed or removed without a major version bump.
 * Use them freely in your stylesheets and component overrides.
 *
 * Full reference and semver policy: docs/css-api.md
 *
 * @since v0.2.0
 */
export type ZynaPublicToken =
  | ZynaBrandToken
  | ZynaShapeToken
  | ZynaMotionToken
  | ZynaTypographyToken
  | ZynaColorToken
  | ZynaSurfaceToken
  | ZynaButtonToken
  | ZynaBadgeToken
  | ZynaCardToken
  | ZynaAlertToken

/**
 * Zyna UI — Tailwind CSS plugin (created via `plugin.withOptions`).
 *
 * Call with options to configure, or pass directly to the plugins array for defaults.
 *
 * @example Tailwind v3 — no options
 * ```js
 * // tailwind.config.js
 * module.exports = {
 *   plugins: [require('zynaui')],
 * }
 * ```
 *
 * @example Tailwind v3 — with prefix
 * ```js
 * module.exports = {
 *   plugins: [require('zynaui')({ prefix: 'z-' })],
 * }
 * ```
 *
 * @example Tailwind v4
 * ```css
 * @import "tailwindcss";
 * @plugin "zynaui";
 * ```
 *
 * @example Tailwind v4 — with prefix
 * ```css
 * @import "tailwindcss";
 * @plugin "zynaui" {
 *   prefix: z-;
 * }
 * ```
 */
declare function zynaPlugin(options?: ZynaUIOptions): { handler: PluginCreator; config?: Partial<Config> }

export = zynaPlugin
