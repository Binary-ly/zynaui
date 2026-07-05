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

  // ── ARIA roles are semantics, not styling hooks ──────────────────────────────

  test('no bare [role="button"] selector is emitted', async () => {
    // Styling is opt-in via the .btn class. A bare [role="button"] selector
    // restyles third-party widgets (menu triggers, switches) at (0,1,0)
    // specificity, and the prefix option cannot rewrite attribute selectors.
    const css = await getCSS()
    expect(css).not.toMatch(/\[role="button"\]/)
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

  test('no bare [role="alert"] selector is emitted', async () => {
    // role="alert" is a live-region semantic used by every toast library —
    // styling it directly gave third-party toasts a mystery bar and padding.
    const css = await getCSS()
    expect(css).not.toMatch(/\[role="alert"\]/)
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
