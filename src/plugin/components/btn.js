/**
 * Button component — CSS variable API
 *
 * To create a completely new button style, set these variables on your class:
 *
 *   --btn-bg                 Background (solid, gradient, or multi-layer)
 *   --btn-color              Text colour
 *   --btn-filter             Resting drop-shadow / glow
 *   --btn-scan-color         Scan-fill accent colour
 *   --btn-hover-bg           Hover background (falls back to --btn-bg)
 *   --btn-hover-color        Hover text colour
 *   --btn-hover-filter       Hover glow + brightness
 *   --btn-hover-text-shadow  Hover text luminescence
 *   --btn-active-filter      Active-press filter
 *   --btn-interior           Interior fill for outlined variants (default: transparent)
 *   --btn-hover-interior     Hover interior fill (falls back to --btn-interior)
 *   --btn-inner-clip         Inner polygon for outlined variants (size classes set this automatically)
 *
 * All built-in gold colours reference var(--zyna) so the entire button palette
 * adapts when users override `colors.zyna.DEFAULT` in their Tailwind config.
 *
 * ─── Solid colour example ──────────────────────────────────────────────────
 *   .btn-plasma {
 *     --btn-bg:                rgba(139, 0, 255, 0.38);
 *     --btn-color:             #BF5FFF;
 *     --btn-filter:            drop-shadow(0 0 8px rgba(139,0,255,0.45));
 *     --btn-scan-color:        rgba(139, 0, 255, 0.18);
 *     --btn-hover-filter:      drop-shadow(0 0 22px rgba(139,0,255,1)) brightness(1.10);
 *     --btn-hover-text-shadow: 0 0 16px rgba(200,100,255,0.7);
 *   }
 *
 * ─── Outlined example ──────────────────────────────────────────────────────
 *   .btn-plasma-outline {
 *     --btn-bg:              rgba(139, 0, 255, 0.45);   ← border rim colour
 *     --btn-color:           #BF5FFF;
 *     --btn-interior:        #08020F;                   ← inner dark fill
 *     --btn-hover-bg:        rgba(139,0,255,0.92);
 *     --btn-hover-interior:  #0D0018;
 *     --btn-hover-filter:    drop-shadow(0 0 14px rgba(139,0,255,0.85));
 *     (--btn-inner-clip is set automatically by .btn / .btn-sm / .btn-lg)
 *   }
 *
 * ─── Accessibility ──────────────────────────────────────────────────────────
 *   • All resting and hover text colours meet WCAG 2.1 AA contrast (≥4.5:1
 *     against the default dark card background).
 *   • Focus-visible outline is rendered via :focus-visible, not :focus, so
 *     mouse users are not distracted.
 *   • The base .btn rule also applies to [role="button"] so non-<button>
 *     elements get the same visual treatment when correctly marked up.
 */
import shapes from '../shapes.js'

export default function(theme) {
  const base = {
    // CSS variable defaults — variants override only what they need
    '--btn-bg':                'var(--z-color-overlay)',
    '--btn-color':             'var(--z-color-text-muted)',  // ≥4.5:1 on dark bg
    '--btn-filter':            'none',
    '--btn-scan-color':        'color-mix(in srgb, white 7%, transparent)',
    '--btn-hover-color':       'var(--z-color-text)',
    '--btn-hover-filter':      'none',
    '--btn-hover-text-shadow': 'none',
    '--btn-active-filter':     'none',
    '--btn-focus-color':       'color-mix(in srgb, var(--zyna) 65%, transparent)',
    // Shape — drives clip-path polygon geometry via CSS variable
    '--btn-corner':            'var(--z-corner)',
    // Outlined technique defaults — transparent so solid buttons are unaffected
    '--btn-interior':          'transparent',
    '--btn-inner-clip':        shapes.chamfer('var(--btn-corner)').inner,

    // Structure
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.45rem',
    padding: '0.65rem 1.5rem',
    fontFamily: 'var(--z-font-mono)',
    fontSize: '0.7rem',
    fontWeight: '700',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    userSelect: 'none',
    border: 'none',
    clipPath: shapes.chamfer('var(--btn-corner)').outer,
    transition: 'filter 0.22s ease, color 0.18s ease, background 0.18s ease, transform 0.08s ease',
    background: 'var(--btn-bg)',
    color: 'var(--btn-color)',
    filter: 'var(--btn-filter)',

    // Interior fill — invisible for solid variants (transparent), dark polygon for outlined
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: '0',
      clipPath: 'var(--btn-inner-clip)',
      background: 'var(--btn-interior)',
      zIndex: '-1',
      pointerEvents: 'none',
    },

    // Scan-fill sweep left→right on hover
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: '0',
      background: 'linear-gradient(90deg, var(--btn-scan-color) 0%, transparent 70%)',
      opacity: '0',
      transform: 'scaleX(0)',
      transformOrigin: 'left center',
      transition: 'transform 0.28s ease, opacity 0.28s ease',
      pointerEvents: 'none',
    },

    '&:hover': {
      // Falls back to --btn-bg so solid variants keep their background on hover
      background: 'var(--btn-hover-bg, var(--btn-bg))',
      // Falls back to --btn-color so custom variants don't need to repeat it
      color: 'var(--btn-hover-color, var(--btn-color))',
      filter: 'var(--btn-hover-filter)',
      textShadow: 'var(--btn-hover-text-shadow)',
    },

    '&:hover::before': {
      // Falls back to --btn-interior so outlined variants only set what changed
      background: 'var(--btn-hover-interior, var(--btn-interior))',
    },

    '&:hover::after': {
      opacity: '1',
      transform: 'scaleX(1)',
    },

    '&:active': {
      transform: 'scale(0.96)',
      filter: 'var(--btn-active-filter)',
    },

    '&:focus-visible': {
      outline: '1.5px solid var(--btn-focus-color)',
      outlineOffset: '3px',
    },

    '&:disabled, &[aria-disabled="true"]': {
      opacity: '0.28',
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
  }

  return {
    // ── Base — also applied to [role="button"] for accessible markup ──────────
    '.btn': base,
    '[role="button"]': base,

    // ── Primary: gold solid fill ──────────────────────────────────────────────
    '.btn-primary': {
      '--btn-bg':                `repeating-linear-gradient(110deg, transparent 0px, transparent 3px, color-mix(in srgb, white 5.5%, transparent) 3px, color-mix(in srgb, white 5.5%, transparent) 4px), linear-gradient(135deg, color-mix(in srgb, var(--zyna) 85%, white) 0%, var(--zyna-dark) 100%)`,
      '--btn-color':             'var(--z-color-text-inverse)',
      '--btn-scan-color':        'color-mix(in srgb, white 26%, transparent)',
      '--btn-filter':            `drop-shadow(0 0 8px color-mix(in srgb, var(--zyna) 45%, transparent)) drop-shadow(0 0 22px color-mix(in srgb, var(--zyna) 18%, transparent))`,
      '--btn-hover-color':       'var(--z-color-text-inverse)',
      '--btn-hover-filter':      `drop-shadow(0 0 22px var(--zyna)) drop-shadow(0 0 60px color-mix(in srgb, var(--zyna) 45%, transparent)) brightness(1.10)`,
      '--btn-hover-text-shadow': `0 0 20px color-mix(in srgb, var(--zyna) 55%, white)`,
      '--btn-active-filter':     `brightness(0.80) drop-shadow(0 0 8px color-mix(in srgb, var(--zyna) 60%, transparent))`,
    },

    // ── Secondary: outlined gold — polygon border technique ───────────────────
    '.btn-secondary': {
      '--btn-bg':                'color-mix(in srgb, var(--zyna) 45%, transparent)',
      '--btn-color':             'var(--zyna)',
      '--btn-scan-color':        'color-mix(in srgb, var(--zyna) 18%, transparent)',
      '--btn-interior':          'var(--z-surface-inset)',
      '--btn-hover-bg':          'color-mix(in srgb, var(--zyna) 92%, transparent)',
      '--btn-hover-color':       'color-mix(in srgb, var(--zyna) 90%, white)',
      '--btn-hover-filter':      `drop-shadow(0 0 14px color-mix(in srgb, var(--zyna) 85%, transparent)) drop-shadow(0 0 42px color-mix(in srgb, var(--zyna) 30%, transparent))`,
      '--btn-hover-text-shadow': `0 0 14px color-mix(in srgb, var(--zyna) 80%, transparent)`,
      '--btn-hover-interior':    'var(--z-surface-inset-hover)',
    },

    // ── Ghost: near-invisible — text meets AA at 0.55 opacity ─────────────────
    '.btn-ghost': {
      '--btn-bg':                'transparent',
      '--btn-color':             'var(--z-color-text-muted)',  // WCAG AA ≥4.5:1 on dark
      '--btn-scan-color':        'color-mix(in srgb, white 5.5%, transparent)',
      '--btn-hover-bg':          'var(--z-color-border)',
      '--btn-hover-color':       'var(--z-color-text)',
      '--btn-hover-filter':      'drop-shadow(0 0 8px color-mix(in srgb, white 10%, transparent))',
      '--btn-hover-text-shadow': `0 0 10px color-mix(in srgb, var(--zp-text) 35%, transparent)`,
    },

    // ── Danger: neon crimson — polygon border technique ───────────────────────
    '.btn-danger': {
      '--btn-bg':                'color-mix(in srgb, var(--z-color-danger) 42%, transparent)',
      '--btn-color':             'var(--z-color-danger)',
      '--btn-scan-color':        'color-mix(in srgb, var(--z-color-danger) 18%, transparent)',
      '--btn-interior':          'var(--z-surface-inset-danger)',
      '--btn-hover-bg':          'color-mix(in srgb, var(--z-color-danger) 92%, transparent)',
      '--btn-hover-color':       'color-mix(in srgb, var(--z-color-danger) 75%, white)',
      '--btn-hover-filter':      'drop-shadow(0 0 16px color-mix(in srgb, var(--z-color-danger) 90%, transparent)) drop-shadow(0 0 44px color-mix(in srgb, var(--z-color-danger) 32%, transparent))',
      '--btn-hover-text-shadow': '0 0 16px color-mix(in srgb, var(--z-color-danger) 95%, transparent)',
      '--btn-hover-interior':    'var(--z-surface-inset-danger-hover)',
    },

    // ── Sizes ─────────────────────────────────────────────────────────────────
    // Each size class sets --btn-corner. The base clip-path polygon references
    // var(--btn-corner) so the geometry updates automatically — no repeated
    // polygon strings, no compound selectors needed for shape × size combos.
    '.btn-sm': {
      padding: '0.42rem 1rem',
      fontSize: '0.63rem',
      letterSpacing: '0.12em',
      '--btn-corner': 'var(--z-corner-sm)',
    },

    '.btn-lg': {
      padding: '0.9rem 2.1rem',
      fontSize: '0.78rem',
      '--btn-corner': 'var(--z-corner-lg)',
    },

    '.btn-icon': {
      padding: '0.65rem',
      aspectRatio: '1',
      '--btn-corner': 'var(--z-corner-sm)',
    },

    // ── Shape modifiers ────────────────────────────────────────────────────────
    // Size classes set --btn-corner; shape modifiers change the polygon formula.
    // Combined (e.g. .btn-notch.btn-sm) works without compound selectors because
    // .btn-sm updates --btn-corner and the notch polygon uses it automatically.

    '.btn-chamfer': {
      clipPath: shapes.chamfer('var(--btn-corner)').outer,
      borderRadius: '0',
      '--btn-inner-clip': shapes.chamfer('var(--btn-corner)').inner,
    },
    '.btn-notch': {
      clipPath: shapes.notch('var(--btn-corner)').outer,
      '--btn-inner-clip': shapes.notch('var(--btn-corner)').inner,
    },
    '.btn-pill': {
      clipPath: shapes.pill.clipPath,  // inset(0 round 9999px) — ensures filter traces pill, not rect
      borderRadius: '9999px',          // keeps native focus ring pill-shaped in browsers that read border-radius
      '--btn-inner-clip': shapes.pill.innerClip,
    },
    '.btn-sharp': {
      clipPath: shapes.sharp.clipPath,  // inset(0) — ensures filter traces element before compositing
      borderRadius: shapes.sharp.borderRadius,
      '--btn-inner-clip': shapes.sharp.innerClip,
    },
  }
}
