import { describe, test, expect } from 'vitest'
import { generateCSS } from './helpers.js'

describe('.badge component', () => {
  test('generates base .badge class', async () => {
    const css = await generateCSS('<span class="badge">')
    expect(css).toContain('.badge')
  })

  test('exposes --badge-bg CSS variable', async () => {
    const css = await generateCSS('<span class="badge">')
    expect(css).toMatch(/--badge-bg:/)
  })

  test('exposes --badge-color CSS variable', async () => {
    const css = await generateCSS('<span class="badge">')
    expect(css).toMatch(/--badge-color:/)
  })

  test('generates .badge-pulse variant', async () => {
    const css = await generateCSS('<span class="badge-pulse">')
    expect(css).toContain('.badge-pulse')
  })

  test('generates .badge-outline variant', async () => {
    const css = await generateCSS('<span class="badge-outline">')
    expect(css).toContain('.badge-outline')
  })

  test('.badge-outline sets --badge-interior for the dark inner fill', async () => {
    // The outlined technique uses a ::before pseudo-element clipped to --badge-inner-clip
    // with background: var(--badge-interior). For outline variants, --badge-interior
    // must be set to a dark surface color (badge.js:146: var(--z-surface-inset)).
    // Without this, the outlined badge has no visible interior — it is hollow or solid.
    const css = await generateCSS('<span class="badge-outline">')
    expect(css).toContain('--badge-interior: var(--z-surface-inset)')
  })

  test('generates .badge-success semantic variant', async () => {
    const css = await generateCSS('<span class="badge-success">')
    expect(css).toContain('.badge-success')
  })

  test('generates .badge-danger semantic variant', async () => {
    const css = await generateCSS('<span class="badge-danger">')
    expect(css).toContain('.badge-danger')
  })

  test('generates .badge-warning semantic variant', async () => {
    const css = await generateCSS('<span class="badge-warning">')
    expect(css).toContain('.badge-warning')
  })

  test('generates .badge-info semantic variant', async () => {
    const css = await generateCSS('<span class="badge-info">')
    expect(css).toContain('.badge-info')
  })

  // ── Shape modifiers ───────────────────────────────────────────────────────────

  test('generates .badge-slant shape modifier', async () => {
    const css = await generateCSS('<span class="badge-slant">')
    expect(css).toContain('.badge-slant')
  })

  test('generates .badge-rect shape modifier', async () => {
    const css = await generateCSS('<span class="badge-rect">')
    expect(css).toContain('.badge-rect')
  })

  test('generates .badge-pill shape modifier', async () => {
    const css = await generateCSS('<span class="badge-pill">')
    expect(css).toContain('.badge-pill')
  })

  test('generates .badge-bevel shape modifier', async () => {
    const css = await generateCSS('<span class="badge-bevel">')
    expect(css).toContain('.badge-bevel')
  })

})
