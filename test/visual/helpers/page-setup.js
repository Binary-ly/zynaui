import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { injectFonts } from './fonts.js'

const CSS_PATH = resolve(fileURLToPath(new URL('../../../dist/zynaui.css', import.meta.url)))

const FREEZE_CSS = `
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-delay: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    transition-delay: 0ms !important;
  }
`

// Returns the fixture locator (element-scoped screenshot target)
export async function setupPage(page, genre, bodyHTML) {
  const attr = genre.dataGenre ? ` data-genre="${genre.dataGenre}"` : ''

  await page.emulateMedia({ colorScheme: genre.colorScheme })
  // font-family is pinned to the bundled DM Mono: since dist/zynaui.css no
  // longer ships preflight, un-styled text inherits the UA default font,
  // whose metrics drift across OS releases — 0-threshold snapshots must not
  // depend on system fonts. Components that set their own font are unaffected.
  await page.setContent(`<!DOCTYPE html>
    <html lang="en"${attr}>
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0">
      <div id="vr" style="padding:32px;display:inline-flex;flex-direction:column;gap:16px;background:var(--z-surface-page);font-family:'DM Mono',monospace">
        ${bodyHTML}
      </div>
    </body></html>`)

  await page.addStyleTag({ path: CSS_PATH })
  await page.addStyleTag({ content: FREEZE_CSS })
  await injectFonts(page)
  await page.waitForFunction(() => document.fonts.ready)
  return page.locator('#vr')
}
