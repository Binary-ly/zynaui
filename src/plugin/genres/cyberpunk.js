/**
 * Cyberpunk genre — neon-drenched terminal aesthetic.
 * Acid-green palette, scan-line textures, edgy geometry, pulsing glows.
 *
 * tokens  — CSS custom property overrides (set on :root at runtime via JS)
 * styles  — structural CSS selector rules compiled into zynaui.css via addBase.
 *            Only contains overrides that cannot be expressed as tokens:
 *            per-variant badge intensities (class-level variables) and the
 *            body::before scan-line overlay (pseudo-element creation).
 *            All layout/geometry/animation differences are tokenised.
 */

export const name = 'Cyberpunk'

export const swatches = {
  brand:   '#39FF14',
  success: '#39FF14',
  danger:  '#FF073A',
  info:    '#7B61FF',
}

export const tokens = {
  // ── Color ───────────────────────────────────────────────────────────────────
  '--zyna':        '#39FF14',
  '--zyna-dark':   '#1A8A00',
  '--zp-success':  '#39FF14',
  '--zp-danger':   '#FF073A',
  '--zp-warning':  '#FFD700',
  '--zp-info':     '#7B61FF',
  '--zp-text':     '#E0FFE0',
  '--z-font-mono': "'Share Tech Mono', 'Courier New', monospace",

  // ── Motion ──────────────────────────────────────────────────────────────────
  '--z-duration-fast': '0.12s',
  '--z-duration-base': '0.15s',
  '--z-duration-slow': '0.20s',
  // Directional easing — terminal, edge, aggressive
  '--z-ease-enter':  'cubic-bezier(0, 0.85, 0.1, 1)',    // sharp deceleration, "slamming in"
  '--z-ease-exit':   'cubic-bezier(0.9, 0, 1, 0.15)',    // hard acceleration out, "cutting"
  '--z-ease-spring': 'cubic-bezier(0.5, 1.8, 0.5, 1)',   // aggressive overshoot, "recoil"

  // ── Button structural ────────────────────────────────────────────────────────
  '--z-btn-clip':         'inset(0)',
  '--z-btn-inner-clip':   'inset(1.5px)',
  '--z-btn-corner':       '18px',
  '--z-btn-active-scale': '0.94',
  '--z-btn-scan-stop':    '55%',

  // ── Badge structural ─────────────────────────────────────────────────────────
  '--zp-corner-badge':         '14px',
  '--z-badge-clip':            'inset(0)',
  '--z-badge-padding':         '0.24rem 0.8rem',
  '--z-badge-letter-spacing':  '0.16em',
  '--z-badge-inset-shadow':    'inset 0 0 0 1px currentColor',
  '--z-badge-scan-duration':   '2.5s',
  '--z-badge-inner-clip':      'inset(2px)',

  // ── Alert structural ─────────────────────────────────────────────────────────
  '--z-alert-radius':       '0',
  '--z-alert-bar-width':    '5px',
  '--z-alert-prefix':       '"> "',
  '--z-alert-bg-opacity':   '14%',
  // Full-perimeter border in the variant's bar colour. Lazy CSS evaluation resolves
  // var(--alert-bar-color) at the element level even though this token is on :root.
  '--z-alert-border':          '1px solid color-mix(in oklch, var(--alert-bar-color) 35%, transparent)',
  '--z-alert-prefix-opacity': '0.55',
  '--z-alert-bar-glow':        '0 0 14px var(--alert-bar-color), 0 0 30px color-mix(in oklch, var(--alert-bar-color) 40%, transparent)',
  '--z-alert-texture':         'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.018) 3px, rgba(255,255,255,0.018) 4px)',
  // Top bar geometry: padding pushes top instead of left; bar spans full width
  '--z-alert-padding-top':  'calc(0.875rem + var(--z-alert-bar-width))',
  '--z-alert-padding-left': '1.25rem',
  '--z-alert-bar-inset':    '0 0 auto 0',   // top right bottom left
  '--z-alert-bar-w':        '100%',
  '--z-alert-bar-h':        'var(--z-alert-bar-width)',
  '--z-alert-bar-radius':   '0',

  // ── Card structural — rectangular, no clip-path geometry ────────────────────
  '--z-card-gradient':              'linear-gradient(145deg, rgba(2,18,4,0.98) 0%, rgba(0,8,1,0.99) 100%)',
  '--z-card-border-color':          'color-mix(in oklch, var(--zyna) 60%, transparent)',
  '--z-card-shadow':                '0 0 0 1px color-mix(in oklch, var(--zyna) 25%, transparent), 0 8px 32px rgba(0,0,0,0.6)',
  '--z-card-bar-height':            '3px',
  '--z-card-bar-bg':                'var(--zyna)',
  '--z-card-bar-shadow':            '0 0 14px var(--zyna), 0 0 32px color-mix(in oklch, var(--zyna) 50%, transparent)',
  '--z-card-header-bg':             'color-mix(in oklch, var(--zyna) 10%, transparent)',
  '--z-card-header-border':         'color-mix(in oklch, var(--zyna) 30%, transparent)',
  '--z-card-header-color':          'var(--zyna)',
  '--z-card-header-letter-spacing': '0.18em',
  '--z-card-header-text-shadow':    '0 0 10px color-mix(in oklch, var(--zyna) 60%, transparent)',
  '--z-card-header-dot-size':       '7px',
  '--z-card-header-dot-bg':         'var(--zyna)',
  '--z-card-header-dot-shadow':     '0 0 8px var(--zyna), 0 0 20px color-mix(in oklch, var(--zyna) 50%, transparent)',
  '--z-card-header-dot-animation':  'zyna-pulse-ring 2s var(--z-ease-enter) infinite',
  '--z-card-bracket-size':          '22px',
  '--z-card-bracket-stroke':        '2px',
  '--z-card-bracket-color':         'color-mix(in oklch, var(--zyna) 80%, transparent)',
  '--z-card-texture':               'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,255,20,0.022) 1px, rgba(0,255,20,0.022) 2px)',
  '--z-card-title-text-shadow':     '0 0 18px color-mix(in oklch, var(--zyna) 22%, transparent)',
  '--z-card-glow-duration':         '5s',
  // Default glow colours applied to every .card so .card-glow pulses in neon automatically
  '--z-card-default-glow-lo':       'color-mix(in oklch, var(--zyna) 8%, transparent)',
  '--z-card-default-glow-hi':       'color-mix(in oklch, var(--zyna) 22%, transparent)',

  // ── Docs chrome ─────────────────────────────────────────────────────────────
  '--z-topbar-border':         'color-mix(in oklch, var(--zyna) 40%, transparent)',
  '--z-topbar-glow':           '0 1px 0 color-mix(in oklch, var(--zyna) 20%, transparent), 0 2px 14px color-mix(in oklch, var(--zyna) 10%, transparent)',
  '--z-sidebar-active-shadow': 'inset 3px 0 0 var(--zyna), inset 6px 0 0 color-mix(in oklch, var(--zyna) 30%, transparent)',
}

export const styles = {
  // ── Badges — per-variant intensity overrides ─────────────────────────────────
  // These are class-level CSS variable overrides (not global tokens) so they must
  // live here as scoped rules. The base badge structure (clip, padding, border) is
  // handled entirely via tokens above — no specificity fights needed.
  'html[data-genre="cyberpunk"] .badge-primary': {
    '--badge-bg':   'color-mix(in oklch, var(--zyna) 20%, transparent)',
    '--badge-glow': 'drop-shadow(0 0 8px color-mix(in oklch, var(--zyna) 70%, transparent)) drop-shadow(0 0 20px color-mix(in oklch, var(--zyna) 28%, transparent))',
  },
  'html[data-genre="cyberpunk"] .badge-success': {
    '--badge-bg':   'color-mix(in oklch, var(--z-color-success) 18%, transparent)',
    '--badge-glow': 'drop-shadow(0 0 8px color-mix(in oklch, var(--z-color-success) 70%, transparent)) drop-shadow(0 0 18px color-mix(in oklch, var(--z-color-success) 28%, transparent))',
  },
  'html[data-genre="cyberpunk"] .badge-danger': {
    '--badge-bg':   'color-mix(in oklch, var(--z-color-danger) 18%, transparent)',
    '--badge-glow': 'drop-shadow(0 0 8px color-mix(in oklch, var(--z-color-danger) 70%, transparent)) drop-shadow(0 0 18px color-mix(in oklch, var(--z-color-danger) 28%, transparent))',
  },
  'html[data-genre="cyberpunk"] .badge-warning': {
    '--badge-bg':   'color-mix(in oklch, var(--z-color-warning) 18%, transparent)',
    '--badge-glow': 'drop-shadow(0 0 8px color-mix(in oklch, var(--z-color-warning) 65%, transparent)) drop-shadow(0 0 16px color-mix(in oklch, var(--z-color-warning) 25%, transparent))',
  },
  'html[data-genre="cyberpunk"] .badge-info': {
    '--badge-bg':   'color-mix(in oklch, var(--z-color-info) 18%, transparent)',
    '--badge-glow': 'drop-shadow(0 0 8px color-mix(in oklch, var(--z-color-info) 70%, transparent)) drop-shadow(0 0 18px color-mix(in oklch, var(--z-color-info) 28%, transparent))',
  },
  'html[data-genre="cyberpunk"] .badge-secondary': {
    '--badge-bg':   'color-mix(in oklch, var(--zyna) 10%, transparent)',
    '--badge-glow': 'drop-shadow(0 0 6px color-mix(in oklch, var(--zyna) 45%, transparent))',
  },

  // ── Body scan-line overlay ────────────────────────────────────────────────────
  // Cannot be tokenised — pseudo-element creation requires a selector rule.
  'html[data-genre="cyberpunk"] body::before': {
    content: '""',
    position: 'fixed',
    inset: '0',
    zIndex: '0',
    pointerEvents: 'none',
    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in oklch, var(--zyna) 4.5%, transparent) 2px, color-mix(in oklch, var(--zyna) 4.5%, transparent) 3px)',
  },
}

export default { name, tokens, swatches, styles }
