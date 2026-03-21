import { test, expect } from '@playwright/test'
import { setupPage } from './helpers/page-setup.js'
import { GENRES } from './helpers/genre.js'

// The bar ::before is position:absolute. Each genre anchors it to a different edge.
// We assert the anchored edge property is '0px' (not auto/unset).
// Source: --z-alert-bar-inset values: ops=left, cyberpunk=top, corporate=left, phosphor=right, military=bottom
const GENRE_BAR_EDGE = {
  ops:       'left',
  cyberpunk: 'top',
  corporate: 'left',
  phosphor:  'right',
  military:  'bottom',
}

for (const genre of GENRES) {
  test.describe(`alert / ${genre.id}`, () => {

    test('semantic variants', async ({ page }) => {
      const el = await setupPage(page, genre, `
        <div style="display:flex;flex-direction:column;gap:10px;width:360px">
          <div class="alert alert-success"><span class="alert-title">Success</span> Operation completed.</div>
          <div class="alert alert-danger"><span class="alert-title">Error</span> Something went wrong.</div>
          <div class="alert alert-warning"><span class="alert-title">Warning</span> Proceed with caution.</div>
          <div class="alert alert-info"><span class="alert-title">Info</span> For your information.</div>
          <div class="alert alert-neutral"><span class="alert-title">Neutral</span> Neutral message.</div>
          <div class="alert alert-dark"><span class="alert-title">Dark</span> Dark surface.</div>
        </div>`)
      await expect(el).toHaveScreenshot(`alert-variants-${genre.id}.png`)
    })

    test('size variants', async ({ page }) => {
      const el = await setupPage(page, genre, `
        <div style="display:flex;flex-direction:column;gap:10px;width:360px">
          <div class="alert alert-info alert-sm"><span class="alert-title">Small</span> Compact alert.</div>
          <div class="alert alert-info"><span class="alert-title">Default</span> Standard alert.</div>
          <div class="alert alert-info alert-lg"><span class="alert-title">Large</span> Large alert.</div>
        </div>`)
      await expect(el).toHaveScreenshot(`alert-sizes-${genre.id}.png`)
    })

    test('shape variants', async ({ page }) => {
      const el = await setupPage(page, genre, `
        <div style="display:flex;flex-direction:column;gap:10px;width:360px">
          <div class="alert alert-success alert-square"><span class="alert-title">Square</span> No radius.</div>
          <div class="alert alert-success alert-round"><span class="alert-title">Round</span> Rounded.</div>
        </div>`)
      await expect(el).toHaveScreenshot(`alert-shapes-${genre.id}.png`)
    })

    test('alert-icon sub-element', async ({ page }) => {
      const el = await setupPage(page, genre, `
        <div style="display:flex;flex-direction:column;gap:10px;width:360px">
          <div class="alert alert-success">
            <span class="alert-icon">✓</span>
            <span class="alert-title">With Icon</span> Status confirmed.
          </div>
        </div>`)
      await expect(el).toHaveScreenshot(`alert-icon-${genre.id}.png`)
    })

    test('bar anchored to correct edge for genre', async ({ page }) => {
      await setupPage(page, genre, `
        <div class="alert alert-info" style="width:360px">
          <span class="alert-title">Bar Position</span> Test.
        </div>`)
      const edge = GENRE_BAR_EDGE[genre.id]
      const value = await page.evaluate((prop) => {
        const alert = document.querySelector('.alert')
        return getComputedStyle(alert, '::before')[prop]
      }, edge)
      expect(value).toBe('0px')
    })
  })
}
