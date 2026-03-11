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
import shapes from '../shapes.js'

export default function(theme) {
  // Parallelogram formula driven by --badge-offset CSS variable.
  // .badge-lg just sets --badge-offset to a larger value; same formula applies.
  const chip = shapes.parallelogram('var(--badge-offset)')

  return {
    // ── Base ─────────────────────────────────────────────────────────────────
    '.badge': {
      '--badge-bg':         'var(--z-color-overlay)',
      '--badge-color':      'var(--z-color-text-muted)',  // WCAG AA ≥4.5:1 on dark
      '--badge-glow':       'none',
      '--badge-scan-color': 'color-mix(in srgb, white 18%, transparent)',
      '--badge-offset':     'var(--zp-corner-badge)',

      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      padding: '0.22rem 0.85rem',
      fontFamily: 'var(--z-font-mono)',
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
      '--badge-bg':    'color-mix(in srgb, var(--z-color-success) 10%, transparent)',
      '--badge-color': 'var(--z-color-success)',
      '--badge-glow':  'drop-shadow(0 0 5px color-mix(in srgb, var(--z-color-success) 45%, transparent)) drop-shadow(0 0 14px color-mix(in srgb, var(--z-color-success) 14%, transparent))',
    },

    // Neon crimson
    '.badge-danger': {
      '--badge-bg':    'color-mix(in srgb, var(--z-color-danger) 10%, transparent)',
      '--badge-color': 'var(--z-color-danger)',
      '--badge-glow':  'drop-shadow(0 0 5px color-mix(in srgb, var(--z-color-danger) 45%, transparent)) drop-shadow(0 0 14px color-mix(in srgb, var(--z-color-danger) 14%, transparent))',
    },

    // Amber
    '.badge-warning': {
      '--badge-bg':    'color-mix(in srgb, var(--z-color-warning) 10%, transparent)',
      '--badge-color': 'var(--z-color-warning)',
      '--badge-glow':  'drop-shadow(0 0 5px color-mix(in srgb, var(--z-color-warning) 40%, transparent)) drop-shadow(0 0 12px color-mix(in srgb, var(--z-color-warning) 12%, transparent))',
    },

    // Electric cyan
    '.badge-info': {
      '--badge-bg':    'color-mix(in srgb, var(--z-color-info) 10%, transparent)',
      '--badge-color': 'var(--z-color-info)',
      '--badge-glow':  'drop-shadow(0 0 5px color-mix(in srgb, var(--z-color-info) 45%, transparent)) drop-shadow(0 0 14px color-mix(in srgb, var(--z-color-info) 14%, transparent))',
    },

    // WCAG AA: bumped from 0.35 → 0.55 opacity
    '.badge-neutral': {
      '--badge-bg':    'var(--z-color-overlay)',
      '--badge-color': 'var(--z-color-text-muted)',
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
      '--badge-offset': 'var(--zp-corner-badge-lg)',
    },

    // ── Shape modifiers ────────────────────────────────────────────────────────
    // .badge-notch.badge-lg works automatically — .badge-lg sets --badge-offset,
    // the notch polygon uses it. No compound selector needed.
    '.badge-sharp': { clipPath: 'inset(0 round 3px)', borderRadius: '3px' },
    '.badge-pill':  { clipPath: 'inset(0 round 9999px)', borderRadius: '9999px' },
    '.badge-notch': { clipPath: shapes.notch('var(--badge-offset)').outer },
  }
}
