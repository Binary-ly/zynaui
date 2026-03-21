import { test, expect } from '@playwright/test'
import { setupPage } from './helpers/page-setup.js'
import { GENRES } from './helpers/genre.js'

const GENRE_CLIP = {
  ops:       /polygon/,
  cyberpunk: /polygon|inset/,
  corporate: /polygon|inset/,
  phosphor:  /polygon|inset/,
  military:  /polygon|inset/,
}

for (const genre of GENRES) {
  test.describe(`badge / ${genre.id}`, () => {

    test('color variants', async ({ page }) => {
      const el = await setupPage(page, genre, `
        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
          <span class="badge badge-primary">Primary</span>
          <span class="badge badge-secondary">Secondary</span>
          <span class="badge badge-success">Success</span>
          <span class="badge badge-danger">Danger</span>
          <span class="badge badge-warning">Warning</span>
          <span class="badge badge-info">Info</span>
          <span class="badge badge-neutral">Neutral</span>
          <span class="badge badge-outline">Outline</span>
        </div>`)
      await expect(el).toHaveScreenshot(`badge-variants-${genre.id}.png`)
    })

    test('size variants', async ({ page }) => {
      const el = await setupPage(page, genre, `
        <div style="display:flex;gap:10px;align-items:center">
          <span class="badge badge-primary badge-sm">Sm</span>
          <span class="badge badge-primary">Default</span>
          <span class="badge badge-primary badge-lg">Lg</span>
        </div>`)
      await expect(el).toHaveScreenshot(`badge-sizes-${genre.id}.png`)
    })

    test('shape variants', async ({ page }) => {
      const el = await setupPage(page, genre, `
        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
          <span class="badge badge-primary badge-slant">Slant</span>
          <span class="badge badge-primary badge-rect">Rect</span>
          <span class="badge badge-primary badge-pill">Pill</span>
          <span class="badge badge-primary badge-bevel">Bevel</span>
        </div>`)
      await expect(el).toHaveScreenshot(`badge-shapes-${genre.id}.png`)
    })

    test('pulse variant frozen at frame 0', async ({ page }) => {
      const el = await setupPage(page, genre, `
        <div style="display:flex;gap:10px;align-items:center">
          <span class="badge badge-success badge-pulse">Live</span>
          <span class="badge badge-danger badge-pulse">Alert</span>
        </div>`)
      await expect(el).toHaveScreenshot(`badge-pulse-${genre.id}.png`)
    })

    test('clip-path matches genre', async ({ page }) => {
      await setupPage(page, genre, `<span class="badge badge-primary">Test</span>`)
      const clip = await page.evaluate(() =>
        getComputedStyle(document.querySelector('.badge')).clipPath)
      expect(clip).toMatch(GENRE_CLIP[genre.id])
    })
  })
}
