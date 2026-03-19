import postcss from 'postcss'
import tailwindcss from '@tailwindcss/postcss'
import { fileURLToPath } from 'url'
import { resolve } from 'path'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const pluginPath = resolve(__dirname, '../../src/plugin/index.js')

/** Generate full CSS output from the plugin with no options (addBase — always emitted). */
export async function generateCSS(_contentClasses) {
  const css = `
@import "tailwindcss" source(none);
@plugin "${pluginPath}";
`
  const result = await postcss([tailwindcss()]).process(css, {
    from: resolve(__dirname, 'input.css'),
  })
  return result.css
}

/**
 * Generate CSS with a class prefix option passed through Tailwind v4's
 * @plugin options block.  e.g. generateCSSWithPrefix('z-') →
 *   @plugin "…" { prefix: z-; }
 */
export async function generateCSSWithPrefix(prefix) {
  const pluginBlock = prefix
    ? `@plugin "${pluginPath}" {\n  prefix: ${prefix};\n}`
    : `@plugin "${pluginPath}";`
  const css = `@import "tailwindcss" source(none);\n${pluginBlock}`
  const result = await postcss([tailwindcss()]).process(css, {
    from: resolve(__dirname, 'input.css'),
  })
  return result.css
}

/**
 * Return the plugin instance created by calling zynaui(options).
 * Useful for inspecting plugin.config without running the full Tailwind pipeline.
 */
export async function getPluginInstance(options = {}) {
  const mod = await import('../../src/plugin/index.js')
  return mod.default(options)
}

export function normalizeCss(str) {
  return str.replace(/\s+/g, ' ').replace(/\s*([{};:,])\s*/g, '$1').trim()
}
