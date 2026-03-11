import postcss from 'postcss'
import tailwindcss from '@tailwindcss/postcss'
import { fileURLToPath } from 'url'
import { resolve } from 'path'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const pluginPath = resolve(__dirname, '../../src/plugin/index.js')

export async function generateCSS(contentClasses) {
  const css = `
@import "tailwindcss" source(none);
@plugin "${pluginPath}";
`
  const result = await postcss([tailwindcss()]).process(css, {
    from: resolve(__dirname, 'input.css'),
  })
  return result.css
}

export function normalizeCss(str) {
  return str.replace(/\s+/g, ' ').replace(/\s*([{};:,])\s*/g, '$1').trim()
}
