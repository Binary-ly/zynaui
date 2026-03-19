import { describe, test, expect } from 'vitest'
import { generateCSS } from './helpers.js'

describe('.alert component', () => {
  test('generates base .alert class', async () => {
    const css = await generateCSS('<div class="alert">')
    expect(css).toContain('.alert')
  })

  test('also targets [role="alert"] for accessibility', async () => {
    const css = await generateCSS('<div class="alert">')
    expect(css).toMatch(/\[role="alert"\]/)
  })

  test('exposes --alert-bar-color CSS variable', async () => {
    const css = await generateCSS('<div class="alert">')
    expect(css).toMatch(/--alert-bar-color:/)
  })

  test('exposes --alert-bg CSS variable', async () => {
    const css = await generateCSS('<div class="alert">')
    expect(css).toMatch(/--alert-bg:/)
  })

  test('exposes --alert-color CSS variable', async () => {
    const css = await generateCSS('<div class="alert">')
    expect(css).toMatch(/--alert-color:/)
  })

  test('generates .alert-success semantic variant', async () => {
    const css = await generateCSS('<div class="alert-success">')
    expect(css).toContain('.alert-success')
  })

  test('generates .alert-danger semantic variant', async () => {
    const css = await generateCSS('<div class="alert-danger">')
    expect(css).toContain('.alert-danger')
  })

  test('generates .alert-warning semantic variant', async () => {
    const css = await generateCSS('<div class="alert-warning">')
    expect(css).toContain('.alert-warning')
  })

  test('generates .alert-info semantic variant', async () => {
    const css = await generateCSS('<div class="alert-info">')
    expect(css).toContain('.alert-info')
  })

  test('generates .alert-neutral semantic variant', async () => {
    const css = await generateCSS('<div class="alert-neutral">')
    expect(css).toContain('.alert-neutral')
  })

  test('generates .alert-dark semantic variant', async () => {
    const css = await generateCSS('<div class="alert-dark">')
    expect(css).toContain('.alert-dark')
  })

  // ── Shape modifiers ───────────────────────────────────────────────────────────

  test('generates .alert-square shape modifier', async () => {
    const css = await generateCSS('<div class="alert-square">')
    expect(css).toContain('.alert-square')
  })

  test('.alert-round hides the ::before bar and uses inset box-shadow instead', async () => {
    // .alert-round uses a pill border-radius: the absolute-positioned bar ::before
    // would not follow the rounded shape, so alert.js:219 sets display:none on it
    // and uses inset box-shadow for the border ring instead.
    const css = await generateCSS('<div class="alert-round">')
    // Inset box-shadow provides the visual border ring (unique to .alert-round)
    expect(css).toContain('inset 0 0 0 var(--z-alert-bar-width) var(--alert-bar-color)')
    // The &::before rule INSIDE .alert-round's block must hide the bar.
    // Use position-based check: 'display: none' must appear within .alert-round's block,
    // not just somewhere in the full CSS (Tailwind's [hidden] reset also sets display:none).
    const roundIdx = css.indexOf(':where(.alert-round)')
    const roundBlock = css.slice(roundIdx, roundIdx + 400)
    expect(roundBlock).toContain('display: none')
  })

  test('full alert output matches snapshot', async () => {
    const css = await generateCSS('<div class="alert alert-success alert-danger alert-warning alert-info alert-neutral alert-dark">')
    expect(css).toMatchSnapshot()
  })
})
