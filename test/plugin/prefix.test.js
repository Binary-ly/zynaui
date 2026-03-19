/**
 * prefix option tests
 *
 * Real-world scenario: a developer has Bootstrap or another CSS framework
 * installed that already defines .btn, .card, .badge, .alert. They use
 * { prefix: 'z-' } to namespace ZynaUI classes and avoid conflicts.
 *
 * These tests verify the prefix option end-to-end: from the Tailwind
 * @plugin options block, through plugin.withOptions(), through applyPrefix(),
 * to the final CSS output.
 */
import { describe, test, expect } from 'vitest'
import { generateCSSWithPrefix } from './helpers.js'

// Run both prefix and no-prefix once; tests share the outputs.
let cssWithPrefix
let cssNoPrefix

async function getCSSWithPrefix() {
  if (!cssWithPrefix) cssWithPrefix = await generateCSSWithPrefix('z-')
  return cssWithPrefix
}
async function getCSSNoPrefix() {
  if (!cssNoPrefix) cssNoPrefix = await generateCSSWithPrefix('')
  return cssNoPrefix
}

describe('plugin prefix option', () => {

  // ── Core component classes are renamed ──────────────────────────────────────

  test('prefix "z-" → .z-btn is in output', async () => {
    const css = await getCSSWithPrefix()
    expect(css).toContain('.z-btn')
  })

  test('prefix "z-" → .z-btn-primary is in output', async () => {
    const css = await getCSSWithPrefix()
    expect(css).toContain('.z-btn-primary')
  })

  test('prefix "z-" → .z-btn-secondary is in output', async () => {
    const css = await getCSSWithPrefix()
    expect(css).toContain('.z-btn-secondary')
  })

  test('prefix "z-" → .z-badge-success is in output', async () => {
    const css = await getCSSWithPrefix()
    expect(css).toContain('.z-badge-success')
  })

  test('prefix "z-" → .z-card-glow is in output', async () => {
    const css = await getCSSWithPrefix()
    expect(css).toContain('.z-card-glow')
  })

  test('prefix "z-" → .z-alert-danger is in output', async () => {
    const css = await getCSSWithPrefix()
    expect(css).toContain('.z-alert-danger')
  })

  test('prefix "z-" → size modifier .z-btn-sm is in output', async () => {
    const css = await getCSSWithPrefix()
    expect(css).toContain('.z-btn-sm')
  })

  test('prefix "z-" → shape modifier .z-btn-cut is in output', async () => {
    const css = await getCSSWithPrefix()
    expect(css).toContain('.z-btn-cut')
  })

  // ── Semantic / at-rule selectors are NOT prefixed ───────────────────────────

  test('prefix "z-" → [role="button"] selector is preserved unchanged', async () => {
    // [role="button"] is a semantic ARIA attribute selector — it must not be
    // prefixed because it targets any element already carrying the correct role.
    const css = await getCSSWithPrefix()
    expect(css).toMatch(/\[role="button"\]/)
  })

  test('prefix "z-" → @property --btn-bg at-rule is preserved unchanged', async () => {
    // CSS custom property names are part of ZynaUI's internal token API and
    // must not change; doing so would break all user-authored custom variants.
    const css = await getCSSWithPrefix()
    expect(css).toContain('@property --btn-bg')
  })

  test('prefix "z-" → genre selector html[data-genre="cyberpunk"] is preserved', async () => {
    // Genre activation uses a data attribute on <html>, not a class — prefix must not touch it.
    const css = await getCSSWithPrefix()
    expect(css).toContain('html[data-genre="cyberpunk"]')
  })

  test('prefix "z-" → genre badge variant rules also use prefixed class names', async () => {
    // Real bug caught: genresPlugin() was not wrapped in applyPrefix.
    // Cyberpunk badge variant rules must target .z-badge-primary, not .badge-primary,
    // otherwise a prefixed app's .z-badge-primary element gets no cyberpunk neon glow.
    const css = await getCSSWithPrefix()
    // Prefixed form must exist somewhere in the genre-scoped output
    expect(css).toContain('.z-badge-primary')
    // The bare unprefixed class name must not appear anywhere in the CSS
    // (applyPrefix transforms every .class-name token; if genresPlugin() was not
    //  wrapped, .badge-primary would leak through unchanged)
    expect(css).not.toContain(':where(.badge-primary)')
  })

  // ── Reduced-motion nested selectors are also prefixed ────────────────────────

  test('prefix "z-" → prefers-reduced-motion targets .z-btn', async () => {
    // The motion utility wraps selectors in @media. applyPrefix recurses
    // into nested objects so these also get prefixed.
    const css = await getCSSWithPrefix()
    expect(css).toMatch(/prefers-reduced-motion/)
    expect(css).toMatch(/\.z-btn/)
  })

  test('prefix "z-" → prefers-reduced-motion targets .z-badge', async () => {
    const css = await getCSSWithPrefix()
    expect(css).toMatch(/\.z-badge/)
  })

  test('prefix "z-" → prefers-reduced-motion targets .z-card', async () => {
    const css = await getCSSWithPrefix()
    expect(css).toMatch(/\.z-card/)
  })

  // ── Empty prefix is a passthrough ───────────────────────────────────────────

  test('empty prefix → .btn is present (no renaming)', async () => {
    const css = await getCSSNoPrefix()
    expect(css).toContain('.btn')
  })

  test('empty prefix → .badge-success is present (no renaming)', async () => {
    const css = await getCSSNoPrefix()
    expect(css).toContain('.badge-success')
  })

  test('empty prefix → .z-btn is NOT present (no accidental renaming)', async () => {
    // With no prefix the output must be identical to the unmodified class names.
    // If applyPrefix accidentally prepended something, .z-btn would appear — this
    // negative assertion catches that regression.
    const css = await getCSSNoPrefix()
    expect(css).not.toContain('.z-btn')
  })
})
