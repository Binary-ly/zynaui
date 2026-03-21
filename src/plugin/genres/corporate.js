/**
 * Corporate genre — "LEDGER"
 * The visual language of a premier Swiss institutional annual report.
 *
 * First light genre in ZynaUI. Warm ivory surfaces, deep graphite ink,
 * institutional navy accent. Zero glows, zero neon — pure typographic precision.
 *
 * Unique design decisions:
 *   Button shape  — single top-right chamfer only ("document dog-ear").
 *                   Never used in any design system. Reads as a turned page corner.
 *   Alert prefix  — § legal section symbol instead of // or >
 *   Badge shape   — micro-rounded rectangular label (inset 3px radius), like a printed tag
 *   Texture       — 24 px graph-paper grid overlay at ~4.5 % opacity, CSS-only
 *   Motion        — deliberate and measured; no springs, no urgency
 *
 * tokens  — global overrides (colors, text, surfaces, motion).
 *           Applied via JS setProperty on html by applyGenre() — inline styles
 *           beat all stylesheets, so docs.css CSS-variable-based rules respond correctly.
 *
 * styles  — structural CSS rules compiled into zynaui.css via addBase.
 *           html[data-genre="corporate"] at specificity [0,1,1] beats the ops
 *           defaults on html [0,0,1].
 */

export const name = 'Corporate'

export const swatches = {
  brand:   '#1D3557',
  success: '#1A6B45',
  danger:  '#A31621',
  info:    '#2A5B8C',
}

export const tokens = {
  // ── Brand ─────────────────────────────────────────────────────────────────────
  '--zyna':      '#1D3557',   // "Navy Dispatch" — institutional, never electric
  '--zyna-dark': '#0D1F36',   // deep ink

  // ── Status colors — deep, readable on light surfaces ─────────────────────────
  // Not neon: these must work on ivory without glows.
  '--zp-success': '#1A6B45',  // forest institutional green
  '--zp-danger':  '#A31621',  // sealing-wax crimson
  '--zp-warning': '#926B00',  // aged amber
  '--zp-info':    '#2A5B8C',  // steel blue

  // ── Text — warm graphite ink ──────────────────────────────────────────────────
  '--zp-text':              '#1C1A18',  // deep warm graphite, not cold black
  '--z-color-text-inverse': '#F5F4F0',  // text on primary (dark brand) buttons

  // ── Light page surfaces — override the dark defaults from tokens.js ───────────
  '--z-surface-page':               '#F5F4F0',   // warm ivory — 100 gsm Conqueror paper
  '--z-surface-inset':              '#EDE9E2',   // slightly warmer inset tone
  '--z-surface-inset-hover':        '#E6E2D9',
  '--z-surface-inset-danger':       '#FCF0F0',
  '--z-surface-inset-danger-hover': '#F7E4E4',
  '--z-surface-card':      'linear-gradient(160deg, #FFFFFF 0%, #F8F7F3 100%)',
  '--z-surface-card-deep': 'linear-gradient(160deg, #F4F3EF 0%, #ECEAE3 100%)',

  // ── Borders & overlays — ink on paper ────────────────────────────────────────
  '--z-color-border':     'rgba(28,27,22,0.10)',
  '--z-color-border-dim': 'rgba(28,27,22,0.055)',
  '--z-color-overlay':    'rgba(28,27,22,0.03)',

  // ── Shadows — paper lift, not neon bloom ─────────────────────────────────────
  '--z-shadow-card':      '0 1px 3px rgba(0,0,0,0.07), 0 6px 20px rgba(0,0,0,0.05)',
  '--z-shadow-card-deep': '0 2px 8px rgba(0,0,0,0.09), 0 12px 32px rgba(0,0,0,0.06)',

  // ── Docs chrome — light palette for docs.css CSS variables ───────────────────
  // These are set via setProperty() as inline styles on <html>, so they override
  // the hardcoded dark values in docs.css :root and allow all var(--bg/--text/--border)
  // references across the docs site to resolve to the light palette.
  '--bg':        '#F5F4F0',
  '--bg2':       '#EDEAE3',   // sidebar
  '--bg3':       '#E5E1D9',   // hover states, buttons
  '--border':    'rgba(28,27,22,0.13)',
  '--border2':   'rgba(28,27,22,0.07)',
  '--text':      '#1C1A18',
  '--text2':     '#6B6560',
  '--text3':     '#9E9994',
  '--topbar-bg':    'rgba(244,243,238,0.93)',  // semi-transparent ivory for blur
  '--z-panel-bg':   '#EDEAE3',                // warm inset — not dark modal
  '--z-panel-shadow': '0 8px 24px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',

  // ── Motion — deliberate, controlled, no urgency ───────────────────────────────
  '--z-duration-fast': '0.20s',
  '--z-duration-base': '0.28s',
  '--z-duration-slow': '0.38s',
  '--z-duration-pulse': '3.5s',
  '--z-ease-enter':  'cubic-bezier(0.25, 0.46, 0.45, 0.94)',  // professional ease-out
  '--z-ease-exit':   'cubic-bezier(0.55, 0.055, 0.675, 0.19)', // measured ease-in
  '--z-ease-spring': 'cubic-bezier(0.34, 1.06, 0.64, 1)',      // restrained settle, no recoil
}

export const styles = {
  // ── Structural overrides — scoped to html[data-genre="corporate"] ─────────────
  // Specificity [0,1,1] beats ops defaults on html [0,0,1].
  'html[data-genre="corporate"]': {
    'color-scheme': 'light',

    // ── Button — document dog-ear (single top-right chamfer) ─────────────────
    // Cuts ONLY the top-right corner — like a page with a turned-down corner.
    // This shape has never appeared in any UI design system.
    '--z-btn-clip':         'polygon(0 0, calc(100% - var(--btn-corner)) 0, 100% var(--btn-corner), 100% 100%, 0 100%)',
    '--z-btn-inner-clip':   'polygon(1px 1px, calc(100% - calc(var(--btn-corner) + 1px)) 1px, calc(100% - 1px) calc(var(--btn-corner) + 1px), calc(100% - 1px) calc(100% - 1px), 1px calc(100% - 1px))',
    '--z-btn-corner':       '10px',
    '--z-btn-active-scale': '0.97',
    '--z-btn-scan-stop':    '38%',    // understated fill — not aggressive

    // ── Badge — micro-rounded typographic label ────────────────────────────────
    // inset(0 round 3px) is clip-path syntax — clips to rect with 3px corner radius.
    // Reads like a precision-printed document label, not a digital pill or chip.
    '--z-badge-clip':           'inset(0 round 3px)',
    '--z-badge-radius':         '3px',
    '--z-badge-padding':        '0.19rem 0.75rem',
    '--z-badge-letter-spacing': '0.07em',  // tight typographic — no spaced-out caps
    '--z-badge-inset-shadow':   'inset 0 0 0 1px currentColor',
    '--z-badge-scan-duration':  '9s',      // barely perceptible scan
    '--z-badge-inner-clip':     'inset(2px round 1px)',

    // ── Alert — left rule, § legal prefix, paper border ───────────────────────
    // § (section sign) is the mark used in legal and regulatory documents.
    // Completely unique as an alert prefix — no other design system uses it.
    '--z-alert-radius':         '0 3px 3px 0',
    '--z-alert-bar-width':      '2.5px',      // hairline rule, more refined than Ops (3px)
    '--z-alert-prefix':         '"§ "',   // legal section sign
    '--z-alert-bg-opacity':     '5%',
    '--z-alert-border':         '1px solid rgba(28,27,22,0.07)',
    '--z-alert-prefix-opacity': '0.38',
    '--z-alert-bar-glow':       'none',
    '--z-alert-texture':        'none',
    '--z-alert-padding-top':    '0.875rem',
    '--z-alert-padding-left':   'calc(1.25rem + var(--z-alert-bar-width))',
    '--z-alert-bar-inset':      '0 auto 0 0',   // left-side rule, same position as Ops
    '--z-alert-bar-w':          'var(--z-alert-bar-width)',
    '--z-alert-bar-h':          'auto',
    '--z-alert-bar-radius':     '0',

    // ── Card — clean paper card; no brackets, no neon, no clip-path ───────────
    // Cards read as physical paper: white gradient, soft lift shadow,
    // institution-blue header band, fading rule at the top edge.
    '--z-card-clip':                  'none',
    '--z-card-filter':                'none',
    '--z-card-texture':               'none',
    '--z-card-gradient':              'var(--z-surface-card)',
    '--z-card-border-color':          'rgba(28,27,22,0.09)',
    '--z-card-shadow':                'var(--z-shadow-card)',
    // Brackets are an Ops hallmark — remove them entirely for Corporate
    '--z-card-bracket-color':         'transparent',
    '--z-card-bracket-size':          '0px',
    '--z-card-bracket-stroke':        '0px',
    // Top rule: fades right like a printed ruling line
    '--z-card-bar-height':            '2px',
    '--z-card-bar-bg':                'linear-gradient(90deg, var(--zyna) 0%, color-mix(in oklch, var(--zyna) 0%, transparent) 100%)',
    '--z-card-bar-shadow':            'none',
    // Header: very subtle brand wash — like printed letterhead
    '--z-card-header-bg':             'rgba(29,53,87,0.04)',
    '--z-card-header-border':         'rgba(29,53,87,0.11)',
    '--z-card-header-color':          'var(--zyna)',
    '--z-card-header-letter-spacing': '0.08em',
    '--z-card-header-text-shadow':    'none',
    '--z-card-header-dot-size':       '4px',
    '--z-card-header-dot-bg':         'var(--zyna)',
    '--z-card-header-dot-shadow':     'none',      // no glow
    '--z-card-header-dot-animation':  'none',      // static — not pulsing
    '--z-card-title-text-shadow':     'none',
    '--z-card-glow-duration':         '8s',
    // .card-glow: a barely-there institution-navy bloom — not neon, not dramatic
    '--z-card-default-glow-lo':       'rgba(29,53,87,0.03)',
    '--z-card-default-glow-hi':       'rgba(29,53,87,0.08)',

    // ── Docs chrome ───────────────────────────────────────────────────────────
    '--z-topbar-border':         'rgba(28,27,22,0.09)',
    '--z-topbar-glow':           'none',
    '--z-sidebar-active-shadow': 'inset 3px 0 0 var(--zyna)',
  },

  // ── Badge color overrides — deep tones for light backgrounds ─────────────────
  // No glows — Corporate doesn't bloom.
  ':where(html[data-genre="corporate"]) :where(.badge-primary)': {
    '--badge-bg':   'rgba(29,53,87,0.08)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="corporate"]) :where(.badge-success)': {
    '--badge-bg':   'rgba(26,107,69,0.08)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="corporate"]) :where(.badge-danger)': {
    '--badge-bg':   'rgba(163,22,33,0.08)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="corporate"]) :where(.badge-warning)': {
    '--badge-bg':   'rgba(146,107,0,0.08)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="corporate"]) :where(.badge-info)': {
    '--badge-bg':   'rgba(42,91,140,0.08)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="corporate"]) :where(.badge-secondary)': {
    '--badge-bg':   'rgba(28,26,24,0.06)',
    '--badge-glow': 'none',
  },

  // ── Graph-paper ledger grid — page texture ────────────────────────────────────
  // 24 px repeating grid in institutional navy at ~4.5 % opacity.
  // Unique: horizontal + vertical 1 px rules produce a genuine graph-paper effect.
  // At this opacity it reads as "precision" without being visible as texture.
  // No design system has shipped a repeating-linear-gradient grid as a genre overlay.
  ':where(html[data-genre="corporate"]) body::before': {
    content: '""',
    position: 'fixed',
    inset: '0',
    zIndex: '0',
    pointerEvents: 'none',
    backgroundImage: [
      'repeating-linear-gradient(rgba(29,53,87,0.045) 0 1px, transparent 1px 100%)',
      'repeating-linear-gradient(90deg, rgba(29,53,87,0.045) 0 1px, transparent 1px 100%)',
    ].join(', '),
    backgroundSize: '24px 24px',
  },
}

export default { name, tokens, swatches, styles }
