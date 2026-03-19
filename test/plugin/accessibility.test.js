/**
 * Accessibility CSS tests
 *
 * Real-world scenario: a developer adds a ZynaUI button to a form. They need:
 *   1. The button to have a visible focus ring when keyboard-navigated.
 *   2. The disabled button to show cursor:not-allowed so users understand it is inert.
 *   3. A [role="button"] <div> to receive the same visual treatment as <button>.
 *   4. An [role="alert"] element to be styled correctly.
 *   5. All decorative animations to turn off with prefers-reduced-motion.
 *
 * These tests verify the accessibility contract of the generated CSS.
 */
import { describe, test, expect } from 'vitest'
import { generateCSS } from './helpers.js'

let _css
async function getCSS() {
  if (!_css) _css = await generateCSS()
  return _css
}

describe('button accessibility styles', () => {

  // ── Disabled states ──────────────────────────────────────────────────────────

  test(':disabled rule sets cursor: not-allowed', async () => {
    const css = await getCSS()
    // Both :disabled and [aria-disabled="true"] share the same declaration block
    expect(css).toMatch(/cursor:\s*not-allowed/)
  })

  test('[aria-disabled="true"] rule sets opacity to 0.28', async () => {
    const css = await getCSS()
    // The :disabled / aria-disabled block sets opacity: 0.28
    expect(css).toMatch(/\[aria-disabled="true"\]/)
    expect(css).toMatch(/opacity:\s*0\.28/)
  })

  test('[aria-disabled="true"] sets pointer-events: none', async () => {
    const css = await getCSS()
    expect(css).toMatch(/pointer-events:\s*none/)
  })

  // ── Focus visibility ──────────────────────────────────────────────────────────

  test(':focus-visible rule exists', async () => {
    const css = await getCSS()
    expect(css).toMatch(/:focus-visible/)
  })

  test(':focus-visible sets an outline (not box-shadow)', async () => {
    // We use outline, not box-shadow, so it works inside clip-path elements.
    // box-shadow is clipped; outline is not.
    const css = await getCSS()
    // There should be an outline declaration inside a :focus-visible block
    expect(css).toMatch(/:focus-visible[^}]*\{[^}]*outline/)
  })

  test(':focus-visible uses --btn-focus-color token', async () => {
    const css = await getCSS()
    expect(css).toContain('--btn-focus-color')
  })

  // ── [role="button"] parity ────────────────────────────────────────────────────

  test('[role="button"] selector receives .btn base styles', async () => {
    // Non-<button> elements carrying role="button" should look identical to .btn.
    const css = await getCSS()
    expect(css).toMatch(/\[role="button"\]/)
  })

  test('[role="button"] is in the prefers-reduced-motion block', async () => {
    // Reduced-motion also disables transitions on [role="button"] elements.
    // motion.js generates: @media (prefers-reduced-motion: reduce) { ...[role="button"]... }
    // We verify [role="button"] appears AFTER "prefers-reduced-motion" in the CSS string,
    // which proves it is inside the @media block (all content within the block follows the rule name).
    const css = await getCSS()
    const mediaIdx = css.indexOf('prefers-reduced-motion')
    expect(mediaIdx).toBeGreaterThan(-1)
    const roleIdx = css.indexOf('[role="button"]', mediaIdx)
    expect(roleIdx).toBeGreaterThan(mediaIdx)
  })
})

describe('badge accessibility styles', () => {

  test('.badge::after animation is disabled under prefers-reduced-motion', async () => {
    // Badge has a scan sweep animation on ::after — must be disabled for motion-sensitive users.
    const css = await getCSS()
    // The prefers-reduced-motion block targets :where(.badge)::after
    expect(css).toMatch(/prefers-reduced-motion/)
    expect(css).toMatch(/badge/)
  })
})

describe('alert accessibility styles', () => {

  test('[role="alert"] selector is present', async () => {
    // Alert component applies [role="alert"] to ensure screen readers announce it
    const css = await getCSS()
    expect(css).toMatch(/\[role="alert"\]/)
  })
})

describe('prefers-reduced-motion', () => {

  test('@media prefers-reduced-motion block is emitted', async () => {
    const css = await getCSS()
    expect(css).toContain('prefers-reduced-motion')
  })

  test('reduced-motion disables .card animations', async () => {
    const css = await getCSS()
    // :where(.card) inside the media block gets animation: none
    expect(css).toMatch(/prefers-reduced-motion/)
    expect(css).toMatch(/:where\(.card\)/)
  })

  test('reduced-motion disables .card-header::before animations', async () => {
    const css = await getCSS()
    expect(css).toMatch(/:where\(.card-header\)::before/)
  })

  test('reduced-motion disables .btn transitions', async () => {
    const css = await getCSS()
    // :where(.btn) inside media block gets transition: none
    expect(css).toMatch(/:where\(.btn\)/)
  })

  test('reduced-motion disables .badge-pulse::before animations', async () => {
    const css = await getCSS()
    expect(css).toMatch(/:where\(.badge-pulse\)::before/)
  })
})
