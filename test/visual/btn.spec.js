import { test, expect } from '@playwright/test'
import { setupPage } from './helpers/page-setup.js'
import { GENRES } from './helpers/genre.js'

const GENRE_CLIP = {
  ops:        /polygon/,
  cyberpunk:  /inset/,
  corporate:  /polygon/,
  phosphor:   /polygon/,
  military:   /polygon/,
  blueprint:  /polygon/,
  washi:      /polygon/,
  laboratory: /polygon/,
  atelier:    /polygon/,
}

// Genre-default chamfer depth in px for the default size — --z-btn-corner.
// The size classes must move it (sm = --z-corner-sm 7px, lg = --z-corner-lg
// 13px); before 0.3.1 the clip was frozen at html's 10px in every genre.
const GENRE_CORNER = {
  ops: 10, corporate: 10, phosphor: 14, military: 10,
  blueprint: 10, washi: 11, laboratory: 10, atelier: 10,
}

for (const genre of GENRES) {
  test.describe(`btn / ${genre.id}`, () => {

    test('color variants', async ({ page }) => {
      const el = await setupPage(page, genre, `
        <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">
          <button class="btn" type="button">Base</button>
          <button class="btn btn-primary" type="button">Primary</button>
          <button class="btn btn-secondary" type="button">Secondary</button>
          <button class="btn btn-ghost" type="button">Ghost</button>
          <button class="btn btn-danger" type="button">Danger</button>
        </div>`)
      await expect(el).toHaveScreenshot(`btn-variants-${genre.id}.png`)
    })

    test('size variants', async ({ page }) => {
      const el = await setupPage(page, genre, `
        <div style="display:flex;gap:12px;align-items:center">
          <button class="btn btn-primary btn-sm" type="button">Sm</button>
          <button class="btn btn-primary" type="button">Default</button>
          <button class="btn btn-primary btn-lg" type="button">Lg</button>
          <button class="btn btn-primary btn-icon" type="button" aria-label="star">★</button>
        </div>`)
      await expect(el).toHaveScreenshot(`btn-sizes-${genre.id}.png`)
    })

    test('shape modifiers', async ({ page }) => {
      const el = await setupPage(page, genre, `
        <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">
          <button class="btn btn-primary btn-cut" type="button">Cut</button>
          <button class="btn btn-primary btn-bevel" type="button">Bevel</button>
          <button class="btn btn-primary btn-round" type="button">Round</button>
          <button class="btn btn-primary btn-square" type="button">Square</button>
        </div>`)
      await expect(el).toHaveScreenshot(`btn-shapes-${genre.id}.png`)
    })

    test('hover state', async ({ page }) => {
      const el = await setupPage(page, genre, `<button class="btn btn-primary" type="button">Hover</button>`)
      await page.hover('.btn')
      await expect(el).toHaveScreenshot(`btn-hover-${genre.id}.png`)
    })

    test('focus-visible state', async ({ page }) => {
      const el = await setupPage(page, genre, `<button class="btn btn-primary" type="button">Focus</button>`)
      await page.keyboard.press('Tab')
      await expect(el).toHaveScreenshot(`btn-focus-${genre.id}.png`)
    })

    test('disabled states', async ({ page }) => {
      const el = await setupPage(page, genre, `
        <div style="display:flex;gap:12px">
          <button class="btn btn-primary" type="button" disabled>disabled</button>
          <button class="btn btn-primary" type="button" aria-disabled="true">aria-disabled</button>
        </div>`)
      await expect(el).toHaveScreenshot(`btn-disabled-${genre.id}.png`)
    })

    test('clip-path matches genre default shape', async ({ page }) => {
      await setupPage(page, genre, `<button class="btn btn-primary" type="button">Shape</button>`)
      const clip = await page.evaluate(() =>
        getComputedStyle(document.querySelector('.btn')).clipPath)
      expect(clip).toMatch(GENRE_CLIP[genre.id])
    })

    test('size classes change the chamfer depth of the genre shape', async ({ page }) => {
      test.skip(genre.id === 'cyberpunk', 'Cyberpunk buttons are rectangular (inset) — no chamfer to scale')
      await setupPage(page, genre, `
        <button class="btn btn-primary btn-sm" type="button">Sm</button>
        <button class="btn btn-primary" type="button">Default</button>
        <button class="btn btn-primary btn-lg" type="button">Lg</button>`)
      const clips = await page.evaluate(() =>
        [...document.querySelectorAll('.btn')].map(b => getComputedStyle(b).clipPath))
      const corner = GENRE_CORNER[genre.id]
      expect(clips[0]).toContain('7px')
      expect(clips[0]).not.toContain(`${corner}px`)
      expect(clips[1]).toContain(`${corner}px`)
      expect(clips[2]).toContain('13px')
    })
  })
}
