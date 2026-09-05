/**
 * Reduced-motion overrides — cross-component accessibility rule.
 *
 * Decorative animations (scan sweeps, card glows) are disabled entirely.
 * The badge-pulse dot is the exception: it communicates live status, so it
 * degrades to an opacity-only fade (zyna-pulse-fade) instead of vanishing —
 * reduced motion means no movement, not no information.
 * Transitions are set to none so state changes remain visible but produce
 * no perceptible movement.
 *
 * Extracted here because it spans multiple components (badge, card, btn)
 * and belongs in utils rather than any single component file.
 *
 * Specificity note: badge, card, and alert rules are wrapped in :where() so
 * these zero-specificity overrides win on source order alone. The .btn base
 * is deliberately unwrapped (see btn.js), so it declares `transition` at
 * (0,1,0) and a :where(.btn) override at (0,0,0) can never beat it inside
 * the same cascade layer. The button rules below therefore use the bare
 * class (matching forced-colors.js) so they tie on specificity and win on
 * source order. `.btn:hover::after` is included because the base declares
 * its own scan-sweep transition on that compound selector at (0,2,1).
 */
export default function motion() {
  return {
    '@media (prefers-reduced-motion: reduce)': {
      ':where(.badge)::after':        { animation: 'none' },
      ':where(.badge-pulse)::after': {
        animation: 'zyna-pulse-fade calc(var(--z-duration-pulse) * 2) ease-in-out infinite',
      },
      ':where(.card)':                { animation: 'none' },
      ':where(.card-header)::before': { animation: 'none' },
      '.btn': {
        transition: 'none',
      },
      '.btn:hover': {
        transition: 'none',
      },
      '.btn::after': {
        transition: 'none',
      },
      '.btn:hover::after': {
        transition: 'none',
      },
    },
  }
}
