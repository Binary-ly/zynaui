import { describe, test, expect } from 'vitest'
import { generateCSS } from './helpers.js'

describe('.card component', () => {
  test('generates .card base class', async () => {
    const css = await generateCSS('<div class="card">')
    expect(css).toContain('.card')
  })

  test('generates .card-glow variant', async () => {
    const css = await generateCSS('<div class="card-glow">')
    expect(css).toContain('.card-glow')
  })

  test('exposes --card-gradient CSS variable', async () => {
    const css = await generateCSS('<div class="card">')
    expect(css).toMatch(/--card-gradient:/)
  })

  test('exposes --card-border-color CSS variable', async () => {
    const css = await generateCSS('<div class="card">')
    expect(css).toMatch(/--card-border-color:/)
  })

  test('exposes --card-glow-lo CSS variable', async () => {
    const css = await generateCSS('<div class="card-glow">')
    expect(css).toMatch(/--card-glow-lo:/)
  })

  test('exposes --card-glow-hi CSS variable', async () => {
    const css = await generateCSS('<div class="card-glow">')
    expect(css).toMatch(/--card-glow-hi:/)
  })

  test('generates ::before pseudo-element on .card', async () => {
    const css = await generateCSS('<div class="card">')
    // v4 outputs native CSS nesting (&::before) rather than expanded selectors
    expect(css).toMatch(/(?:\.card::before|&::before)\s*\{/)
  })

  test('registers @keyframes zyna-card-pulse', async () => {
    const css = await generateCSS('<div class="card-glow">')
    expect(css).toContain('@keyframes zyna-card-pulse')
  })

  test('.card-glow sets --card-animation to use zyna-card-pulse', async () => {
    // The .card base rule applies animation: var(--card-animation).
    // .card-glow overrides --card-animation: zyna-card-pulse ... (card.js:269).
    // Without this, no animation runs even though the keyframe is defined.
    const css = await generateCSS('<div class="card-glow">')
    expect(css).toContain('--card-animation: zyna-card-pulse')
  })

  test('generates .card-dark variant', async () => {
    const css = await generateCSS('<div class="card-dark">')
    expect(css).toContain('.card-dark')
  })

  test('generates .card-sm variant', async () => {
    const css = await generateCSS('<div class="card-sm">')
    expect(css).toContain('.card-sm')
  })

  // ── Shape modifiers ───────────────────────────────────────────────────────────

  test('generates .card-round shape modifier', async () => {
    const css = await generateCSS('<div class="card-round">')
    expect(css).toContain('.card-round')
  })

  test('.card-bevel uses clip-path and nulls box-shadow', async () => {
    // clip-path clips box-shadow, so .card-bevel must set --card-shadow: none
    // and use filter:drop-shadow() instead (card.js:300-305).
    const css = await generateCSS('<div class="card-bevel">')
    expect(css).toContain('.card-bevel')
    expect(css).toContain('--card-shadow: none')
  })

  test('full card output matches snapshot', async () => {
    const css = await generateCSS('<div class="card card-glow card-dark card-sm">')
    expect(css).toMatchSnapshot()
  })
})
