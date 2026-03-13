/**
 * Badge component — CSS variable API
 *
 * To create a new badge style, set these variables on your class:
 *
 *   --badge-bg         Background tint
 *   --badge-color      Text / dot colour
 *   --badge-glow       drop-shadow filter (traces the parallelogram shape)
 *   --badge-scan-color Scan-sweep highlight colour
 *   --badge-dot-size   Pulse status dot diameter (default: 5px; .badge-lg sets 6px)
 *
 * All built-in gold colours reference var(--zyna) so the badge palette
 * adapts when users override `colors.zyna.DEFAULT` in their Tailwind config.
 *
 * Genre structural tokens (Cyberpunk sets these on :root; Ops leaves --z-badge-clip unset,
 * activating the direct polygon fallback in the clip-path rule below):
 *
 *   --z-badge-clip             clip-path override (unset in Ops → parallelogram via fallback;
 *                              Cyberpunk sets inset(0) → rectangle)
 *   --z-badge-radius           border-radius matching the clip shape
 *   --z-badge-padding          padding shorthand
 *   --z-badge-letter-spacing   letter-spacing
 *   --z-badge-inset-shadow     box-shadow (Ops = none, Cyberpunk = inset 1px border)
 *   --z-badge-scan-duration    Radar scan animation duration (Ops = 5s, Cyberpunk = 2.5s)
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
      // --z-badge-padding/letter-spacing: genre structural tokens.
      // Cyberpunk uses slightly different values for the rectangular style.
      padding: 'var(--z-badge-padding)',
      fontFamily: 'var(--z-font-mono)',
      fontSize: '0.6rem',
      fontWeight: '700',
      letterSpacing: 'var(--z-badge-letter-spacing)',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      position: 'relative',
      // --z-badge-clip: genre structural token. Ops leaves this unset; the fallback
      // applies the parallelogram directly on the element (avoids a nested @property
      // <length> var chain on :root that can break clip-path resolution in Ops).
      // Cyberpunk sets --z-badge-clip: inset(0) — no nested vars, resolves correctly.
      // Shape modifiers (.badge-alpha, .badge-beta, etc.) set clipPath directly, which
      // always wins over this token — no specificity re-scoping needed per genre.
      clipPath: `var(--z-badge-clip, ${shapes.slant('var(--badge-offset)')})`,
      borderRadius: 'var(--z-badge-radius)',
      background: 'var(--badge-bg)',
      color: 'var(--badge-color)',
      filter: 'var(--badge-glow)',
      // --z-badge-inset-shadow: Ops = none. Cyberpunk = inset 1px border in text colour.
      boxShadow: 'var(--z-badge-inset-shadow)',

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
        animation: 'zyna-badge-scan var(--z-badge-scan-duration) var(--z-ease-spring) infinite',
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
      '--badge-dot-size': '5px',
      '&::before': {
        content: '""',
        width: 'var(--badge-dot-size)',
        height: 'var(--badge-dot-size)',
        borderRadius: '50%',
        background: 'currentColor',
        flexShrink: '0',
        animation: 'zyna-pulse-ring 2s var(--z-ease-enter) infinite',
      },
    },

    '.badge-lg': {
      padding: '0.32rem 1.05rem',
      fontSize: '0.68rem',
      '--badge-offset':   'var(--zp-corner-badge-lg)',
      '--badge-dot-size': '6px',
    },

    // ── Shape modifiers ────────────────────────────────────────────────────────
    // .badge-beta.badge-lg works — .badge-lg sets --badge-offset, the bevel polygon uses it.
    '.badge-alpha': { clipPath: shapes.slant('var(--badge-offset)') },
    '.badge-delta': { clipPath: 'inset(0 round 3px)', borderRadius: '3px' },
    '.badge-gamma': { clipPath: 'inset(0 round 9999px)', borderRadius: '9999px' },
    '.badge-beta':    { clipPath: shapes.bevel('var(--badge-offset)').outer },
  }
}
