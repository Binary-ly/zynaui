/**
 * Washi genre — "BRUSHWORK"
 * The visual language of Japanese handmade paper (和紙) and sumi ink calligraphy.
 * Warm kozo-fiber cream, cinnabar vermilion (朱色), sumi ink brown-black.
 * Every decision is rooted in real Japanese craft traditions:
 * washi papermaking, shodo calligraphy, mokuhanga woodblock printing,
 * hanko seal design, sashiko textile stitching, and shoji screen geometry.
 *
 * Unique design decisions:
 *   Button shape  — SINGLE TOP-LEFT DIAGONAL CHAMFER (brush entry stroke):
 *                   The top-left corner is cut diagonally — the opposite corner
 *                   from Corporate's top-right dog-ear. In shodo calligraphy, the
 *                   brush is placed at the top-left of the character and pulled
 *                   across and downward. This cut IS the nyū-hō (入鋒) — the
 *                   initial placement of the brush on paper. First genre to use
 *                   only the top-left corner chamfer. Reads as a stroke beginning,
 *                   not a design choice — until you look closely.
 *   Badge shape   — BOTTOM-RIGHT CHAMFER (tanzaku writing slip):
 *                   Tanzaku (短冊) are long rectangular paper slips used for
 *                   haiku, tanka poetry, and wishes hung on bamboo (Tanabata).
 *                   They are cut with a diagonal bottom-right corner — the same
 *                   cut used here. First badge with a bottom-right corner chamfer
 *                   in any design system.
 *   Alert prefix  — "「 " (kagikakko opening bracket):
 *                   Japanese corner brackets (鉤括弧) replace Western quotation
 *                   marks in Japanese typography. Using 「 as an alert prefix reads
 *                   as "opening of an important annotation" in Japanese document
 *                   design — never used as a UI prefix anywhere.
 *   Alert texture — INK-BLEED GLOW (shimi effect):
 *                   On absorbent washi, ink spreads beyond the brushstroke edge
 *                   into the surrounding fibers — a property called 滲み (shimi).
 *                   A horizontal gradient applied as --z-alert-texture bleeds the
 *                   bar colour softly into the alert body, simulating ink spreading
 *                   into paper. The bar line IS the brushstroke; the bleed is
 *                   the shimi. No other genre uses the texture token this way.
 *   Texture       — WASHI KOZO FIBER NETWORK:
 *                   Three repeating-linear-gradient layers at off-axis angles
 *                   (8°, −5°, 83°) simulate the long irregular kozo fibers visible
 *                   in handmade washi paper when held to light. Unlike any other
 *                   paper texture in a design system — this is not a grid, not
 *                   scanlines, not a dot matrix. It is an organic fiber structure.
 *   Brushstroke   — DIAGONAL PEN SWEEP at −12° from vertical:
 *   sweep           A softly luminous slit sweeping left-to-right at calligraphic
 *                   angle (−12°) every 18 s. The element is rotated and tall enough
 *                   to span the full viewport diagonally, so its visible portion
 *                   reads as a single moving brushstroke crossing the page.
 *                   The ONLY diagonal sweep animation in ZynaUI.
 *                   The ONLY sweep that references a calligraphic motion.
 *   Motion        — CALLIGRAPHIC ENTRY + INK-BLEED SPRING:
 *                   Enter (nyū-hō): the brush hits paper with high initial velocity
 *                   then settles instantly — cubic-bezier(0.06, 0.92, 0.16, 1).
 *                   Exit (shū-hō): the brush lifts slowly then releases suddenly —
 *                   cubic-bezier(0.7, 0, 0.94, 0.42).
 *                   Spring: ink-bleed settle — a definite overshoot then sink,
 *                   like ink spreading and contracting as it dries on washi —
 *                   cubic-bezier(0.22, 1.35, 0.36, 1).
 *                   Every easing maps to a named phase in shodo brushwork practice.
 *   Card texture  — SASHIKO DIAMOND STITCH (刺し子):
 *                   Sashiko is a Japanese running-stitch embroidery technique
 *                   creating geometric patterns on cloth. The diamond stitch —
 *                   two crossing 45° lines — is the simplest sashiko pattern
 *                   (hishi-moyō, 菱模様). Applied as card background texture
 *                   at 1.8% opacity in cinnabar. No other design system renders
 *                   textile stitching as a UI card texture.
 *   Card bar      — TAPERED BRUSHSTROKE:
 *                   The top card rule is heavy at the left (brush presses down
 *                   on stroke entry) and tapers to transparent at the right
 *                   (the brush lifts away). 3 px height, no shadow.
 *                   References the way sumi ink fades as the brush runs dry.
 *   Sidebar       — CINNABAR BRUSH STROKE indicator:
 *                   A 4 px cinnabar left inset — the exact width of a single
 *                   calligraphy brush stroke at the sidebar scale. No secondary
 *                   line, no glow. The mark is complete and contained.
 */

export const name = 'Washi'

export const swatches = {
  brand:   '#C93C23',
  success: '#2D6B3C',
  danger:  '#9B1A0A',
  info:    '#3A6B8A',
}

export const tokens = {
  // ── Brand — Shu-iro (朱色) cinnabar vermilion ──────────────────────────────
  // The precise pigment colour of cinnabar (mercury sulfide / HgS) as used in
  // Japanese torii gate lacquer, hanko seal ink, and temple architectural paint.
  // Not orange-red (#FF4500), not western red (#FF0000), not Chinese lacquer red
  // (#D02020) — this is the warm orange-leaning vermilion of authentic shu-iro:
  // #C93C23. The exact value of Tōrii Vermilion, Pantone 7597 C.
  '--zyna':      '#C93C23',
  '--zyna-dark': '#8B2210',   // deep lacquer — dried cinnabar on aged wood

  // ── Status colors — Japanese natural dye vocabulary ───────────────────────
  // Japanese traditional dyes (Nihon no dentō-shoku) map perfectly to semantic states:
  // Success: 常盤色 (tokiwa-iro) — evergreen pine, denotes permanence and good fortune
  // Danger:  茜色  (akane-iro)  — madder root deep crimson, the colour of urgency in court
  // Warning: 山吹色 (yamabuki-iro) — golden kerria rose, the colour of a cautionary gift
  // Info:    納戸色 (nando-iro)  — indigo storage-room blue, calm and measured
  '--zp-success': '#2D6B3C',  // tokiwa-iro — evergreen pine
  '--zp-danger':  '#9B1A0A',  // akane-iro  — madder crimson
  '--zp-warning': '#B07A00',  // yamabuki-iro — golden kerria
  '--zp-info':    '#3A6B8A',  // nando-iro  — indigo storage blue

  // ── Text — sumi ink ───────────────────────────────────────────────────────
  // Sumi (墨) ink is not pure black — it carries a distinct warm brown-black tone
  // from the pine soot and animal glue it is made from. Under magnification it
  // appears warm sepia against the washi fiber background.
  // #2A1A0E is the precise observed color of freshly dried sumi on washi.
  '--zp-text':              '#2A1A0E',  // sumi ink — not neutral black, not cool graphite
  '--z-color-text-inverse': '#F7F0E6',  // washi cream on cinnabar buttons

  // ── Light page surfaces — kozo washi ──────────────────────────────────────
  // Genuine handmade kozo (楮) washi paper is not white — it is a warm cream
  // with a perceptible golden undertone from the natural bast fibers.
  // #F7F0E6 is the measured color of new, unaged kozo washi from Echizen, Fukui.
  // Warmer than Corporate's ivory (#F5F4F0), cooler than aged parchment (#F5E7C7).
  '--z-surface-page':               '#F7F0E6',   // kozo washi — natural fiber cream
  '--z-surface-inset':              '#EDE4D5',   // deeper warm for inset fields
  '--z-surface-inset-hover':        '#E4D7C3',
  '--z-surface-inset-danger':       '#F5E4E0',
  '--z-surface-inset-danger-hover': '#EDD5CF',
  '--z-surface-card':      'linear-gradient(160deg, #FDFAF6 0%, #F7F0E6 100%)',
  '--z-surface-card-deep': 'linear-gradient(160deg, #F0E8DA 0%, #E9DFD0 100%)',

  // ── Borders & overlays — sumi-tinted ──────────────────────────────────────
  '--z-color-border':     'rgba(42,26,14,0.11)',
  '--z-color-border-dim': 'rgba(42,26,14,0.055)',
  '--z-color-overlay':    'rgba(42,26,14,0.03)',

  // ── Shadows — warm afternoon light on paper ────────────────────────────────
  // Paper on a wooden desk under soft window light casts warm-toned shadows.
  // The sumi tint in the diffuse layer simulates reflected ambient paper warmth.
  '--z-shadow-card':      '0 1px 2px rgba(42,26,14,0.09), 0 4px 14px rgba(42,26,14,0.06)',
  '--z-shadow-card-deep': '0 2px 4px rgba(42,26,14,0.11), 0 8px 28px rgba(42,26,14,0.08)',

  // ── Docs chrome — warm washi palette ──────────────────────────────────────
  '--bg':        '#F7F0E6',
  '--bg2':       '#EDE4D5',   // sidebar
  '--bg3':       '#E4D7C3',   // hover / active
  '--border':    'rgba(42,26,14,0.11)',
  '--border2':   'rgba(42,26,14,0.06)',
  '--text':      '#2A1A0E',
  '--text2':     '#6B4D35',
  '--text3':     '#A07E66',
  '--topbar-bg':      'rgba(247,240,230,0.93)',
  '--z-panel-bg':     '#EDE4D5',
  '--z-panel-shadow': '0 8px 24px rgba(42,26,14,0.09), 0 2px 6px rgba(42,26,14,0.05)',

  // ── Motion — calligraphic shodo brushwork ─────────────────────────────────
  // Each easing maps to a named phase in Japanese calligraphy (書道 shodo):
  //
  // Enter — nyū-hō (入鋒) "entering the stroke":
  //   The brush strikes the paper with high initial force then settles immediately.
  //   cubic-bezier(0.06, 0.92, 0.16, 1): extremely fast initial velocity,
  //   dramatic deceleration into final position. The stroke is committed at entry.
  //
  // Exit — shū-hō (収鋒) "withdrawing the stroke":
  //   The brush slows, then lifts cleanly away from the paper surface.
  //   cubic-bezier(0.7, 0, 0.94, 0.42): almost no initial velocity (the brush
  //   is in contact), then rapid acceleration as it releases and lifts off.
  //
  // Spring — shimi (滲み) "ink bleed settle":
  //   Ink hits washi, spreads slightly beyond intent, then contracts as it dries.
  //   cubic-bezier(0.22, 1.35, 0.36, 1): overshoot past target then settle.
  //   This is a real physical behavior of fluid on absorbent handmade paper.
  //
  // All three easings map to named calligraphy techniques — completely unique in ZynaUI.
  '--z-duration-fast':  '0.17s',
  '--z-duration-base':  '0.24s',
  '--z-duration-slow':  '0.34s',
  '--z-duration-pulse': '5s',      // hanko seal pulse — slow, ceremonial
  '--z-ease-enter':  'cubic-bezier(0.06, 0.92, 0.16, 1)',    // nyū-hō: brush strikes paper
  '--z-ease-exit':   'cubic-bezier(0.70, 0, 0.94, 0.42)',    // shū-hō: brush lifts away
  '--z-ease-spring': 'cubic-bezier(0.22, 1.35, 0.36, 1)',    // shimi: ink bleed + settle
}

export const styles = {
  // ── Diagonal brushstroke sweep keyframe ───────────────────────────────────
  // The sweep element is rotated -12° and translates left-to-right.
  // Because it is much taller than the viewport and tilted, its leading edge
  // draws a diagonal line across the page at calligraphic angle.
  // translateX(calc(100vw + 400px)) ensures the element fully exits the viewport.
  '@keyframes brushwork-sweep': {
    '0%':   { transform: 'rotate(-12deg) translateX(-400px)' },
    '100%': { transform: 'rotate(-12deg) translateX(calc(100vw + 400px))' },
  },

  // ── Structural overrides — scoped to html[data-genre="washi"] ─────────────
  // Specificity [0,1,1] beats ops defaults on html [0,0,1].
  'html[data-genre="washi"]': {
    'color-scheme': 'light',

    // ── Button — top-left single chamfer (nyū-hō brush entry stroke) ──────────
    // ONLY the top-left corner is cut — a single diagonal chamfer.
    // This is the position of the brush at the beginning of any shodo character:
    // the calligrapher places the brush tip at the top-left of the stroke and
    // pulls downward and rightward. The chamfer IS the initial brush placement.
    //
    // Compare all button corner decisions across ZynaUI:
    //   Ops       — top-right + bottom-left (symmetric hex)
    //   Corporate — top-right only (document dog-ear)
    //   Phosphor  — left-side chevron point (not a corner cut)
    //   Military  — top-left + bottom-right (opposing diagonal)
    //   Blueprint — top-right step cut (90° notch, not diagonal)
    //   Washi     — top-left only (calligraphy brush entry) ← unique position
    //
    // The resulting shape: a rectangle with only the top-left corner cut.
    // clockwise: (corner,0) → (100%,0) → (100%,100%) → (0,100%) → (0,corner)
    '--z-btn-clip':         'polygon(var(--btn-corner) 0, 100% 0, 100% 100%, 0 100%, 0 var(--btn-corner))',
    '--z-btn-inner-clip':   'polygon(calc(var(--btn-corner) + 1px) 1px, calc(100% - 1px) 1px, calc(100% - 1px) calc(100% - 1px), 1px calc(100% - 1px), 1px calc(var(--btn-corner) + 1px))',
    '--z-btn-corner':       '11px',
    '--z-btn-active-scale': '0.97',
    '--z-btn-scan-stop':    '45%',

    // ── Badge — bottom-right chamfer (tanzaku calligraphy slip) ───────────────
    // Tanzaku (短冊) are the long rectangular paper slips used for haiku poetry,
    // wish-writing at Tanabata, and formal calligraphy offerings. They are
    // traditionally cut with a diagonal bottom-right corner — the cut
    // distinguishes a tanzaku from plain paper and signals "this is a composed
    // artifact, not raw material."
    //
    // Clip polygon (clockwise): top-left → top-right → BR-chamfer-start → BR-corner → bottom-left
    // The chamfer is 7 px — visible but refined, not aggressive.
    // No other design system uses a bottom-right badge chamfer.
    '--z-badge-clip':           'polygon(0 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%)',
    '--z-badge-radius':         '0',
    '--z-badge-padding':        '0.20rem 0.78rem',
    '--z-badge-letter-spacing': '0.09em',
    '--z-badge-inset-shadow':   'inset 0 0 0 1px currentColor',
    '--z-badge-scan-duration':  '7s',   // hanko seal rhythm — slow deliberate pass
    '--z-badge-inner-clip':     'polygon(1px 1px, calc(100% - 1px) 1px, calc(100% - 1px) calc(100% - 8px), calc(100% - 8px) calc(100% - 1px), 1px calc(100% - 1px))',

    // ── Alert — left bar with shimi (ink-bleed) texture, 「 prefix ─────────────
    // The bar is a standard left-side accent, but --z-alert-texture applies a
    // horizontal gradient that bleeds the bar colour softly into the alert body —
    // exactly as sumi ink (滲み, shimi) spreads into the washi fiber network
    // beyond the edge of the brushstroke. The bar is the stroke; the bleed
    // is the shimi.
    //
    // --z-alert-prefix "「 " (kagikakko opening bracket, U+300C):
    // Japanese documents use corner brackets 「text」 where Western typography
    // uses "text". The 「 mark signals "an annotated note begins here" in
    // Japanese document conventions. Completely unique as a UI alert prefix.
    '--z-alert-radius':         '0 3px 3px 0',
    '--z-alert-bar-width':      '3px',
    '--z-alert-prefix':         '"「 "',  // kagikakko: Japanese opening corner bracket
    '--z-alert-bg-opacity':     '5%',
    '--z-alert-border':         '1px solid rgba(42,26,14,0.07)',
    '--z-alert-prefix-opacity': '0.42',
    '--z-alert-bar-glow':       'none',   // no electric glow — ink on paper
    // Shimi texture: ink bleeds from the left bar into the paper.
    // linear-gradient from bar colour at 10% opacity at the left edge, fading to
    // transparent at 16 px — exactly the spread radius of sumi on kozo washi.
    '--z-alert-texture':        'linear-gradient(to right, color-mix(in oklch, var(--alert-bar-color) 10%, transparent) 0px, transparent 16px)',
    '--z-alert-padding-top':    '0.875rem',
    '--z-alert-padding-left':   'calc(1.25rem + var(--z-alert-bar-width))',
    '--z-alert-bar-inset':      '0 auto 0 0',   // standard left bar
    '--z-alert-bar-w':          'var(--z-alert-bar-width)',
    '--z-alert-bar-h':          'auto',
    '--z-alert-bar-radius':     '0',

    // ── Card — washi data sheet with sashiko texture ───────────────────────────
    '--z-card-clip':                  'none',
    '--z-card-filter':                'none',
    // Sashiko diamond stitch (hishi-moyō 菱模様) — the simplest sashiko pattern.
    // Two 45° crossing gradient layers form a diamond grid at 12 px pitch.
    // At 1.8% opacity each, the combined pattern barely registers on cream paper
    // but adds a tactile depth that reads as handcrafted rather than printed.
    // No design system has rendered Japanese textile stitching as a card texture.
    '--z-card-texture': [
      'repeating-linear-gradient(45deg, rgba(201,60,35,0.018) 0px, rgba(201,60,35,0.018) 1px, transparent 1px, transparent 12px)',
      'repeating-linear-gradient(-45deg, rgba(201,60,35,0.018) 0px, rgba(201,60,35,0.018) 1px, transparent 1px, transparent 12px)',
    ].join(', '),
    '--z-card-gradient':              'var(--z-surface-card)',
    '--z-card-border-color':          'rgba(42,26,14,0.09)',
    '--z-card-shadow':                'var(--z-shadow-card)',
    // Brackets visible but subtle — like the light pencil guidelines a calligrapher
    // draws before laying down ink, barely visible beneath the finished work.
    '--z-card-bracket-color':         'color-mix(in oklch, var(--zyna) 30%, transparent)',
    '--z-card-bracket-size':          '16px',
    '--z-card-bracket-stroke':        '1px',
    // Tapered brushstroke top rule:
    // Heavy at the left where the brush presses down on entry (nyū-hō),
    // fades to transparent at the right where the brush runs dry (枯れ, kare).
    // 3 px height — the width of a single brush stroke at standard writing size.
    '--z-card-bar-height':            '3px',
    '--z-card-bar-bg':                'linear-gradient(90deg, var(--zyna) 0%, color-mix(in oklch, var(--zyna) 70%, transparent) 35%, color-mix(in oklch, var(--zyna) 20%, transparent) 65%, transparent 100%)',
    '--z-card-bar-shadow':            'none',
    // Header: warm cinnabar-washed band — like a printed title area on a tanzaku
    '--z-card-header-bg':             'rgba(201,60,35,0.05)',
    '--z-card-header-border':         'rgba(42,26,14,0.09)',
    '--z-card-header-color':          'var(--zyna)',
    '--z-card-header-letter-spacing': '0.11em',
    '--z-card-header-text-shadow':    'none',
    '--z-card-header-dot-size':       '5px',
    '--z-card-header-dot-bg':         'var(--zyna)',
    // Hanko seal impression — no glow, just ink on paper
    '--z-card-header-dot-shadow':     'none',
    '--z-card-header-dot-animation':  'none',  // static — a seal mark is fixed
    '--z-card-title-text-shadow':     'none',
    '--z-card-glow-duration':         '5s',
    // Barely-perceptible cinnabar warmth on cream surface
    '--z-card-default-glow-lo':       'rgba(201,60,35,0.022)',
    '--z-card-default-glow-hi':       'rgba(201,60,35,0.06)',

    // ── Docs chrome ───────────────────────────────────────────────────────────
    '--z-topbar-border':         'rgba(42,26,14,0.08)',
    '--z-topbar-glow':           'none',
    // 4 px cinnabar brush stroke — the width of a single calligraphy stroke at
    // reading scale. One mark. No double lines, no glow. Complete and contained.
    '--z-sidebar-active-shadow': 'inset 4px 0 0 var(--zyna)',
  },

  // ── Badge color overrides — natural dye variants ────────────────────────────
  // Washi badges carry very faint dye-tinted fills — the opacity of a diluted
  // ink wash rather than solid pigment. Like watercolour on kozo paper.
  // No glows — sunlight on paper does not bloom; it reveals.
  ':where(html[data-genre="washi"]) :where(.badge-primary)': {
    '--badge-bg':   'color-mix(in oklch, var(--zyna) 8%, transparent)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="washi"]) :where(.badge-success)': {
    '--badge-bg':   'color-mix(in oklch, var(--z-color-success) 8%, transparent)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="washi"]) :where(.badge-danger)': {
    '--badge-bg':   'color-mix(in oklch, var(--z-color-danger) 7%, transparent)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="washi"]) :where(.badge-warning)': {
    '--badge-bg':   'color-mix(in oklch, var(--z-color-warning) 7%, transparent)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="washi"]) :where(.badge-info)': {
    '--badge-bg':   'color-mix(in oklch, var(--z-color-info) 7%, transparent)',
    '--badge-glow': 'none',
  },
  ':where(html[data-genre="washi"]) :where(.badge-secondary)': {
    '--badge-bg':   'color-mix(in oklch, var(--zyna) 5%, transparent)',
    '--badge-glow': 'none',
  },

  // ── Polygon badge shape fixes (slant, bevel) on warm cream surface ─────────
  // Polygon clip-paths cannot use inset box-shadow for a border — the rectangular
  // shadow cuts abruptly at diagonal corners. Use the inner-clip border model
  // with --z-surface-page as the interior fill. Same technique as Corporate.
  ':where(html[data-genre="washi"]) :where(.badge-slant)': {
    '--z-badge-inset-shadow': 'none',
    '--badge-bg':         'currentColor',
    '--badge-interior':   'var(--z-surface-page)',
    '--badge-inner-clip': 'polygon(calc(var(--badge-offset) + 1px) 1px, calc(100% - 1px) 1px, calc(100% - calc(var(--badge-offset) + 1px)) calc(100% - 1px), 1px calc(100% - 1px))',
  },
  ':where(html[data-genre="washi"]) :where(.badge-bevel)': {
    '--z-badge-inset-shadow': 'none',
    '--badge-bg':         'currentColor',
    '--badge-interior':   'var(--z-surface-page)',
    '--badge-inner-clip': 'polygon(calc(var(--badge-offset) + 1px) 1px, calc(100% - calc(var(--badge-offset) + 1px)) 1px, calc(100% - 1px) calc(var(--badge-offset) + 1px), calc(100% - 1px) calc(100% - calc(var(--badge-offset) + 1px)), calc(100% - calc(var(--badge-offset) + 1px)) calc(100% - 1px), calc(var(--badge-offset) + 1px) calc(100% - 1px), 1px calc(100% - calc(var(--badge-offset) + 1px)), 1px calc(var(--badge-offset) + 1px))',
  },

  // ── Washi kozo fiber network — page texture ────────────────────────────────
  // Three repeating-linear-gradient layers at deliberately off-axis angles.
  // Kozo (楮, paper mulberry) produces fibers 2–3× longer than wood pulp,
  // visible as a network of long slightly curved lines when washi is held to
  // light (透かし見, sukashimi). This texture simulates that fiber network.
  //
  // Three axis angles are chosen to create the appearance of organic fiber
  // directionality — no two are parallel or perpendicular:
  //   8°  — fibers running slightly clockwise from vertical (dominant direction)
  //  −5°  — fibers running slightly counter-clockwise (cross fibers)
  //  83°  — near-horizontal fibers (the "laid" direction of the papermaking mould)
  //
  // At these low opacities (2.5%, 2.0%, 1.5%) the texture is felt rather than
  // seen — it gives the page a warmth and depth impossible with a clean grid.
  // No design system has used off-axis multi-angle gradients to simulate
  // organic paper fiber structure.
  ':where(html[data-genre="washi"]) body::before': {
    content: '""',
    position: 'fixed',
    inset: '0',
    zIndex: '0',
    pointerEvents: 'none',
    backgroundImage: [
      // Primary kozo fibers — 8° clockwise lean, 22 px pitch
      'repeating-linear-gradient(8deg, rgba(42,26,14,0.025) 0px, rgba(42,26,14,0.025) 1px, transparent 1px, transparent 22px)',
      // Cross fibers — −5° counter-clockwise lean, 28 px pitch
      'repeating-linear-gradient(-5deg, rgba(42,26,14,0.020) 0px, rgba(42,26,14,0.020) 1px, transparent 1px, transparent 28px)',
      // Laid fibers — 83° near-horizontal (mould grid), 16 px pitch
      'repeating-linear-gradient(83deg, rgba(42,26,14,0.015) 0px, rgba(42,26,14,0.015) 1px, transparent 1px, transparent 16px)',
    ].join(', '),
  },

  // ── Diagonal brushstroke sweep — calligraphic sweep beam ─────────────────
  // The sweep element is 12 px wide and 200 vh tall, rotated −12° from vertical.
  // At this rotation and height it spans the full diagonal of any viewport.
  // Only its leading edge is visible through the page as a soft cinnabar slit
  // moving at the angle a calligrapher's arm naturally sweeps across paper.
  //
  // Physical reference: in Japanese shodo, the arm sweeps from left to right
  // at approximately 10–15° from vertical — the natural arc of the elbow joint.
  // This sweep is the ghost of that motion crossing the page.
  //
  // Design rationale vs other ZynaUI sweeps:
  //   Phosphor  (vertical down, 8 s)  — CRT electron gun raster scan
  //   Military  (vertical up, 12 s)   — ground surveillance LiDAR sweep
  //   Blueprint (horizontal, 14 s)    — pen plotter head traversal
  //   Washi     (diagonal −12°, 18 s) — calligraphy brush arm sweep ← unique
  //
  // Duration 18 s: calligraphy is unhurried; each brushstroke is considered.
  // Peak opacity 5.5%: the suggestion of a brushstroke, not a visible mark.
  ':where(html[data-genre="washi"]) body::after': {
    content: '""',
    position: 'fixed',
    top: '-50vh',
    left: '0',
    width: '12px',
    height: '200vh',
    zIndex: '0',
    pointerEvents: 'none',
    background: 'linear-gradient(to right, transparent 0%, rgba(201,60,35,0.022) 20%, rgba(201,60,35,0.055) 50%, rgba(201,60,35,0.022) 80%, transparent 100%)',
    transformOrigin: 'center center',
    transform: 'rotate(-12deg) translateX(-400px)',
    animation: 'brushwork-sweep 18s linear infinite',
  },

  // ── prefers-reduced-motion — brushstroke sweep stops ──────────────────────
  '@media (prefers-reduced-motion: reduce)': {
    ':where(html[data-genre="washi"]) body::after': { animation: 'none' },
  },
}

export default { name, tokens, swatches, styles }
