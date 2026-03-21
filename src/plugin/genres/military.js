/**
 * Military genre — "FIELDCRAFT"
 * Tactical ground operations. The visual language of a NATO field operations
 * center at night: olive drab surfaces, ranger-green accents, earth tones,
 * Share Tech Mono communications typography.
 *
 * Distinct from Ops (gold HUD, space command) — this is mud and terrain,
 * not cockpit glass. Every decision is grounded in real military visual
 * vocabulary: field manuals, topo maps, NATO symbology, dogtag ID tabs.
 *
 * Unique design decisions:
 *   Button shape  — OPPOSING DIAGONAL CHAMFERS: top-left AND bottom-right corners
 *                   cut simultaneously. Creates a parallelogram-adjacent shape that
 *                   reads as a military ID card, dogtag, or MOLLE equipment label.
 *                   No other genre or design system uses opposing-diagonal double
 *                   chamfer on interactive elements.
 *   Alert bar     — BOTTOM edge, full width. Ground line symbology: in NATO map
 *                   notation, a solid baseline beneath a unit symbol indicates a
 *                   defensive position. Every alert "rests" on its bar like a
 *                   unit sitting on its ground line. First genre with a bottom bar.
 *   Alert prefix  — "◈ " diamond waypoint: the filled diamond is the NATO standard
 *                   control point and waypoint marker on tactical overlays.
 *   Badge shape   — BOTTOM-LEFT NOTCH: a punch-hole notch at the lower-left corner,
 *                   like a physical field identification tab or a barcode label with
 *                   a punched binding hole. No other genre uses this shape.
 *   Texture       — body::before: dual-axis 45°/−45° diagonal crosshatch at 3%
 *                   opacity — authentic camouflage netting and topographic map
 *                   hatching pattern. Two gradient layers combine to form a diamond
 *                   grid that reads as precision without being legible as pattern.
 *   Sweep beam    — body::after: UPWARD terrain surveillance sweep — opposite
 *                   direction to Phosphor's downward CRT scan. Simulates a
 *                   ground-based LiDAR or surface surveillance radar sweeping
 *                   bottom-to-top at 12 s / cycle (slower than CRT: 8 s).
 *                   The olive-green glow is the first bottom-to-top genre sweep.
 *   Card texture  — repeating-linear-gradient hatching overlay on card surfaces,
 *                   giving each card the texture of a laminated field map or
 *                   situation board covered with acetate overlay paper.
 *   Font          — Share Tech Mono: military field radio / SINCGARS comms display.
 *                   VT323 (Phosphor) is a CRT civilian terminal — Share Tech is
 *                   built for tactical data readout terminals.
 *   Motion        — Ballistic precision. Enter: fast approach + precise settle
 *                   (a rangefinder locking on target). Exit: deliberate departure.
 *                   No spring, no overshoot — military equipment doesn't bounce.
 *
 * tokens  — global overrides (colors, motion, font).
 *           Applied via JS setProperty on html by applyGenre() — inline styles
 *           beat all stylesheets, so docs.css CSS-variable-based rules respond correctly.
 *
 * styles  — structural CSS rules compiled into zynaui.css via addBase.
 *           html[data-genre="military"] at specificity [0,1,1] beats the ops
 *           defaults on html [0,0,1].
 */

export const name = 'Military'

export const swatches = {
  brand:   '#8B9E4B',
  success: '#5B8A3C',
  danger:  '#CC3300',
  info:    '#4A7FA5',
}

export const tokens = {
  // ── Brand — Ranger olive ────────────────────────────────────────────────────
  // The authentic US Army uniform olive, slightly desaturated to avoid the
  // neon-green trap. Reads as "military" immediately without being cartoonish.
  '--zyna':      '#8B9E4B',   // Ranger olive — US Army OD (Olive Drab) green
  '--zyna-dark': '#5C6B2F',   // Deep ranger — shadow side of an olive surface

  // ── Status colors — field operations palette ────────────────────────────────
  // Grounded in real operational color conventions:
  // Go = vegetation green (blend with terrain, safe to move)
  // Danger = infrared flare red / tracer round (universal alarm)
  // Warning = amber signal flare (caution, be alert)
  // Info = radio/comms blue / water feature blue from topo maps
  '--zp-success': '#5B8A3C',  // vegetation green — clear to proceed
  '--zp-danger':  '#CC3300',  // flare red — stop, threat detected
  '--zp-warning': '#C98A00',  // amber signal — proceed with caution
  '--zp-info':    '#4A7FA5',  // radio blue / topo water feature

  // ── Text — field notebook cream ─────────────────────────────────────────────
  // Not pure white (too high-contrast for night ops), not amber (that's Phosphor).
  // A warm gray-green: the color of paper in a military field manual printed
  // on government specification stock — aged, olive-tinted, readable under red light.
  '--zp-text':              '#B8BD9B',  // field notebook cream-green
  '--z-color-text-inverse': '#131510',  // dark olive on brand (button fill)

  // ── Surfaces — tactical dark, olive-tinted ──────────────────────────────────
  // Near-black with a perceptible green tint — the ambient light in a tactical
  // operations center is dim olive from filtered overhead lights and display glow.
  // Not pure black (#000) and not warm black (Phosphor's #0A0700) — this is cold,
  // alert, field-operational dark.
  '--z-surface-page':               '#131510',
  '--z-surface-inset':              '#1A1D13',
  '--z-surface-inset-hover':        '#1F2318',
  '--z-surface-inset-danger':       '#1A1208',
  '--z-surface-inset-danger-hover': '#201508',
  '--z-surface-card':      'linear-gradient(160deg, #1B1F13 0%, #131510 100%)',
  '--z-surface-card-deep': 'linear-gradient(160deg, #1F2318 0%, #1A1D13 100%)',

  // ── Borders & overlays — olive-tinted ──────────────────────────────────────
  '--z-color-border':     'rgba(139,158,75,0.12)',
  '--z-color-border-dim': 'rgba(139,158,75,0.06)',
  '--z-color-overlay':    'rgba(139,158,75,0.04)',

  // ── Shadows — terrain shadow, not neon bloom ────────────────────────────────
  // Military shadows read as depth under field lighting — no glow, no ambiance.
  // A slight olive tint in the diffuse layer simulates reflected ambient terrain.
  '--z-shadow-card':      '0 2px 8px rgba(0,0,0,0.60), 0 0 24px rgba(139,158,75,0.03)',
  '--z-shadow-card-deep': '0 4px 18px rgba(0,0,0,0.75), 0 0 40px rgba(139,158,75,0.05)',

  // ── Docs chrome — olive field palette for docs.css CSS variables ─────────────
  '--bg':        '#131510',
  '--bg2':       '#1A1D13',                         // sidebar surface
  '--bg3':       '#1F2318',                         // hover / active surface
  '--border':    'rgba(139,158,75,0.13)',
  '--border2':   'rgba(139,158,75,0.07)',
  '--text':      '#B8BD9B',
  '--text2':     'rgba(184,189,155,0.55)',
  '--text3':     'rgba(184,189,155,0.32)',
  '--topbar-bg':      'rgba(19,21,16,0.93)',
  '--z-panel-bg':     '#1A1D13',
  '--z-panel-shadow': '0 8px 24px rgba(0,0,0,0.65), 0 0 28px rgba(139,158,75,0.04)',

  // ── Font — Share Tech Mono: SINCGARS / field radio comms display ─────────────
  // Designed for tactical data terminals and military communications readout.
  // Share Tech Mono vs VT323 (Phosphor): Share Tech is sharp, modern-military;
  // VT323 is 1980s civilian CRT. These are different worlds.
  '--z-font-mono': "'Share Tech Mono', 'Courier New', monospace",

  // ── Motion — Ballistic precision ─────────────────────────────────────────────
  // Enter: fast approach with precise, zero-overshoot settle.
  //        Like a rangefinder locking on target — it reaches position and stops.
  //        cubic-bezier(0.16, 1, 0.3, 1): very fast initial velocity, smooth deceleration.
  // Exit:  deliberate departure — pulling back from a firing position.
  //        cubic-bezier(0.4, 0, 1, 1): measured acceleration, no hesitation.
  // Spring: no spring. Military equipment doesn't bounce or recoil in UI.
  //         Same professional settle as Corporate but with military-tight timing.
  '--z-duration-fast':  '0.15s',   // rapid target acquisition
  '--z-duration-base':  '0.22s',
  '--z-duration-slow':  '0.30s',
  '--z-duration-pulse': '3s',      // measured indicator pulse
  '--z-ease-enter':  'cubic-bezier(0.16, 1, 0.3, 1)',   // ballistic approach + lock
  '--z-ease-exit':   'cubic-bezier(0.4, 0, 1, 1)',      // deliberate departure
  '--z-ease-spring': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // no bounce, precision settle
}

export const styles = {
  // ── Terrain surveillance sweep keyframe ─────────────────────────────────────
  // BOTTOM-TO-TOP — opposite direction from Phosphor (top-to-bottom CRT scan).
  // Simulates a ground-based LiDAR or surface surveillance radar sweeping upward
  // across terrain, "painting" a picture of the operational environment.
  // The beam starts below the viewport (at +100vh) and exits above it (at -160px).
  '@keyframes field-sweep': {
    '0%':   { transform: 'translateY(100vh)' },
    '100%': { transform: 'translateY(-160px)' },
  },

  // ── Structural overrides — scoped to html[data-genre="military"] ─────────────
  // Specificity [0,1,1] beats ops defaults on html [0,0,1].
  'html[data-genre="military"]': {
    'color-scheme': 'dark',

    // ── Button — opposing diagonal chamfers (dogtag / ID card) ───────────────
    // TOP-LEFT and BOTTOM-RIGHT corners are cut simultaneously.
    // The resulting shape reads as a military identification tag, a MOLLE
    // equipment label, or a field ID card — a form that appears on real
    // physical military hardware but has never been used as a button shape
    // in any CSS design system or UI component library.
    //
    // Compare:
    //   Ops       — hex-ish (both top-right AND bottom-left, symmetric)
    //   Corporate — single top-right dog-ear
    //   Phosphor  — left-side chevron notch
    //   Military  — opposing diagonal (top-left + bottom-right) ← unique axis
    //
    // The clip polygon reads clockwise from the top-left chamfer endpoint:
    //   (corner,0) → (100%,0) → (100%,100%-corner) → (100%-corner,100%) → (0,100%) → (0,corner)
    '--z-btn-clip':       'polygon(var(--btn-corner) 0, 100% 0, 100% calc(100% - var(--btn-corner)), calc(100% - var(--btn-corner)) 100%, 0 100%, 0 var(--btn-corner))',
    // Inner clip: 1 px inset on all edges, chamfer points pulled 1 px inward.
    '--z-btn-inner-clip': 'polygon(calc(var(--btn-corner) + 1px) 1px, calc(100% - 1px) 1px, calc(100% - 1px) calc(100% - calc(var(--btn-corner) + 1px)), calc(100% - calc(var(--btn-corner) + 1px)) calc(100% - 1px), 1px calc(100% - 1px), 1px calc(var(--btn-corner) + 1px))',
    '--z-btn-corner':       '10px',
    '--z-btn-active-scale': '0.97',
    '--z-btn-scan-stop':    '60%',   // tactical fill: present but not aggressive

    // ── Badge — bottom-left notch (field identification tab) ─────────────────
    // A physical punch-hole notch at the lower-left corner: the same shape
    // used on military ID cards, barcode label rolls, and MOLLE binding tabs.
    // Completely unique in UI design systems — no other library or genre uses
    // a bottom-left corner clip on badges.
    //
    // Clip polygon (clockwise): top-left → top-right → bottom-right → notch-end → notch-point
    // The notch is 8px — sufficient to read as a punch hole without consuming badge space.
    '--z-badge-clip':           'polygon(0 0, 100% 0, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
    '--z-badge-radius':         '0',
    '--z-badge-padding':        '0.20rem 0.75rem',
    '--z-badge-letter-spacing': '0.11em',
    '--z-badge-inset-shadow':   'inset 0 0 0 1px currentColor',
    '--z-badge-scan-duration':  '6s',   // tactical awareness cadence
    '--z-badge-inner-clip':     'polygon(1px 1px, calc(100% - 1px) 1px, calc(100% - 1px) calc(100% - 1px), 9px calc(100% - 1px), 1px calc(100% - 9px))',

    // ── Alert — BOTTOM bar, diamond waypoint prefix ───────────────────────────
    // The bottom bar is a direct reference to NATO ground symbology:
    // a solid baseline below a unit marker indicates "defensive position."
    // Every alert in FIELDCRAFT "rests on its ground line" — it knows where it stands.
    //
    // First genre with a bottom accent bar — Ops and Corporate use left,
    // Phosphor uses right, Cyberpunk uses top. Military completes the set.
    //
    // Bar geometry: inset shorthand = top right bottom left.
    //   top:auto + bottom:0 + left:0 + right:0 → bottom edge, full width.
    //   width must be 'auto' so left:0 + right:0 constraints govern it.
    //   height must be explicit (var(--z-alert-bar-width)) since auto would collapse.
    '--z-alert-radius':         '3px 3px 0 0',   // rounded top, flat bottom (where bar lives)
    '--z-alert-bar-width':      '3px',
    '--z-alert-prefix':         '"◈ "',  // filled diamond — NATO control point / waypoint marker
    '--z-alert-bg-opacity':     '6%',
    '--z-alert-border':         'none',
    '--z-alert-prefix-opacity': '0.45',
    '--z-alert-bar-glow':       'none',  // military doesn't bloom
    '--z-alert-texture':        'none',
    '--z-alert-padding-top':    '0.875rem',
    '--z-alert-padding-left':   '1.25rem',  // no left bar — standard side padding
    // Bar sits at the bottom; content padding keeps text well above it
    '--z-alert-bar-inset':      'auto 0 0 0',   // top:auto, right:0, bottom:0, left:0
    '--z-alert-bar-w':          'auto',          // left:0 + right:0 govern full width
    '--z-alert-bar-h':          'var(--z-alert-bar-width)',  // explicit thickness
    '--z-alert-bar-radius':     '0',

    // ── Card — field situation board with acetate overlay texture ─────────────
    // The diagonal hatching texture (--z-card-texture) simulates acetate overlay
    // paper placed on a laminated field map — the medium of tactical planning
    // at every level from squad to corps.
    '--z-card-clip':                  'none',
    '--z-card-filter':                'none',
    '--z-card-texture':               'repeating-linear-gradient(45deg, rgba(139,158,75,0.022) 0px, rgba(139,158,75,0.022) 1px, transparent 1px, transparent 10px)',
    '--z-card-gradient':              'var(--z-surface-card)',
    '--z-card-border-color':          'rgba(139,158,75,0.13)',
    '--z-card-shadow':                'var(--z-shadow-card)',
    '--z-card-bracket-color':         'color-mix(in oklch, var(--zyna) 40%, transparent)',
    '--z-card-bracket-size':          '18px',
    '--z-card-bracket-stroke':        '1.5px',
    // Top rule: solid 2px olive line — hard edge like a stencil, no gradient fade.
    // Every other genre fades the bar. Military stencils are sharp.
    '--z-card-bar-height':            '2px',
    '--z-card-bar-bg':                'var(--zyna)',  // solid, not gradient — stencil edge
    '--z-card-bar-shadow':            'none',
    // Header: subtle olive-green wash — like a printed field label affixed to equipment
    '--z-card-header-bg':             'rgba(139,158,75,0.06)',
    '--z-card-header-border':         'rgba(139,158,75,0.12)',
    '--z-card-header-color':          'var(--zyna)',
    '--z-card-header-letter-spacing': '0.14em',
    '--z-card-header-text-shadow':    'none',  // military doesn't glow
    '--z-card-header-dot-size':       '5px',
    '--z-card-header-dot-bg':         'var(--zyna)',
    '--z-card-header-dot-shadow':     'none',  // static — not pulsing
    '--z-card-header-dot-animation':  'none',  // status dots don't animate in the field
    '--z-card-title-text-shadow':     'none',
    '--z-card-glow-duration':         '5s',
    '--z-card-default-glow-lo':       'rgba(139,158,75,0.03)',
    '--z-card-default-glow-hi':       'rgba(139,158,75,0.08)',

    // ── Docs chrome ─────────────────────────────────────────────────────────────
    '--z-topbar-border':         'rgba(139,158,75,0.12)',
    '--z-topbar-glow':           'none',
    '--z-sidebar-active-shadow': 'inset 3px 0 0 var(--zyna), inset 5px 0 0 color-mix(in oklch, var(--zyna) 22%, transparent)',
  },

  // ── Badge color overrides — earth-tone variants ──────────────────────────────
  // Military badges use de-saturated olive-tinted fills — not neon, not transparent.
  // The fill is real (not transparent like Corporate) but subdued (not bright like Cyberpunk).
  // No glows: FIELDCRAFT doesn't bloom. Everything is contained, flat, tactical.
  ':where(html[data-genre="military"]) :where(.badge-primary)': {
    '--badge-bg':   'color-mix(in oklch, var(--zyna) 14%, transparent)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="military"]) :where(.badge-success)': {
    '--badge-bg':   'color-mix(in oklch, var(--z-color-success) 12%, transparent)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="military"]) :where(.badge-danger)': {
    '--badge-bg':   'color-mix(in oklch, var(--z-color-danger) 11%, transparent)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="military"]) :where(.badge-warning)': {
    '--badge-bg':   'color-mix(in oklch, var(--z-color-warning) 11%, transparent)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="military"]) :where(.badge-info)': {
    '--badge-bg':   'color-mix(in oklch, var(--z-color-info) 11%, transparent)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="military"]) :where(.badge-secondary)': {
    '--badge-bg':   'color-mix(in oklch, var(--zyna) 8%, transparent)',
    '--badge-glow': 'none',
  },

  // ── Field map crosshatch — body texture ─────────────────────────────────────
  // Dual-axis diagonal hatching at 45°/−45°.
  // At 3% opacity each layer, the combined diamond pattern reads as precision
  // and structure without being legible as a visible texture to casual viewers.
  // Reference: NATO tactical overlay paper, USGS topographic map hatching,
  // camouflage netting silhouette patterns.
  //
  // Two gradient layers combine to form a genuine crosshatch (diamond grid):
  //   45° pass:  ╲ stripes
  //   -45° pass: ╱ stripes
  // Combined:    ╳ diamond grid — the field operations surface texture.
  ':where(html[data-genre="military"]) body::before': {
    content: '""',
    position: 'fixed',
    inset: '0',
    zIndex: '0',
    pointerEvents: 'none',
    backgroundImage: [
      'repeating-linear-gradient(45deg, rgba(139,158,75,0.03) 0px, rgba(139,158,75,0.03) 1px, transparent 1px, transparent 12px)',
      'repeating-linear-gradient(-45deg, rgba(139,158,75,0.02) 0px, rgba(139,158,75,0.02) 1px, transparent 1px, transparent 12px)',
    ].join(', '),
  },

  // ── Upward terrain surveillance sweep ───────────────────────────────────────
  // A faint olive-green glow band ascending from bottom to top of the viewport
  // every 12 seconds. The opposite direction from Phosphor's 8 s downward CRT scan.
  //
  // Design rationale:
  //   Phosphor simulates a CRT electron gun scanning top-to-bottom (display physics).
  //   Military simulates a ground surveillance sensor scanning bottom-to-top
  //   (terrain physics: you scan from ground level upward — LiDAR, millimeter-wave,
  //   FLIR thermal scanning rising from the terrain surface upward through the air).
  //
  //   Duration 12 s: surveillance sweeps are slower than CRT refresh (8 s).
  //   Height 160 px: slightly shorter than Phosphor (200 px) — focused beam width.
  //   Peak opacity 3.5%: at night-ops ambient light, barely perceptible is intentional.
  ':where(html[data-genre="military"]) body::after': {
    content: '""',
    position: 'fixed',
    bottom: '0',
    left: '0',
    right: '0',
    height: '160px',
    zIndex: '0',
    pointerEvents: 'none',
    background: 'linear-gradient(transparent 0%, rgba(139,158,75,0.018) 30%, rgba(139,158,75,0.035) 50%, rgba(139,158,75,0.018) 70%, transparent 100%)',
    transform: 'translateY(100vh)',
    animation: 'field-sweep 12s linear infinite',
  },

  // ── prefers-reduced-motion — surveillance sweep stops ───────────────────────
  // Must live here (inside the genre file, last in addBase source order) so it
  // wins over the animation declaration above. motion.js runs before genresPlugin()
  // and would lose to genre rules via source order at equal specificity.
  '@media (prefers-reduced-motion: reduce)': {
    ':where(html[data-genre="military"]) body::after': { animation: 'none' },
  },
}

export default { name, tokens, swatches, styles }
