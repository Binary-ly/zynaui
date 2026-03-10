/**
 * Badge component — CSS variable API
 *
 * To create a new badge style, set these variables on your class:
 *
 *   --badge-bg         Background tint
 *   --badge-color      Text / dot colour
 *   --badge-glow       drop-shadow filter (traces the parallelogram shape)
 *   --badge-scan-color Scan-sweep highlight colour
 *
 * All built-in gold colours reference var(--zyna) so the badge palette
 * adapts when users override `colors.zyna.DEFAULT` in their Tailwind config.
 *
 * ─── Example ───────────────────────────────────────────────────────────────
 *   .badge-plasma {
 *     --badge-bg:    rgba(139, 0, 255, 0.10);
 *     --badge-color: #BF5FFF;
 *     --badge-glow:  drop-shadow(0 0 5px rgba(139,0,255,0.45))
 *                    drop-shadow(0 0 14px rgba(139,0,255,0.14));
 *   }
 */
module.exports = function(theme) {
  // Parallelogram: both sides angled — military data-chip aesthetic.
  // filter: drop-shadow() on the element traces these angled edges.
  const chip   = 'polygon(0.55rem 0%, 100% 0%, calc(100% - 0.55rem) 100%, 0% 100%)'
  const chipLg = 'polygon(0.65rem 0%, 100% 0%, calc(100% - 0.65rem) 100%, 0% 100%)'

  return {
    // ── Base ─────────────────────────────────────────────────────────────────
    '.badge': {
      '--badge-bg':         'rgba(255,255,255,0.04)',
      '--badge-color':      'rgba(240,235,224,0.55)',  // WCAG AA ≥4.5:1 on dark
      '--badge-glow':       'none',
      '--badge-scan-color': 'rgba(255,255,255,0.18)',

      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      padding: '0.22rem 0.85rem',
      fontFamily: "'DM Mono', 'Fira Code', ui-monospace, monospace",
      fontSize: '0.6rem',
      fontWeight: '700',
      letterSpacing: '0.13em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      position: 'relative',
      clipPath: chip,
      background: 'var(--badge-bg)',
      color: 'var(--badge-color)',
      filter: 'var(--badge-glow)',

      // Focus ring — shown when badge is used as an interactive element
      '&:focus-visible': {
        outline: '1.5px solid var(--badge-color)',
        outlineOffset: '3px',
      },

      // Periodic radar scan sweep — contained within the parallelogram clip
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '0',
        bottom: '0',
        left: '-60%',
        width: '50%',
        background: 'linear-gradient(90deg, transparent, var(--badge-scan-color), transparent)',
        animation: 'zyna-badge-scan 5s ease-in-out infinite',
        pointerEvents: 'none',
      },
    },

    // ── Semantic variants ─────────────────────────────────────────────────────

    '.badge-primary': {
      '--badge-bg':    'color-mix(in srgb, var(--zyna) 13%, transparent)',
      '--badge-color': 'color-mix(in srgb, var(--zyna) 90%, white)',
      '--badge-glow':  'drop-shadow(0 0 5px color-mix(in srgb, var(--zyna) 40%, transparent)) drop-shadow(0 0 14px color-mix(in srgb, var(--zyna) 14%, transparent))',
    },

    '.badge-secondary': {
      '--badge-bg':    'color-mix(in srgb, var(--zyna) 5%, transparent)',
      // Bumped from 65% → 80% to clear WCAG AA (≈5.3:1 on dark bg)
      '--badge-color': 'color-mix(in srgb, var(--zyna) 80%, transparent)',
    },

    // Alien mint
    '.badge-success': {
      '--badge-bg':    'rgba(0,255,178,0.10)',
      '--badge-color': '#00FFB2',
      '--badge-glow':  'drop-shadow(0 0 5px rgba(0,255,178,0.45)) drop-shadow(0 0 14px rgba(0,255,178,0.14))',
    },

    // Neon crimson
    '.badge-danger': {
      '--badge-bg':    'rgba(255,51,102,0.10)',
      '--badge-color': '#FF3366',
      '--badge-glow':  'drop-shadow(0 0 5px rgba(255,51,102,0.45)) drop-shadow(0 0 14px rgba(255,51,102,0.14))',
    },

    // Amber
    '.badge-warning': {
      '--badge-bg':    'rgba(255,184,0,0.10)',
      '--badge-color': '#FFB800',
      '--badge-glow':  'drop-shadow(0 0 5px rgba(255,184,0,0.40)) drop-shadow(0 0 12px rgba(255,184,0,0.12))',
    },

    // Electric cyan
    '.badge-info': {
      '--badge-bg':    'rgba(0,212,255,0.10)',
      '--badge-color': '#00D4FF',
      '--badge-glow':  'drop-shadow(0 0 5px rgba(0,212,255,0.45)) drop-shadow(0 0 14px rgba(0,212,255,0.14))',
    },

    // WCAG AA: bumped from 0.35 → 0.55 opacity
    '.badge-neutral': {
      '--badge-bg':    'rgba(255,255,255,0.04)',
      '--badge-color': 'rgba(240,235,224,0.55)',
    },

    // Top + bottom strokes through the parallelogram — corners are clipped away
    '.badge-outline': {
      background: 'transparent',
      borderTop: '1px solid currentColor',
      borderBottom: '1px solid currentColor',
      opacity: '0.75',
    },

    // ── Pulsing status dot — expanding ring via animated box-shadow ───────────
    '.badge-pulse': {
      '&::before': {
        content: '""',
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        background: 'currentColor',
        flexShrink: '0',
        animation: 'zyna-pulse-ring 2s ease-out infinite',
      },
    },

    '.badge-lg': {
      padding: '0.32rem 1.05rem',
      fontSize: '0.68rem',
      clipPath: chipLg,
    },
  }
}
