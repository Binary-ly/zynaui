/**
 * Phosphor genre — "PHOSPHOR"
 * Amber CRT terminal. The visual language of a 1980s P3 phosphor monochrome
 * display — the warm amber glow of a DataPoint 2200 or an IBM 3101.
 *
 * First genre with stepped easing — typewriter-rhythm motion.
 * First genre with a right-side alert bar.
 * First genre to animate a CRT phosphor sweep as a page texture.
 *
 * Unique design decisions:
 *   Button shape  — left-side chevron notch: the left edge indents to a point
 *                   at vertical center, like a punch-card slot or tape-drive bay.
 *                   Each button reads as a terminal command-entry field.
 *   Alert bar     — RIGHT side (not left): the bar terminates the text line like
 *                   a cursor at end-of-line. No other genre or design system does this.
 *   Alert prefix  — ">> " double-chevron: terminal command-ready prompt.
 *   Motion        — steps(6, end) enter / steps(4, start) exit. Discrete typewriter
 *                   rhythm rather than smooth bezier curves. Simulates phosphor
 *                   persistence and digital-clock character refresh.
 *   Sweep beam    — body::after: a slow amber horizontal glow band scanning from
 *                   top to bottom of the viewport every 8 s, simulating the CRT
 *                   electron gun's raster refresh pass. CSS-only, no canvas.
 *   Scanlines     — body::before: 1 px dark bands every 3 px + radial vignette
 *                   darkening at screen edges (barrel distortion simulation).
 *   Font          — VT323: the definitive amber CRT terminal typeface.
 *   Badge scan    — 9 s: phosphor persistence — the afterglow fades very slowly.
 *
 * tokens  — global overrides (colors, motion, font).
 *           Applied via JS setProperty on html by applyGenre() — inline styles
 *           beat all stylesheets, so docs.css CSS-variable-based rules respond correctly.
 *
 * styles  — structural CSS rules compiled into zynaui.css via addBase.
 *           html[data-genre="phosphor"] at specificity [0,1,1] beats the ops
 *           defaults on html [0,0,1].
 */

export const name = 'Phosphor'

export const swatches = {
  brand:   '#FF9F0A',
  success: '#6EC96C',
  danger:  '#FF4E4E',
  info:    '#5BBFFF',
}

export const tokens = {
  // ── Brand — classic P3 phosphor amber ─────────────────────────────────────
  '--zyna':      '#FF9F0A',   // P3 phosphor amber — the precise hue of an Amber CRT tube
  '--zyna-dark': '#C97300',   // deeper warm amber

  // ── Status colors — secondary phosphor emissions ───────────────────────────
  // Different phosphor chemical compounds emit at different wavelengths.
  // Green = P1, Red = alarm, Yellow-amber = P3 blend, Blue-white = P4.
  '--zp-success': '#6EC96C',  // P1 phosphor green
  '--zp-danger':  '#FF4E4E',  // red alarm phosphor
  '--zp-warning': '#FFD060',  // yellow-amber phosphor blend
  '--zp-info':    '#5BBFFF',  // P4 blue-white phosphor

  // ── Text — phosphor amber glow ─────────────────────────────────────────────
  '--zp-text':              '#FFB742',  // warm amber emission — slightly de-saturated vs brand
  '--z-color-text-inverse': '#0A0700', // text on primary (amber fill) buttons

  // ── Surfaces — near-black with warm amber tint ─────────────────────────────
  // A CRT display in the dark: not pure black but warm near-black from
  // residual amber phosphor emission and glass tinting.
  '--z-surface-page':               '#0A0700',
  '--z-surface-inset':              '#120D02',
  '--z-surface-inset-hover':        '#1A1200',
  '--z-surface-inset-danger':       '#1A0600',
  '--z-surface-inset-danger-hover': '#220800',
  '--z-surface-card':      'linear-gradient(160deg, #120D02 0%, #0A0700 100%)',
  '--z-surface-card-deep': 'linear-gradient(160deg, #1A1200 0%, #120D02 100%)',

  // ── Borders & overlays — amber-tinted ──────────────────────────────────────
  '--z-color-border':     'rgba(255,159,10,0.12)',
  '--z-color-border-dim': 'rgba(255,159,10,0.06)',
  '--z-color-overlay':    'rgba(255,159,10,0.05)',

  // ── Shadows — phosphor bloom, not sharp drop ────────────────────────────────
  '--z-shadow-card':      '0 2px 8px rgba(0,0,0,0.5), 0 0 20px rgba(255,159,10,0.04)',
  '--z-shadow-card-deep': '0 4px 16px rgba(0,0,0,0.7), 0 0 40px rgba(255,159,10,0.06)',

  // ── Docs chrome — amber phosphor palette for docs.css CSS variables ─────────
  '--bg':        '#0A0700',
  '--bg2':       '#120D02',
  '--bg3':       '#1A1200',
  '--border':    'rgba(255,159,10,0.13)',
  '--border2':   'rgba(255,159,10,0.07)',
  '--text':      '#FFB742',
  '--text2':     'rgba(255,183,66,0.60)',
  '--text3':     'rgba(255,183,66,0.35)',
  '--topbar-bg':      'rgba(10,7,0,0.93)',
  '--z-panel-bg':     '#120D02',
  '--z-panel-shadow': '0 8px 24px rgba(0,0,0,0.6), 0 0 30px rgba(255,159,10,0.05)',

  // ── Font — VT323: the definitive amber CRT terminal typeface ───────────────
  '--z-font-mono': "'VT323', 'Courier New', monospace",

  // ── Motion — STEPPED, not smooth ──────────────────────────────────────────
  // steps() easing is unique to PHOSPHOR — no other genre or design system uses
  // discrete step timing for interactive hover transitions.
  // Each state change snaps in discrete increments, simulating phosphor
  // persistence and digital-clock character refresh cycles.
  '--z-duration-fast':  '0.16s',
  '--z-duration-base':  '0.24s',
  '--z-duration-slow':  '0.32s',
  '--z-duration-pulse': '4s',
  '--z-ease-enter':  'steps(6, end)',    // typewriter snap-in — 6 discrete frames
  '--z-ease-exit':   'steps(4, start)', // typewriter snap-out — 4 discrete frames
  '--z-ease-spring': 'steps(8, end)',   // stepped persistence — phosphor decay
}

export const styles = {
  // ── CRT phosphor sweep keyframe ────────────────────────────────────────────
  // Unique to this genre: simulates the CRT electron gun's raster scan pass.
  // The body::after element (200 px tall) descends from above the viewport
  // to below it in 8 s. translateY(100vh) is valid in CSS transforms.
  '@keyframes phosphor-sweep': {
    '0%':   { transform: 'translateY(-200px)' },
    '100%': { transform: 'translateY(100vh)' },
  },

  // ── Structural overrides — scoped to html[data-genre="phosphor"] ───────────
  // Specificity [0,1,1] beats ops defaults on html [0,0,1].
  'html[data-genre="phosphor"]': {
    'color-scheme': 'dark',

    // ── Button — terminal chevron notch ──────────────────────────────────────
    // The left edge indents to a point at vertical center, giving each button
    // the appearance of a punch-card slot or tape-drive bay entry port.
    // Each button reads as a terminal command-entry field.
    // polygon: (corner,0) top-left inset → (100%,0) top-right → (100%,100%)
    //          bottom-right → (corner,100%) bottom-left inset → (0,50%) point.
    '--z-btn-clip':         'polygon(var(--btn-corner) 0, 100% 0, 100% 100%, var(--btn-corner) 100%, 0 50%)',
    // Inner clip: 1 px inset on all straight edges, point moved 1 px right.
    '--z-btn-inner-clip':   'polygon(calc(var(--btn-corner) + 1px) 1px, calc(100% - 1px) 1px, calc(100% - 1px) calc(100% - 1px), calc(var(--btn-corner) + 1px) calc(100% - 1px), 1px 50%)',
    '--z-btn-corner':       '14px',
    '--z-btn-active-scale': '0.97',
    '--z-btn-scan-stop':    '55%',

    // ── Badge — sharp rectangular terminal tag ────────────────────────────────
    // No parallelogram, no pill — a sharp-cornered rectangle that reads as
    // a character-mode terminal status flag or punched label tape.
    '--z-badge-clip':           'inset(0)',
    '--z-badge-radius':         '0',
    '--z-badge-padding':        '0.20rem 0.70rem',
    '--z-badge-letter-spacing': '0.10em',
    '--z-badge-inset-shadow':   'inset 0 0 0 1px currentColor',
    '--z-badge-scan-duration':  '9s',  // phosphor persistence — afterglow fades slowly
    '--z-badge-inner-clip':     'inset(2px)',

    // ── Alert — RIGHT-side bar, double-chevron prompt prefix ──────────────────
    // Bar on the RIGHT: the accent terminates the text line like a cursor at
    // end-of-line. No other genre or design system has a right-side alert bar.
    // Alert container: rounded left (open side), square right (bar terminus).
    '--z-alert-radius':         '3px 0 0 3px',
    '--z-alert-bar-width':      '3px',
    '--z-alert-prefix':         '">> "',  // double-chevron: terminal ready-for-input
    '--z-alert-bg-opacity':     '8%',
    '--z-alert-border':         '1px solid rgba(255,159,10,0.10)',
    '--z-alert-prefix-opacity': '0.55',
    '--z-alert-bar-glow':       '0 0 10px var(--alert-bar-color), 0 0 20px color-mix(in oklch, var(--alert-bar-color) 40%, transparent)',
    '--z-alert-texture':        'none',
    '--z-alert-padding-top':    '0.875rem',
    '--z-alert-padding-left':   '1.25rem',  // no left bar — standard padding
    // Bar geometry: right side, full height.
    // inset shorthand: top right bottom left = 0 0 0 auto → top:0 right:0 bottom:0 left:auto
    '--z-alert-bar-inset':      '0 0 0 auto',
    '--z-alert-bar-w':          'var(--z-alert-bar-width)',
    '--z-alert-bar-h':          'auto',
    '--z-alert-bar-radius':     '0',

    // ── Card — phosphor terminal output pane ──────────────────────────────────
    '--z-card-clip':                  'none',
    '--z-card-filter':                'none',
    '--z-card-texture':               'none',
    '--z-card-gradient':              'var(--z-surface-card)',
    '--z-card-border-color':          'rgba(255,159,10,0.14)',
    '--z-card-shadow':                'var(--z-shadow-card)',
    '--z-card-bracket-color':         'color-mix(in oklch, var(--zyna) 38%, transparent)',
    '--z-card-bracket-size':          '16px',
    '--z-card-bracket-stroke':        '1px',
    // Top amber phosphor rule: fades right like a CRT trace
    '--z-card-bar-height':            '1px',
    '--z-card-bar-bg':                'linear-gradient(90deg, var(--zyna) 0%, color-mix(in oklch, var(--zyna) 0%, transparent) 100%)',
    '--z-card-bar-shadow':            '0 0 8px rgba(255,159,10,0.6), 0 0 20px rgba(255,159,10,0.2)',
    // Header: amber-tinted band — terminal window titlebar
    '--z-card-header-bg':             'rgba(255,159,10,0.06)',
    '--z-card-header-border':         'rgba(255,159,10,0.14)',
    '--z-card-header-color':          'var(--zyna)',
    '--z-card-header-letter-spacing': '0.16em',
    '--z-card-header-text-shadow':    '0 0 12px color-mix(in oklch, var(--zyna) 55%, transparent)',
    '--z-card-header-dot-size':       '5px',
    '--z-card-header-dot-bg':         'var(--zyna)',
    '--z-card-header-dot-shadow':     '0 0 6px var(--zyna), 0 0 14px color-mix(in oklch, var(--zyna) 50%, transparent)',
    '--z-card-header-dot-animation':  'zyna-pulse-ring var(--z-duration-pulse) var(--z-ease-enter) infinite',
    '--z-card-title-text-shadow':     '0 0 14px color-mix(in oklch, var(--zyna) 22%, transparent)',
    '--z-card-glow-duration':         '6s',
    '--z-card-default-glow-lo':       'rgba(255,159,10,0.04)',
    '--z-card-default-glow-hi':       'rgba(255,159,10,0.12)',

    // ── Docs chrome ────────────────────────────────────────────────────────────
    '--z-topbar-border':         'rgba(255,159,10,0.15)',
    '--z-topbar-glow':           '0 1px 0 rgba(255,159,10,0.10), 0 2px 16px rgba(255,159,10,0.05)',
    '--z-sidebar-active-shadow': 'inset 3px 0 0 var(--zyna), inset 6px 0 0 color-mix(in oklch, var(--zyna) 25%, transparent)',
  },

  // ── Badge color overrides — amber phosphor variants ────────────────────────
  ':where(html[data-genre="phosphor"]) :where(.badge-primary)': {
    '--badge-bg':   'color-mix(in oklch, var(--zyna) 15%, transparent)',
    '--badge-glow': 'drop-shadow(0 0 6px color-mix(in oklch, var(--zyna) 65%, transparent)) drop-shadow(0 0 16px color-mix(in oklch, var(--zyna) 25%, transparent))',
  },
  ':where(html[data-genre="phosphor"]) :where(.badge-success)': {
    '--badge-bg':   'color-mix(in oklch, var(--z-color-success) 12%, transparent)',
    '--badge-glow': 'drop-shadow(0 0 6px color-mix(in oklch, var(--z-color-success) 65%, transparent))',
  },
  ':where(html[data-genre="phosphor"]) :where(.badge-danger)': {
    '--badge-bg':   'color-mix(in oklch, var(--z-color-danger) 12%, transparent)',
    '--badge-glow': 'drop-shadow(0 0 6px color-mix(in oklch, var(--z-color-danger) 65%, transparent))',
  },
  ':where(html[data-genre="phosphor"]) :where(.badge-warning)': {
    '--badge-bg':   'color-mix(in oklch, var(--z-color-warning) 12%, transparent)',
    '--badge-glow': 'drop-shadow(0 0 6px color-mix(in oklch, var(--z-color-warning) 65%, transparent))',
  },
  ':where(html[data-genre="phosphor"]) :where(.badge-info)': {
    '--badge-bg':   'color-mix(in oklch, var(--z-color-info) 12%, transparent)',
    '--badge-glow': 'drop-shadow(0 0 6px color-mix(in oklch, var(--z-color-info) 65%, transparent))',
  },
  ':where(html[data-genre="phosphor"]) :where(.badge-secondary)': {
    '--badge-bg':   'color-mix(in oklch, var(--zyna) 8%, transparent)',
    '--badge-glow': 'drop-shadow(0 0 4px color-mix(in oklch, var(--zyna) 40%, transparent))',
  },

  // ── Badge animation easing overrides ──────────────────────────────────────
  // steps() is right for hover interactions (typewriter snap), but wrong for
  // continuous background animations. Phosphor glows and fades smoothly —
  // the pulse ring and scan sweep must use smooth easing, not discrete steps.
  ':where(html[data-genre="phosphor"]) :where(.badge)::after': {
    animation: 'zyna-badge-scan var(--z-badge-scan-duration) linear infinite',
  },
  ':where(html[data-genre="phosphor"]) :where(.badge-pulse)::before': {
    animation: 'zyna-pulse-ring var(--z-duration-pulse) ease-in-out infinite',
  },

  // ── CRT phosphor overlay — scanlines + radial vignette ────────────────────
  // Horizontal scanlines: authentic CRT raster line structure, 1 px every 3 px.
  // Radial vignette: barrel distortion — the glass darkens at the CRT bezel edges.
  ':where(html[data-genre="phosphor"]) body::before': {
    content: '""',
    position: 'fixed',
    inset: '0',
    zIndex: '0',
    pointerEvents: 'none',
    background: [
      'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)',
      'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.65) 100%)',
    ].join(', '),
  },

  // ── Animated phosphor sweep beam ───────────────────────────────────────────
  // The CRT electron gun's raster sweep: a faint amber glow band slowly descending.
  // At 5.5 % peak opacity it reads as "alive" without being distracting.
  // body::after is not used by any other genre, so no scoping conflicts.
  // This is the only CSS genre texture that animates a physical electron beam path.
  ':where(html[data-genre="phosphor"]) body::after': {
    content: '""',
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    height: '200px',
    zIndex: '0',
    pointerEvents: 'none',
    background: 'linear-gradient(transparent 0%, rgba(255,159,10,0.025) 35%, rgba(255,159,10,0.055) 50%, rgba(255,159,10,0.025) 65%, transparent 100%)',
    transform: 'translateY(-200px)',
    animation: 'phosphor-sweep 8s linear infinite',
  },
}

export default { name, tokens, swatches, styles }
