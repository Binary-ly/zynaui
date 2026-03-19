/**
 * tokens & Tailwind theme extension tests
 *
 * Real-world scenario: a developer drops ZynaUI into a Next.js app and expects
 * the design tokens to be available on :root immediately (no markup needed),
 * and wants to write Tailwind utilities like `text-zyna-success` instead of
 * `text-[var(--z-color-success)]`. These tests verify the token surface end-to-end.
 */
import { describe, test, expect } from 'vitest'
import { generateCSS, getPluginInstance } from './helpers.js'

// A single CSS generation covers all token tests — addBase always emits, regardless
// of what content classes are used.
let _css
async function getCSS() {
  if (!_css) _css = await generateCSS()
  return _css
}

describe('plugin :root tokens', () => {

  // ── Tier 1: Primitive tokens are set ────────────────────────────────────────

  test(':root contains --zp-corner-sm', async () => {
    const css = await getCSS()
    expect(css).toContain('--zp-corner-sm')
  })

  test(':root corner-sm value is 7px', async () => {
    const css = await getCSS()
    expect(css).toMatch(/--zp-corner-sm:\s*7px/)
  })

  test(':root contains --zp-ease-standard (motion primitives)', async () => {
    const css = await getCSS()
    expect(css).toContain('--zp-ease-standard')
  })

  test(':root contains --zp-success color primitive', async () => {
    const css = await getCSS()
    expect(css).toContain('--zp-success')
  })

  // ── Tier 2: Semantic shape tokens reference primitives ───────────────────────

  test(':root --z-corner falls back to --zp-corner-md', async () => {
    const css = await getCSS()
    expect(css).toMatch(/--z-corner:\s*var\(--zp-corner-md\)/)
  })

  test(':root --z-corner-lg falls back to --zp-corner-lg', async () => {
    const css = await getCSS()
    expect(css).toMatch(/--z-corner-lg:\s*var\(--zp-corner-lg\)/)
  })

  // ── Tier 2: Semantic color tokens ────────────────────────────────────────────

  test(':root --z-color-success falls back to --zp-success', async () => {
    const css = await getCSS()
    expect(css).toMatch(/--z-color-success:\s*var\(--zp-success\)/)
  })

  test(':root --z-color-danger falls back to --zp-danger', async () => {
    const css = await getCSS()
    expect(css).toMatch(/--z-color-danger:\s*var\(--zp-danger\)/)
  })

  test(':root --z-color-warning falls back to --zp-warning', async () => {
    const css = await getCSS()
    expect(css).toMatch(/--z-color-warning:\s*var\(--zp-warning\)/)
  })

  test(':root --z-color-info falls back to --zp-info', async () => {
    const css = await getCSS()
    expect(css).toMatch(/--z-color-info:\s*var\(--zp-info\)/)
  })

  test(':root --z-color-text uses color-mix with --zp-text', async () => {
    const css = await getCSS()
    expect(css).toMatch(/--z-color-text:.*color-mix.*--zp-text/)
  })

  // ── Tier 2: Motion tokens come from ops.tokens ───────────────────────────────

  test(':root --z-duration-fast is set (from ops.tokens spread)', async () => {
    const css = await getCSS()
    expect(css).toContain('--z-duration-fast')
  })

  test(':root --z-ease-enter is set', async () => {
    const css = await getCSS()
    expect(css).toContain('--z-ease-enter')
  })

  // ── Fonts ─────────────────────────────────────────────────────────────────────

  test(':root --z-font-mono is set', async () => {
    const css = await getCSS()
    expect(css).toContain('--z-font-mono')
  })

  // ── Page surface tokens ───────────────────────────────────────────────────────

  test(':root --z-surface-page is set (dark default #09080F)', async () => {
    const css = await getCSS()
    expect(css).toContain('--z-surface-page')
  })

  test(':root --z-surface-card is set', async () => {
    const css = await getCSS()
    expect(css).toContain('--z-surface-card')
  })

  // ── Component structural tokens go on html, not :root ────────────────────────

  test('html element gets --z-btn-corner from ops styles', async () => {
    const css = await getCSS()
    // The structural tokens land on html {}, not :root {}
    expect(css).toMatch(/html\s*\{[^}]*--z-btn-corner/)
  })

  test('html element gets --z-card-gradient from ops styles', async () => {
    const css = await getCSS()
    expect(css).toMatch(/html\s*\{[^}]*--z-card-gradient/)
  })

  test('html element gets color-scheme: dark', async () => {
    const css = await getCSS()
    expect(css).toMatch(/html\s*\{[^}]*color-scheme:\s*dark/)
  })
})

describe('Tailwind theme extension config', () => {
  // These test plugin.withOptions() second argument — the config factory.
  // We call the plugin instance directly to inspect config without running Tailwind.

  test('plugin returns a config object when called', async () => {
    const instance = await getPluginInstance()
    // plugin.withOptions returns a function; calling it returns { handler, config? }
    expect(instance).toBeTruthy()
  })

  test('Tailwind theme extends colors.zyna.DEFAULT with gold value', async () => {
    const instance = await getPluginInstance()
    // The config is accessible via instance.config in withOptions return
    const config = instance?.config ?? {}
    const zynaColor = config?.theme?.extend?.colors?.zyna?.DEFAULT
    expect(zynaColor).toBe('#C9A84C')
  })

  test('Tailwind theme extends colors.zyna.success with CSS var', async () => {
    const instance = await getPluginInstance()
    const config = instance?.config ?? {}
    const val = config?.theme?.extend?.colors?.zyna?.success
    expect(val).toBe('var(--z-color-success)')
  })

  test('Tailwind theme extends colors.zyna.danger with CSS var', async () => {
    const instance = await getPluginInstance()
    const config = instance?.config ?? {}
    const val = config?.theme?.extend?.colors?.zyna?.danger
    expect(val).toBe('var(--z-color-danger)')
  })

  test('Tailwind theme extends borderRadius[zyna] with CSS var', async () => {
    const instance = await getPluginInstance()
    const config = instance?.config ?? {}
    const val = config?.theme?.extend?.borderRadius?.['zyna']
    expect(val).toBe('var(--z-corner)')
  })

  test('Tailwind theme extends borderRadius[zyna-lg] with CSS var', async () => {
    const instance = await getPluginInstance()
    const config = instance?.config ?? {}
    const val = config?.theme?.extend?.borderRadius?.['zyna-lg']
    expect(val).toBe('var(--z-corner-lg)')
  })
})
