/**
 * Blueprint genre — "SCHEMATIC"
 * The visual language of a precision ISO engineering drawing — prussian blue
 * annotation ink on drafting vellum, dimension witness lines, metric coordinate
 * grid, GD&T datum notation. Every decision is grounded in real technical
 * drawing standards (ISO 128, ASME Y14.5, BS 308).
 *
 * Unique design decisions:
 *   Button shape  — RIGHT-ANGLE STEPPED NOTCH (top-right corner):
 *                   A 90° counterbore step — the shape of a machined shoulder,
 *                   a PCB routing keepout step, or a precision tolerance feature.
 *                   The step is exactly --btn-corner wide and --btn-corner tall.
 *                   No other genre or design system uses a right-angle step cut
 *                   on interactive elements. Reads as a manufactured part, not
 *                   a design choice — then you look closer.
 *   Alert bar     — PARTIAL-HEIGHT LEFT WITNESS LINE (15 %→85 % of height):
 *                   Dimension witness lines in ISO 128 drawings don't extend
 *                   past the feature they measure. The bar floats inside the
 *                   alert container — anchored to the feature, not the edge.
 *                   First alert bar in any design system that is not full-height.
 *   Alert prefix  — "⊗ " (circled times / into-page vector marker):
 *                   In orthographic drawing convention, ⊗ marks a vector going
 *                   INTO the page — the tail of the arrow. Used here to indicate
 *                   "this condition originates here." Unique across all systems.
 *   Badge shape   — TOP-CENTER V-NOTCH (ISO 1101 datum feature symbol):
 *                   A downward-pointing triangular cut at the midpoint of the
 *                   top edge — the exact shape of a datum feature symbol opening
 *                   in ISO GD&T annotation. First badge with a top-center notch
 *                   in any design system.
 *   Texture       — DUAL-TIER PRECISION METRIC GRID (5 px minor / 25 px major):
 *                   Four gradient layers: horizontal + vertical at each tier.
 *                   5:1 subdivision ratio matches ISO metric drafting paper.
 *                   Distinct from Corporate's single-tier 24 px grid —
 *                   this has measurable precision with two levels of division.
 *   Plotter sweep — HORIZONTAL LEFT-TO-RIGHT pen plotter scan:
 *                   A faint prussian-blue vertical slit crossing the viewport
 *                   horizontally every 14 s — simulating an HP 7475A pen plotter
 *                   head traversing the drawing surface at constant speed.
 *                   The ONLY horizontal sweep animation in ZynaUI.
 *                   The ONLY genre sweep on a LIGHT background.
 *   Motion        — CONSTANT VELOCITY (linear timing):
 *                   A drafting arm, pantograph, or CMM probe moves at constant
 *                   speed — no acceleration, no deceleration, no spring.
 *                   The ONLY genre in ZynaUI using linear() for UI transitions.
 *   Sidebar       — DOUBLE WITNESS LINE indicator:
 *                   Two 2 px prussian lines separated by a 2 px gap — the pair
 *                   of extension/witness lines used in dimension callouts.
 *                   Built from three stacked inset box-shadows. Never done in
 *                   any design system or UI library.
 *   Card texture  — RULED SCHEDULE LINES:
 *                   Horizontal rules at 18 px — a blank engineering parts list
 *                   or schedule table, ready to be annotated.
 */

export const name = 'Blueprint'

export const swatches = {
  brand:   '#1B3A6B',
  success: '#1A6B3A',
  danger:  '#C0392B',
  info:    '#2456A4',
}

export const tokens = {
  // ── Brand — Prussian Blue ──────────────────────────────────────────────────
  // The ferric cyanide blue of the original cyanotype blueprint process.
  // Not navy (#000080), not cobalt (#0047AB), not royal (#4169E1) —
  // #1B3A6B is the precise hue of a ferric cyanide annotation on sensitised linen.
  '--zyna':      '#1B3A6B',
  '--zyna-dark': '#0D1F3C',   // deep prussian — the shadow side of a folded linen drawing

  // ── Status colors — ISO drawing annotation palette ─────────────────────────
  // Reference: engineering inspection and revision marking conventions.
  // Green  = "within tolerance" — dimensional inspection PASS mark
  // Red    = "rejected / non-conformance" — out-of-tolerance rejection mark
  // Amber  = "reference dimension" — informational, not a controlled tolerance
  // Info   = medium prussian — standard annotation/reference callout colour
  '--zp-success': '#1A6B3A',  // inspection pass — tolerance green
  '--zp-danger':  '#C0392B',  // rejection red — non-conformance mark
  '--zp-warning': '#A06800',  // reference amber — informational dimension
  '--zp-info':    '#2456A4',  // annotation blue — standard callout

  // ── Text — prussian drafting ink ──────────────────────────────────────────
  '--zp-text':              '#0D1B33',  // deep prussian — ISO standard annotation ink
  '--z-color-text-inverse': '#EDF2FA',  // drafting vellum on solid prussian buttons

  // ── Light page surfaces — drawing vellum ──────────────────────────────────
  // ISO 216 drafting paper: not pure white but slightly cool blue-white —
  // the natural tint of high-quality technical drafting vellum under overhead light.
  '--z-surface-page':               '#EDF2FA',   // drafting vellum
  '--z-surface-inset':              '#E0E8F5',   // inset — slightly deeper
  '--z-surface-inset-hover':        '#D4DFEF',
  '--z-surface-inset-danger':       '#F5E8E8',
  '--z-surface-inset-danger-hover': '#EDD9D9',
  '--z-surface-card':      'linear-gradient(160deg, #FFFFFF 0%, #F4F8FE 100%)',
  '--z-surface-card-deep': 'linear-gradient(160deg, #EDF2FA 0%, #E4EDF7 100%)',

  // ── Borders & overlays — prussian-tinted ──────────────────────────────────
  '--z-color-border':     'rgba(27,58,107,0.12)',
  '--z-color-border-dim': 'rgba(27,58,107,0.06)',
  '--z-color-overlay':    'rgba(27,58,107,0.03)',

  // ── Shadows — paper-on-light-table lift ───────────────────────────────────
  // Drawings on a light table cast crisp, constrained shadows — not diffuse bloom.
  // The slight prussian tint in the diffuse layer reflects ambient vellum scatter.
  '--z-shadow-card':      '0 1px 0 rgba(0,0,0,0.09), 0 4px 12px rgba(27,58,107,0.06), 0 1px 3px rgba(0,0,0,0.05)',
  '--z-shadow-card-deep': '0 2px 0 rgba(0,0,0,0.11), 0 8px 24px rgba(27,58,107,0.08), 0 2px 6px rgba(0,0,0,0.06)',

  // ── Docs chrome — drafting vellum palette ─────────────────────────────────
  '--bg':        '#EDF2FA',
  '--bg2':       '#E1E9F5',   // sidebar
  '--bg3':       '#D4DFEF',   // hover / active states
  '--border':    'rgba(27,58,107,0.13)',
  '--border2':   'rgba(27,58,107,0.07)',
  '--text':      '#0D1B33',
  '--text2':     '#3A5580',
  '--text3':     '#7A96B8',
  '--topbar-bg':      'rgba(237,242,250,0.93)',
  '--z-panel-bg':     '#E1E9F5',
  '--z-panel-shadow': '0 8px 24px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',

  // ── Font — DM Mono: precision engineering notation ─────────────────────────
  // DM Mono's geometric axis reads as technical annotation lettering.
  // Chosen over Courier (typewriter), VT323 (CRT civilian), Share Tech (military comms).
  '--z-font-mono': "'DM Mono', 'Courier New', monospace",

  // ── Motion — CONSTANT VELOCITY (linear) ───────────────────────────────────
  // A drafting arm, T-square, or CMM probe moves at constant velocity.
  // No acceleration into position, no deceleration before stop.
  // This is the ONLY genre in ZynaUI using linear() for interactive transitions.
  // Reference: pantograph, optical comparator carriage, coordinate measuring machine.
  '--z-duration-fast':  '0.16s',
  '--z-duration-base':  '0.22s',
  '--z-duration-slow':  '0.30s',
  '--z-duration-pulse': '4.5s',
  '--z-ease-enter':  'linear',
  '--z-ease-exit':   'linear',
  // Spring: a precision instrument finds its rest position with a micro-settle.
  // cubic-bezier over 1 by 0.02 = barely-perceptible overshoot then lock.
  '--z-ease-spring': 'cubic-bezier(0.34, 1.02, 0.64, 1)',
}

export const styles = {
  // ── Pen plotter sweep keyframe ─────────────────────────────────────────────
  // Simulates an HP 7475A pen plotter head traversing the drawing surface.
  // The ONLY left-to-right (horizontal) sweep animation in ZynaUI.
  // The ONLY sweep animation on a LIGHT background.
  '@keyframes schematic-plotter': {
    '0%':   { transform: 'translateX(-4px)' },
    '100%': { transform: 'translateX(100vw)' },
  },

  // ── Structural overrides — scoped to html[data-genre="blueprint"] ──────────
  // Specificity [0,1,1] beats ops defaults on html [0,0,1].
  'html[data-genre="blueprint"]': {
    'color-scheme': 'light',

    // ── Button — right-angle stepped notch (machined tolerance feature) ───────
    // The TOP-RIGHT corner is cut as a 90° STEP — not a diagonal chamfer,
    // not a rounded corner, not a bevelled edge. A right-angle step cut:
    // the shape of a counterbored hole, a PCB routing keepout shoulder,
    // or a precision tolerance step in a machined part.
    //
    // The step is exactly --btn-corner × --btn-corner (a square notch).
    // At 10 px it is 10 × 10 px — barely noticeable as a design decision,
    // undeniably intentional once you look for it.
    //
    // Shape (CW from top-left):
    //   (0,0) → (100%-corner, 0)          — full top edge minus step width
    //   → (100%-corner, corner)            — step drops corner px
    //   → (100%, corner)                   — step runs to the right edge
    //   → (100%, 100%) → (0, 100%) → back  — standard bottom and left edges
    //
    // Compare all button shapes across ZynaUI:
    //   Ops       — symmetric diagonal hex (top-right + bottom-left)
    //   Corporate — single top-right diagonal dog-ear
    //   Phosphor  — left-side chevron notch
    //   Military  — opposing diagonal (top-left + bottom-right)
    //   Cyberpunk — rectangular inset
    //   Blueprint — right-angle STEP (top-right) ← unique orthogonal cut
    '--z-btn-clip':         'polygon(0 0, calc(100% - var(--btn-corner)) 0, calc(100% - var(--btn-corner)) var(--btn-corner), 100% var(--btn-corner), 100% 100%, 0 100%)',
    '--z-btn-inner-clip':   'polygon(1px 1px, calc(100% - var(--btn-corner) - 1px) 1px, calc(100% - var(--btn-corner) - 1px) calc(var(--btn-corner) + 1px), calc(100% - 1px) calc(var(--btn-corner) + 1px), calc(100% - 1px) calc(100% - 1px), 1px calc(100% - 1px))',
    '--z-btn-corner':       '10px',
    '--z-btn-active-scale': '0.97',
    '--z-btn-scan-stop':    '40%',   // precision fill — restrained, like a CMM readout

    // ── Badge — top-center V-notch (ISO 1101 datum feature symbol) ────────────
    // A downward-pointing triangular cut at the midpoint of the top edge.
    // In ISO 1101 / ASME Y14.5 GD&T (Geometric Dimensioning & Tolerancing),
    // the datum feature symbol is a rectangle with a triangular opening at the
    // top — the triangle indicates the datum direction. This badge clip
    // reproduces that opening exactly.
    //
    // The notch is 5 px deep and ±5 px from the horizontal centerline.
    // At font-size 12–14 px the badge top padding clears it comfortably.
    // No other design system uses a top-center notch on a badge element.
    '--z-badge-clip':           'polygon(0 0, calc(50% - 5px) 0, 50% 5px, calc(50% + 5px) 0, 100% 0, 100% 100%, 0 100%)',
    '--z-badge-radius':         '0',
    '--z-badge-padding':        '0.38rem 0.80rem 0.22rem 0.80rem',  // extra top to clear the 5 px notch
    '--z-badge-letter-spacing': '0.09em',
    '--z-badge-inset-shadow':   'inset 0 0 0 1px currentColor',
    '--z-badge-scan-duration':  '8s',
    '--z-badge-inner-clip':     'polygon(1px 1px, calc(50% - 4px) 1px, 50% 4px, calc(50% + 4px) 1px, calc(100% - 1px) 1px, calc(100% - 1px) calc(100% - 1px), 1px calc(100% - 1px))',

    // ── Alert — partial-height LEFT WITNESS LINE ───────────────────────────────
    // In ISO 128 dimension practice, witness lines (extension lines) project
    // ONLY from the feature being dimensioned — they don't extend beyond it.
    // The alert bar spans 15 %→85 % of the alert height: anchored to the content
    // region, not pinned to the container edges.
    //
    // Bar geometry: inset shorthand = top right bottom left.
    //   inset: 15% auto 15% 0
    //   top: 15%  — bar starts 15 % from top
    //   right: auto
    //   bottom: 15% — bar ends 15 % from bottom
    //   left: 0    — bar touches the left edge
    //   height: auto — governed by top+bottom constraints = 70 % of height
    //
    // This is the FIRST partial-height alert bar in any CSS design system.
    // It is also the first alert bar whose height is percentage-relative (not 100%).
    '--z-alert-radius':         '3px',           // all corners rounded — bar floats inside, not flush
    '--z-alert-bar-width':      '2px',            // hairline witness line — ISO thin-line standard
    '--z-alert-prefix':         '"⊗ "',           // circled times: into-page vector / reference terminus
    '--z-alert-bg-opacity':     '5%',
    '--z-alert-border':         '1px solid rgba(27,58,107,0.08)',
    '--z-alert-prefix-opacity': '0.40',
    '--z-alert-bar-glow':       'none',            // light surface — no bloom
    '--z-alert-texture':        'none',
    '--z-alert-padding-top':    '0.875rem',
    '--z-alert-padding-left':   'calc(1.25rem + var(--z-alert-bar-width))',
    '--z-alert-bar-inset':      '15% auto 15% 0', // witness line: 15 % inset top + bottom
    '--z-alert-bar-w':          'var(--z-alert-bar-width)',
    '--z-alert-bar-h':          'auto',            // top:15% + bottom:15% = 70 % height, centered
    '--z-alert-bar-radius':     '1px',             // clean line terminus

    // ── Card — precision data sheet ───────────────────────────────────────────
    '--z-card-clip':                  'none',
    '--z-card-filter':                'none',
    // Ruled schedule lines — a blank engineering parts list or schedule table.
    // Horizontal rules at 18 px simulate the pre-printed ruling on an engineering
    // form or inspection schedule, ready for annotation.
    '--z-card-texture':               'repeating-linear-gradient(0deg, rgba(27,58,107,0.022) 0px, rgba(27,58,107,0.022) 1px, transparent 1px, transparent 18px)',
    '--z-card-gradient':              'var(--z-surface-card)',
    '--z-card-border-color':          'rgba(27,58,107,0.09)',
    '--z-card-shadow':                'var(--z-shadow-card)',
    // Corner registration marks — heavier than Ops, reads as print/CAD registration.
    // Drawing sheets use L-shaped corner marks for sheet alignment in reproduction.
    '--z-card-bracket-color':         'color-mix(in oklch, var(--zyna) 50%, transparent)',
    '--z-card-bracket-size':          '20px',
    '--z-card-bracket-stroke':        '2px',
    // Title block top rule — SOLID, full-width.
    // Every ISO drawing sheet has a solid top border on the title block.
    // No gradient fade: drawings have hard edges, not soft ones.
    '--z-card-bar-height':            '2px',
    '--z-card-bar-bg':                'var(--zyna)',  // solid rule — ISO line standard
    '--z-card-bar-shadow':            'none',
    // Header: precise annotation band — like a printed drawing title block header
    '--z-card-header-bg':             'rgba(27,58,107,0.04)',
    '--z-card-header-border':         'rgba(27,58,107,0.10)',
    '--z-card-header-color':          'var(--zyna)',
    '--z-card-header-letter-spacing': '0.10em',
    '--z-card-header-text-shadow':    'none',
    '--z-card-header-dot-size':       '5px',
    '--z-card-header-dot-bg':         'var(--zyna)',
    // CMM position indicator: a precise, tight shadow — not a neon bloom.
    // Simulates the target dot on a coordinate measuring machine probe display.
    '--z-card-header-dot-shadow':     '0 0 4px color-mix(in oklch, var(--zyna) 55%, transparent)',
    // Linear pulse: CMM cursor blinks at constant rate — no ease-in-out.
    '--z-card-header-dot-animation':  'zyna-pulse-ring var(--z-duration-pulse) linear infinite',
    '--z-card-title-text-shadow':     'none',
    '--z-card-glow-duration':         '7s',
    // Barely-perceptible prussian field on light card surface
    '--z-card-default-glow-lo':       'rgba(27,58,107,0.025)',
    '--z-card-default-glow-hi':       'rgba(27,58,107,0.065)',

    // ── Docs chrome ───────────────────────────────────────────────────────────
    '--z-topbar-border':         'rgba(27,58,107,0.09)',
    '--z-topbar-glow':           'none',
    // DOUBLE WITNESS LINE sidebar indicator — two 2 px prussian lines with a 2 px gap.
    // Reference: the pair of extension/witness lines used in ISO 128 dimension callouts.
    // Built from three stacked inset box-shadows:
    //   shadow 1 (front) — 2 px prussian line at edge
    //   shadow 2         — 2 px gap (paints var(--bg) over the area between lines)
    //   shadow 3 (back)  — 6 px prussian behind, visible only in the 4–6 px band
    // Net result: 2 px prussian | 2 px gap | 2 px faint prussian — a dimension tick pair.
    // Never implemented in any design system or UI component library.
    '--z-sidebar-active-shadow': 'inset 2px 0 0 var(--zyna), inset 4px 0 0 var(--bg), inset 6px 0 0 color-mix(in oklch, var(--zyna) 40%, transparent)',
  },

  // ── Badge color overrides — prussian annotation variants ─────────────────
  // Blueprint badges: faint tinted fill + solid 1 px border via inset shadow.
  // No glows — this is a light drafting surface, not a neon display.
  ':where(html[data-genre="blueprint"]) :where(.badge-primary)': {
    '--badge-bg':   'color-mix(in oklch, var(--zyna) 7%, transparent)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="blueprint"]) :where(.badge-success)': {
    '--badge-bg':   'color-mix(in oklch, var(--z-color-success) 7%, transparent)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="blueprint"]) :where(.badge-danger)': {
    '--badge-bg':   'color-mix(in oklch, var(--z-color-danger) 7%, transparent)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="blueprint"]) :where(.badge-warning)': {
    '--badge-bg':   'color-mix(in oklch, var(--z-color-warning) 7%, transparent)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="blueprint"]) :where(.badge-info)': {
    '--badge-bg':   'color-mix(in oklch, var(--z-color-info) 7%, transparent)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="blueprint"]) :where(.badge-secondary)': {
    '--badge-bg':   'color-mix(in oklch, var(--zyna) 5%, transparent)',
    '--badge-glow': 'none',
  },

  // ── Polygon badge shape fixes (slant, bevel) on light surface ─────────────
  // Polygon shapes can't use box-shadow: inset for a border — the rectangular
  // shadow cuts abruptly at diagonal corners. Use the inner-clip border model:
  //   outer = border color (currentColor), ::before fill = page background.
  // Same technique as Corporate — required for all light-mode genres.
  ':where(html[data-genre="blueprint"]) :where(.badge-slant)': {
    '--z-badge-inset-shadow': 'none',
    '--badge-bg':         'currentColor',
    '--badge-interior':   'var(--z-surface-page)',
    '--badge-inner-clip': 'polygon(calc(var(--badge-offset) + 1px) 1px, calc(100% - 1px) 1px, calc(100% - calc(var(--badge-offset) + 1px)) calc(100% - 1px), 1px calc(100% - 1px))',
  },
  ':where(html[data-genre="blueprint"]) :where(.badge-bevel)': {
    '--z-badge-inset-shadow': 'none',
    '--badge-bg':         'currentColor',
    '--badge-interior':   'var(--z-surface-page)',
    '--badge-inner-clip': 'polygon(calc(var(--badge-offset) + 1px) 1px, calc(100% - calc(var(--badge-offset) + 1px)) 1px, calc(100% - 1px) calc(var(--badge-offset) + 1px), calc(100% - 1px) calc(100% - calc(var(--badge-offset) + 1px)), calc(100% - calc(var(--badge-offset) + 1px)) calc(100% - 1px), calc(var(--badge-offset) + 1px) calc(100% - 1px), 1px calc(100% - calc(var(--badge-offset) + 1px)), 1px calc(var(--badge-offset) + 1px))',
  },

  // ── Precision metric grid — page texture ──────────────────────────────────
  // Four gradient layers: horizontal + vertical lines at two tiers.
  //   Minor grid — 5 px pitch: finest division (1 mm at 1:5 scale)
  //   Major grid — 25 px pitch: main division (5 mm at 1:5 scale, 5:1 ratio)
  //
  // The 5:1 ratio is the ISO metric drafting paper standard subdivision.
  // Distinct from Corporate's single-tier 24 px graph-paper grid:
  //   Corporate = notepad grid (one density, uniform)
  //   Blueprint  = engineering metric paper (two densities, measured subdivision)
  ':where(html[data-genre="blueprint"]) body::before': {
    content: '""',
    position: 'fixed',
    inset: '0',
    zIndex: '0',
    pointerEvents: 'none',
    backgroundImage: [
      // Minor grid horizontal — 5 px pitch
      'repeating-linear-gradient(rgba(27,58,107,0.020) 0 1px, transparent 1px 100%)',
      // Minor grid vertical — 5 px pitch
      'repeating-linear-gradient(90deg, rgba(27,58,107,0.020) 0 1px, transparent 1px 100%)',
      // Major grid horizontal — 25 px pitch (5× minor)
      'repeating-linear-gradient(rgba(27,58,107,0.052) 0 1px, transparent 1px 100%)',
      // Major grid vertical — 25 px pitch
      'repeating-linear-gradient(90deg, rgba(27,58,107,0.052) 0 1px, transparent 1px 100%)',
    ].join(', '),
    backgroundSize: '5px 5px, 5px 5px, 25px 25px, 25px 25px',
  },

  // ── Pen plotter sweep — horizontal scan ───────────────────────────────────
  // A faint 3 px vertical slit moving left-to-right across the viewport at
  // constant velocity, completing one pass every 14 s.
  //
  // Reference: HP 7475A / 7550A pen plotter — the pen head traverses the
  // X-axis at a fixed feedrate while the Y-axis drum rolls the paper.
  // The scan is the pen head, not the paper — so the motion is horizontal.
  //
  // Design rationale vs other ZynaUI sweeps:
  //   Phosphor (top→bottom, 8 s)  — CRT electron gun raster scan
  //   Military (bottom→top, 12 s) — ground surveillance LiDAR sweep
  //   Blueprint (left→right, 14 s) — pen plotter head traversal ← unique axis
  //
  // Duration 14 s: plotter feedrate is slow — precision over speed.
  // Width 3 px: wider than 1 px scanline to read as a plotter pen stroke.
  // Peak opacity 6 %: barely visible on vellum — "the plotter is working."
  ':where(html[data-genre="blueprint"]) body::after': {
    content: '""',
    position: 'fixed',
    top: '0',
    left: '0',
    width: '3px',
    height: '100%',
    zIndex: '0',
    pointerEvents: 'none',
    background: 'linear-gradient(to bottom, transparent 0%, rgba(27,58,107,0.03) 20%, rgba(27,58,107,0.06) 50%, rgba(27,58,107,0.03) 80%, transparent 100%)',
    transform: 'translateX(-4px)',
    animation: 'schematic-plotter 14s linear infinite',
  },

  // ── prefers-reduced-motion — plotter sweep stops ───────────────────────────
  '@media (prefers-reduced-motion: reduce)': {
    ':where(html[data-genre="blueprint"]) body::after': { animation: 'none' },
  },
}

export default { name, tokens, swatches, styles }
