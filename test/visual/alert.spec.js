import { test, expect } from '@playwright/test'
import { setupPage } from './helpers/page-setup.js'
import { GENRES } from './helpers/genre.js'

// The bar ::before is position:absolute. Each genre anchors it to a different edge.
// We assert the anchored edge property is '0px' (not auto/unset).
// Source: --z-alert-bar-inset values: ops=left, cyberpunk=top, corporate=left,
// phosphor=right, military=bottom, blueprint=left (partial height), washi=left,
// laboratory=top, atelier=right (partial height)
const GENRE_BAR_EDGE = {
  ops:        'left',
  cyberpunk:  'top',
  corporate:  'left',
  phosphor:   'right',
  military:   'bottom',
  blueprint:  'left',
  washi:      'left',
  laboratory: 'top',
  atelier:    'right',
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

    test('the accent bar paints the variant colour, not the initial grey', async ({ page }) => {
      // The bar is a ::before painting var(--alert-bar-color). Registered with
      // inherits:false, that resolved to its initial-value on the pseudo-element,
      // so every variant in every genre drew the same white 10% bar while the
      // glow around it carried the right colour.
      await setupPage(page, genre, `
        <div class="alert alert-success" style="width:320px">Success.</div>
        <div class="alert alert-danger" style="width:320px">Danger.</div>`)
      const seen = await page.evaluate(() =>
        [...document.querySelectorAll('.alert')].map(a => ({
          want: getComputedStyle(a).getPropertyValue('--alert-bar-color').trim(),
          got:  getComputedStyle(a, '::before').backgroundColor,
        })))
      for (const { want, got } of seen) {
        expect(got).not.toBe('rgba(255, 255, 255, 0.1)')
        expect(got).toBe(want)
      }
      expect(seen[0].got).not.toBe(seen[1].got)
    })

    test('alert-round keeps a visible indicator ring', async ({ page }) => {
      // The round shape replaces the bar with an inset ring built from
      // --z-alert-bar-width. Laboratory and Atelier set that to 0 (their bar
      // was not on the left) and lost the ring entirely.
      await setupPage(page, genre, `<div class="alert alert-success alert-round" style="width:320px">Round.</div>`)
      const shadow = await page.evaluate(() => getComputedStyle(document.querySelector('.alert')).boxShadow)
      expect(shadow).toMatch(/inset/)
      expect(shadow).not.toMatch(/0px 0px 0px 0px inset/)
    })
  })
}
