import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import zynaPlugin from '../../src/plugin/index.js'

export async function generateCSS(contentClasses, pluginOptions = {}, configOverrides = {}) {
  const result = await postcss(
    tailwindcss({
      corePlugins: false,
      content: [{ raw: contentClasses }],
      plugins: [zynaPlugin],
      ...configOverrides,
    })
  ).process('@tailwind base; @tailwind components; @tailwind utilities;', {
    from: undefined,
  })
  return result.css
}

export function normalizeCss(str) {
  return str.replace(/\s+/g, ' ').replace(/\s*([{};:,])\s*/g, '$1').trim()
}
