import type { PluginCreator, Config } from 'tailwindcss/types/config'

/**
 * Zyna UI — Tailwind CSS plugin
 *
 * @example Tailwind v3
 * ```js
 * // tailwind.config.js
 * module.exports = {
 *   plugins: [require('zynaui')],
 * }
 * ```
 *
 * @example Tailwind v4
 * ```css
 * @import "tailwindcss";
 * @plugin "zynaui";
 * ```
 */
declare const zynaPlugin: {
  handler: PluginCreator
  config?: Partial<Config>
}

export = zynaPlugin
