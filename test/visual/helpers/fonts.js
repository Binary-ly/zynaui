import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const FONTS_DIR = fileURLToPath(new URL('../__fonts__', import.meta.url))
const FONT_FACES = [
  { family: 'VT323',           file: 'vt323.woff2' },
  { family: 'Share Tech Mono', file: 'share-tech-mono.woff2' },
  { family: 'DM Mono',         file: 'dm-mono.woff2' },
]

export async function injectFonts(page) {
  const css = FONT_FACES
    .filter(({ file }) => existsSync(resolve(FONTS_DIR, file)))
    .map(({ family, file }) => {
      const b64 = readFileSync(resolve(FONTS_DIR, file)).toString('base64')
      return `@font-face {
        font-family: '${family}';
        src: url('data:font/woff2;base64,${b64}') format('woff2');
        font-display: block;
      }`
    }).join('\n')

  if (css) await page.addStyleTag({ content: css })
}
