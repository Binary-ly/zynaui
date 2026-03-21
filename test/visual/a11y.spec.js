import { test, expect } from '@playwright/test'
import { setupPage } from './helpers/page-setup.js'
import { GENRES } from './helpers/genre.js'

const OPS = GENRES[0]

// For each component, verify that prefers-reduced-motion: no-preference produces
// the same static appearance as prefers-reduced-motion: reduce.
//
// How: generate baseline from 'no-preference' page, then verify 'reduce' page
// matches the same baseline. If they differ, motion tokens are leaking into
// static layout (e.g. a glow filter, drop-shadow, or layout token that differs
// between motion modes) — a visual regression bug.
//
// Uses toHaveScreenshot (not Buffer.compare) for stable, pixel-threshold comparison.

test.describe('a11y / reduced-motion invariant', () => {

  test('btn static appearance unchanged across motion preference', async ({ browser }) => {
    const HTML = `<button class="btn btn-primary" type="button">Test</button>`

    // Baseline: no-preference state
    const noPrefPage = await browser.newPage()
    await noPrefPage.emulateMedia({ reducedMotion: 'no-preference' })
    const noPrefEl = await setupPage(noPrefPage, OPS, HTML)
    await expect(noPrefEl).toHaveScreenshot('a11y-btn.png')
    await noPrefPage.close()

    // Must match: reduce state against the same baseline
    const reducePage = await browser.newPage()
    await reducePage.emulateMedia({ reducedMotion: 'reduce' })
    const reduceEl = await setupPage(reducePage, OPS, HTML)
    await expect(reduceEl).toHaveScreenshot('a11y-btn.png')
    await reducePage.close()
  })

  test('badge static appearance unchanged across motion preference', async ({ browser }) => {
    const HTML = `<span class="badge badge-primary">Badge</span>`

    const noPrefPage = await browser.newPage()
    await noPrefPage.emulateMedia({ reducedMotion: 'no-preference' })
    const noPrefEl = await setupPage(noPrefPage, OPS, HTML)
    await expect(noPrefEl).toHaveScreenshot('a11y-badge.png')
    await noPrefPage.close()

    const reducePage = await browser.newPage()
    await reducePage.emulateMedia({ reducedMotion: 'reduce' })
    const reduceEl = await setupPage(reducePage, OPS, HTML)
    await expect(reduceEl).toHaveScreenshot('a11y-badge.png')
    await reducePage.close()
  })

  test('card static appearance unchanged across motion preference', async ({ browser }) => {
    const HTML = `<div class="card" style="width:280px"><div class="card-body"><p>Card</p></div></div>`

    const noPrefPage = await browser.newPage()
    await noPrefPage.emulateMedia({ reducedMotion: 'no-preference' })
    const noPrefEl = await setupPage(noPrefPage, OPS, HTML)
    await expect(noPrefEl).toHaveScreenshot('a11y-card.png')
    await noPrefPage.close()

    const reducePage = await browser.newPage()
    await reducePage.emulateMedia({ reducedMotion: 'reduce' })
    const reduceEl = await setupPage(reducePage, OPS, HTML)
    await expect(reduceEl).toHaveScreenshot('a11y-card.png')
    await reducePage.close()
  })

  test('alert static appearance unchanged across motion preference', async ({ browser }) => {
    const HTML = `<div class="alert alert-info" style="width:320px"><span class="alert-title">Alert</span> Message.</div>`

    const noPrefPage = await browser.newPage()
    await noPrefPage.emulateMedia({ reducedMotion: 'no-preference' })
    const noPrefEl = await setupPage(noPrefPage, OPS, HTML)
    await expect(noPrefEl).toHaveScreenshot('a11y-alert.png')
    await noPrefPage.close()

    const reducePage = await browser.newPage()
    await reducePage.emulateMedia({ reducedMotion: 'reduce' })
    const reduceEl = await setupPage(reducePage, OPS, HTML)
    await expect(reduceEl).toHaveScreenshot('a11y-alert.png')
    await reducePage.close()
  })
})
