/**
 * Card component — CSS variable API
 *
 * To create a new card style, set these variables on your class:
 *
 *   --card-gradient          Base colour gradient (texture + genre overlay are stacked on top)
 *   --card-border-color      Border colour
 *   --card-shadow            box-shadow
 *   --card-bracket-color     Corner L-bracket stroke colour
 *   --card-bracket-size      Corner bracket arm length (default: 20px)
 *   --card-bracket-stroke    Corner bracket line thickness (default: 1.5px)
 *   --card-bar-gradient      Top luminescent power-bar gradient (falls back to --z-card-bar-bg genre default)
 *   --card-bar-shadow        Top power-bar box-shadow glow (falls back to --z-card-bar-shadow)
 *   --card-animation         CSS animation shorthand (e.g. zyna-card-pulse 4s ease-in-out infinite)
 *   --card-glow-lo           Pulse glow colour at rest  (used by zyna-card-pulse keyframe)
 *   --card-glow-hi           Pulse glow colour at peak  (used by zyna-card-pulse keyframe)
 *   --card-header-border     Header bottom border (and footer top border) colour
 *   --card-header-bg         Header background tint
 *   --card-header-color      Header text colour
 *   --card-header-dot-color  Status dot colour in the card header
 *   --card-header-dot-shadow Status dot box-shadow glow
 *   --card-header-text-shadow Header text luminescence (text-shadow)
 *   --card-title-text-shadow .card-title text luminescence (text-shadow)
 *
 * Genre structural tokens (set on html by ops.js defaults, overridden by genre CSS selectors):
 *
 *   --z-card-clip                    clip-path polygon string (Ops = none)
 *   --z-card-filter                  filter: drop-shadow() for clip-path shaped cards
 *   --z-card-gradient                Base colour surface (Cyberpunk = green-tinted)
 *   --z-card-border-color            Border colour
 *   --z-card-shadow                  box-shadow
 *   --z-card-bar-height              Top power bar height (Ops = 1px, Cyberpunk = 3px)
 *   --z-card-bar-bg                  Top power bar genre default. --card-bar-gradient (public API)
 *                                    takes priority; this is only the fallback when unset.
 *   --z-card-bar-shadow              Top power bar box-shadow glow genre default
 *   --z-card-header-bg               Header background tint
 *   --z-card-header-border           Header bottom border colour
 *   --z-card-header-color            Header text colour
 *   --z-card-header-letter-spacing   Header letter-spacing
 *   --z-card-header-text-shadow      Header text-shadow (Ops = none, Cyberpunk = neon glow)
 *   --z-card-header-dot-size         Status dot diameter (Ops = 5px, Cyberpunk = 7px)
 *   --z-card-header-dot-bg           Status dot background colour
 *   --z-card-header-dot-shadow       Status dot box-shadow glow
 *   --z-card-header-dot-animation    Status dot animation (Ops = none, Cyberpunk = pulse)
 *   --z-card-bracket-color           Corner L-bracket colour
 *   --z-card-bracket-size            Corner L-bracket arm length
 *   --z-card-bracket-stroke          Corner L-bracket line thickness (Ops = 1.5px, Cyberpunk = 2px)
 *   --z-card-texture                 Surface overlay (Ops = transparent, Cyberpunk = scanlines)
 *   --z-card-title-text-shadow       .card-title text-shadow
 *   --z-card-glow-duration           .card-glow animation duration (Ops = 4s, Cyberpunk = 5s)
 *   --z-card-default-glow-lo         Base card resting glow colour (transparent in Ops)
 *   --z-card-default-glow-hi         Base card peak glow colour (transparent in Ops)
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
import shapes from '../../utils/shapes.js'

export default function(theme) {
  // All 4 corner L-brackets drawn as 8 stacked background-image gradients
  // on a single pseudo-element. Uses --card-bracket-color and --card-bracket-size
  // so any variant just sets those two variables.
  function cornerBrackets() {
    const c = 'var(--card-bracket-color)'
    const s = 'var(--card-bracket-size)'
    const t = 'var(--card-bracket-stroke)'
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
      backgroundSize:     `${s} ${t}, ${t} ${s}, ${s} ${t}, ${t} ${s}, ${s} ${t}, ${t} ${s}, ${s} ${t}, ${t} ${s}`,
      backgroundPosition: '0 0, 0 0, 100% 0, 100% 0, 0 100%, 0 100%, 100% 100%, 100% 100%',
      backgroundRepeat:   'no-repeat',
    }
  }

  return {
    // ── @property registrations ───────────────────────────────────────────────
    // Typed color registrations allow native interpolation and prevent accidental
    // cascade from ancestor elements (inherits: false).
    // NOTE: --card-bracket-color is NOT registered — its value uses
    // color-mix(in oklch, var(--zyna) …) which cannot be a static @property initial-value.
    '@property --card-border-color': { syntax: '"<color>"', inherits: 'false', initialValue: 'rgba(255,255,255,0.05)' },
    '@property --card-glow-lo':      { syntax: '"<color>"', inherits: 'false', initialValue: 'rgba(0,0,0,0)' },
    '@property --card-glow-hi':      { syntax: '"<color>"', inherits: 'false', initialValue: 'rgba(0,0,0,0)' },

    // ── Keyframes ─────────────────────────────────────────────────────────────
    // Card glow pulse — animates filter: drop-shadow() rather than box-shadow so
    // Chrome can GPU-composite the animation (box-shadow always triggers CPU repaint).
    // Uses --card-glow-lo / --card-glow-hi so any variant produces a different-coloured
    // pulse by setting those two variables alongside --card-animation.
    '@keyframes zyna-card-pulse': {
      '0%, 100%': {
        filter: 'drop-shadow(0 0 18px var(--card-glow-lo)) drop-shadow(0 0 6px var(--card-glow-lo))',
      },
      '50%': {
        filter: 'drop-shadow(0 0 38px var(--card-glow-hi)) drop-shadow(0 0 14px var(--card-glow-hi))',
      },
    },

    // ── Base ─────────────────────────────────────────────────────────────────
    ':where(.card)': {
      '--card-gradient':      'var(--z-card-gradient)',
      '--card-border-color':  'var(--z-card-border-color)',
      '--card-shadow':        'var(--z-card-shadow)',
      // --card-bracket-* are element-level tokens; variants override these locally.
      // Each falls back to its genre structural token so genres control the defaults.
      '--card-bracket-color':  'var(--z-card-bracket-color)',
      '--card-bracket-size':   'var(--z-card-bracket-size)',
      '--card-bracket-stroke': 'var(--z-card-bracket-stroke)',
      // --card-bar-gradient is the public API for the top power-bar colour.
      // Genres set the fallback via --z-card-bar-bg: var(--card-bar-gradient, <default>)
      // so custom variants only need to set --card-bar-gradient on the element.
      '--card-animation':     'none',
      // --z-card-default-glow-lo/hi: genre structural tokens. Ops = transparent (no base pulse).
      // Cyberpunk sets neon values so that .card-glow glows in the right colour automatically.
      '--card-glow-lo':       'var(--z-card-default-glow-lo)',
      '--card-glow-hi':       'var(--z-card-default-glow-hi)',

      position: 'relative',
      // Off-screen cards skip rendering entirely; contain-intrinsic-size provides
      // a placeholder height so the scroll bar doesn't jank when they come into view.
      contentVisibility: 'auto',
      containIntrinsicSize: 'auto 200px',
      // Scopes layout and style to this element so the browser skips costly
      // cross-tree invalidations when card contents change.
      // Note: contain:paint is intentionally excluded — the card's box-shadow and
      // filter:drop-shadow() (via --z-card-filter) both draw outside the border-box;
      // paint containment would clip them, silently destroying depth shadows and glows.
      contain: 'layout style',
      clipPath: 'var(--z-card-clip)',
      // box-shadow is clipped by clip-path, so genres that add clip-path shapes
      // use filter:drop-shadow() via --z-card-filter instead — it traces the outline.
      filter: 'var(--z-card-filter)',
      // Three background layers (front to back):
      //   1. --z-card-texture  — genre-specific surface overlay (Cyberpunk = neon scanlines)
      //   2. Ops scanline      — subtle horizontal stripe texture always present
      //   3. --card-gradient   — base colour gradient
      background: [
        'var(--z-card-texture)',
        'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)',
        'var(--card-gradient)',
      ].join(', '),
      border: '1px solid var(--card-border-color)',
      boxShadow: 'var(--card-shadow)',
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
      // --card-bar-gradient is the public API; falls back to --z-card-bar-bg (genre default).
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: 'var(--z-card-bar-height)',
        background: 'var(--card-bar-gradient, var(--z-card-bar-bg))',
        boxShadow: 'var(--card-bar-shadow, var(--z-card-bar-shadow))',
        zIndex: '1',
        pointerEvents: 'none',
      },
    },

    ':where(.card-body)': {
      padding: '1.5rem',
      position: 'relative',
    },

    // HUD readout header — status dot + mono uppercase label
    // --card-header-* are public API; each falls back to the genre structural token.
    ':where(.card-header)': {
      padding: '0.7rem 1.25rem',
      borderBottom: '1px solid var(--card-header-border, var(--z-card-header-border))',
      background: 'var(--card-header-bg, var(--z-card-header-bg))',
      fontFamily: 'var(--z-font-mono)',
      fontSize: '0.62rem',
      fontWeight: '700',
      letterSpacing: 'var(--z-card-header-letter-spacing)',
      textTransform: 'uppercase',
      color: 'var(--card-header-color, var(--z-card-header-color))',
      textShadow: 'var(--card-header-text-shadow, var(--z-card-header-text-shadow))',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      position: 'relative',

      '&::before': {
        content: '""',
        width: 'var(--z-card-header-dot-size)',
        height: 'var(--z-card-header-dot-size)',
        borderRadius: '50%',
        background: 'var(--card-header-dot-color, var(--z-card-header-dot-bg))',
        flexShrink: '0',
        boxShadow: 'var(--card-header-dot-shadow, var(--z-card-header-dot-shadow))',
        animation: 'var(--z-card-header-dot-animation)',
      },
    },

    ':where(.card-footer)': {
      padding: '0.7rem 1.25rem',
      borderTop: '1px solid var(--card-header-border, var(--z-card-header-border))',
    },

    ':where(.card-title)': {
      fontSize: '1.1rem',
      fontWeight: '800',
      letterSpacing: '-0.025em',
      lineHeight: '1.3',
      color: 'var(--z-color-text-solid)',
      textShadow: 'var(--card-title-text-shadow, var(--z-card-title-text-shadow))',
      marginBottom: '0.2rem',
    },

    // WCAG AA: bumped from 0.38 → 0.55 opacity (~5.6:1 contrast on dark card bg)
    ':where(.card-subtitle)': {
      fontSize: '0.78rem',
      color: 'var(--z-color-text-muted)',
      letterSpacing: '0.01em',
      marginBottom: '0.85rem',
    },

    // ── Deep void variant — just overrides variables ───────────────────────────
    ':where(.card-dark)': {
      '--card-gradient':      'var(--z-surface-card-deep)',
      '--card-border-color':  'var(--z-color-border-dim)',
      '--card-shadow':        'var(--z-shadow-card-deep)',
      '--card-bracket-color': 'color-mix(in oklch, var(--zyna) 28%, transparent)',
      '--card-bar-gradient':  'linear-gradient(90deg, transparent 0%, color-mix(in oklch, var(--zyna) 38%, transparent) 20%, color-mix(in oklch, var(--zyna) 38%, transparent) 80%, transparent 100%)',
    },

    // ── Animated gold-glow variant — just overrides variables ─────────────────
    // The zyna-card-pulse keyframe uses --card-glow-lo and --card-glow-hi,
    // so any custom variant can produce a different-coloured pulse.
    // In Cyberpunk, --zyna = #39FF14 so these color-mix expressions automatically
    // produce neon-green pulse glows without any additional genre overrides.
    ':where(.card-glow)': {
      '--card-border-color':  'color-mix(in oklch, var(--zyna) 22%, transparent)',
      '--card-bracket-color': 'color-mix(in oklch, var(--zyna) 70%, transparent)',
      '--card-bracket-size':  '22px',
      '--card-bar-gradient':  'linear-gradient(90deg, transparent 0%, color-mix(in oklch, var(--zyna) 80%, transparent) 20%, color-mix(in oklch, var(--zyna) 80%, transparent) 80%, transparent 100%)',
      '--card-animation':     'zyna-card-pulse var(--z-card-glow-duration) var(--z-ease-spring) infinite',
      '--card-glow-lo':       'color-mix(in oklch, var(--zyna) 12%, transparent)',
      '--card-glow-hi':       'color-mix(in oklch, var(--zyna) 26%, transparent)',
    },

    ':where(.card-sm) :where(.card-header)': {
      padding: '0.4rem 0.85rem',
    },

    ':where(.card-sm) :where(.card-body)': {
      padding: '0.75rem 0.85rem',
    },

    ':where(.card-sm) :where(.card-footer)': {
      padding: '0.4rem 0.85rem',
    },

    ':where(.card-sm) :where(.card-title)': {
      fontSize: '0.85rem',
      marginBottom: '0.1rem',
    },

    ':where(.card-sm) :where(.card-subtitle)': {
      fontSize: '0.68rem',
      marginBottom: '0.55rem',
    },

    // ── Shape modifiers ────────────────────────────────────────────────────────
    ':where(.card-round)': { borderRadius: 'var(--z-corner-xl)', clipPath: 'none' },
    ':where(.card-bevel)': {
      clipPath: shapes.bevel('var(--zp-corner-card)').outer,
      borderRadius: '0',
      // clip-path clips box-shadow — zero both card and power-bar shadows, use
      // filter:drop-shadow() instead which traces the bevel outline after clipping.
      '--card-shadow':     'none',
      '--card-bar-shadow': 'none',
      filter: 'drop-shadow(0 24px 70px rgba(0,0,0,0.60)) drop-shadow(0 0 0 1px rgba(255,255,255,0.02))',
    },
  }
}
