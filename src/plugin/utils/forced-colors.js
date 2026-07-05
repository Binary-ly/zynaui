/**
 * Forced-colors (Windows High Contrast) overrides — cross-component rule.
 *
 * In forced-colors mode the browser strips backgrounds, filters, and
 * box-shadows — which are the only boundary indicators these components
 * have (button and badge use border: none + clip-path geometry). A real
 * border gives every control a boundary the system palette can recolor.
 *
 * Registered after the component modules so the equal-specificity .btn rule
 * wins its source-order tie against the base's border: none.
 */
export default function forcedColors() {
  return {
    '@media (forced-colors: active)': {
      // .btn base is unwrapped at (0,1,0) and sets border: none — this rule
      // must match that specificity or it loses the cascade outright.
      '.btn':           { border: '1px solid ButtonBorder' },
      ':where(.badge)': { border: '1px solid CanvasText' },
      ':where(.card)':  { border: '1px solid CanvasText' },
      // Alert keeps a heavier start edge so the severity bar's role survives.
      ':where(.alert)': { border: '1px solid CanvasText', borderInlineStartWidth: '4px' },
    },
  }
}
