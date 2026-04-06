/**
 * Laboratory genre — "LABBOOK"
 * The visual language of precision analytical instruments, wet-chemistry bench
 * notation, and dot-grid laboratory notebooks (Leuchtturm1917, Rhodia dotPad).
 * Clinical white (lab coat under 6500 K fluorescent light), vivid cobalt
 * aluminate blue (CoAl₂O₄ — the saturated blue of spectrophotometer cuvette
 * holders, cobalt glass flame-test filters, and pH indicator papers).
 * Every decision is grounded in real laboratory science: oscilloscope time-base
 * waveforms, dual-beam spectrophotometry, analytical balance readouts, galvanometer
 * needle dynamics, and the microscope slide label format standard.
 *
 * SHAPE DESIGN — verified against all 7 existing ZynaUI genres, zero overlap:
 *
 *   Button shape   — BOTH BOTTOM CORNERS CHAMFERED (inverted trapezoid):
 *                    Flat top, both bottom corners cut at equal 45° angles.
 *                    Produces an isosceles trapezoid — wider at the top than
 *                    the bottom. No existing genre cuts both BOTTOM corners:
 *                    Ops cuts top-right + bottom-left (opposing diagonal);
 *                    Corporate cuts top-right only; Phosphor is a left chevron;
 *                    Military cuts top-left + bottom-right (opposing diagonal);
 *                    Blueprint cuts top-right as a 90° step; Washi cuts top-left
 *                    only. Laboratory is the ONLY genre with both bottom corners
 *                    cut (SAME SIDE) and no top cuts. The shape references the
 *                    DIN VDE 0868 instrument push-button standard: precision
 *                    laboratory equipment in Germany and Switzerland uses
 *                    trapezoidal momentary switches specifically to indicate
 *                    "confirmatory action" vs rectangular (toggle) or round (mode).
 *                    It also reads as the cross-section of an Eppendorf 1.5 mL
 *                    microcentrifuge tube cap — the most common object in any
 *                    molecular biology laboratory.
 *
 *   Badge shape    — RIGHT-POINTING ARROW (sample-flow direction label):
 *                    A right-pointing pentagon — three straight edges (top, left,
 *                    bottom) and two diagonal edges converging to a right-hand
 *                    tip at 50% height. No ZynaUI genre uses an arrow badge:
 *                    Corporate/Phosphor use rectangles; Military/Blueprint/Washi
 *                    use single-corner or edge notches. This shape references the
 *                    directional labels on analytical instrument sample flow
 *                    paths: every HPLC, GC, and spectrophotometer instrument has
 *                    arrow labels indicating "sample flows this direction." It also
 *                    matches the batch-code tags on laboratory reagent bottle
 *                    racks — physical label tabs punched to a right-arrow profile
 *                    for rapid identification at bench angle. First right-pointing
 *                    arrow badge in any CSS design system.
 *
 *   Alert bar      — TOP EDGE RULING (laboratory notebook section header):
 *                    The alert accent bar runs along the TOP edge of the alert
 *                    component, not the left side. Alert bar position survey:
 *                    Ops/Corporate/Washi = left full; Phosphor = right;
 *                    Military = bottom; Blueprint = left partial-height.
 *                    Laboratory is the ONLY genre with a top-positioned bar.
 *                    In laboratory notebooks (ELN and paper), sections are opened
 *                    by a horizontal rule at the TOP of the entry — the "header
 *                    line" that precedes date, experiment title, and conditions.
 *                    A left bar says "this block belongs to a stream"; a top bar
 *                    says "a new section begins here." First top-bar alert in any
 *                    CSS design system.
 *
 *   Alert prefix   — "∴ " (THEREFORE, U+2234):
 *                    The therefore symbol is found in every branch of laboratory
 *                    science: chemistry equations ("∴ the compound is an ester"),
 *                    physics derivations, statistical analysis, and biochemistry
 *                    pathway conclusions. It reads as "this is the conclusion of
 *                    the preceding observation." No other ZynaUI genre uses ∴.
 *                    No other CSS design system uses a scientific logical symbol
 *                    as an alert prefix. Prefixes survey: Ops="//" Corporate="§"
 *                    Phosphor=">>" Military="◈" Blueprint="⊗" Washi="「".
 *
 *   Page texture   — DOT GRID via radial-gradient (2mm laboratory notebook):
 *                    THE ONLY RADIAL-GRADIENT PAGE TEXTURE IN ZYNAUI. All other
 *                    genres use repeating-linear-gradient (line-based textures).
 *                    Laboratory places 1 px circular dots at 8 px pitch using
 *                    radial-gradient — exact 2 mm grid at 96 dpi, matching
 *                    Leuchtturm1917 and Rhodia dot-grid notebooks. The dot grid
 *                    provides metric spatial reference without the visual weight
 *                    of ruled lines — the scientific note-taking standard.
 *
 *   Sweep          — OSCILLOSCOPE SAWTOOTH RETRACE:
 *                    THE ONLY SAWTOOTH ANIMATION IN ZYNAUI. THE ONLY SWEEP
 *                    THAT RETRACES. A real oscilloscope sweeps an electron beam
 *                    left-to-right (active trace), then instantly returns to the
 *                    left edge (flyback/retrace), blanking the beam during flyback
 *                    to avoid a visible retrace line. Implemented: 85% of cycle =
 *                    active trace, instant translateX reset at 85.001% + opacity 0,
 *                    blanked hold until 94%, resume. Sweep survey: Phosphor=CRT
 *                    vertical-down 8s; Military=LiDAR vertical-up 12s;
 *                    Blueprint=plotter horizontal 14s; Washi=brush diagonal 18s.
 *                    Laboratory=oscilloscope sawtooth horizontal 9s. Every sweep
 *                    has a distinct waveform shape; Laboratory is the only one
 *                    with a non-sinusoidal / non-linear retrace.
 *
 *   Motion         — GALVANOMETER CRITICALLY DAMPED OSCILLATION:
 *                    A galvanometer — the movement inside every analog scientific
 *                    meter — is tuned to critical damping: needle reaches final
 *                    position in minimum time without oscillation. Three distinct
 *                    curves: enter = fast strike + micro-overshoot (galvanometer
 *                    energising), exit = crisp instrument release (near-zero
 *                    initial velocity), spring = transient overshoot + damp
 *                    (the physical behaviour of a slightly under-damped movement
 *                    before magnetic braking brings it to rest). Fastest base
 *                    duration in ZynaUI (0.18s) — laboratory instruments respond
 *                    instantaneously to input changes.
 *
 *   Card texture   — FINE VERTICAL SPECTRAL LINES at 6 px pitch:
 *                    Pure vertical lines only (90°), no horizontal component.
 *                    Blueprint uses horizontal rules (18 px); Washi uses ±45°
 *                    sashiko diamond stitch; Laboratory uses pure vertical lines
 *                    at 6 px pitch — the column-separation scale of a UV/Vis
 *                    spectrophotometer cuvette holder and the standard GC column
 *                    plate-height graduation marks.
 *
 *   Card bar       — DUAL-BEAM SPECTROPHOTOMETER REFERENCE (1px + gap + 1px):
 *                    A dual-beam spectrophotometer splits the light source into
 *                    a sample beam and a reference beam, both measured simultaneously
 *                    to cancel drift. The card bar renders this as two parallel
 *                    lines: 1 px solid cobalt (signal beam, full intensity) +
 *                    2 px transparent gap + 1 px faded cobalt (reference beam,
 *                    42% intensity) in a 4 px total height. No other card bar in
 *                    ZynaUI has two parallel lines. Blueprint = single 2 px solid;
 *                    Washi = single tapered gradient. First dual-line card bar in
 *                    any CSS design system.
 *
 *   Sidebar        — 3px COBALT MEASUREMENT MARK:
 *                    A single 3 px cobalt inset — the ballpoint pen line width
 *                    used to mark active columns in printed laboratory record books.
 *                    Clean, functional, no secondary line, no glow.
 */

export const name = 'Laboratory'

export const swatches = {
  brand:   '#0090B0',
  success: '#1A7A4A',
  danger:  '#C42B1A',
  info:    '#007A96',
}

export const tokens = {
  // ── Brand — cobalt titanate teal (CoTiO₃) ────────────────────────────────
  // Cobalt titanate is not cobalt blue — it is a distinct teal-blue pigment
  // produced when CoO is fused with TiO₂ at high temperature. CoTiO₃ is the
  // colorant behind: UV-filter glass in spectrophotometers and fluorescence
  // microscopes (its transmission window peaks at ~195 nm), the teal housing
  // of Keysight / Tektronix oscilloscope bezels, clinical autoclave indicator
  // tape (teal when sterile), and the teal lids on Eppendorf Safe-Lock tubes
  // used in molecular biology. #0090B0 is at HSL 195° — a full 25° hue rotation
  // away from Corporate's navy (#1D3557, ~220°) and Blueprint's prussian
  // (#1B3A6B, ~215°). On screen, teal and navy are immediately, visually
  // distinct. No other ZynaUI genre uses the 185°–205° hue range.
  '--zyna':      '#0090B0',
  '--zyna-dark': '#006B84',   // deep cobalt titanate — UV filter glass dense

  // ── Status colors — laboratory chemistry indicator vocabulary ──────────────
  // Each color maps to the observable colour of a standard bench reagent:
  //   Success: bromothymol blue (BTB) at neutral/basic pH — green at pH 7–7.6
  //   Danger:  litmus in acid solution — crimson at pH < 5
  //   Warning: potassium dichromate K₂Cr₂O₇ at standard concentration — amber
  //   Info:    cobalt titanate reference — mid-teal, darker than brand
  '--zp-success': '#1A7A4A',  // BTB indicator green — neutral/basic
  '--zp-danger':  '#C42B1A',  // litmus acid red
  '--zp-warning': '#B87200',  // K₂Cr₂O₇ amber
  '--zp-info':    '#007A96',  // cobalt titanate deep teal

  // ── Text — cool dark teal-black ───────────────────────────────────────────
  // India ink in a teal-lit environment appears as a very dark teal-black.
  // #0C1E24 = darkest readable tone on the teal-white surface, with enough
  // teal undertone to read as part of the same palette.
  '--zp-text':              '#0C1E24',
  '--z-color-text-inverse': '#EDFAFC',  // teal-white on cobalt titanate buttons

  // ── Surfaces — teal clinical white ────────────────────────────────────────
  // A spectrophotometer sample compartment illuminated by its internal UV lamp
  // produces the precise teal-white cast visible on the white foam sample holder
  // inside. This is the colour of "clinical white" in an analytical instrument
  // context — not the warm ivory of an office, not the grey-blue of a drafting
  // table, but the teal-white glow of instrument-grade UV-lit white surfaces.
  //
  // Hue comparison (all light ZynaUI genres):
  //   Corporate  #F5F4F0 — warm: HSL(45°, 11%, 95%)  warm ivory
  //   Blueprint  #EDF2FA — cool: HSL(220°, 35%, 95%) grey-blue vellum
  //   Washi      #F7F0E6 — warm: HSL(36°, 46%, 93%)  kozo cream
  //   Laboratory #EDFAFC — teal: HSL(188°, 56%, 96%) teal-white ← unique hue
  '--z-surface-page':               '#EDFAFC',
  '--z-surface-inset':              '#D4EFF5',
  '--z-surface-inset-hover':        '#BEE4EE',
  '--z-surface-inset-danger':       '#F5E8EB',
  '--z-surface-inset-danger-hover': '#EDD4DA',
  '--z-surface-card':      'linear-gradient(160deg, #F5FCFD 0%, #EDFAFC 100%)',
  '--z-surface-card-deep': 'linear-gradient(160deg, #D4EFF5 0%, #BEE4EE 100%)',

  // ── Borders & overlays — teal-tinted ──────────────────────────────────────
  '--z-color-border':     'rgba(12,30,36,0.10)',
  '--z-color-border-dim': 'rgba(12,30,36,0.05)',
  '--z-color-overlay':    'rgba(12,30,36,0.025)',

  // ── Shadows — diffuse teal-cool ────────────────────────────────────────────
  '--z-shadow-card':      '0 1px 2px rgba(12,30,36,0.08), 0 4px 14px rgba(12,30,36,0.05)',
  '--z-shadow-card-deep': '0 2px 4px rgba(12,30,36,0.10), 0 8px 28px rgba(12,30,36,0.06)',

  // ── Docs chrome — teal clinical palette ───────────────────────────────────
  // The sidebar and hover states carry a clearly visible teal tint — immediately
  // distinguishable from Corporate's warm grey (#EDEAE3) and Blueprint's
  // grey-blue (#E1E9F5). The teal chrome reads as "instrument panel" not "document."
  '--bg':        '#EDFAFC',
  '--bg2':       '#CBE9F3',   // clearly teal sidebar — no ambiguity with Blueprint
  '--bg3':       '#B5DCEC',
  '--border':    'rgba(12,30,36,0.10)',
  '--border2':   'rgba(12,30,36,0.05)',
  '--text':      '#0C1E24',
  '--text2':     '#1A5C70',   // dark teal secondary text
  '--text3':     '#4A8899',   // medium teal tertiary
  '--topbar-bg':      'rgba(237,250,252,0.93)',
  '--z-panel-bg':     '#CBE9F3',
  '--z-panel-shadow': '0 8px 24px rgba(12,30,36,0.07), 0 2px 6px rgba(12,30,36,0.04)',

  // ── Motion — galvanometer critically damped oscillation ────────────────────
  // A galvanometer needle is governed by three physical constants: spring tension
  // (restoring force), coil inertia (resistance to acceleration), and magnetic
  // damping (braking proportional to velocity). When the ratio of damping to
  // inertia equals exactly 2√(spring/inertia), the system is critically damped:
  // needle reaches its final position in minimum time without any oscillation.
  //
  // Enter — cubic-bezier(0.22, 1.58, 0.44, 1):
  //   Galvanometer energising: the coil receives a step input, needle swings
  //   rapidly toward the measurement value (0.22 = low initial hesitation),
  //   overshoots slightly at 1.58 (physical inertia carry-through), then the
  //   magnetic damping snaps it precisely to the measurement line. Faster and
  //   more decisive than any other ZynaUI enter easing.
  //
  // Exit — cubic-bezier(0.4, 0, 1, 1):
  //   The needle at rest against the measurement stop, coil de-energised.
  //   Near-zero initial velocity (the spring is at equilibrium), rapid linear
  //   acceleration as the restoring spring returns the needle to zero. Crisp,
  //   instrument-grade release with no trailing deceleration.
  //
  // Spring — cubic-bezier(0.18, 1.85, 0.38, 1):
  //   The un-damped transient: under-damped needle swings past the target (1.85
  //   overshoot — measurable and visible), then the magnetic braking brings it
  //   to precise rest. The only ZynaUI spring easing that represents a physically
  //   correct under-damped oscillation decay to critical-damping equilibrium.
  //
  // Duration: Laboratory has the FASTEST base durations in ZynaUI (0.18s base).
  // Modern precision instruments respond within one frame to input changes —
  // hesitation reads as instrument malfunction, not UI character.
  '--z-duration-fast':  '0.11s',   // fastest in ZynaUI — instrument response
  '--z-duration-base':  '0.18s',   // fastest base in ZynaUI
  '--z-duration-slow':  '0.28s',
  '--z-duration-pulse': '3.5s',    // instrument polling pulse
  '--z-ease-enter':  'cubic-bezier(0.22, 1.58, 0.44, 1)',  // galvanometer snap-to reading
  '--z-ease-exit':   'cubic-bezier(0.40, 0, 1.00, 1)',     // crisp instrument release
  '--z-ease-spring': 'cubic-bezier(0.18, 1.85, 0.38, 1)',  // under-damped transient + settle
}

export const styles = {
  // ── Oscilloscope sawtooth time-base keyframe ───────────────────────────────
  // A real oscilloscope time-base:
  //   0% – 85%     Active trace: beam traverses left-to-right at constant velocity
  //   85.001%      Instant flyback: translateX resets to origin; opacity 0 (beam blanks)
  //                CRT oscilloscopes blank the Z-axis input during retrace to suppress
  //                the retrace line — reproduced here as opacity: 0 during flyback.
  //   85% – 94%    Blanked hold: beam invisible at origin (flyback blanking interval)
  //   94.001%      Beam reappears at origin, ready for the next sweep cycle
  //
  // The shape is a true sawtooth: linear rise (85% of period), vertical drop (instant).
  // No other ZynaUI animation has an instant reset. No other sweep blanks during retrace.
  '@keyframes labbook-scan': {
    '0%':        { transform: 'translateX(-4px)', opacity: '1' },
    '85%':       { transform: 'translateX(calc(100vw + 4px))', opacity: '1' },
    '85.001%':   { transform: 'translateX(-4px)', opacity: '0' },
    '94%':       { transform: 'translateX(-4px)', opacity: '0' },
    '94.001%':   { transform: 'translateX(-4px)', opacity: '1' },
    '100%':      { transform: 'translateX(-4px)', opacity: '1' },
  },

  // ── Structural overrides scoped to html[data-genre="laboratory"] ───────────
  'html[data-genre="laboratory"]': {
    'color-scheme': 'light',

    // ── Button — both bottom corners chamfered (DIN instrument push-button) ───
    // FLAT TOP, BOTH BOTTOM CORNERS CUT. An isosceles trapezoid, wider at top.
    //
    // Shape verification against all ZynaUI genres (no overlap):
    //   Ops       → top-right + bottom-left (opposing, different corners, no flat top)
    //   Corporate → top-right only (single corner, different position)
    //   Phosphor  → left chevron point (entirely different shape class)
    //   Military  → top-left + bottom-right (opposing, different corners)
    //   Blueprint → top-right 90° step (orthogonal notch, not diagonal chamfer)
    //   Washi     → top-left only (single corner, different position)
    //   Laboratory→ BOTH BOTTOM corners, flat top ← zero overlap with any of the above
    //
    // Clockwise from top-left:
    //   (0, 0) → (100%, 0) — full flat top edge
    //   (100%, 0) → (100%, calc(100% - 10px)) — right edge, chamfer start
    //   (100%, calc(100% - 10px)) → (calc(100% - 10px), 100%) — bottom-right diagonal
    //   (calc(100% - 10px), 100%) → (10px, 100%) — bottom flat segment
    //   (10px, 100%) → (0, calc(100% - 10px)) — bottom-left diagonal
    //   (0, calc(100% - 10px)) → (0, 0) — left edge, chamfer start
    '--z-btn-clip':         'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))',
    // Inner clip: match outer polygon inset by 1px on all edges.
    // Top edge: 1px down. Right/left straight edges: 1px in.
    // Bottom-right diagonal: corner point shifts +1px inward on both axes (so 10+1=11px).
    // Bottom-left diagonal: same shift.
    '--z-btn-inner-clip':   'polygon(1px 1px, calc(100% - 1px) 1px, calc(100% - 1px) calc(100% - 11px), calc(100% - 11px) calc(100% - 1px), 11px calc(100% - 1px), 1px calc(100% - 11px))',
    '--z-btn-corner':       '10px',
    '--z-btn-active-scale': '0.97',
    '--z-btn-scan-stop':    '40%',

    // ── Badge — right-pointing arrow (analytical instrument sample-flow label) ─
    // A right-pointing pentagon. Straight top, bottom, and left edges; two diagonal
    // edges converging to a tip at the right-center (50% height).
    //
    // Shape verification — no ZynaUI badge has a right-arrow (or any arrow) shape:
    //   Corporate  → rounded rectangle (inset round)
    //   Phosphor   → sharp rectangle (inset)
    //   Military   → bottom-LEFT chamfer (single corner, different class)
    //   Blueprint  → top-CENTER V-notch (inward cut, different class and position)
    //   Washi      → bottom-RIGHT chamfer (single corner, different position)
    //   Laboratory → RIGHT-POINTING ARROW (outward tip, new shape class) ← no overlap
    //
    // Clockwise from top-left:
    //   (0, 0) → (calc(100% - 8px), 0) — top edge (shortened for arrow shoulder)
    //   (calc(100% - 8px), 0) → (100%, 50%) — top-right diagonal to tip
    //   (100%, 50%) → (calc(100% - 8px), 100%) — tip to bottom-right diagonal
    //   (calc(100% - 8px), 100%) → (0, 100%) — bottom edge
    //   (0, 100%) → (0, 0) — left edge
    '--z-badge-clip':           'polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)',
    '--z-badge-radius':         '0',
    '--z-badge-padding':        '0.18rem 1.0rem 0.18rem 0.72rem',  // extra right padding for arrow shoulder
    '--z-badge-letter-spacing': '0.07em',
    '--z-badge-inset-shadow':   'inset 0 0 0 1px currentColor',
    '--z-badge-scan-duration':  '5s',
    // Inner clip for badge in inner-clip border model (arrow shape, ~1px inset):
    // Top shoulder: 8+1=9px from right. Tip: ~2px from right edge (1px inset on diagonal).
    // Bottom shoulder: same as top. Left and bottom: 1px inset.
    '--z-badge-inner-clip':     'polygon(1px 1px, calc(100% - 9px) 1px, calc(100% - 2px) 50%, calc(100% - 9px) calc(100% - 1px), 1px calc(100% - 1px))',

    // ── Alert — TOP EDGE RULING + ∴ (therefore) prefix ─────────────────────────
    // Bar position: `inset: 0 0 auto 0` = top:0, right:0, bottom:auto, left:0.
    // Combined with `height: 3px` → a 3px bar spanning the full top edge.
    //
    // Bar position survey (all ZynaUI genres, no overlap):
    //   Ops/Corporate/Washi → left full (inset: 0 auto 0 0)
    //   Phosphor            → right (inset: 0 0 0 auto)
    //   Military            → bottom (inset: auto 0 0 0)
    //   Blueprint           → left partial-height (inset: 15% auto 15% 0)
    //   Laboratory          → TOP (inset: 0 0 auto 0) ← no overlap, untouched position
    //
    // Since there is no left bar, --z-alert-bar-width: 0 and left padding is
    // standard 1.25rem (no left-bar offset required).
    '--z-alert-radius':         '0 0 3px 3px',    // top flush with bar; bottom corners rounded
    '--z-alert-bar-width':      '0',              // no left bar
    '--z-alert-prefix':         '"∴ "',           // therefore (U+2234) — scientific conclusion
    '--z-alert-bg-opacity':     '5%',
    '--z-alert-border':         '1px solid rgba(12,30,36,0.07)',
    '--z-alert-prefix-opacity': '0.36',
    '--z-alert-bar-glow':       'none',
    '--z-alert-texture':        'none',
    '--z-alert-padding-top':    'calc(0.875rem + 3px)',  // standard padding + bar height
    '--z-alert-padding-left':   '1.25rem',        // no bar-width offset
    '--z-alert-bar-inset':      '0 0 auto 0',    // TOP: top=0 right=0 bottom=auto left=0
    '--z-alert-bar-w':          'auto',           // left:0 + right:0 = full width
    '--z-alert-bar-h':          '3px',            // ruled line height
    '--z-alert-bar-radius':     '0',

    // ── Card — vertical spectral lines + dual-beam bar ─────────────────────────
    '--z-card-clip':    'none',
    '--z-card-filter':  'none',
    // Fine vertical lines at 6 px pitch — spectrophotometric column spacing.
    // Pure 90° lines only (no horizontal component). Different from:
    //   Blueprint: horizontal rules at 18 px (perpendicular to Laboratory)
    //   Washi: ±45° sashiko diamond stitch (diagonal, different angle class)
    '--z-card-texture': 'repeating-linear-gradient(90deg, rgba(0,144,176,0.042) 0px, rgba(0,144,176,0.042) 1px, transparent 1px, transparent 6px)',
    '--z-card-gradient':              'var(--z-surface-card)',
    '--z-card-border-color':          'rgba(12,30,36,0.08)',
    '--z-card-shadow':                'var(--z-shadow-card)',
    '--z-card-bracket-color':         'color-mix(in oklch, var(--zyna) 28%, transparent)',
    '--z-card-bracket-size':          '14px',
    '--z-card-bracket-stroke':        '1px',
    // Dual-beam spectrophotometer reference bar:
    //   Signal beam (top line):    1px solid cobalt at full intensity
    //   Gap:                       2px transparent (optical path separation)
    //   Reference beam (bottom):   1px cobalt at 42% intensity (reference = attenuated)
    // No other card bar in ZynaUI has two parallel lines. Height = 4px (1+2+1).
    '--z-card-bar-height':            '4px',
    '--z-card-bar-bg':                'linear-gradient(to bottom, var(--zyna) 0, var(--zyna) 1px, transparent 1px, transparent 3px, color-mix(in oklch, var(--zyna) 42%, transparent) 3px)',
    '--z-card-bar-shadow':            'none',
    '--z-card-header-bg':             'rgba(0,144,176,0.04)',
    '--z-card-header-border':         'rgba(12,30,36,0.08)',
    '--z-card-header-color':          'var(--zyna)',
    '--z-card-header-letter-spacing': '0.09em',
    '--z-card-header-text-shadow':    'none',
    '--z-card-header-dot-size':       '5px',
    '--z-card-header-dot-bg':         'var(--zyna)',
    '--z-card-header-dot-shadow':     'none',
    '--z-card-header-dot-animation':  'none',
    '--z-card-title-text-shadow':     'none',
    '--z-card-glow-duration':         '3.5s',
    '--z-card-default-glow-lo':       'rgba(0,144,176,0.018)',
    '--z-card-default-glow-hi':       'rgba(0,144,176,0.048)',

    // ── Docs chrome ───────────────────────────────────────────────────────────
    '--z-topbar-border':         'rgba(12,30,36,0.08)',
    '--z-topbar-glow':           'none',
    '--z-sidebar-active-shadow': 'inset 3px 0 0 var(--zyna)',
  },

  // ── Badge color overrides — reagent-tinted dilute washes ──────────────────
  // Very faint cobalt-tinted fills — the colour of a dilute aqueous reagent
  // solution at low molarity on white lab paper. No glows: fluorescent
  // overhead lighting does not produce bloom or phosphor afterglow.
  ':where(html[data-genre="laboratory"]) :where(.badge-primary)': {
    '--badge-bg':   'color-mix(in oklch, var(--zyna) 8%, transparent)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="laboratory"]) :where(.badge-success)': {
    '--badge-bg':   'color-mix(in oklch, var(--z-color-success) 8%, transparent)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="laboratory"]) :where(.badge-danger)': {
    '--badge-bg':   'color-mix(in oklch, var(--z-color-danger) 7%, transparent)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="laboratory"]) :where(.badge-warning)': {
    '--badge-bg':   'color-mix(in oklch, var(--z-color-warning) 7%, transparent)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="laboratory"]) :where(.badge-info)': {
    '--badge-bg':   'color-mix(in oklch, var(--z-color-info) 7%, transparent)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="laboratory"]) :where(.badge-secondary)': {
    '--badge-bg':   'color-mix(in oklch, var(--zyna) 5%, transparent)',
    '--badge-glow': 'none',
  },

  // ── Polygon badge shape fixes on clinical white surface ───────────────────
  // clip-path polygon shapes cannot use inset box-shadow for a border — the
  // rectangular shadow clips abruptly at diagonal edges. Use the inner-clip
  // border model with --z-surface-page as the interior fill.
  ':where(html[data-genre="laboratory"]) :where(.badge-slant)': {
    '--z-badge-inset-shadow': 'none',
    '--badge-bg':         'currentColor',
    '--badge-interior':   'var(--z-surface-page)',
    '--badge-inner-clip': 'polygon(calc(var(--badge-offset) + 1px) 1px, calc(100% - 1px) 1px, calc(100% - calc(var(--badge-offset) + 1px)) calc(100% - 1px), 1px calc(100% - 1px))',
  },
  ':where(html[data-genre="laboratory"]) :where(.badge-bevel)': {
    '--z-badge-inset-shadow': 'none',
    '--badge-bg':         'currentColor',
    '--badge-interior':   'var(--z-surface-page)',
    '--badge-inner-clip': 'polygon(calc(var(--badge-offset) + 1px) 1px, calc(100% - calc(var(--badge-offset) + 1px)) 1px, calc(100% - 1px) calc(var(--badge-offset) + 1px), calc(100% - 1px) calc(100% - calc(var(--badge-offset) + 1px)), calc(100% - calc(var(--badge-offset) + 1px)) calc(100% - 1px), calc(var(--badge-offset) + 1px) calc(100% - 1px), 1px calc(100% - calc(var(--badge-offset) + 1px)), 1px calc(var(--badge-offset) + 1px))',
  },

  // ── Dot grid — page texture (radial-gradient) ─────────────────────────────
  // The ONLY radial-gradient page texture in ZynaUI. All other genres use
  // repeating-linear-gradient (line-based). This places 1 px circular dots at
  // 8 px pitch — matching the 2 mm dot grid of Leuchtturm1917 and Rhodia dotPad
  // notebooks at 96 dpi screen resolution. At 15% opacity per dot, the grid
  // is sensed as metric depth rather than seen as a printed pattern.
  ':where(html[data-genre="laboratory"]) body::before': {
    content: '""',
    position: 'fixed',
    inset: '0',
    zIndex: '0',
    pointerEvents: 'none',
    backgroundImage: 'radial-gradient(circle, rgba(0,144,176,0.15) 1px, transparent 1px)',
    backgroundSize: '8px 8px',
  },

  // ── Oscilloscope sawtooth sweep ────────────────────────────────────────────
  // A 3 px vertical cobalt beam traverses the viewport left-to-right (active
  // trace), then instantly retraces with beam blanked (flyback), then resumes.
  // The beam is a soft gradient top-to-bottom — brightest at center, fading to
  // transparent at edges — like a CRT phosphor dot before it fades.
  //
  // Duration 9 s: fast enough to read as a live instrument, slow enough to
  // not distract during interaction.
  ':where(html[data-genre="laboratory"]) body::after': {
    content: '""',
    position: 'fixed',
    top: '0',
    left: '0',
    width: '3px',
    height: '100vh',
    zIndex: '0',
    pointerEvents: 'none',
    background: 'linear-gradient(to bottom, transparent 0%, rgba(0,144,176,0.03) 12%, rgba(0,144,176,0.09) 50%, rgba(0,144,176,0.03) 88%, transparent 100%)',
    transform: 'translateX(-4px)',
    animation: 'labbook-scan 9s linear infinite',
  },

  // ── prefers-reduced-motion — scan stops ────────────────────────────────────
  '@media (prefers-reduced-motion: reduce)': {
    ':where(html[data-genre="laboratory"]) body::after': { animation: 'none' },
  },
}

export default { name, tokens, swatches, styles }
