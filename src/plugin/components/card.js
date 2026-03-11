/**
 * Card component — CSS variable API
 *
 * To create a new card style, set these variables on your class:
 *
 *   --card-gradient       Base colour gradient (scanlines are always added on top)
 *   --card-border-color   Border colour
 *   --card-shadow         box-shadow
 *   --card-bracket-color  Corner L-bracket stroke colour
 *   --card-bracket-size   Corner bracket arm length (default: 20px)
 *   --card-bar-gradient   Top luminescent power-bar gradient
 *   --card-animation      CSS animation shorthand (e.g. zyna-card-pulse 4s ease-in-out infinite)
 *   --card-glow-lo        Pulse glow colour at rest  (used by zyna-card-pulse keyframe)
 *   --card-glow-hi        Pulse glow colour at peak  (used by zyna-card-pulse keyframe)
 *
 * All built-in gold colours reference var(--zyna) so the entire card palette
 * adapts when users override `colors.zyna.DEFAULT` in their Tailwind config.
 *
 * ─── Example — cyan variant ────────────────────────────────────────────────
 *   .card-cyber {
 *     --card-gradient:      linear-gradient(145deg, rgba(0,20,30,0.97) 0%, rgba(0,10,18,0.97) 100%);
 *     --card-border-color:  rgba(0,212,255,0.22);
 *     --card-bracket-color: rgba(0,212,255,0.55);
 *     --card-bar-gradient:  linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.55) 25%, rgba(0,212,255,0.55) 75%, transparent 100%);
 *     --card-glow-lo:       rgba(0,212,255,0.12);
 *     --card-glow-hi:       rgba(0,212,255,0.26);
 *     --card-animation:     zyna-card-pulse 4s ease-in-out infinite;
 *   }
 */
import shapes from '../shapes.js'

export default function(theme) {
  // All 4 corner L-brackets drawn as 8 stacked background-image gradients
  // on a single pseudo-element. Uses --card-bracket-color and --card-bracket-size
  // so any variant just sets those two variables.
  function cornerBrackets() {
    const c = 'var(--card-bracket-color)'
    const s = 'var(--card-bracket-size)'
    return {
      backgroundImage: [
        `linear-gradient(to right,  ${c}, ${c})`,   // TL — horizontal
        `linear-gradient(to bottom, ${c}, ${c})`,   // TL — vertical
        `linear-gradient(to left,   ${c}, ${c})`,   // TR — horizontal
        `linear-gradient(to bottom, ${c}, ${c})`,   // TR — vertical
        `linear-gradient(to right,  ${c}, ${c})`,   // BL — horizontal
        `linear-gradient(to top,    ${c}, ${c})`,   // BL — vertical
        `linear-gradient(to left,   ${c}, ${c})`,   // BR — horizontal
        `linear-gradient(to top,    ${c}, ${c})`,   // BR — vertical
      ].join(', '),
      backgroundSize:     `${s} 1.5px, 1.5px ${s}, ${s} 1.5px, 1.5px ${s}, ${s} 1.5px, 1.5px ${s}, ${s} 1.5px, 1.5px ${s}`,
      backgroundPosition: '0 0, 0 0, 100% 0, 100% 0, 0 100%, 0 100%, 100% 100%, 100% 100%',
      backgroundRepeat:   'no-repeat',
    }
  }

  return {
    // ── Base ─────────────────────────────────────────────────────────────────
    '.card': {
      '--card-gradient':      'var(--z-surface-card)',
      // --z-card-border-color / --z-card-shadow: genre structural tokens.
      // Genres set them on :root; they inherit to .card where these component
      // tokens pick them up. Fallbacks match Ops defaults.
      '--card-border-color':  'var(--z-card-border-color, var(--z-color-border))',
      '--card-shadow':        'var(--z-card-shadow, var(--z-shadow-card))',
      '--card-bracket-color': 'color-mix(in srgb, var(--zyna) 42%, transparent)',
      '--card-bracket-size':  '20px',
      '--card-bar-gradient':  'linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--zyna) 30%, transparent) 25%, color-mix(in srgb, var(--zyna) 30%, transparent) 75%, transparent 100%)',
      '--card-animation':     'none',
      '--card-glow-lo':       'rgba(0,0,0,0)',
      '--card-glow-hi':       'rgba(0,0,0,0)',

      position: 'relative',
      // Scopes layout and style to this element so the browser skips costly
      // cross-tree invalidations when card contents change.
      // Note: contain:paint is intentionally excluded — it creates a new stacking
      // context that prevents ::before bracket pseudo-elements from painting correctly
      // when the card is near the viewport edge.
      contain: 'layout style',
      // --z-card-clip: genre structural token — Ops = none, Cyberpunk = notch polygon
      clipPath: 'var(--z-card-clip)',
      // --z-card-filter: genre structural token.
      // box-shadow is clipped by clip-path, so genres that add clip-path shapes
      // use filter:drop-shadow() here instead — it traces the notch outline.
      filter: 'var(--z-card-filter, none)',
      // Scanline texture stacked on top of the colour gradient via CSS multi-background
      background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px), var(--card-gradient)',
      border: '1px solid var(--card-border-color)',
      boxShadow: 'var(--card-shadow)',
      overflow: 'hidden',
      animation: 'var(--card-animation)',

      // 4-corner L-brackets via 8 stacked background gradients
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: '0',
        ...cornerBrackets(),
        zIndex: '1',
        pointerEvents: 'none',
      },

      // Top luminescent power bar
      // --z-card-bar-height / --z-card-bar-bg / --z-card-bar-shadow: genre structural tokens.
      // Fallbacks preserve Ops defaults. Genres set these on :root to thicken/recolor the bar.
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: 'var(--z-card-bar-height, 1px)',
        background: 'var(--z-card-bar-bg, var(--card-bar-gradient))',
        boxShadow: 'var(--z-card-bar-shadow, none)',
        zIndex: '1',
        pointerEvents: 'none',
      },
    },

    '.card-body': {
      padding: '1.5rem',
      position: 'relative',
    },

    // HUD readout header — status dot + mono uppercase label
    '.card-header': {
      padding: '0.7rem 1.25rem',
      borderBottom: '1px solid var(--z-color-border)',
      // --z-card-header-bg: genre structural token — Ops = transparent, Cyberpunk = tinted neon
      background: 'var(--z-card-header-bg, transparent)',
      fontFamily: 'var(--z-font-mono)',
      fontSize: '0.62rem',
      fontWeight: '700',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'color-mix(in srgb, var(--zyna) 75%, transparent)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      position: 'relative',

      '&::before': {
        content: '""',
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        background: 'color-mix(in srgb, var(--zyna) 65%, transparent)',
        flexShrink: '0',
        boxShadow: '0 0 6px color-mix(in srgb, var(--zyna) 65%, transparent), 0 0 16px color-mix(in srgb, var(--zyna) 30%, transparent)',
      },
    },

    '.card-footer': {
      padding: '0.7rem 1.25rem',
      borderTop: '1px solid var(--z-color-border)',
    },

    '.card-title': {
      fontSize: '1.1rem',
      fontWeight: '800',
      letterSpacing: '-0.025em',
      lineHeight: '1.3',
      color: 'var(--z-color-text-solid)',
      marginBottom: '0.2rem',
    },

    // WCAG AA: bumped from 0.38 → 0.55 opacity (~5.6:1 contrast on dark card bg)
    '.card-subtitle': {
      fontSize: '0.78rem',
      color: 'var(--z-color-text-muted)',
      letterSpacing: '0.01em',
      marginBottom: '0.85rem',
    },

    // ── Deep void variant — just overrides variables ───────────────────────────
    '.card-dark': {
      '--card-gradient':      'var(--z-surface-card-deep)',
      '--card-border-color':  'var(--z-color-border-dim)',
      '--card-shadow':        'var(--z-shadow-card-deep)',
      '--card-bracket-color': 'color-mix(in srgb, var(--zyna) 28%, transparent)',
      '--card-bar-gradient':  'linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--zyna) 18%, transparent) 25%, color-mix(in srgb, var(--zyna) 18%, transparent) 75%, transparent 100%)',
    },

    // ── Animated gold-glow variant — just overrides variables ─────────────────
    // The zyna-card-pulse keyframe uses --card-glow-lo and --card-glow-hi,
    // so any custom variant can produce a different-coloured pulse.
    '.card-glow': {
      '--card-border-color':  'color-mix(in srgb, var(--zyna) 22%, transparent)',
      '--card-bracket-color': 'color-mix(in srgb, var(--zyna) 70%, transparent)',
      '--card-bracket-size':  '22px',
      '--card-bar-gradient':  'linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--zyna) 60%, transparent) 20%, color-mix(in srgb, var(--zyna) 60%, transparent) 80%, transparent 100%)',
      '--card-animation':     'zyna-card-pulse 4s ease-in-out infinite',
      '--card-glow-lo':       'color-mix(in srgb, var(--zyna) 12%, transparent)',
      '--card-glow-hi':       'color-mix(in srgb, var(--zyna) 26%, transparent)',
    },

    '.card-compact .card-header': {
      padding: '0.4rem 0.85rem',
    },

    '.card-compact .card-body': {
      padding: '0.75rem 0.85rem',
    },

    '.card-compact .card-footer': {
      padding: '0.4rem 0.85rem',
    },

    '.card-compact .card-title': {
      fontSize: '0.85rem',
      marginBottom: '0.1rem',
    },

    '.card-compact .card-subtitle': {
      fontSize: '0.68rem',
      marginBottom: '0.55rem',
    },

    // ── Shape modifiers ────────────────────────────────────────────────────────
    '.card-rounded': { borderRadius: 'var(--z-corner-xl)', clipPath: 'none' },
    '.card-notch':   { clipPath: shapes.notch('var(--zp-corner-card)').outer, borderRadius: '0' },
  }
}
