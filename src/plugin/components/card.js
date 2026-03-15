/**
 * Card component — CSS variable API
 *
 * To create a new card style, set these variables on your class:
 *
 *   --card-gradient        Base colour gradient (texture + genre overlay are stacked on top)
 *   --card-border-color    Border colour
 *   --card-shadow          box-shadow
 *   --card-bracket-color   Corner L-bracket stroke colour
 *   --card-bracket-size    Corner bracket arm length (default: 20px)
 *   --card-bracket-stroke  Corner bracket line thickness (default: 1.5px)
 *   --z-card-bar-bg        Top luminescent power-bar gradient (override on element to change per-variant)
 *   --card-animation       CSS animation shorthand (e.g. zyna-card-pulse 4s ease-in-out infinite)
 *   --card-glow-lo         Pulse glow colour at rest  (used by zyna-card-pulse keyframe)
 *   --card-glow-hi         Pulse glow colour at peak  (used by zyna-card-pulse keyframe)
 *
 * Genre structural tokens (set on :root by ops.js defaults, overridden by other genres):
 *
 *   --z-card-clip                    clip-path polygon string (Ops = none)
 *   --z-card-filter                  filter: drop-shadow() for clip-path shaped cards
 *   --z-card-gradient                Base colour surface (Cyberpunk = green-tinted)
 *   --z-card-border-color            Border colour
 *   --z-card-shadow                  box-shadow
 *   --z-card-bar-height              Top power bar height (Ops = 1px, Cyberpunk = 3px)
 *   --z-card-bar-bg                  Top power bar background. Reads --card-bar-gradient
 *                                    via lazy CSS evaluation so variants auto-update.
 *   --z-card-bar-shadow              Top power bar box-shadow glow
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
import shapes from '../shapes.js'

export default function(theme) {
  // All 4 corner L-brackets drawn as 8 stacked background-image gradients
  // on a single pseudo-element. Uses --card-bracket-color and --card-bracket-size
  // so any variant just sets those two variables.
  function cornerBrackets() {
    const c = 'var(--card-bracket-color)'
    const s = 'var(--z-card-bracket-size)'
    const t = 'var(--z-card-bracket-stroke)'
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
    // ── Base ─────────────────────────────────────────────────────────────────
    ':where(.card)': {
      '--card-gradient':      'var(--z-card-gradient)',
      '--card-border-color':  'var(--z-card-border-color)',
      '--card-shadow':        'var(--z-card-shadow)',
      // --card-bracket-color is element-level so variants can override it locally.
      // Size and stroke are read directly from root tokens in cornerBrackets() so the
      // builder and genre tokens update ::before without @property inheritance issues.
      '--card-bracket-color':  'var(--z-card-bracket-color)',
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
      // Note: contain:paint is intentionally excluded — it creates a new stacking
      // context that prevents ::before bracket pseudo-elements from painting correctly
      // when the card is near the viewport edge.
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
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: 'var(--z-card-bar-height)',
        background: 'var(--z-card-bar-bg)',
        boxShadow: 'var(--z-card-bar-shadow)',
        zIndex: '1',
        pointerEvents: 'none',
      },
    },

    ':where(.card-body)': {
      padding: '1.5rem',
      position: 'relative',
    },

    // HUD readout header — status dot + mono uppercase label
    ':where(.card-header)': {
      padding: '0.7rem 1.25rem',
      borderBottom: '1px solid var(--z-card-header-border)',
      background: 'var(--z-card-header-bg)',
      fontFamily: 'var(--z-font-mono)',
      fontSize: '0.62rem',
      fontWeight: '700',
      letterSpacing: 'var(--z-card-header-letter-spacing)',
      textTransform: 'uppercase',
      color: 'var(--z-card-header-color)',
      textShadow: 'var(--z-card-header-text-shadow)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      position: 'relative',

      '&::before': {
        content: '""',
        width: 'var(--z-card-header-dot-size)',
        height: 'var(--z-card-header-dot-size)',
        borderRadius: '50%',
        background: 'var(--z-card-header-dot-bg)',
        flexShrink: '0',
        boxShadow: 'var(--z-card-header-dot-shadow)',
        animation: 'var(--z-card-header-dot-animation)',
      },
    },

    ':where(.card-footer)': {
      padding: '0.7rem 1.25rem',
      borderTop: '1px solid var(--z-card-header-border)',
    },

    ':where(.card-title)': {
      fontSize: '1.1rem',
      fontWeight: '800',
      letterSpacing: '-0.025em',
      lineHeight: '1.3',
      color: 'var(--z-color-text-solid)',
      textShadow: 'var(--z-card-title-text-shadow)',
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
      '--z-card-bar-bg':      'linear-gradient(90deg, transparent 0%, color-mix(in oklch, var(--zyna) 38%, transparent) 20%, color-mix(in oklch, var(--zyna) 38%, transparent) 80%, transparent 100%)',
    },

    // ── Animated gold-glow variant — just overrides variables ─────────────────
    // The zyna-card-pulse keyframe uses --card-glow-lo and --card-glow-hi,
    // so any custom variant can produce a different-coloured pulse.
    // In Cyberpunk, --zyna = #39FF14 so these color-mix expressions automatically
    // produce neon-green pulse glows without any additional genre overrides.
    ':where(.card-glow)': {
      '--card-border-color':  'color-mix(in oklch, var(--zyna) 22%, transparent)',
      '--card-bracket-color': 'color-mix(in oklch, var(--zyna) 70%, transparent)',
      '--z-card-bracket-size': '22px',
      '--z-card-bar-bg':      'linear-gradient(90deg, transparent 0%, color-mix(in oklch, var(--zyna) 80%, transparent) 20%, color-mix(in oklch, var(--zyna) 80%, transparent) 80%, transparent 100%)',
      '--card-animation':     'zyna-card-pulse var(--z-card-glow-duration) var(--z-ease-spring) infinite',
      '--card-glow-lo':       'color-mix(in oklch, var(--zyna) 12%, transparent)',
      '--card-glow-hi':       'color-mix(in oklch, var(--zyna) 26%, transparent)',
    },

    ':where(.card-compact) :where(.card-header)': {
      padding: '0.4rem 0.85rem',
    },

    ':where(.card-compact) :where(.card-body)': {
      padding: '0.75rem 0.85rem',
    },

    ':where(.card-compact) :where(.card-footer)': {
      padding: '0.4rem 0.85rem',
    },

    ':where(.card-compact) :where(.card-title)': {
      fontSize: '0.85rem',
      marginBottom: '0.1rem',
    },

    ':where(.card-compact) :where(.card-subtitle)': {
      fontSize: '0.68rem',
      marginBottom: '0.55rem',
    },

    // ── Shape modifiers ────────────────────────────────────────────────────────
    ':where(.card-round)': { borderRadius: 'var(--z-corner-xl)', clipPath: 'none' },
    ':where(.card-bevel)':   { clipPath: shapes.bevel('var(--zp-corner-card)').outer, borderRadius: '0' },
  }
}
