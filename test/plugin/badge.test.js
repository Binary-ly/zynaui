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

  test('full badge output matches snapshot', async () => {
    const css = await generateCSS('<span class="badge badge-pulse badge-outline badge-success badge-danger badge-warning badge-info">')
    expect(css).toMatchSnapshot()
  })
})
