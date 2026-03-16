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
 *   --badge-interior   Interior fill for outlined variants (transparent for solid badges)
 *   --badge-offset     Parallelogram slant cut depth; shape modifiers set this automatically
 *   --badge-inner-clip clip-path for the inner inset stroke (outlined variant border width)
 *
 * All built-in gold colours reference var(--zyna) so the badge palette
 * adapts when users override `colors.zyna.DEFAULT` in their Tailwind config.
 *
 * Genre structural tokens (set on html by ops.js/cyberpunk.js genre CSS selectors;
 * Ops leaves --z-badge-clip unset, activating the direct polygon fallback in the clip-path rule below):
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
import shapes from '../../utils/shapes.js'

export default function(theme) {
  return {
    // ── Base ─────────────────────────────────────────────────────────────────
    ':where(.badge)': {
      '--badge-bg':         'var(--z-color-overlay)',
      '--badge-color':      'var(--z-color-text-muted)',  // WCAG AA ≥4.5:1 on dark
      '--badge-glow':       'none',
      '--badge-scan-color': 'color-mix(in oklch, white 18%, transparent)',
      '--badge-offset':     'var(--zp-corner-badge)',
      // Outlined technique defaults — transparent so solid badges are unaffected
      '--badge-interior':   'transparent',
      // --z-badge-inner-clip: genre structural token, same two-level pattern as
      // --btn-inner-clip → var(--z-btn-inner-clip). The genre builder's unlayered
      // .gb-preview .badge::before rule reads --z-badge-inner-clip directly (same
      // override trick as buttons) to bypass @layer base cascade ordering.
      '--badge-inner-clip': 'var(--z-badge-inner-clip)',

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
      // <length> var chain that can break clip-path resolution in Ops).
      // Cyberpunk sets --z-badge-clip: inset(0) — no nested vars, resolves correctly.
      // Shape modifiers (.badge-slant, .badge-bevel, etc.) set clipPath directly, which
      // always wins over this token — no specificity re-scoping needed per genre.
      clipPath: `var(--z-badge-clip, ${shapes.slant('var(--badge-offset)')})`,
      borderRadius: 'var(--z-badge-radius)',
      background: 'var(--badge-bg)',
      color: 'var(--badge-color)',
      filter: 'var(--badge-glow)',
      // --z-badge-inset-shadow: Ops = none. Cyberpunk = inset 1px border in text colour.
      boxShadow: 'var(--z-badge-inset-shadow)',

      // Interior fill — invisible for solid badges (transparent), dark polygon for outlined
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: '0',
        clipPath: 'var(--badge-inner-clip)',
        background: 'var(--badge-interior)',
        zIndex: '-1',
        pointerEvents: 'none',
      },

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

    // ── Outline — declared before semantic variants so semantic color wins ───────
    // The inner-clip technique uses the badge bg as a border rim and ::before to
    // fill the dark interior. Defaults to brand gold; semantic classes override
    // --badge-color (and thus currentColor) since they are declared after this rule.
    ':where(.badge-outline)': {
      '--badge-color':    `color-mix(in oklch, var(--zyna) 85%, white)`,
      '--badge-bg':       'color-mix(in oklch, currentColor 80%, transparent)',
      '--badge-interior': 'var(--z-surface-inset)',
      '--badge-glow':     'drop-shadow(0 0 6px color-mix(in oklch, currentColor 55%, transparent)) drop-shadow(0 0 16px color-mix(in oklch, currentColor 20%, transparent))',
    },

    // ── Semantic variants ─────────────────────────────────────────────────────

    ':where(.badge-primary)': {
      '--badge-bg':    'color-mix(in oklch, var(--zyna) 13%, transparent)',
      '--badge-color': 'color-mix(in oklch, var(--zyna) 90%, white)',
      '--badge-glow':  'drop-shadow(0 0 5px color-mix(in oklch, var(--zyna) 40%, transparent)) drop-shadow(0 0 14px color-mix(in oklch, var(--zyna) 14%, transparent))',
    },

    ':where(.badge-secondary)': {
      '--badge-bg':    'color-mix(in oklch, var(--zyna) 5%, transparent)',
      // Bumped from 65% → 80% to clear WCAG AA (≈5.3:1 on dark bg)
      '--badge-color': 'color-mix(in oklch, var(--zyna) 80%, transparent)',
    },

    // Alien mint
    ':where(.badge-success)': {
      '--badge-bg':    'color-mix(in oklch, var(--z-color-success) 10%, transparent)',
      '--badge-color': 'var(--z-color-success)',
      '--badge-glow':  'drop-shadow(0 0 5px color-mix(in oklch, var(--z-color-success) 45%, transparent)) drop-shadow(0 0 14px color-mix(in oklch, var(--z-color-success) 14%, transparent))',
    },

    // Neon crimson
    ':where(.badge-danger)': {
      '--badge-bg':    'color-mix(in oklch, var(--z-color-danger) 10%, transparent)',
      '--badge-color': 'var(--z-color-danger)',
      '--badge-glow':  'drop-shadow(0 0 5px color-mix(in oklch, var(--z-color-danger) 45%, transparent)) drop-shadow(0 0 14px color-mix(in oklch, var(--z-color-danger) 14%, transparent))',
    },

    // Amber
    ':where(.badge-warning)': {
      '--badge-bg':    'color-mix(in oklch, var(--z-color-warning) 10%, transparent)',
      '--badge-color': 'var(--z-color-warning)',
      '--badge-glow':  'drop-shadow(0 0 5px color-mix(in oklch, var(--z-color-warning) 40%, transparent)) drop-shadow(0 0 12px color-mix(in oklch, var(--z-color-warning) 12%, transparent))',
    },

    // Electric cyan
    ':where(.badge-info)': {
      '--badge-bg':    'color-mix(in oklch, var(--z-color-info) 10%, transparent)',
      '--badge-color': 'var(--z-color-info)',
      '--badge-glow':  'drop-shadow(0 0 5px color-mix(in oklch, var(--z-color-info) 45%, transparent)) drop-shadow(0 0 14px color-mix(in oklch, var(--z-color-info) 14%, transparent))',
    },

    // WCAG AA: bumped from 0.35 → 0.55 opacity
    ':where(.badge-neutral)': {
      '--badge-bg':    'var(--z-color-overlay)',
      '--badge-color': 'var(--z-color-text-muted)',
    },

    // ── Pulsing status dot — expanding ring via animated box-shadow ───────────
    ':where(.badge-pulse)': {
      '--badge-dot-size': '5px',
      '&::before': {
        // Reset position properties inherited from .badge::before — the dot must
        // flow as a flex item, not be absolutely positioned inside the badge.
        content: '""',
        position: 'relative',
        inset: 'auto',
        clipPath: 'none',
        zIndex: 'auto',
        background: 'currentColor',
        width: 'var(--badge-dot-size)',
        height: 'var(--badge-dot-size)',
        borderRadius: '50%',
        flexShrink: '0',
        animation: 'zyna-pulse-ring 2s var(--z-ease-enter) infinite',
      },
    },

    ':where(.badge-sm)': {
      padding: '0.15rem 0.65rem',
      fontSize: '0.55rem',
      '--badge-offset':   '3px',
      '--badge-dot-size': '4px',
    },

    ':where(.badge-lg)': {
      padding: '0.32rem 1.05rem',
      fontSize: '0.68rem',
      '--badge-offset':   'var(--zp-corner-badge-lg)',
      '--badge-dot-size': '6px',
    },

    // ── Shape modifiers ────────────────────────────────────────────────────────
    // .badge-bevel.badge-lg works — .badge-lg sets --badge-offset, the bevel polygon uses it.
    // Each modifier also sets --badge-inner-clip so .badge-outline traces the correct shape.
    ':where(.badge-slant)': {
      clipPath: shapes.slant('var(--badge-offset)'),
      '--badge-inner-clip': `polygon(calc(var(--badge-offset) + 2px) 2px, calc(100% - 2px) 2px, calc(100% - calc(var(--badge-offset) + 2px)) calc(100% - 2px), 2px calc(100% - 2px))`,
    },
    ':where(.badge-rect)': {
      clipPath: 'inset(0 round 3px)',
      borderRadius: '3px',
      '--badge-inner-clip': 'inset(2px round 3px)',
    },
    ':where(.badge-pill)': {
      clipPath: 'inset(0 round 9999px)',
      borderRadius: '9999px',
      '--badge-inner-clip': 'inset(2px round 9999px)',
    },
    ':where(.badge-bevel)': {
      clipPath: shapes.bevel('var(--badge-offset)').outer,
      '--badge-inner-clip': `polygon(calc(var(--badge-offset) + 2px) 2px, calc(100% - calc(var(--badge-offset) + 2px)) 2px, calc(100% - 2px) calc(var(--badge-offset) + 2px), calc(100% - 2px) calc(100% - calc(var(--badge-offset) + 2px)), calc(100% - calc(var(--badge-offset) + 2px)) calc(100% - 2px), calc(var(--badge-offset) + 2px) calc(100% - 2px), 2px calc(100% - calc(var(--badge-offset) + 2px)), 2px calc(var(--badge-offset) + 2px))`,
    },
  }
}
