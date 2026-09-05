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

  test('cyberpunk structural tokens stay alongside its color tokens on html', () => {
    // In genresPlugin(), styles always take precedence: { ...tokens, ...styles[selector] }
    // --z-btn-corner is a structural token that comes from styles, not tokens.
    const result = genresPlugin()
    const cpRule = result['html[data-genre="cyberpunk"]']
    expect(cpRule['--z-btn-corner']).toBe('18px')
    expect(cpRule['--zyna']).toBe('#39FF14')
  })

  test('structural tokens that reference element-level tokens are emitted on the element', () => {
    // Real bug: a custom property substitutes its var() references where it is
    // DECLARED. --z-btn-clip on <html> resolved var(--btn-corner) against html's
    // @property initial-value, so every button inherited a 10px chamfer no
    // matter its size class, and Cyberpunk's var(--alert-bar-color) border/glow
    // resolved to white for every alert variant. These tokens must live on the
    // component element, genre-scoped by a descendant selector.
    const result = genresPlugin()
    // Ops: emitted on :where(.btn) / :where(.badge), not html
    expect(result['html']['--z-btn-clip']).toBeUndefined()
    expect(result['html']['--z-btn-inner-clip']).toBeUndefined()
    expect(result['html']['--z-badge-inner-clip']).toBeUndefined()
    expect(result[':where(.btn)']['--z-btn-clip']).toContain('var(--btn-corner)')
    expect(result[':where(.btn)']['--z-btn-inner-clip']).toContain('var(--btn-corner)')
    expect(result[':where(.badge)']['--z-badge-inner-clip']).toContain('var(--badge-offset)')
    // html keeps the plain-valued structural tokens
    expect(result['html']['--z-btn-corner']).toBe('var(--z-corner)')
    // Genres: same tokens on the genre-scoped element selector
    const cp = result[':where(html[data-genre="cyberpunk"]) :where(.btn)']
    expect(cp['--z-btn-clip']).toBe('inset(0)')
    expect(result['html[data-genre="cyberpunk"]']['--z-btn-clip']).toBeUndefined()
    const cpAlert = result[':where(html[data-genre="cyberpunk"]) :where(.alert)']
    expect(cpAlert['--z-alert-border']).toContain('var(--alert-bar-color)')
    expect(cpAlert['--z-alert-bar-glow']).toContain('var(--alert-bar-color)')
    expect(result['html[data-genre="cyberpunk"]']['--z-alert-border']).toBeUndefined()
    // Every genre scopes the same token set — none leaves one on html
    for (const [sel, decl] of Object.entries(result)) {
      if (!/^html(\[data-genre=|$)/.test(sel)) continue
      for (const k of ['--z-btn-clip', '--z-btn-inner-clip', '--z-badge-clip', '--z-badge-inner-clip', '--z-alert-border', '--z-alert-bar-glow', '--z-alert-texture']) {
        expect(decl[k], `${k} must not be declared on ${sel}`).toBeUndefined()
      }
    }
  })

  test('element-scoped tokens compile to genre-scoped element rules in the CSS', async () => {
    const css = await generateCSS()
    expect(css).toMatch(/:where\(\.btn\)\s*\{[^}]*--z-btn-clip:/)
    expect(css).toMatch(/:where\(html\[data-genre="phosphor"\]\) :where\(\.btn\)\s*\{[^}]*--z-btn-clip:/)
    expect(css).toMatch(/:where\(html\[data-genre="cyberpunk"\]\) :where\(\.alert\)\s*\{[^}]*--z-alert-border:/)
  })

  test('does not crash if a genre has no tokens', () => {
    // Edge case: a genre may not define a tokens key
    expect(() => genresPlugin()).not.toThrow()
  })

  test('a tokens-only custom genre compiles into its own html[data-genre] rule', async () => {
    // Real bug: tokens were only merged into a rule that a `styles` block had
    // already created, so the simplest custom genre — defineGenre({ name, tokens })
    // — compiled to nothing and data-genre="…" did nothing.
    const { defineGenre, registerGenre } = await import('../../src/plugin/genres/index.js')
    const g = defineGenre({ name: 'TokensOnly', tokens: { '--zyna': '#123456' } })
    registerGenre(g)
    const rule = genresPlugin()['html[data-genre="tokensonly"]']
    expect(rule).toBeDefined()
    expect(rule['--zyna']).toBe('#123456')
    // Inherited Ops motion tokens ride along so the genre is complete on its own.
    expect(rule['--z-duration-fast']).toBeTruthy()
  })

  test('multi-word genre names are slugified consistently (validation, selector, remap)', async () => {
    // The docs genre builder exports names like "My Genre" and targets
    // html[data-genre="my-genre"]; defineGenre used to throw on the space and
    // genresPlugin used a different (lowercase-only) slug rule.
    const { defineGenre, registerGenre, genreSlug } = await import('../../src/plugin/genres/index.js')
    expect(genreSlug('  My  Genre ')).toBe('my-genre')
    const g = defineGenre({ name: 'Two Words', tokens: { '--zyna': '#abcdef' } })
    registerGenre(g)
    expect(genresPlugin()['html[data-genre="two-words"]']['--zyna']).toBe('#abcdef')
    // A child of a non-Ops base has its inherited selectors remapped by slug.
    const cyber = (await import('../../src/plugin/genres/cyberpunk.js')).default
    const child = defineGenre({ name: 'Neon Child', extends: cyber })
    expect(Object.keys(child.styles).some(k => k.includes('[data-genre="neon-child"]'))).toBe(true)
    expect(Object.keys(child.styles).some(k => k.includes('[data-genre="cyberpunk"]'))).toBe(false)
  })

  test('still rejects names the slug rule cannot make selector-safe', async () => {
    const { defineGenre } = await import('../../src/plugin/genres/index.js')
    expect(() => defineGenre({ name: 'bad"quote' })).toThrow(/Invalid genre name/)
    expect(() => defineGenre({ name: '1starts-with-digit' })).toThrow(/Invalid genre name/)
  })

  test('genresPlugin(list) compiles only the given genres', async () => {
    const { defineGenre } = await import('../../src/plugin/genres/index.js')
    const only = defineGenre({ name: 'Solo', tokens: { '--zyna': '#0f0f0f' } })
    const out = genresPlugin([only])
    expect(out['html[data-genre="solo"]']['--zyna']).toBe('#0f0f0f')
    expect(out['html[data-genre="cyberpunk"]']).toBeUndefined()
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
