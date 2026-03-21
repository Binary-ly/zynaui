import { test, expect } from '@playwright/test'
import { setupPage } from './helpers/page-setup.js'
import { GENRES } from './helpers/genre.js'

const CARD_HTML = `
  <div class="card" style="width:320px">
    <div class="card-header">
      <span class="card-title">System Status</span>
      <span class="badge badge-success badge-sm">Online</span>
    </div>
    <div class="card-body">
      <p class="card-subtitle">All systems operational</p>
      <p>Node uptime: 99.98% — Latency: 12ms</p>
    </div>
    <div class="card-footer">
      <button class="btn btn-primary btn-sm" type="button">Details</button>
    </div>
  </div>`

for (const genre of GENRES) {
  test.describe(`card / ${genre.id}`, () => {

    test('base card with all sub-elements', async ({ page }) => {
      const el = await setupPage(page, genre, CARD_HTML)
      await expect(el).toHaveScreenshot(`card-base-${genre.id}.png`)
    })

    test('card-dark variant', async ({ page }) => {
      const el = await setupPage(page, genre, `
        <div class="card card-dark" style="width:320px">
          <div class="card-header"><span class="card-title">Dark Mode</span></div>
          <div class="card-body"><p>Elevated dark surface</p></div>
        </div>`)
      await expect(el).toHaveScreenshot(`card-dark-${genre.id}.png`)
    })

    test('card-glow variant frozen', async ({ page }) => {
      const el = await setupPage(page, genre, `
        <div class="card card-glow" style="width:320px">
          <div class="card-header"><span class="card-title">Glow State</span></div>
          <div class="card-body"><p>Static glow — animation frozen</p></div>
        </div>`)
      await expect(el).toHaveScreenshot(`card-glow-${genre.id}.png`)
    })

    test('card-sm variant', async ({ page }) => {
      const el = await setupPage(page, genre, `
        <div class="card card-sm" style="width:280px">
          <div class="card-header"><span class="card-title">Compact</span></div>
          <div class="card-body"><p>Small card variant</p></div>
        </div>`)
      await expect(el).toHaveScreenshot(`card-sm-${genre.id}.png`)
    })

    test('card-round shape', async ({ page }) => {
      const el = await setupPage(page, genre, `
        <div class="card card-round" style="width:320px">
          <div class="card-body"><p>Rounded card</p></div>
        </div>`)
      await expect(el).toHaveScreenshot(`card-round-${genre.id}.png`)
    })

    test('card-bevel shape', async ({ page }) => {
      const el = await setupPage(page, genre, `
        <div class="card card-bevel" style="width:320px">
          <div class="card-body"><p>Beveled card</p></div>
        </div>`)
      await expect(el).toHaveScreenshot(`card-bevel-${genre.id}.png`)
    })

    test('L-bracket pseudo-element renders via linear-gradient', async ({ page }) => {
      await setupPage(page, genre, CARD_HTML)
      const bgImage = await page.evaluate(() => {
        const card = document.querySelector('.card')
        return getComputedStyle(card, '::before').backgroundImage
      })
      // L-bracket corner brackets are drawn with stacked linear-gradients
      expect(bgImage).toContain('linear-gradient')
    })
  })
}
