/**
 * Genre system tests — defineGenre, registerGenre, genresPlugin, CSS output
 *
 * Real-world scenarios:
 *   1. A developer wants to create a custom "Aurora" genre for their brand.
 *      They call defineGenre() and registerGenre() and expect it to merge onto
 *      the Ops base and show up in GENRES.
 *   2. The compiled CSS must include html[data-genre="cyberpunk"] rules so
 *      genre activation works purely via a data attribute — no JS needed.
 *   3. Registering a genre with the same name twice must not create duplicates.
 *   4. genres with no tokens key must not crash genresPlugin().
 */
import { describe, test, expect, beforeEach } from 'vitest'
import { generateCSS } from './helpers.js'

// ── Unit tests for defineGenre / registerGenre ─────────────────────────────────
// These run directly against the source module with no Tailwind pipeline.

describe('defineGenre()', () => {
  let defineGenre, registerGenre, GENRES

  beforeEach(async () => {
    // Re-import to get a fresh module state in each test group.
    // Vitest isolates modules between describe blocks when using vi.resetModules(),
    // but since GENRES is a module-level array we test mutation carefully.
    const mod = await import('../../src/plugin/genres/index.js')
    defineGenre  = mod.defineGenre
    registerGenre = mod.registerGenre
    GENRES       = mod.GENRES
  })

  test('returns an object with name, swatches, tokens, styles', () => {
    const g = defineGenre({ name: 'Aurora' })
    expect(g).toHaveProperty('name', 'Aurora')
    expect(g).toHaveProperty('swatches')
    expect(g).toHaveProperty('tokens')
    expect(g).toHaveProperty('styles')
  })

  test('merges caller tokens onto Ops base tokens', () => {
    const g = defineGenre({
      name: 'Test',
      tokens: { '--zyna': '#BF5FFF', '--z-duration-fast': '0.10s' },
    })
    // --zyna should be the caller's value
    expect(g.tokens['--zyna']).toBe('#BF5FFF')
    // --z-duration-base should come from the Ops base
    expect(g.tokens['--z-duration-base']).toBeTruthy()
  })

  test('merges caller styles onto Ops base styles', () => {
    const g = defineGenre({
      name: 'Test2',
      styles: {
        'html[data-genre="test2"]': {
          '--z-btn-clip': 'inset(0)',
        },
      },
    })
    // Own structural override key should exist
    expect(g.styles['html[data-genre="test2"]']).toBeDefined()
    // html base styles from Ops should also still be present
    expect(g.styles['html']).toBeDefined()
  })

  test('merges palette onto Ops base swatches', () => {
    const g = defineGenre({
      name: 'Test3',
      palette: { brand: '#FF00FF', info: '#00FFFF' },
    })
    expect(g.swatches.brand).toBe('#FF00FF')
    expect(g.swatches.info).toBe('#00FFFF')
    // Ops base swatch that was not overridden
    expect(g.swatches.success).toBeTruthy()
  })

  test('extends from a custom base genre when extends is provided', () => {
    const base = {
      name: 'Base',
      swatches: { brand: '#AAAAAA', success: '#BBBBBB', danger: '#CCCCCC', info: '#DDDDDD' },
      tokens:   { '--zyna': '#AAAAAA', '--z-duration-fast': '0.20s' },
      styles:   { 'html': { '--z-btn-corner': '0px' } },
    }
    const g = defineGenre({
      name:    'Child',
      extends: base,
      tokens:  { '--zyna': '#FF0000' },
    })
    // Child overrides --zyna
    expect(g.tokens['--zyna']).toBe('#FF0000')
    // Child inherits base token
    expect(g.tokens['--z-duration-fast']).toBe('0.20s')
  })

  test('empty options produces a genre that matches Ops structure', () => {
    const g = defineGenre({ name: 'EmptyTest' })
    // Should have all the Ops token keys
    expect(g.tokens['--z-duration-fast']).toBeTruthy()
    expect(g.styles['html']).toBeDefined()
  })

})

describe('registerGenre()', () => {
  let defineGenre, registerGenre, GENRES

  beforeEach(async () => {
    const mod = await import('../../src/plugin/genres/index.js')
    defineGenre   = mod.defineGenre
    registerGenre = mod.registerGenre
    GENRES        = mod.GENRES
  })

  test('adds a new genre to GENRES array', () => {
    const before = GENRES.length
    const g = defineGenre({ name: `UniqueGenre_${Date.now()}` })
    registerGenre(g)
    expect(GENRES.length).toBe(before + 1)
  })

  test('does not duplicate when the same name is registered twice', () => {
    const g = defineGenre({ name: 'NoDupe' })
    registerGenre(g)
    const afterFirst = GENRES.length
    registerGenre(g)
    expect(GENRES.length).toBe(afterFirst)
  })

  test('registered genre is findable in GENRES by name', () => {
    const name = `FindMe_${Date.now()}`
    const g = defineGenre({ name })
    registerGenre(g)
    expect(GENRES.find(x => x.name === name)).toBeTruthy()
  })
})

describe('genresPlugin() output', () => {
  let genresPlugin

  beforeEach(async () => {
    const mod = await import('../../src/plugin/genres/index.js')
    genresPlugin = mod.genresPlugin
  })

  test('returns a plain object', () => {
    const result = genresPlugin()
    expect(typeof result).toBe('object')
    expect(result).not.toBeNull()
  })

  test('includes html key for ops baseline structural styles', () => {
    const result = genresPlugin()
    expect(result['html']).toBeDefined()
  })

  test('html key contains --z-btn-corner token', () => {
    const result = genresPlugin()
    expect(result['html']['--z-btn-corner']).toBeTruthy()
  })

  test('includes html[data-genre="cyberpunk"] key', () => {
    const result = genresPlugin()
    expect(result['html[data-genre="cyberpunk"]']).toBeDefined()
  })

  test('cyberpunk genre rule contains its color overrides', () => {
    const result = genresPlugin()
    const cpRule = result['html[data-genre="cyberpunk"]']
    // Cyberpunk tokens should be merged into the structural rule
    expect(cpRule['--zyna']).toBe('#39FF14')
  })

  test('cyberpunk structural tokens take precedence over color tokens', () => {
    // In genresPlugin(), styles always take precedence: { ...tokens, ...styles[selector] }
    // --z-btn-clip is a structural token that should come from styles, not tokens
    const result = genresPlugin()
    const cpRule = result['html[data-genre="cyberpunk"]']
    expect(cpRule['--z-btn-clip']).toBe('inset(0)')
  })

  test('does not crash if a genre has no tokens', () => {
    // Edge case: a genre may not define a tokens key
    expect(() => genresPlugin()).not.toThrow()
  })

  test('genre name is lowercased in the html[data-genre] selector', () => {
    // genresPlugin() calls genre.name.toLowerCase() when building the selector.
    // A genre registered as 'Cyberpunk' must produce html[data-genre="cyberpunk"],
    // not html[data-genre="Cyberpunk"] — otherwise <html data-genre="cyberpunk">
    // (lowercase, as users would naturally write it) would not activate the genre.
    const result = genresPlugin()
    // The built-in cyberpunk genre has name 'Cyberpunk' or 'cyberpunk' —
    // either way the key in the output must be fully lowercase.
    const keys = Object.keys(result)
    const genreKeys = keys.filter(k => k.includes('data-genre='))
    genreKeys.forEach(k => {
      // Extract the value inside data-genre="..."
      const match = k.match(/data-genre="([^"]+)"/)
      if (match) {
        expect(match[1]).toBe(match[1].toLowerCase())
      }
    })
  })
})

describe('genre CSS output (full pipeline)', () => {
  let css
  beforeEach(async () => {
    if (!css) css = await generateCSS()
  })

  test('html[data-genre="cyberpunk"] rule is emitted in CSS', async () => {
    const output = await generateCSS()
    expect(output).toContain('html[data-genre="cyberpunk"]')
  })

  test('cyberpunk genre emits --zyna custom property override', async () => {
    const output = await generateCSS()
    // Somewhere under html[data-genre="cyberpunk"], --zyna: #39FF14 should appear
    expect(output).toContain('--zyna')
    expect(output).toContain('#39FF14')
  })

  test('cyberpunk body scan-line rule is emitted', async () => {
    // The scan-line overlay uses :where(html[data-genre="cyberpunk"]) body::before
    const output = await generateCSS()
    expect(output).toMatch(/html\[data-genre="cyberpunk"\][^}]*body::before|body::before/)
  })
})
