/**
 * Reduced-motion overrides — cross-component accessibility rule.
 *
 * All animations in this library are decorative. This module disables them
 * entirely when the user has enabled reduced motion on their device.
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
      ':where(.badge-pulse)::before': { animation: 'none' },
      ':where(.card)':                { animation: 'none' },
      ':where(.card-header)::before': { animation: 'none' },
      ':where(.btn), :where([role="button"])': {
        transition: 'none',
      },
      ':where(.btn):hover, :where([role="button"]):hover': {
        transition: 'none',
      },
      ':where(.btn)::after, :where([role="button"])::after': {
        transition: 'none',
      },
    },
  }
}
