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

  test('full alert output matches snapshot', async () => {
    const css = await generateCSS('<div class="alert alert-success alert-danger alert-warning alert-info alert-neutral alert-dark">')
    expect(css).toMatchSnapshot()
  })
})
