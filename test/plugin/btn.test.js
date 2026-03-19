import { describe, test, expect } from 'vitest'
import { generateCSS } from './helpers.js'

describe('.btn component', () => {
  test('generates base .btn class', async () => {
    const css = await generateCSS('<div class="btn">')
    expect(css).toContain('.btn')
  })

  test('exposes --btn-color CSS variable', async () => {
    const css = await generateCSS('<div class="btn">')
    expect(css).toMatch(/--btn-color:/)
  })

  test('exposes --btn-bg CSS variable', async () => {
    const css = await generateCSS('<div class="btn">')
    expect(css).toMatch(/--btn-bg:/)
  })

  test('generates ::before pseudo-element', async () => {
    const css = await generateCSS('<div class="btn">')
    // v4 outputs native CSS nesting (&::before) rather than expanded selectors
    expect(css).toMatch(/(?:\.btn::before|&::before)\s*\{/)
  })

  test('generates hover state with filter', async () => {
    const css = await generateCSS('<div class="btn">')
    // v4 outputs native CSS nesting (&:hover) rather than expanded selectors
    expect(css).toMatch(/(?:\.btn:hover|&:hover)/)
  })

  test('hover transition uses --z-ease-enter (hover-in easing)', async () => {
    // Core directional easing contract (btn.js:141):
    //   base .btn transition uses var(--z-ease-exit)  — easing when LEAVING hover
    //   &:hover transition uses var(--z-ease-enter)   — easing when ENTERING hover
    // This ensures hover-in and hover-out feel physically different.
    const css = await generateCSS('<div class="btn">')
    expect(css).toContain('--z-ease-enter')
    expect(css).toContain('--z-ease-exit')
  })

  test(':disabled and [aria-disabled="true"] share opacity 0.28', async () => {
    // Both are in the same declaration block in btn.js so both values appear together.
    const css = await generateCSS('<div class="btn">')
    expect(css).toContain('[aria-disabled="true"]')
    expect(css).toMatch(/opacity:\s*0\.28/)
    // cursor: not-allowed is in the same block
    expect(css).toMatch(/cursor:\s*not-allowed/)
  })

  test('generates .btn-primary variant', async () => {
    const css = await generateCSS('<div class="btn-primary">')
    expect(css).toContain('.btn-primary')
  })

  test('generates .btn-secondary variant', async () => {
    const css = await generateCSS('<div class="btn-secondary">')
    expect(css).toContain('.btn-secondary')
  })

  test('generates .btn-ghost variant', async () => {
    const css = await generateCSS('<div class="btn-ghost">')
    expect(css).toContain('.btn-ghost')
  })

  test('generates .btn-danger variant', async () => {
    const css = await generateCSS('<div class="btn-danger">')
    expect(css).toContain('.btn-danger')
  })

  test('generates .btn-sm size variant', async () => {
    const css = await generateCSS('<div class="btn-sm">')
    expect(css).toContain('.btn-sm')
  })

  test('generates .btn-lg size variant', async () => {
    const css = await generateCSS('<div class="btn-lg">')
    expect(css).toContain('.btn-lg')
  })

  test('::after scan sweep starts collapsed (scaleX(0)) and expands on hover', async () => {
    // The scan sweep is an ::after pseudo-element: transform:scaleX(0) at rest,
    // scaleX(1) on hover (btn.js:127-153). Without this, no sweep animation plays.
    const css = await generateCSS('<div class="btn">')
    expect(css).toContain('scaleX(0)')
    expect(css).toContain('scaleX(1)')
  })

})
