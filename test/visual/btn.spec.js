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

// Chamfer depth in px per size — --z-btn-corner-sm / --z-btn-corner / --z-btn-corner-lg.
// Ops maps sm/lg to the global --z-corner-sm (7px) / --z-corner-lg (13px);
// Phosphor and Washi cut deeper than the global scale by default, so they carry
// their own sm/lg depths — before that, their .btn-lg was shallower than .btn.
const GENRE_CORNER = {
  ops: [7, 10, 13], corporate: [7, 10, 13], phosphor: [10, 14, 18], military: [7, 10, 13],
  blueprint: [7, 10, 13], washi: [8, 11, 14], laboratory: [7, 10, 13], atelier: [7, 10, 13],
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

    // The icon button is deliberately not in this screenshot. Its side is one
    // line box plus padding, so its pixel size follows the resolved font — and
    // in the two genres whose bundled test font actually loads (Cyberpunk and
    // Military both use Share Tech Mono) the capture can land either side of
    // the font swap, which moved this snapshot on roughly half of all runs.
    // Its geometry is asserted numerically instead, in the test below.
    test('size variants', async ({ page }) => {
      const el = await setupPage(page, genre, `
        <div style="display:flex;gap:12px;align-items:center">
          <button class="btn btn-primary btn-sm" type="button">Sm</button>
          <button class="btn btn-primary" type="button">Default</button>
          <button class="btn btn-primary btn-lg" type="button">Lg</button>
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

    test('outlined variants paint their interior fill and their own scan colour', async ({ page }) => {
      // ::before reads var(--btn-interior) and ::after reads var(--btn-scan-color).
      // Registered with inherits:false, both resolved to their initial-value on
      // the pseudo-element (transparent / white 7%) instead of the button's own
      // value, so the outlined technique drew a flat translucent slab.
      await setupPage(page, genre, `<button class="btn btn-secondary" type="button">Secondary</button>`)
      const seen = await page.evaluate(() => {
        const b  = document.querySelector('.btn')
        const cs = getComputedStyle(b)
        return {
          interior:  cs.getPropertyValue('--btn-interior').trim(),
          painted:   getComputedStyle(b, '::before').backgroundColor,
          scan:      cs.getPropertyValue('--btn-scan-color').trim(),
          sweep:     getComputedStyle(b, '::after').backgroundImage,
        }
      })
      expect(seen.painted).not.toBe('rgba(0, 0, 0, 0)')
      expect(seen.painted).toBe(seen.interior)
      expect(seen.sweep).toContain(seen.scan)
    })

    test('icon buttons are square and match the height of their size row', async ({ page }) => {
      // .btn-icon relied on aspect-ratio, which the glyph's line box defeats:
      // the content height is an automatic minimum the ratio cannot shrink, and
      // it does not widen the box to match. Icon buttons came out taller than
      // wide, and a .btn-sm.btn-icon was taller than the .btn-sm beside it.
      await setupPage(page, genre, `
        <div style="display:flex;gap:12px;align-items:center">
          <button class="btn btn-primary btn-sm" type="button">Sm</button>
          <button class="btn btn-primary btn-sm btn-icon" type="button" aria-label="add">+</button>
          <button class="btn btn-primary" type="button">Default</button>
          <button class="btn btn-primary btn-icon" type="button" aria-label="add">+</button>
          <button class="btn btn-primary btn-lg" type="button">Lg</button>
          <button class="btn btn-primary btn-lg btn-icon" type="button" aria-label="add">+</button>
        </div>`)
      const box = await page.evaluate(() => [...document.querySelectorAll('.btn')].map(b => {
        const r = b.getBoundingClientRect()
        return { w: r.width, h: r.height }
      }))
      for (const i of [1, 3, 5]) {
        expect(Math.abs(box[i].w - box[i].h), `icon ${i} is ${box[i].w}×${box[i].h}`).toBeLessThan(0.5)
      }
      for (const [text, icon] of [[0, 1], [2, 3], [4, 5]]) {
        expect(Math.abs(box[text].h - box[icon].h), `row ${text} heights differ`).toBeLessThan(1)
      }
      expect(box[1].w).toBeLessThan(box[3].w)
      expect(box[3].w).toBeLessThan(box[5].w)
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
      const [sm, md, lg] = GENRE_CORNER[genre.id]
      expect(sm).toBeLessThan(md)
      expect(md).toBeLessThan(lg)
      expect(clips[0]).toContain(`${sm}px`)
      expect(clips[0]).not.toContain(`${md}px`)
      expect(clips[1]).toContain(`${md}px`)
      expect(clips[2]).toContain(`${lg}px`)
    })
  })
}
