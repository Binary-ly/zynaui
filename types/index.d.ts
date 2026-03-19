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
