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

  // ── Rim border model ──────────────────────────────────────────────────────
  // An inset box-shadow traces the border box, so on a clipped badge the
  // border stopped at every notch, chamfer, and diagonal. Genres that draw a
  // border now paint currentColor on the element and fill the interior through
  // ::before inside --z-badge-inner-clip, so the rim follows the clip shape.

  const RIM_GENRES = ['cyberpunk', 'corporate', 'phosphor', 'military', 'blueprint', 'washi', 'laboratory', 'atelier']

  test('the badge background is the genre rim, falling back to --badge-bg', async () => {
    const css = await generateCSS()
    expect(css).toMatch(/:where\(\.badge\)\s*\{[^}]*background: var\(--z-badge-rim, var\(--badge-bg\)\)/)
    expect(css).toMatch(/:where\(\.badge\)\s*\{[^}]*--badge-interior: var\(--z-badge-interior, transparent\)/)
  })

  test('Ops leaves the rim unset so badges paint --badge-bg directly', async () => {
    const css = await generateCSS()
    expect(css).not.toMatch(/(^|\n)html\s*\{[^}]*--z-badge-rim/)
    expect(css).not.toMatch(/(^|\n):where\(\.badge\)\s*\{[^}]*--z-badge-interior/)
  })

  test('rim genres declare the rim on html and the tint interior on the badge element', async () => {
    const css = await generateCSS()
    for (const g of RIM_GENRES) {
      expect(css, g).toMatch(new RegExp(`html\\[data-genre="${g}"\\]\\s*\\{[^}]*--z-badge-rim: currentColor`))
      expect(css, g).toMatch(new RegExp(`html\\[data-genre="${g}"\\]\\s*\\{[^}]*--z-badge-inset: 1px`))
      expect(css, g).toMatch(new RegExp(`:where\\(html\\[data-genre="${g}"\\]\\) :where\\(\\.badge\\)\\s*\\{[^}]*--z-badge-interior: linear-gradient\\(var\\(--badge-bg\\), var\\(--badge-bg\\)\\), var\\(--z-surface-page\\)`))
      expect(css, g).not.toMatch(new RegExp(`html\\[data-genre="${g}"\\]\\s*\\{[^}]*--z-badge-interior:`))
    }
  })

  test('shape modifiers inset their inner clip by the genre rim width', async () => {
    const css = await generateCSS()
    expect(css).toMatch(/:where\(\.badge-slant\)\s*\{[^}]*--badge-inner-clip: polygon\(calc\(var\(--badge-offset\) \+ var\(--z-badge-inset, 2px\)\) var\(--z-badge-inset, 2px\)/)
    expect(css).toMatch(/:where\(\.badge-bevel\)\s*\{[^}]*--badge-inner-clip: polygon\(calc\(var\(--badge-offset\) \+ var\(--z-badge-inset, 2px\)\) var\(--z-badge-inset, 2px\)/)
    expect(css).toMatch(/:where\(\.badge-rect\)\s*\{[^}]*--badge-inner-clip: inset\(var\(--z-badge-inset, 2px\) round 3px\)/)
    expect(css).toMatch(/:where\(\.badge-pill\)\s*\{[^}]*--badge-inner-clip: inset\(var\(--z-badge-inset, 2px\) round 9999px\)/)
  })

  test('size classes scale every cut depth through --badge-scale', async () => {
    const css = await generateCSS()
    expect(css).toMatch(/:where\(\.badge\)\s*\{[^}]*--badge-scale: 1;/)
    expect(css).toMatch(/:where\(\.badge\)\s*\{[^}]*--badge-offset: calc\(var\(--zp-corner-badge\) \* var\(--badge-scale\)\)/)
    expect(css).toMatch(/:where\(\.badge-sm\)\s*\{[^}]*--badge-scale: 0\.6/)
    expect(css).toMatch(/:where\(\.badge-lg\)\s*\{[^}]*--badge-scale: 1\.2/)
    expect(css).not.toMatch(/:where\(\.badge-(sm|lg)\)\s*\{[^}]*--badge-offset/)
    expect(css).not.toContain('--zp-corner-badge-lg')
  })

  test('.badge-pulse draws its dot with ::after so ::before still fills the interior', async () => {
    const css = await generateCSS()
    expect(css).toMatch(/:where\(\.badge-pulse\)\s*\{[^}]*&::after\s*\{[^}]*order: -1/)
    expect(css).toMatch(/:where\(\.badge-pulse\)\s*\{[^}]*&::after\s*\{[^}]*zyna-pulse-ring/)
    expect(css).not.toMatch(/:where\(\.badge-pulse\)\s*\{[^}]*&::before/)
    expect(css).not.toMatch(/:where\(\.badge-pulse\)\s*\{[^}]*--z-badge-rim/)
  })

  test('no genre deepens the slant / bevel cut past the 5px badge primitive', async () => {
    // Cyberpunk set --zp-corner-badge: 14px for a badge that is 22px tall: its
    // .badge-slant sheared at ~32° and its .badge-bevel self-intersected,
    // leaving tick marks at both tips. The primitive is only read by the
    // slant / bevel modifiers, so it stays at the root value in every genre.
    const { genresPlugin } = await import('../../src/plugin/genres/index.js')
    for (const [sel, decl] of Object.entries(genresPlugin())) {
      if (/^html\[data-genre=/.test(sel)) expect(decl['--zp-corner-badge'], sel).toBeUndefined()
    }
  })

})
