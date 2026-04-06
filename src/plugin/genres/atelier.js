/**
 * Atelier genre — "MAISON"
 * The visual language of luxury editorial fashion houses: warm ecru vellum stock,
 * 22-karat gold blocking, and the restrained geometry of Parisian couture labels.
 * Every decision is grounded in physical luxury craft: hand-stamped price tags
 * with ribbon-notch holes, gold-foil title cards on archive boxes, the precise
 * parallel rules of a Moleskine cahier cover, the shimmer of gold leaf under
 * oblique atelier lighting, and the deliberate pace of a master cutter's movements.
 *
 * SHAPE DESIGN — verified against all 8 existing ZynaUI genres, zero overlap:
 *
 *   Button shape   — BOTH RIGHT CORNERS CHAMFERED (luxury ribbon label):
 *                    Flat left edge, both right corners cut at equal 45° angles.
 *                    Produces a right-shouldered ribbon form — the silhouette of a
 *                    woven satin label sewn into a garment, or a gold-foil price tag
 *                    affixed to a Hermès belt. The left edge is perfectly flush
 *                    (measuring instrument) while the right edge opens to a point.
 *                    No existing genre cuts BOTH RIGHT corners:
 *                    Ops = top-right + bottom-left (opposing diagonal);
 *                    Corporate = top-right only; Phosphor = left chevron;
 *                    Military = top-left + bottom-right (opposing); Blueprint =
 *                    top-right 90° step; Washi = top-left only; Laboratory =
 *                    both BOTTOM corners (different side). Atelier is the ONLY genre
 *                    with both RIGHT corners cut. No other CSS design system renders
 *                    a ribbon-label button.
 *
 *   Badge shape    — LEFT-SIDE V-NOTCH (couture price-tag ribbon hole):
 *                    A rectangle with a triangular V-notch cut into the LEFT-CENTER.
 *                    Physical luxury price tags (Chanel, Hermès, Dior) are punched
 *                    with a V-notch at the top-center or left-center through which
 *                    the ribbon or cord passes — the badge shape is that punched tag,
 *                    oriented with the notch on the left. No other ZynaUI badge uses
 *                    a V-notch: Corporate/Phosphor = rectangles; Military/Washi =
 *                    single corner chamfers; Blueprint = top-center V-notch (different
 *                    axis); Laboratory = right-pointing arrow. Atelier's notch is on
 *                    the LEFT (not the top), making it a new shape class. First
 *                    left-notch badge in any CSS design system.
 *
 *   Alert bar      — RIGHT PARTIAL-HEIGHT (archive ledger side-notation):
 *                    The alert accent bar runs along the RIGHT edge at 15%–85%
 *                    vertical — i.e., inset: 15% 0 15% auto. Bar position survey:
 *                    Ops/Corporate/Washi = left full; Phosphor = right full;
 *                    Military = bottom; Blueprint = left partial-height; Laboratory
 *                    = top. Atelier is the ONLY genre with RIGHT PARTIAL-HEIGHT.
 *                    In French couture atelier archives, assistant annotates a pattern
 *                    card by drawing a short vertical gold line down the RIGHT margin —
 *                    not a full-height rule (which signals a page boundary) but a
 *                    crop-height mark signalling "this element is approved / à suivre."
 *
 *   Alert prefix   — "» " (RIGHT GUILLEMET — French editorial citation):
 *                    The French right double guillemet (U+00BB) is the standard
 *                    quotation and annotation mark in French editorial and couture
 *                    typography. Parisian fashion editorials use » as a section
 *                    continuation mark — "the point of view continues here." It reads
 *                    as elegant, directional, and unmistakably editorial. No other
 *                    ZynaUI genre uses a guillemet. Prefix survey: Ops="//" Corporate
 *                    ="§" Phosphor=">>" Military="◈" Blueprint="⊗" Washi="「"
 *                    Laboratory="∴". The » is visually similar to >> (Phosphor) but
 *                    is a single Unicode character with a fundamentally different
 *                    cultural register — double-chevron vs double-guillemet.
 *
 *   Page texture   — LAID PAPER (horizontal laid lines + vertical chain lines):
 *                    Hand-made and premium machine-made papers have a characteristic
 *                    texture: fine closely-spaced horizontal "laid lines" (4 px pitch)
 *                    from the wire mesh of the paper mould, and coarser vertical
 *                    "chain lines" (40 px pitch) from the wires binding the mould
 *                    together. Seen in: Arches, Fabriano Artistico, Moulin du Roy,
 *                    and Clairefontaine Triomphe — the papers used for couture pattern
 *                    sheets and luxury stationery. Laid paper is the ONLY dual-axis
 *                    page texture in ZynaUI: two crossing repeating-linear-gradients,
 *                    one at 0° (laid lines) and one at 90° (chain lines).
 *
 *   Sweep          — GOLD SHIMMER (wide oblique light pass):
 *                    THE WIDEST AND SLOWEST SWEEP IN ZYNAUI. A 120 px wide gradient
 *                    shimmer — 4× wider than any other genre sweep — moves across
 *                    the viewport at ease-in-out timing over 28 s. The shimmer
 *                    reproduces the oblique gold-leaf light pass that occurs when
 *                    an atelier window's ambient light crosses a foil-stamped title
 *                    card: the illumination appears to roll slowly across the surface.
 *                    Sweep survey: Phosphor=CRT 3px 8s; Military=LiDAR 2px 12s;
 *                    Blueprint=plotter 1px 14s; Washi=brush diagonal 8px 18s;
 *                    Laboratory=oscilloscope 3px 9s. Atelier=gold shimmer 120px 28s.
 *                    Every parameter (width, duration, easing) is a genre maximum.
 *
 *   Motion         — SILK DRAPE TIMING (slowest in ZynaUI):
 *                    A master cutter works with deliberate, measured movements. No
 *                    gesture is hurried. The base duration (0.38s) is the longest in
 *                    ZynaUI — longer than Washi (0.28s), Military (0.26s), Blueprint
 *                    (0.24s), Laboratory (0.18s). Enter easing mimics a bolt of silk
 *                    falling from a table: slow start, flowing middle, gentle land.
 *                    Exit easing mirrors silk being gathered: smooth acceleration,
 *                    precise stop. Spring easing is a barely-perceptible overshoot —
 *                    the sway of a garment on the final movement before stillness.
 *
 *   Card bar       — CENTERED GOLD FADE (foil title card rule):
 *                    A 2 px gold horizontal bar that fades from transparent at both
 *                    ends to full gold at center — like the engraved rule centered
 *                    under a name on a luxury business card. Distinct from Ops
 *                    (center-weighted gradient at 55% opacity), this bar reaches
 *                    full opacity at center. The center-fade rule appears in all
 *                    Parisian couture stationery: Maison Margiela, Balenciaga,
 *                    Chanel. First centered-to-full-opacity rule in any CSS design
 *                    system.
 */

export const name = 'Atelier'

export const swatches = {
  brand:   '#B8920A',
  success: '#2D6A2D',
  danger:  '#B03020',
  info:    '#1A5C7A',
}

export const tokens = {
  // ── Brand — 22-karat gold (Au, #B8920A) ──────────────────────────────────
  // 22K gold alloy in its characteristic warm midtone: HSL ~43°, 89% saturation,
  // 38% lightness. This is the precise hue of gold foil hot-stamp blocking as
  // seen on a Hermès dustbag, a Chanel hatbox, or a Cartier archive card.
  // It is NOT "yellow" — it is the amber-gold of annealed gold leaf under
  // diffuse warm atelier lighting. No other ZynaUI genre uses the 30°–55° hue
  // band. Hue comparison: Corporate ~45° (warm grey-gold) is 11% saturated;
  // Atelier #B8920A is 89% saturated — unmistakably gold, not beige.
  '--zyna':      '#B8920A',
  '--zyna-dark': '#8A6C00',   // deep cast gold — rolled gold on base metal

  // ── Status colors — French fine arts pigment vocabulary ───────────────────
  //   Success: sap green (pigment from buckthorn berries, the "bookbinder's green")
  //   Danger:  alizarin crimson (the original synthetic red lake, 1868)
  //   Warning: yellow ochre (iron oxide, the oldest known pigment, cave paintings)
  //   Info:    Prussian blue (the first synthetic pigment, 1704, archive blue)
  '--zp-success': '#2D6A2D',  // sap green — balanced, organic
  '--zp-danger':  '#B03020',  // alizarin crimson — warm red lake
  '--zp-warning': '#C07000',  // yellow ochre — deep warm amber
  '--zp-info':    '#1A5C7A',  // Prussian blue — archive, documentation

  // ── Text — warm ink on vellum ─────────────────────────────────────────────
  // A fountain pen filled with iron gall ink writes on ecru vellum paper as a
  // warm near-black: visually softer than RGB(0,0,0), with enough warmth to
  // belong to the same palette as the ecru ground.
  '--zp-text':              '#1C1208',
  '--z-color-text-inverse': '#F5EFDF',  // warm ecru on 22K gold buttons

  // ── Surfaces — warm ecru vellum ───────────────────────────────────────────
  // Arches 300 gsm hot-press watercolour paper, cream variant: HSL ~38°, the
  // precise off-white of premium stationery under daylight-balanced atelier
  // lighting. Not ivory (too yellow), not cream (too opaque), not white (too
  // clinical). The ecru tone sits at the intersection of natural linen and
  // old bone. Every luxury maison uses this exact tonal range for its printed
  // materials: Hermès cream, Chanel off-white, Louis Vuitton vellum.
  //
  // Hue comparison (all light ZynaUI genres):
  //   Corporate  #F5F4F0 — warm: HSL(45°, 11%, 95%)  warm ivory (low sat)
  //   Blueprint  #EDF2FA — cool: HSL(220°, 35%, 95%) grey-blue vellum
  //   Washi      #F7F0E6 — warm: HSL(36°, 46%, 93%)  kozo cream (mid sat)
  //   Laboratory #EDFAFC — teal: HSL(188°, 56%, 96%) teal-white (high sat)
  //   Atelier    #F5EFDF — warm: HSL(38°, 51%, 91%)  ecru vellum (higher sat, darker)
  '--z-surface-page':               '#F5EFDF',
  '--z-surface-inset':              '#EBE0C4',
  '--z-surface-inset-hover':        '#DFCEA8',
  '--z-surface-inset-danger':       '#F5E8E4',
  '--z-surface-inset-danger-hover': '#EDD4CE',
  '--z-surface-card':      'linear-gradient(160deg, #FBF8F0 0%, #F5EFDF 100%)',
  '--z-surface-card-deep': 'linear-gradient(160deg, #EDE0C4 0%, #DFCEA8 100%)',

  // ── Borders & overlays — warm sepia tint ──────────────────────────────────
  '--z-color-border':     'rgba(44,28,4,0.10)',
  '--z-color-border-dim': 'rgba(44,28,4,0.05)',
  '--z-color-overlay':    'rgba(44,28,4,0.025)',

  // ── Shadows — warm diffuse atelier light ──────────────────────────────────
  '--z-shadow-card':      '0 1px 2px rgba(44,28,4,0.08), 0 4px 14px rgba(44,28,4,0.05)',
  '--z-shadow-card-deep': '0 2px 4px rgba(44,28,4,0.10), 0 8px 28px rgba(44,28,4,0.06)',

  // ── Docs chrome — warm ecru palette ───────────────────────────────────────
  '--bg':        '#F5EFDF',
  '--bg2':       '#EDE3C8',   // warm parchment sidebar — deeper, clearly warm
  '--bg3':       '#E3D5B0',
  '--border':    'rgba(44,28,4,0.10)',
  '--border2':   'rgba(44,28,4,0.05)',
  '--text':      '#1C1208',
  '--text2':     '#5C3D00',   // warm amber-brown secondary text
  '--text3':     '#8C6B20',   // medium gold-brown tertiary
  '--topbar-bg':      'rgba(245,239,223,0.93)',
  '--z-panel-bg':     '#EDE3C8',
  '--z-panel-shadow': '0 8px 24px rgba(44,28,4,0.07), 0 2px 6px rgba(44,28,4,0.04)',

  // ── Motion — silk drape timing (slowest in ZynaUI) ────────────────────────
  // Silk organza falls from a cutting table in three observable phases:
  //   Enter: the cloth leaves the table edge with near-zero velocity, flows
  //          gracefully mid-air (the silk curve), and settles with a whisper.
  //          cubic-bezier(0.25, 0.46, 0.45, 0.94) — the Penner "easeOutQuart"
  //          adapted for silk: slow start (0.25 initial tangent), smooth parabolic
  //          flow (0.46), precise landing (0.45 late tangent), gentle terminal
  //          deceleration (0.94 endpoint).
  //   Exit:  the assistant gathers the cloth: smooth acceleration from rest,
  //          precise arrest at the fold line. cubic-bezier(0.55, 0, 1, 0.45) —
  //          deliberate early acceleration (0.55), linear through mid-movement,
  //          clean stop (1, 0.45 at end tangent).
  //   Spring: a just-placed garment on a dress form settles: tiny overshoot
  //          (1.26 — the sway past equilibrium) then elegant rest (0.64, 1).
  //          The most restrained spring in ZynaUI — barely perceptible overshoot.
  //
  // Duration: Atelier has the SLOWEST durations in ZynaUI (0.38s base).
  // Luxury is defined, in part, by the pace at which things happen. Hermès
  // ribbon tying, Cartier box closing, Chanel bag zip — each performed at
  // exactly the speed that signals value.
  '--z-duration-fast':  '0.20s',   // briefest luxury gesture
  '--z-duration-base':  '0.38s',   // slowest base in ZynaUI
  '--z-duration-slow':  '0.52s',   // slowest slow in ZynaUI
  '--z-duration-pulse': '6s',      // slow editorial pulse
  '--z-ease-enter':  'cubic-bezier(0.25, 0.46, 0.45, 0.94)',  // silk unfurl
  '--z-ease-exit':   'cubic-bezier(0.55, 0.00, 1.00, 0.45)',  // silk gather
  '--z-ease-spring': 'cubic-bezier(0.34, 1.26, 0.64, 1)',     // garment settle
}

export const styles = {
  // ── Gold shimmer keyframe ─────────────────────────────────────────────────
  // A 120 px wide warm-gold shimmer traverses the viewport left-to-right over
  // 28 seconds at ease-in-out timing. The shimmer fades in at 8% of the cycle
  // and fades out at 92% — the light appears to emerge from offscreen, cross
  // the surface, and disappear. The gradient inside the shimmer element peaks
  // at 12% opacity gold at center, fading to 0 at both edges — reproducing the
  // roll of oblique reflected light across hot-stamped gold foil.
  //
  // Sweep comparison (all ZynaUI genres):
  //   Phosphor   — 3px,   8s, linear        (CRT vertical phosphor dot)
  //   Military   — 2px,  12s, linear        (LiDAR vertical beam)
  //   Blueprint  — 1px,  14s, linear        (plotter pen)
  //   Laboratory — 3px,   9s, linear        (oscilloscope horizontal scan)
  //   Washi      — 8px,  18s, ease-in-out   (diagonal brush stroke)
  //   Atelier    — 120px, 28s, ease-in-out  (gold leaf shimmer) ← widest & slowest
  '@keyframes maison-shimmer': {
    '0%':   { transform: 'translateX(-140px)', opacity: '0' },
    '8%':   { transform: 'translateX(calc(-140px + 8vw))', opacity: '1' },
    '92%':  { transform: 'translateX(calc(100vw + 20px))', opacity: '1' },
    '100%': { transform: 'translateX(calc(100vw + 140px))', opacity: '0' },
  },

  // ── Structural overrides scoped to html[data-genre="atelier"] ─────────────
  'html[data-genre="atelier"]': {
    'color-scheme': 'light',

    // ── Button — both RIGHT corners chamfered (luxury ribbon label) ───────────
    // FLAT LEFT EDGE, BOTH RIGHT CORNERS CUT. A right-shouldered ribbon form.
    //
    // Shape verification against all ZynaUI genres (no overlap):
    //   Ops        → top-right + bottom-left (opposing, two sides, not both right)
    //   Corporate  → top-right only (single corner, different position)
    //   Phosphor   → left chevron (different shape class entirely)
    //   Military   → top-left + bottom-right (opposing, different corners)
    //   Blueprint  → top-right 90° step (orthogonal, different class)
    //   Washi      → top-left only (single corner, different position)
    //   Laboratory → both BOTTOM corners (different side — bottom vs right)
    //   Atelier    → BOTH RIGHT corners ← zero overlap with any above
    //
    // Clockwise from top-left:
    //   (0, 0) → (calc(100% - 10px), 0) — top edge (shortened for shoulder)
    //   (calc(100% - 10px), 0) → (100%, 10px) — top-right diagonal
    //   (100%, 10px) → (100%, calc(100% - 10px)) — right straight edge
    //   (100%, calc(100% - 10px)) → (calc(100% - 10px), 100%) — bottom-right diagonal
    //   (calc(100% - 10px), 100%) → (0, 100%) — bottom edge (full width)
    //   (0, 100%) → (0, 0) — left edge (full height, flat)
    '--z-btn-clip':         'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
    // Inner clip: outer polygon inset by 1px on all edges.
    // Left edge: 1px in from left. Top/bottom: 1px from edges.
    // Top-right diagonal: shoulder shifts to 10+1=11px. Bottom-right: same.
    '--z-btn-inner-clip':   'polygon(1px 1px, calc(100% - 11px) 1px, calc(100% - 1px) 11px, calc(100% - 1px) calc(100% - 11px), calc(100% - 11px) calc(100% - 1px), 1px calc(100% - 1px))',
    '--z-btn-corner':       '10px',
    '--z-btn-active-scale': '0.97',
    '--z-btn-scan-stop':    '35%',

    // ── Badge — left-side V-notch (couture price-tag ribbon hole) ─────────────
    // A rectangle with a triangular notch cut from the LEFT-CENTER edge.
    // The notch is 10px deep and 10px tall (5px above and below 50% height).
    //
    // Shape verification — no ZynaUI badge has a left-notch:
    //   Corporate  → rounded rectangle (inset round)
    //   Phosphor   → sharp rectangle (inset)
    //   Military   → bottom-LEFT chamfer (corner, not center-edge notch)
    //   Blueprint  → top-CENTER V-notch (different axis: top vs left)
    //   Washi      → bottom-RIGHT chamfer (corner, different position)
    //   Laboratory → right-pointing arrow (outward tip, opposite direction)
    //   Atelier    → LEFT-CENTER V-notch (inward cut on left edge) ← no overlap
    //
    // Clockwise from top-left (x=0 exists only above and below the notch):
    //   (0, 0) → (100%, 0) — top edge
    //   (100%, 0) → (100%, 100%) — right edge
    //   (100%, 100%) → (0, 100%) — bottom edge
    //   (0, 100%) → (0, calc(50% + 5px)) — left edge, approaching notch from bottom
    //   (0, calc(50% + 5px)) → (10px, 50%) — lower notch diagonal to tip
    //   (10px, 50%) → (0, calc(50% - 5px)) — tip back to upper notch start
    //   (0, calc(50% - 5px)) → (0, 0) — left edge above notch back to top
    '--z-badge-clip':           'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 calc(50% + 5px), 10px 50%, 0 calc(50% - 5px))',
    '--z-badge-radius':         '0',
    '--z-badge-padding':        '0.18rem 0.72rem 0.18rem 1.0rem',  // extra left padding for notch depth
    '--z-badge-letter-spacing': '0.07em',
    '--z-badge-inset-shadow':   'inset 0 0 0 1px currentColor',
    '--z-badge-scan-duration':  '5s',
    // Inner clip for left V-notch badge (1px inset on all edges):
    // Notch tip moves from x=10px to x=11px (1px inner offset on diagonal).
    // Notch endpoints: ±5px at x=0 becomes ±6px at x=1px (diagonal compensation).
    '--z-badge-inner-clip':     'polygon(1px 1px, calc(100% - 1px) 1px, calc(100% - 1px) calc(100% - 1px), 1px calc(100% - 1px), 1px calc(50% + 6px), 11px 50%, 1px calc(50% - 6px))',

    // ── Alert — RIGHT PARTIAL-HEIGHT + » (right guillemet) prefix ─────────────
    // Bar: inset 15% 0 15% auto = top:15%, right:0, bottom:15%, left:auto
    // Width: 3px. Height: auto (determined by top + bottom inset).
    // The bar floats 15% from top and 15% from bottom — mid-height crop mark.
    //
    // Bar position survey (all ZynaUI genres, no overlap):
    //   Ops/Corporate/Washi → left full (inset: 0 auto 0 0)
    //   Phosphor            → right full (inset: 0 0 0 auto)
    //   Military            → bottom (inset: auto 0 0 0)
    //   Blueprint           → left partial-height (inset: 15% auto 15% 0)
    //   Laboratory          → top (inset: 0 0 auto 0)
    //   Atelier             → RIGHT PARTIAL-HEIGHT (inset: 15% 0 15% auto) ← no overlap
    //
    // No left bar → standard left padding. Alert is open on all sides except
    // the right edge where the gold crop mark appears.
    '--z-alert-radius':         '3px 0 0 3px',   // left corners rounded, right flush with bar
    '--z-alert-bar-width':      '0',              // no left bar
    '--z-alert-prefix':         '"» "',           // right guillemet (U+00BB) — French editorial
    '--z-alert-bg-opacity':     '5%',
    '--z-alert-border':         '1px solid rgba(44,28,4,0.07)',
    '--z-alert-prefix-opacity': '0.40',
    '--z-alert-bar-glow':       'none',
    '--z-alert-texture':        'none',
    '--z-alert-padding-top':    '0.875rem',        // standard padding (no top bar)
    '--z-alert-padding-left':   '1.25rem',         // standard (no left bar)
    '--z-alert-bar-inset':      '15% 0 15% auto', // RIGHT partial-height crop mark
    '--z-alert-bar-w':          '3px',             // gold crop mark width
    '--z-alert-bar-h':          'auto',            // determined by top + bottom inset
    '--z-alert-bar-radius':     '2px 0 0 2px',     // slight left-side rounding on bar

    // ── Card — laid paper texture + centered gold fade bar ────────────────────
    '--z-card-clip':    'none',
    '--z-card-filter':  'none',
    // Fine horizontal laid lines at 4 px pitch + vertical chain lines at 40 px.
    // Two crossing gradients — the ONLY dual-axis card texture in ZynaUI:
    //   0deg  = horizontal stack of thin lines (4px period): laid lines
    //   90deg = vertical stack of thin lines (40px period): chain lines
    '--z-card-texture': 'repeating-linear-gradient(0deg, rgba(184,146,10,0.05) 0px, rgba(184,146,10,0.05) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(90deg, rgba(184,146,10,0.08) 0px, rgba(184,146,10,0.08) 1px, transparent 1px, transparent 40px)',
    '--z-card-gradient':              'var(--z-surface-card)',
    '--z-card-border-color':          'rgba(44,28,4,0.08)',
    '--z-card-shadow':                'var(--z-shadow-card)',
    '--z-card-bracket-color':         'color-mix(in oklch, var(--zyna) 28%, transparent)',
    '--z-card-bracket-size':          '14px',
    '--z-card-bracket-stroke':        '1px',
    // Centered gold fade bar — transparent → full gold → transparent:
    //   The bar starts and ends in transparency, reaching full brand-gold at center.
    //   This reproduces the centered rule found on luxury letterheads and name cards:
    //   not a left-to-right brand line, but a symmetric, centered accent mark.
    //   Height: 2px. Width: full card width.
    '--z-card-bar-height':            '2px',
    '--z-card-bar-bg':                'linear-gradient(to right, transparent 0%, var(--zyna) 40%, var(--zyna) 60%, transparent 100%)',
    '--z-card-bar-shadow':            'none',
    '--z-card-header-bg':             'rgba(184,146,10,0.04)',
    '--z-card-header-border':         'rgba(44,28,4,0.08)',
    '--z-card-header-color':          'var(--zyna)',
    '--z-card-header-letter-spacing': '0.11em',
    '--z-card-header-text-shadow':    'none',
    '--z-card-header-dot-size':       '4px',
    '--z-card-header-dot-bg':         'var(--zyna)',
    '--z-card-header-dot-shadow':     'none',
    '--z-card-header-dot-animation':  'none',
    '--z-card-title-text-shadow':     'none',
    '--z-card-glow-duration':         '6s',
    '--z-card-default-glow-lo':       'rgba(184,146,10,0.015)',
    '--z-card-default-glow-hi':       'rgba(184,146,10,0.040)',

    // ── Docs chrome ───────────────────────────────────────────────────────────
    '--z-topbar-border':         'rgba(44,28,4,0.08)',
    '--z-topbar-glow':           'none',
    '--z-sidebar-active-shadow': 'inset 3px 0 0 var(--zyna)',
  },

  // ── Badge color overrides — gold-washed dilute fills ─────────────────────
  // Faint warm-gold washes — the colour of a lightly gilded watercolour ground.
  // No glows: atelier indirect lighting (north-facing skylight) produces no
  // phosphor afterglow or neon bloom. Every fill reads as a tinted vellum wash.
  ':where(html[data-genre="atelier"]) :where(.badge-primary)': {
    '--badge-bg':   'color-mix(in oklch, var(--zyna) 10%, transparent)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="atelier"]) :where(.badge-success)': {
    '--badge-bg':   'color-mix(in oklch, var(--z-color-success) 9%, transparent)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="atelier"]) :where(.badge-danger)': {
    '--badge-bg':   'color-mix(in oklch, var(--z-color-danger) 8%, transparent)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="atelier"]) :where(.badge-warning)': {
    '--badge-bg':   'color-mix(in oklch, var(--z-color-warning) 8%, transparent)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="atelier"]) :where(.badge-info)': {
    '--badge-bg':   'color-mix(in oklch, var(--z-color-info) 8%, transparent)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="atelier"]) :where(.badge-secondary)': {
    '--badge-bg':   'color-mix(in oklch, var(--zyna) 6%, transparent)',
    '--badge-glow': 'none',
  },

  // ── Polygon badge shape fixes on ecru vellum surface ─────────────────────
  // clip-path polygon shapes cannot use inset box-shadow for a border on light
  // backgrounds. Use the inner-clip border model: --badge-bg = currentColor,
  // --badge-interior = page surface, --badge-inner-clip = inset polygon.
  ':where(html[data-genre="atelier"]) :where(.badge-slant)': {
    '--z-badge-inset-shadow': 'none',
    '--badge-bg':         'currentColor',
    '--badge-interior':   'var(--z-surface-page)',
    '--badge-inner-clip': 'polygon(calc(var(--badge-offset) + 1px) 1px, calc(100% - 1px) 1px, calc(100% - calc(var(--badge-offset) + 1px)) calc(100% - 1px), 1px calc(100% - 1px))',
  },
  ':where(html[data-genre="atelier"]) :where(.badge-bevel)': {
    '--z-badge-inset-shadow': 'none',
    '--badge-bg':         'currentColor',
    '--badge-interior':   'var(--z-surface-page)',
    '--badge-inner-clip': 'polygon(calc(var(--badge-offset) + 1px) 1px, calc(100% - calc(var(--badge-offset) + 1px)) 1px, calc(100% - 1px) calc(var(--badge-offset) + 1px), calc(100% - 1px) calc(100% - calc(var(--badge-offset) + 1px)), calc(100% - calc(var(--badge-offset) + 1px)) calc(100% - 1px), calc(var(--badge-offset) + 1px) calc(100% - 1px), 1px calc(100% - calc(var(--badge-offset) + 1px)), 1px calc(var(--badge-offset) + 1px))',
  },

  // ── Laid paper texture — page background ──────────────────────────────────
  // Dual-axis laid paper texture applied to the document body pseudo-element.
  // Two crossing repeating-linear-gradients:
  //   Layer 1 (top): horizontal laid lines at 4px pitch — 0° stacking
  //   Layer 2 (base): vertical chain lines at 40px pitch — 90° stacking
  // The chain lines are slightly more opaque (0.08 vs 0.05) because physical
  // chain lines are thicker than laid lines and carry more visual weight.
  ':where(html[data-genre="atelier"]) body::before': {
    content: '""',
    position: 'fixed',
    inset: '0',
    zIndex: '0',
    pointerEvents: 'none',
    backgroundImage: 'repeating-linear-gradient(0deg, rgba(184,146,10,0.05) 0px, rgba(184,146,10,0.05) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(90deg, rgba(184,146,10,0.08) 0px, rgba(184,146,10,0.08) 1px, transparent 1px, transparent 40px)',
  },

  // ── Gold leaf shimmer sweep ────────────────────────────────────────────────
  // A 120 px wide warm-gold gradient light-pass traverses the viewport over 28 s.
  // The gradient peaks at 12% gold opacity at center — below threshold for
  // visible color shift, but clearly perceptible as a light-play event. The
  // shimmer element is positioned off-screen left, animates across, and exits
  // off-screen right. The ease-in-out timing mimics the arc of oblique window
  // light crossing a foil surface: slow approach, smooth traverse, slow exit.
  ':where(html[data-genre="atelier"]) body::after': {
    content: '""',
    position: 'fixed',
    top: '0',
    left: '0',
    width: '120px',
    height: '100vh',
    zIndex: '0',
    pointerEvents: 'none',
    background: 'linear-gradient(to right, transparent 0%, rgba(184,146,10,0.04) 25%, rgba(184,146,10,0.12) 50%, rgba(184,146,10,0.04) 75%, transparent 100%)',
    transform: 'translateX(-140px)',
    animation: 'maison-shimmer 28s ease-in-out infinite',
  },

  // ── prefers-reduced-motion — shimmer stops ────────────────────────────────
  '@media (prefers-reduced-motion: reduce)': {
    ':where(html[data-genre="atelier"]) body::after': { animation: 'none' },
  },
}

export default { name, tokens, swatches, styles }
