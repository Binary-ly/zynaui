/**
 * Genre structural rules — CSS that cannot be expressed as inherited tokens.
 *
 * Everything else (shapes, colors, sizes, prefixes) is handled by the
 * genre structural token system: genres set --z-* custom properties on :root
 * in _genres.js, and components read them via var(). See src/plugin/index.js
 * for the full list of genre structural tokens.
 *
 * This file only contains rules that genuinely need a CSS selector —
 * specifically pseudo-elements on elements outside component scope.
 */

export default function genres() {
  return {
    // Page-wide scan-line overlay via body::before.
    // Scoped to data-genre so it only activates for non-Ops genres,
    // avoiding conflicts with the landing page noise texture (body::before).
    // Opacity and color are controlled by the genre token on :root.
    'html[data-genre="cyberpunk"] body::before': {
      content: '""',
      position: 'fixed',
      inset: '0',
      zIndex: '0',
      pointerEvents: 'none',
      background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in srgb, var(--zyna) 3%, transparent) 2px, color-mix(in srgb, var(--zyna) 3%, transparent) 3px)',
    },
  }
}
