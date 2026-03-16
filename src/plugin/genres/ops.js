/**
 * Ops genre — default visual paradigm.
 * Clean military HUD: gold accents, diagonal corners, subtle surfaces.
 *
 * tokens  — global tokens only (motion, easing). Spread into :root by index.js
 *           so they are available as global defaults and override-able by JS
 *           setProperty (genre builder motion sliders).
 *
 * styles  — structural CSS rules on the html element.
 *           Component structural tokens (--z-btn-*, --z-badge-*, --z-card-*,
 *           --z-alert-*) live here instead of :root so they are scoped to the
 *           element level, not the global namespace. Components inherit them
 *           from html via normal CSS inheritance.
 *           Specificity: html [0,0,1] — deliberately lower than any genre
 *           override selector (html[data-genre="cyberpunk"] = [0,1,1]).
 */
import shapes from '../utils/shapes.js'

export const name = 'Ops'

export const swatches = {
  brand:   '#C9A84C',
  success: '#00FFB2',
  danger:  '#FF3366',
  info:    '#00D4FF',
}

// Global tokens only — set on :root and override-able by JS setProperty.
// Component structural tokens live in styles['html'] below.
export const tokens = {
  // ── Motion ─────────────────────────────────────────────────────────────────
  '--z-duration-fast': '0.18s',
  '--z-duration-base': '0.22s',
  '--z-duration-slow': '0.28s',
  // Directional easing — genre-swappable motion character.
  // Components use var(--z-ease-exit) on base transitions (hover-out) and
  // var(--z-ease-enter) on :hover transitions (hover-in). CSS reads the
  // transition from the state being transitioned TO, so each direction
  // gets its own curve without any JS or specificity tricks.
  '--z-ease-enter':  'cubic-bezier(0.22, 1, 0.36, 1)',   // smooth deceleration, "landing"
  '--z-ease-exit':   'cubic-bezier(0.55, 0, 1, 0.45)',   // acceleration out, "lifting"
  '--z-ease-spring': 'cubic-bezier(0.34, 1.4, 0.64, 1)', // modest overshoot
}

export const styles = {
  // ── Structural component defaults — scoped to html, not :root ──────────────
  // Specificity [0,0,1] so any genre override selector (html[data-genre="X"]
  // at [0,1,1]) wins without needing !important or additional specificity tricks.
  // The genre builder's inline setProperty() on html always wins over these rules.
  'html': {
    // ── Button structural ───────────────────────────────────────────────────
    '--z-btn-clip':         `polygon(0 0, calc(100% - var(--btn-corner)) 0, 100% var(--btn-corner), 100% 100%, var(--btn-corner) 100%, 0 calc(100% - var(--btn-corner)))`,
    '--z-btn-corner':       'var(--z-corner)',
    '--z-btn-inner-clip':   shapes.diagonal('var(--btn-corner)').inner,
    '--z-btn-active-scale': '0.96',
    '--z-btn-scan-stop':    '70%',

    // ── Alert structural ────────────────────────────────────────────────────
    '--z-alert-radius':       '0 3px 3px 0',
    '--z-alert-bar-width':    '3px',
    '--z-alert-prefix':       '"// "',
    '--z-alert-bg-opacity':   '5.5%',
    '--z-alert-border':          'none',
    '--z-alert-prefix-opacity': '0.38',
    '--z-alert-bar-glow':        'none',
    '--z-alert-texture':         'none',
    // Padding — left accounts for the bar; top is uniform in Ops
    '--z-alert-padding-top':  '0.875rem',
    '--z-alert-padding-left': 'calc(1.25rem + var(--z-alert-bar-width))',
    // Bar pseudo-element geometry — Ops: left bar (full height, thin width)
    // inset: top right bottom left. top:0 + bottom:0 stretch the bar full height.
    // height must be 'auto' so the top/bottom constraints govern — '100%' would be
    // discarded by CSS over-constraint resolution and produce a zero-height bar.
    '--z-alert-bar-inset':    '0 auto 0 0',   // top right bottom left
    '--z-alert-bar-w':        'var(--z-alert-bar-width)',
    '--z-alert-bar-h':        'auto',
    '--z-alert-bar-radius':   'var(--z-alert-radius) 0 0 var(--z-alert-radius)',

    // ── Card structural ─────────────────────────────────────────────────────
    '--z-card-clip':                  'none',
    '--z-card-filter':                'none',
    '--z-card-texture':               'linear-gradient(transparent, transparent)',
    '--z-card-gradient':              'var(--z-surface-card)',
    '--z-card-border-color':          'var(--z-color-border)',
    '--z-card-shadow':                'var(--z-shadow-card)',
    '--z-card-bracket-color':         'color-mix(in oklch, var(--zyna) 42%, transparent)',
    '--z-card-bracket-size':          '20px',
    '--z-card-bracket-stroke':        '1.5px',
    '--z-card-bar-height':            '1px',
    '--z-card-bar-bg':                'linear-gradient(90deg, transparent 0%, color-mix(in oklch, var(--zyna) 55%, transparent) 20%, color-mix(in oklch, var(--zyna) 55%, transparent) 80%, transparent 100%)',
    '--z-card-bar-shadow':            'none',
    '--z-card-header-bg':             'transparent',
    '--z-card-header-border':         'var(--z-color-border)',
    '--z-card-header-color':          'color-mix(in oklch, var(--zyna) 75%, transparent)',
    '--z-card-header-letter-spacing': '0.14em',
    '--z-card-header-text-shadow':    'none',
    '--z-card-header-dot-size':       '5px',
    '--z-card-header-dot-bg':         'color-mix(in oklch, var(--zyna) 65%, transparent)',
    '--z-card-header-dot-shadow':     '0 0 6px color-mix(in oklch, var(--zyna) 65%, transparent), 0 0 16px color-mix(in oklch, var(--zyna) 30%, transparent)',
    '--z-card-header-dot-animation':  'none',
    '--z-card-title-text-shadow':     'none',
    '--z-card-glow-duration':         '4s',
    // Default glow colours for the base .card (transparent = no pulse). .card-glow
    // overrides these locally to produce the gold / neon pulse effect.
    '--z-card-default-glow-lo':       'rgba(0,0,0,0)',
    '--z-card-default-glow-hi':       'rgba(0,0,0,0)',

    // ── Badge structural ────────────────────────────────────────────────────
    // Note: --z-badge-clip is intentionally absent for Ops. The base clip-path is applied
    // directly in badge.js as a fallback: var(--z-badge-clip, polygon(...)). This avoids
    // a nested @property <length> var chain that can break clip-path resolution.
    // Cyberpunk sets --z-badge-clip: inset(0) — no nested vars, works fine via token.
    '--z-badge-radius':          '0',
    '--z-badge-padding':         '0.22rem 0.85rem',
    '--z-badge-letter-spacing':  '0.13em',
    '--z-badge-inset-shadow':    'none',
    '--z-badge-scan-duration':   '5s',
    // Inner clip for .badge-outline — same two-level pattern as --z-btn-inner-clip.
    // Uses var(--badge-offset) which is an unregistered custom property; lazy CSS
    // substitution resolves it at the element level (same as --btn-corner in buttons).
    '--z-badge-inner-clip':      'polygon(calc(var(--badge-offset) + 2px) 2px, calc(100% - 2px) 2px, calc(100% - calc(var(--badge-offset) + 2px)) calc(100% - 2px), 2px calc(100% - 2px))',

    // ── Docs chrome structural ───────────────────────────────────────────────
    // docs.css references these with CSS fallbacks (e.g. var(--z-topbar-border, var(--border)))
    // so they are optional — but declared here to complete the ops source-of-truth contract
    // and make them discoverable when authoring new genres.
    '--z-topbar-border':         'var(--z-color-border)',
    '--z-topbar-glow':           'none',
    '--z-sidebar-active-shadow': 'none',
  },
}

export default { name, tokens, swatches, styles }
