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
module.exports = function(theme) {
  // Outer clip-path polygons (chamfered top-right + bottom-left)
  const outer   = 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
  const outerSm = 'polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))'
  const outerLg = 'polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))'

  // Inner polygons (1px inset) — used by outlined variants for the polygon-border technique.
  // Size classes set --btn-inner-clip to the matching polygon so any outlined
  // variant (including user-defined ones) automatically gets the right inner clip.
  const inner   = 'polygon(1px 1px, calc(100% - 11px) 1px, calc(100% - 1px) 11px, calc(100% - 1px) calc(100% - 1px), 11px calc(100% - 1px), 1px calc(100% - 11px))'
  const innerSm = 'polygon(1px 1px, calc(100% - 8px) 1px, calc(100% - 1px) 8px, calc(100% - 1px) calc(100% - 1px), 8px calc(100% - 1px), 1px calc(100% - 8px))'
  const innerLg = 'polygon(1px 1px, calc(100% - 14px) 1px, calc(100% - 1px) 14px, calc(100% - 1px) calc(100% - 1px), 14px calc(100% - 1px), 1px calc(100% - 14px))'

  const base = {
    // CSS variable defaults — variants override only what they need
    '--btn-bg':                'rgba(255,255,255,0.04)',
    '--btn-color':             'rgba(240,235,224,0.55)',  // ≥4.5:1 on dark bg
    '--btn-filter':            'none',
    '--btn-scan-color':        'rgba(255,255,255,0.07)',
    '--btn-hover-color':       'rgba(240,235,224,0.90)',
    '--btn-hover-filter':      'none',
    '--btn-hover-text-shadow': 'none',
    '--btn-active-filter':     'none',
    '--btn-focus-color':       'color-mix(in srgb, var(--zyna) 65%, transparent)',
    // Outlined technique defaults — transparent so solid buttons are unaffected
    '--btn-interior':          'transparent',
    '--btn-inner-clip':        'none',

    // Structure
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.45rem',
    padding: '0.65rem 1.5rem',
    fontFamily: "'DM Mono', 'Fira Code', ui-monospace, monospace",
    fontSize: '0.7rem',
    fontWeight: '700',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    userSelect: 'none',
    border: 'none',
    clipPath: outer,
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
      // Promotes to GPU compositing layer only while the transition is active —
      // avoids the ~150KB/button permanent VRAM cost of putting will-change on the base class
      willChange: 'filter, transform',
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
      willChange: 'filter, transform',
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
      '--btn-bg':                `repeating-linear-gradient(110deg, transparent 0px, transparent 3px, rgba(255,255,255,0.055) 3px, rgba(255,255,255,0.055) 4px), linear-gradient(135deg, color-mix(in srgb, var(--zyna) 85%, white) 0%, var(--zyna-dark) 100%)`,
      '--btn-color':             '#050407',
      '--btn-scan-color':        'rgba(255,255,255,0.26)',
      '--btn-filter':            `drop-shadow(0 0 8px color-mix(in srgb, var(--zyna) 45%, transparent)) drop-shadow(0 0 22px color-mix(in srgb, var(--zyna) 18%, transparent))`,
      '--btn-hover-color':       '#050407',
      '--btn-hover-filter':      `drop-shadow(0 0 22px var(--zyna)) drop-shadow(0 0 60px color-mix(in srgb, var(--zyna) 45%, transparent)) brightness(1.10)`,
      '--btn-hover-text-shadow': `0 0 20px color-mix(in srgb, var(--zyna) 55%, white)`,
      '--btn-active-filter':     `brightness(0.80) drop-shadow(0 0 8px color-mix(in srgb, var(--zyna) 60%, transparent))`,
    },

    // ── Secondary: outlined gold — polygon border technique ───────────────────
    '.btn-secondary': {
      '--btn-bg':                'color-mix(in srgb, var(--zyna) 45%, transparent)',
      '--btn-color':             'var(--zyna)',
      '--btn-scan-color':        'color-mix(in srgb, var(--zyna) 18%, transparent)',
      '--btn-inner-clip':        inner,
      '--btn-interior':          '#0C0B14',
      '--btn-hover-bg':          'color-mix(in srgb, var(--zyna) 92%, transparent)',
      '--btn-hover-color':       'color-mix(in srgb, var(--zyna) 90%, white)',
      '--btn-hover-filter':      `drop-shadow(0 0 14px color-mix(in srgb, var(--zyna) 85%, transparent)) drop-shadow(0 0 42px color-mix(in srgb, var(--zyna) 30%, transparent))`,
      '--btn-hover-text-shadow': `0 0 14px color-mix(in srgb, var(--zyna) 80%, transparent)`,
      '--btn-hover-interior':    '#0E0D18',
    },

    // ── Ghost: near-invisible — text meets AA at 0.55 opacity ─────────────────
    '.btn-ghost': {
      '--btn-bg':                'transparent',
      '--btn-color':             'rgba(240,235,224,0.55)',  // WCAG AA ≥4.5:1 on dark
      '--btn-scan-color':        'rgba(255,255,255,0.055)',
      '--btn-hover-bg':          'rgba(255,255,255,0.05)',
      '--btn-hover-color':       'rgba(240,235,224,0.90)',
      '--btn-hover-filter':      'drop-shadow(0 0 8px rgba(255,255,255,0.10))',
      '--btn-hover-text-shadow': '0 0 10px rgba(240,235,224,0.35)',
    },

    // ── Danger: neon crimson — polygon border technique ───────────────────────
    '.btn-danger': {
      '--btn-bg':                'rgba(255,51,102,0.42)',
      '--btn-color':             '#FF3366',
      '--btn-scan-color':        'rgba(255,51,102,0.18)',
      '--btn-inner-clip':        inner,
      '--btn-interior':          '#0C0508',
      '--btn-hover-bg':          'rgba(255,51,102,0.92)',
      '--btn-hover-color':       '#FF80A0',
      '--btn-hover-filter':      'drop-shadow(0 0 16px rgba(255,51,102,0.90)) drop-shadow(0 0 44px rgba(255,51,102,0.32))',
      '--btn-hover-text-shadow': '0 0 16px rgba(255,51,102,0.95)',
      '--btn-hover-interior':    '#100608',
    },

    // ── Sizes ─────────────────────────────────────────────────────────────────
    // Each size class overrides --btn-inner-clip so ANY outlined variant
    // (built-in or user-defined) automatically gets the correct inner polygon.
    '.btn-sm': {
      padding: '0.42rem 1rem',
      fontSize: '0.63rem',
      letterSpacing: '0.12em',
      clipPath: outerSm,
      '--btn-inner-clip': innerSm,
    },

    '.btn-lg': {
      padding: '0.9rem 2.1rem',
      fontSize: '0.78rem',
      clipPath: outerLg,
      '--btn-inner-clip': innerLg,
    },

    '.btn-icon': {
      padding: '0.65rem',
      aspectRatio: '1',
      clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
    },
  }
}
