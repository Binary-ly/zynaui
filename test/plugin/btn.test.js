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
    expect(css).toMatch(/\.btn::before\s*\{/)
  })

  test('generates hover state with filter', async () => {
    const css = await generateCSS('<div class="btn">')
    expect(css).toMatch(/\.btn:hover/)
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

  test('full btn output matches snapshot', async () => {
    const css = await generateCSS('<div class="btn btn-primary btn-secondary btn-ghost btn-danger btn-sm btn-lg">')
    expect(css).toMatchSnapshot()
  })
})
