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
 */
export default function motion() {
  return {
    '@media (prefers-reduced-motion: reduce)': {
      ':where(.badge)::after':        { animation: 'none' },
      ':where(.badge-pulse)::before': {
        animation: 'zyna-pulse-fade calc(var(--z-duration-pulse) * 2) ease-in-out infinite',
      },
      ':where(.card)':                { animation: 'none' },
      ':where(.card-header)::before': { animation: 'none' },
      ':where(.btn)': {
        transition: 'none',
      },
      ':where(.btn):hover': {
        transition: 'none',
      },
      ':where(.btn)::after': {
        transition: 'none',
      },
    },
  }
}
