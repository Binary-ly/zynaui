const l = {
  /**
   * Diagonal — cuts top-right and bottom-left corners diagonally (2-corner chamfer).
   */
  diagonal: (a) => ({
    outer: `polygon(0 0, calc(100% - ${a}) 0, 100% ${a}, 100% 100%, ${a} 100%, 0 calc(100% - ${a}))`,
    inner: `polygon(1px 1px, calc(100% - calc(${a} + 1px)) 1px, calc(100% - 1px) calc(${a} + 1px), calc(100% - 1px) calc(100% - 1px), calc(${a} + 1px) calc(100% - 1px), 1px calc(100% - calc(${a} + 1px)))`
  }),
  /**
   * Bevel — cuts all 4 corners symmetrically (octagon).
   */
  bevel: (a) => ({
    outer: `polygon(${a} 0%, calc(100% - ${a}) 0%, 100% ${a}, 100% calc(100% - ${a}), calc(100% - ${a}) 100%, ${a} 100%, 0% calc(100% - ${a}), 0% ${a})`,
    inner: `polygon(calc(${a} + 1px) 1px, calc(100% - calc(${a} + 1px)) 1px, calc(100% - 1px) calc(${a} + 1px), calc(100% - 1px) calc(100% - calc(${a} + 1px)), calc(100% - calc(${a} + 1px)) calc(100% - 1px), calc(${a} + 1px) calc(100% - 1px), 1px calc(100% - calc(${a} + 1px)), 1px calc(${a} + 1px))`
  }),
  /**
   * Slant — both sides angled (parallelogram).
   * Used by badges.
   */
  slant: (a) => `polygon(${a} 0%, 100% 0%, calc(100% - ${a}) 100%, 0% 100%)`,
  /**
   * Rounded — inset(0 round 9999px) as clip-path, NOT border-radius.
   * Using clip-path (instead of border-radius + overflow:hidden) is critical:
   *  • clip-path is applied BEFORE filter in the rendering pipeline, so
   *    drop-shadow traces the rounded outline rather than the rectangular bounding box.
   *  • clip-path clips pseudo-elements (::after scan fill) automatically,
   *    preventing the rectangular scan-fill artefact on hover.
   */
  rounded: { clipPath: "inset(0 round 9999px)", innerClip: "inset(1.5px round 9999px)" },
  /**
   * Rect — zero border-radius, rectangular inset inner clip.
   * clip-path: inset(0) clips to the full element box (visually identical to none)
   * but ensures filter traces the element before compositing and clips pseudo-elements.
   */
  rect: { clipPath: "inset(0)", borderRadius: "0", innerClip: "inset(1.5px)" }
}, p = "Ops", i = {
  brand: "#C9A84C",
  success: "#00FFB2",
  danger: "#FF3366",
  info: "#00D4FF"
}, s = {
  // ── Motion ─────────────────────────────────────────────────────────────────
  "--z-duration-fast": "0.18s",
  "--z-duration-base": "0.22s",
  "--z-duration-slow": "0.28s",
  "--z-duration-pulse": "2s",
  // Directional easing — genre-swappable motion character.
  // Components use var(--z-ease-exit) on base transitions (hover-out) and
  // var(--z-ease-enter) on :hover transitions (hover-in). CSS reads the
  // transition from the state being transitioned TO, so each direction
  // gets its own curve without any JS or specificity tricks.
  "--z-ease-enter": "cubic-bezier(0.22, 1, 0.36, 1)",
  // smooth deceleration, "landing"
  "--z-ease-exit": "cubic-bezier(0.55, 0, 1, 0.45)",
  // acceleration out, "lifting"
  "--z-ease-spring": "cubic-bezier(0.34, 1.4, 0.64, 1)"
  // modest overshoot
}, g = {
  // ── Structural component defaults — scoped to html, not :root ──────────────
  // Specificity [0,0,1] so any genre override selector (html[data-genre="X"]
  // at [0,1,1]) wins without needing !important or additional specificity tricks.
  // The genre builder's inline setProperty() on html always wins over these rules.
  html: {
    // ── Page base ───────────────────────────────────────────────────────────
    // Added 2026-03-17 during framework integration testing: without these the
    // plugin tokens assume a dark context but the page itself stays browser-default
    // white, causing components to render against the wrong background.
    // color-scheme lives here (not :root) so future light genres can override it
    // via html[data-genre="..."] at specificity [0,1,1] > html [0,0,1].
    "color-scheme": "dark",
    "background-color": "var(--z-surface-page)",
    color: "var(--z-color-text)",
    // ── Button structural ───────────────────────────────────────────────────
    "--z-btn-clip": "polygon(0 0, calc(100% - var(--btn-corner)) 0, 100% var(--btn-corner), 100% 100%, var(--btn-corner) 100%, 0 calc(100% - var(--btn-corner)))",
    "--z-btn-corner": "var(--z-corner)",
    "--z-btn-inner-clip": l.diagonal("var(--btn-corner)").inner,
    "--z-btn-active-scale": "0.96",
    "--z-btn-scan-stop": "70%",
    // ── Alert structural ────────────────────────────────────────────────────
    "--z-alert-radius": "0 3px 3px 0",
    "--z-alert-bar-width": "3px",
    "--z-alert-prefix": '"// "',
    "--z-alert-bg-opacity": "5.5%",
    "--z-alert-border": "none",
    "--z-alert-prefix-opacity": "0.38",
    "--z-alert-bar-glow": "none",
    "--z-alert-texture": "none",
    // Padding — left accounts for the bar; top is uniform in Ops
    "--z-alert-padding-top": "0.875rem",
    "--z-alert-padding-left": "calc(1.25rem + var(--z-alert-bar-width))",
    // Bar pseudo-element geometry — Ops: left bar (full height, thin width)
    // inset: top right bottom left. top:0 + bottom:0 stretch the bar full height.
    // height must be 'auto' so the top/bottom constraints govern — '100%' would be
    // discarded by CSS over-constraint resolution and produce a zero-height bar.
    "--z-alert-bar-inset": "0 auto 0 0",
    // top right bottom left
    "--z-alert-bar-w": "var(--z-alert-bar-width)",
    "--z-alert-bar-h": "auto",
    "--z-alert-bar-radius": "var(--z-alert-radius) 0 0 var(--z-alert-radius)",
    // ── Card structural ─────────────────────────────────────────────────────
    "--z-card-clip": "none",
    "--z-card-filter": "none",
    "--z-card-texture": "linear-gradient(transparent, transparent)",
    "--z-card-gradient": "var(--z-surface-card)",
    "--z-card-border-color": "var(--z-color-border)",
    "--z-card-shadow": "var(--z-shadow-card)",
    "--z-card-bracket-color": "color-mix(in oklch, var(--zyna) 42%, transparent)",
    "--z-card-bracket-size": "20px",
    "--z-card-bracket-stroke": "1.5px",
    "--z-card-bar-height": "1px",
    "--z-card-bar-bg": "linear-gradient(90deg, transparent 0%, color-mix(in oklch, var(--zyna) 55%, transparent) 20%, color-mix(in oklch, var(--zyna) 55%, transparent) 80%, transparent 100%)",
    "--z-card-bar-shadow": "none",
    "--z-card-header-bg": "transparent",
    "--z-card-header-border": "var(--z-color-border)",
    "--z-card-header-color": "color-mix(in oklch, var(--zyna) 75%, transparent)",
    "--z-card-header-letter-spacing": "0.14em",
    "--z-card-header-text-shadow": "none",
    "--z-card-header-dot-size": "5px",
    "--z-card-header-dot-bg": "color-mix(in oklch, var(--zyna) 65%, transparent)",
    "--z-card-header-dot-shadow": "0 0 6px color-mix(in oklch, var(--zyna) 65%, transparent), 0 0 16px color-mix(in oklch, var(--zyna) 30%, transparent)",
    "--z-card-header-dot-animation": "none",
    "--z-card-title-text-shadow": "none",
    "--z-card-glow-duration": "4s",
    // Default glow colours for the base .card (transparent = no pulse). .card-glow
    // overrides these locally to produce the gold / neon pulse effect.
    "--z-card-default-glow-lo": "rgba(0,0,0,0)",
    "--z-card-default-glow-hi": "rgba(0,0,0,0)",
    // ── Badge structural ────────────────────────────────────────────────────
    // Note: --z-badge-clip is intentionally absent for Ops. The base clip-path is applied
    // directly in badge.js as a fallback: var(--z-badge-clip, polygon(...)). This avoids
    // a nested @property <length> var chain that can break clip-path resolution.
    // Cyberpunk sets --z-badge-clip: inset(0) — no nested vars, works fine via token.
    "--z-badge-radius": "0",
    "--z-badge-padding": "0.22rem 0.85rem",
    "--z-badge-letter-spacing": "0.13em",
    "--z-badge-inset-shadow": "none",
    "--z-badge-scan-duration": "5s",
    // Inner clip for .badge-outline — same two-level pattern as --z-btn-inner-clip.
    // Uses var(--badge-offset) which is an unregistered custom property; lazy CSS
    // substitution resolves it at the element level (same as --btn-corner in buttons).
    "--z-badge-inner-clip": "polygon(calc(var(--badge-offset) + 2px) 2px, calc(100% - 2px) 2px, calc(100% - calc(var(--badge-offset) + 2px)) calc(100% - 2px), 2px calc(100% - 2px))",
    // ── Docs chrome structural ───────────────────────────────────────────────
    // docs.css references these with CSS fallbacks (e.g. var(--z-topbar-border, var(--border)))
    // so they are optional — but declared here to complete the ops source-of-truth contract
    // and make them discoverable when authoring new genres.
    "--z-topbar-border": "var(--z-color-border)",
    "--z-topbar-glow": "none",
    "--z-sidebar-active-shadow": "none"
  }
}, t = { name: p, tokens: s, swatches: i, styles: g }, z = "Cyberpunk", b = {
  brand: "#39FF14",
  success: "#39FF14",
  danger: "#FF073A",
  info: "#7B61FF"
}, x = {
  // ── Color ───────────────────────────────────────────────────────────────────
  "--zyna": "#39FF14",
  "--zyna-dark": "#1A8A00",
  "--zp-success": "#39FF14",
  "--zp-danger": "#FF073A",
  "--zp-warning": "#FFD700",
  "--zp-info": "#7B61FF",
  "--zp-text": "#E0FFE0",
  "--z-font-mono": "'Share Tech Mono', 'Courier New', monospace",
  // ── Motion ──────────────────────────────────────────────────────────────────
  "--z-duration-fast": "0.12s",
  "--z-duration-base": "0.15s",
  "--z-duration-slow": "0.20s",
  // Directional easing — terminal, edge, aggressive
  "--z-ease-enter": "cubic-bezier(0, 0.85, 0.1, 1)",
  // sharp deceleration, "slamming in"
  "--z-ease-exit": "cubic-bezier(0.9, 0, 1, 0.15)",
  // hard acceleration out, "cutting"
  "--z-ease-spring": "cubic-bezier(0.5, 1.8, 0.5, 1)"
  // aggressive overshoot, "recoil"
}, h = {
  // ── Structural overrides — scoped to html[data-genre="cyberpunk"] ──────────
  // Specificity [0,1,1] beats ops defaults on html [0,0,1].
  // Genre activation is pure CSS: set data-genre="cyberpunk" on the html element.
  'html[data-genre="cyberpunk"]': {
    // ── Badge shape primitive ────────────────────────────────────────────────
    "--zp-corner-badge": "14px",
    // ── Button structural ────────────────────────────────────────────────────
    "--z-btn-clip": "inset(0)",
    "--z-btn-inner-clip": "inset(1.5px)",
    "--z-btn-corner": "18px",
    "--z-btn-active-scale": "0.94",
    "--z-btn-scan-stop": "55%",
    // ── Badge structural ─────────────────────────────────────────────────────
    "--z-badge-clip": "inset(0)",
    "--z-badge-padding": "0.24rem 0.8rem",
    "--z-badge-letter-spacing": "0.16em",
    "--z-badge-inset-shadow": "inset 0 0 0 1px currentColor",
    "--z-badge-scan-duration": "2.5s",
    "--z-badge-inner-clip": "inset(2px)",
    // ── Alert structural ─────────────────────────────────────────────────────
    "--z-alert-radius": "0",
    "--z-alert-bar-width": "5px",
    "--z-alert-prefix": '"> "',
    "--z-alert-bg-opacity": "14%",
    // Full-perimeter border in the variant's bar colour. Lazy CSS evaluation resolves
    // var(--alert-bar-color) at the element level even though this token is on html.
    "--z-alert-border": "1px solid color-mix(in oklch, var(--alert-bar-color) 35%, transparent)",
    "--z-alert-prefix-opacity": "0.55",
    "--z-alert-bar-glow": "0 0 14px var(--alert-bar-color), 0 0 30px color-mix(in oklch, var(--alert-bar-color) 40%, transparent)",
    "--z-alert-texture": "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.018) 3px, rgba(255,255,255,0.018) 4px)",
    // Top bar geometry: padding pushes top instead of left; bar spans full width
    "--z-alert-padding-top": "calc(0.875rem + var(--z-alert-bar-width))",
    "--z-alert-padding-left": "1.25rem",
    "--z-alert-bar-inset": "0 0 auto 0",
    // top right bottom left
    "--z-alert-bar-w": "100%",
    "--z-alert-bar-h": "var(--z-alert-bar-width)",
    "--z-alert-bar-radius": "0",
    // ── Card structural — rectangular, no clip-path geometry ────────────────
    "--z-card-gradient": "linear-gradient(145deg, rgba(2,18,4,0.98) 0%, rgba(0,8,1,0.99) 100%)",
    "--z-card-border-color": "color-mix(in oklch, var(--zyna) 60%, transparent)",
    "--z-card-shadow": "0 0 0 1px color-mix(in oklch, var(--zyna) 25%, transparent), 0 8px 32px rgba(0,0,0,0.6)",
    "--z-card-bar-height": "3px",
    "--z-card-bar-bg": "var(--zyna)",
    "--z-card-bar-shadow": "0 0 14px var(--zyna), 0 0 32px color-mix(in oklch, var(--zyna) 50%, transparent)",
    "--z-card-header-bg": "color-mix(in oklch, var(--zyna) 10%, transparent)",
    "--z-card-header-border": "color-mix(in oklch, var(--zyna) 30%, transparent)",
    "--z-card-header-color": "var(--zyna)",
    "--z-card-header-letter-spacing": "0.18em",
    "--z-card-header-text-shadow": "0 0 10px color-mix(in oklch, var(--zyna) 60%, transparent)",
    "--z-card-header-dot-size": "7px",
    "--z-card-header-dot-bg": "var(--zyna)",
    "--z-card-header-dot-shadow": "0 0 8px var(--zyna), 0 0 20px color-mix(in oklch, var(--zyna) 50%, transparent)",
    "--z-card-header-dot-animation": "zyna-pulse-ring var(--z-duration-pulse) var(--z-ease-enter) infinite",
    "--z-card-bracket-size": "22px",
    "--z-card-bracket-stroke": "2px",
    "--z-card-bracket-color": "color-mix(in oklch, var(--zyna) 80%, transparent)",
    "--z-card-texture": "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,255,20,0.022) 1px, rgba(0,255,20,0.022) 2px)",
    "--z-card-title-text-shadow": "0 0 18px color-mix(in oklch, var(--zyna) 22%, transparent)",
    "--z-card-glow-duration": "5s",
    // Default glow colours applied to every .card so .card-glow pulses in neon automatically
    "--z-card-default-glow-lo": "color-mix(in oklch, var(--zyna) 8%, transparent)",
    "--z-card-default-glow-hi": "color-mix(in oklch, var(--zyna) 22%, transparent)",
    // ── Docs chrome ─────────────────────────────────────────────────────────
    "--z-topbar-border": "color-mix(in oklch, var(--zyna) 40%, transparent)",
    "--z-topbar-glow": "0 1px 0 color-mix(in oklch, var(--zyna) 20%, transparent), 0 2px 14px color-mix(in oklch, var(--zyna) 10%, transparent)",
    "--z-sidebar-active-shadow": "inset 3px 0 0 var(--zyna), inset 6px 0 0 color-mix(in oklch, var(--zyna) 30%, transparent)"
  },
  // ── Badges — per-variant intensity overrides ─────────────────────────────────
  // These are class-level CSS variable overrides (not global tokens) so they must
  // live here as scoped rules. The base badge structure (clip, padding, border) is
  // handled entirely via the html[data-genre="cyberpunk"] rule above.
  ':where(html[data-genre="cyberpunk"]) :where(.badge-primary)': {
    "--badge-bg": "color-mix(in oklch, var(--zyna) 20%, transparent)",
    "--badge-glow": "drop-shadow(0 0 8px color-mix(in oklch, var(--zyna) 70%, transparent)) drop-shadow(0 0 20px color-mix(in oklch, var(--zyna) 28%, transparent))"
  },
  ':where(html[data-genre="cyberpunk"]) :where(.badge-success)': {
    "--badge-bg": "color-mix(in oklch, var(--z-color-success) 18%, transparent)",
    "--badge-glow": "drop-shadow(0 0 8px color-mix(in oklch, var(--z-color-success) 70%, transparent)) drop-shadow(0 0 18px color-mix(in oklch, var(--z-color-success) 28%, transparent))"
  },
  ':where(html[data-genre="cyberpunk"]) :where(.badge-danger)': {
    "--badge-bg": "color-mix(in oklch, var(--z-color-danger) 18%, transparent)",
    "--badge-glow": "drop-shadow(0 0 8px color-mix(in oklch, var(--z-color-danger) 70%, transparent)) drop-shadow(0 0 18px color-mix(in oklch, var(--z-color-danger) 28%, transparent))"
  },
  ':where(html[data-genre="cyberpunk"]) :where(.badge-warning)': {
    "--badge-bg": "color-mix(in oklch, var(--z-color-warning) 18%, transparent)",
    "--badge-glow": "drop-shadow(0 0 8px color-mix(in oklch, var(--z-color-warning) 65%, transparent)) drop-shadow(0 0 16px color-mix(in oklch, var(--z-color-warning) 25%, transparent))"
  },
  ':where(html[data-genre="cyberpunk"]) :where(.badge-info)': {
    "--badge-bg": "color-mix(in oklch, var(--z-color-info) 18%, transparent)",
    "--badge-glow": "drop-shadow(0 0 8px color-mix(in oklch, var(--z-color-info) 70%, transparent)) drop-shadow(0 0 18px color-mix(in oklch, var(--z-color-info) 28%, transparent))"
  },
  ':where(html[data-genre="cyberpunk"]) :where(.badge-secondary)': {
    "--badge-bg": "color-mix(in oklch, var(--zyna) 10%, transparent)",
    "--badge-glow": "drop-shadow(0 0 6px color-mix(in oklch, var(--zyna) 45%, transparent))"
  },
  // ── Body scan-line overlay ────────────────────────────────────────────────────
  // Cannot be tokenised — pseudo-element creation requires a selector rule.
  ':where(html[data-genre="cyberpunk"]) body::before': {
    content: '""',
    position: "fixed",
    inset: "0",
    zIndex: "0",
    pointerEvents: "none",
    background: "repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in oklch, var(--zyna) 4.5%, transparent) 2px, color-mix(in oklch, var(--zyna) 4.5%, transparent) 3px)"
  }
}, w = { name: z, tokens: x, swatches: b, styles: h }, m = "Corporate", u = {
  brand: "#1D3557",
  success: "#1A6B45",
  danger: "#A31621",
  info: "#2A5B8C"
}, v = {
  // ── Brand ─────────────────────────────────────────────────────────────────────
  "--zyna": "#1D3557",
  // "Navy Dispatch" — institutional, never electric
  "--zyna-dark": "#0D1F36",
  // deep ink
  // ── Status colors — deep, readable on light surfaces ─────────────────────────
  // Not neon: these must work on ivory without glows.
  "--zp-success": "#1A6B45",
  // forest institutional green
  "--zp-danger": "#A31621",
  // sealing-wax crimson
  "--zp-warning": "#926B00",
  // aged amber
  "--zp-info": "#2A5B8C",
  // steel blue
  // ── Text — warm graphite ink ──────────────────────────────────────────────────
  "--zp-text": "#1C1A18",
  // deep warm graphite, not cold black
  "--z-color-text-inverse": "#F5F4F0",
  // text on primary (dark brand) buttons
  // ── Light page surfaces — override the dark defaults from tokens.js ───────────
  "--z-surface-page": "#F5F4F0",
  // warm ivory — 100 gsm Conqueror paper
  "--z-surface-inset": "#EDE9E2",
  // slightly warmer inset tone
  "--z-surface-inset-hover": "#E6E2D9",
  "--z-surface-inset-danger": "#FCF0F0",
  "--z-surface-inset-danger-hover": "#F7E4E4",
  "--z-surface-card": "linear-gradient(160deg, #FFFFFF 0%, #F8F7F3 100%)",
  "--z-surface-card-deep": "linear-gradient(160deg, #F4F3EF 0%, #ECEAE3 100%)",
  // ── Borders & overlays — ink on paper ────────────────────────────────────────
  "--z-color-border": "rgba(28,27,22,0.10)",
  "--z-color-border-dim": "rgba(28,27,22,0.055)",
  "--z-color-overlay": "rgba(28,27,22,0.03)",
  // ── Shadows — paper lift, not neon bloom ─────────────────────────────────────
  "--z-shadow-card": "0 1px 3px rgba(0,0,0,0.07), 0 6px 20px rgba(0,0,0,0.05)",
  "--z-shadow-card-deep": "0 2px 8px rgba(0,0,0,0.09), 0 12px 32px rgba(0,0,0,0.06)",
  // ── Docs chrome — light palette for docs.css CSS variables ───────────────────
  // These are set via setProperty() as inline styles on <html>, so they override
  // the hardcoded dark values in docs.css :root and allow all var(--bg/--text/--border)
  // references across the docs site to resolve to the light palette.
  "--bg": "#F5F4F0",
  "--bg2": "#EDEAE3",
  // sidebar
  "--bg3": "#E5E1D9",
  // hover states, buttons
  "--border": "rgba(28,27,22,0.13)",
  "--border2": "rgba(28,27,22,0.07)",
  "--text": "#1C1A18",
  "--text2": "#6B6560",
  "--text3": "#9E9994",
  "--topbar-bg": "rgba(244,243,238,0.93)",
  // semi-transparent ivory for blur
  "--z-panel-bg": "#EDEAE3",
  // warm inset — not dark modal
  "--z-panel-shadow": "0 8px 24px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
  // ── Motion — deliberate, controlled, no urgency ───────────────────────────────
  "--z-duration-fast": "0.20s",
  "--z-duration-base": "0.28s",
  "--z-duration-slow": "0.38s",
  "--z-duration-pulse": "3.5s",
  "--z-ease-enter": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  // professional ease-out
  "--z-ease-exit": "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
  // measured ease-in
  "--z-ease-spring": "cubic-bezier(0.34, 1.06, 0.64, 1)"
  // restrained settle, no recoil
}, y = {
  // ── Structural overrides — scoped to html[data-genre="corporate"] ─────────────
  // Specificity [0,1,1] beats ops defaults on html [0,0,1].
  'html[data-genre="corporate"]': {
    "color-scheme": "light",
    // ── Button — document dog-ear (single top-right chamfer) ─────────────────
    // Cuts ONLY the top-right corner — like a page with a turned-down corner.
    // This shape has never appeared in any UI design system.
    "--z-btn-clip": "polygon(0 0, calc(100% - var(--btn-corner)) 0, 100% var(--btn-corner), 100% 100%, 0 100%)",
    "--z-btn-inner-clip": "polygon(1px 1px, calc(100% - calc(var(--btn-corner) + 1px)) 1px, calc(100% - 1px) calc(var(--btn-corner) + 1px), calc(100% - 1px) calc(100% - 1px), 1px calc(100% - 1px))",
    "--z-btn-corner": "10px",
    "--z-btn-active-scale": "0.97",
    "--z-btn-scan-stop": "38%",
    // understated fill — not aggressive
    // ── Badge — micro-rounded typographic label ────────────────────────────────
    // inset(0 round 3px) is clip-path syntax — clips to rect with 3px corner radius.
    // Reads like a precision-printed document label, not a digital pill or chip.
    "--z-badge-clip": "inset(0 round 3px)",
    "--z-badge-radius": "3px",
    "--z-badge-padding": "0.19rem 0.75rem",
    "--z-badge-letter-spacing": "0.07em",
    // tight typographic — no spaced-out caps
    "--z-badge-inset-shadow": "inset 0 0 0 1px currentColor",
    "--z-badge-scan-duration": "9s",
    // barely perceptible scan
    "--z-badge-inner-clip": "inset(2px round 1px)",
    // ── Alert — left rule, § legal prefix, paper border ───────────────────────
    // § (section sign) is the mark used in legal and regulatory documents.
    // Completely unique as an alert prefix — no other design system uses it.
    "--z-alert-radius": "0 3px 3px 0",
    "--z-alert-bar-width": "2.5px",
    // hairline rule, more refined than Ops (3px)
    "--z-alert-prefix": '"§ "',
    // legal section sign
    "--z-alert-bg-opacity": "5%",
    "--z-alert-border": "1px solid rgba(28,27,22,0.07)",
    "--z-alert-prefix-opacity": "0.38",
    "--z-alert-bar-glow": "none",
    "--z-alert-texture": "none",
    "--z-alert-padding-top": "0.875rem",
    "--z-alert-padding-left": "calc(1.25rem + var(--z-alert-bar-width))",
    "--z-alert-bar-inset": "0 auto 0 0",
    // left-side rule, same position as Ops
    "--z-alert-bar-w": "var(--z-alert-bar-width)",
    "--z-alert-bar-h": "auto",
    "--z-alert-bar-radius": "0",
    // ── Card — clean paper card; no brackets, no neon, no clip-path ───────────
    // Cards read as physical paper: white gradient, soft lift shadow,
    // institution-blue header band, fading rule at the top edge.
    "--z-card-clip": "none",
    "--z-card-filter": "none",
    "--z-card-texture": "none",
    "--z-card-gradient": "var(--z-surface-card)",
    "--z-card-border-color": "rgba(28,27,22,0.09)",
    "--z-card-shadow": "var(--z-shadow-card)",
    // Brackets are an Ops hallmark — remove them entirely for Corporate
    "--z-card-bracket-color": "transparent",
    "--z-card-bracket-size": "0px",
    "--z-card-bracket-stroke": "0px",
    // Top rule: fades right like a printed ruling line
    "--z-card-bar-height": "2px",
    "--z-card-bar-bg": "linear-gradient(90deg, var(--zyna) 0%, color-mix(in oklch, var(--zyna) 0%, transparent) 100%)",
    "--z-card-bar-shadow": "none",
    // Header: very subtle brand wash — like printed letterhead
    "--z-card-header-bg": "rgba(29,53,87,0.04)",
    "--z-card-header-border": "rgba(29,53,87,0.11)",
    "--z-card-header-color": "var(--zyna)",
    "--z-card-header-letter-spacing": "0.08em",
    "--z-card-header-text-shadow": "none",
    "--z-card-header-dot-size": "4px",
    "--z-card-header-dot-bg": "var(--zyna)",
    "--z-card-header-dot-shadow": "none",
    // no glow
    "--z-card-header-dot-animation": "none",
    // static — not pulsing
    "--z-card-title-text-shadow": "none",
    "--z-card-glow-duration": "8s",
    // .card-glow: a barely-there institution-navy bloom — not neon, not dramatic
    "--z-card-default-glow-lo": "rgba(29,53,87,0.03)",
    "--z-card-default-glow-hi": "rgba(29,53,87,0.08)",
    // ── Docs chrome ───────────────────────────────────────────────────────────
    "--z-topbar-border": "rgba(28,27,22,0.09)",
    "--z-topbar-glow": "none",
    "--z-sidebar-active-shadow": "inset 3px 0 0 var(--zyna)"
  },
  // ── Badge color overrides — deep tones for light backgrounds ─────────────────
  // No glows — Corporate doesn't bloom.
  ':where(html[data-genre="corporate"]) :where(.badge-primary)': {
    "--badge-bg": "transparent",
    "--badge-glow": "none"
  },
  ':where(html[data-genre="corporate"]) :where(.badge-success)': {
    "--badge-bg": "transparent",
    "--badge-glow": "none"
  },
  ':where(html[data-genre="corporate"]) :where(.badge-danger)': {
    "--badge-bg": "transparent",
    "--badge-glow": "none"
  },
  ':where(html[data-genre="corporate"]) :where(.badge-warning)': {
    "--badge-bg": "transparent",
    "--badge-glow": "none"
  },
  ':where(html[data-genre="corporate"]) :where(.badge-info)': {
    "--badge-bg": "transparent",
    "--badge-glow": "none"
  },
  ':where(html[data-genre="corporate"]) :where(.badge-secondary)': {
    "--badge-bg": "transparent",
    "--badge-glow": "none"
  },
  // Polygon shapes (slant, bevel) can't use box-shadow: inset for a border —
  // the rectangular shadow gets clipped abruptly at the diagonal corners.
  // Switch to the inner-clip border model: outer = border color, ::before = fill.
  // Polygon shapes (slant, bevel) can't use box-shadow: inset — rectangular shadow
  // cuts abruptly at diagonal corners. Use inner-clip model instead (same technique
  // as the genre builder which uses --z-badge-inset-shadow: none for all shapes):
  //   outer strip (1px) = border color (currentColor)
  //   ::before fill     = color-mix(currentColor 8%, page) — identical to how pill/rect
  //                       look when rgba(currentColor, 0.08) sits on the page background
  ':where(html[data-genre="corporate"]) :where(.badge-slant)': {
    "--z-badge-inset-shadow": "none",
    "--badge-bg": "currentColor",
    "--badge-interior": "var(--z-surface-page)",
    "--badge-inner-clip": "polygon(calc(var(--badge-offset) + 1px) 1px, calc(100% - 1px) 1px, calc(100% - calc(var(--badge-offset) + 1px)) calc(100% - 1px), 1px calc(100% - 1px))"
  },
  ':where(html[data-genre="corporate"]) :where(.badge-bevel)': {
    "--z-badge-inset-shadow": "none",
    "--badge-bg": "currentColor",
    "--badge-interior": "var(--z-surface-page)",
    "--badge-inner-clip": "polygon(calc(var(--badge-offset) + 1px) 1px, calc(100% - calc(var(--badge-offset) + 1px)) 1px, calc(100% - 1px) calc(var(--badge-offset) + 1px), calc(100% - 1px) calc(100% - calc(var(--badge-offset) + 1px)), calc(100% - calc(var(--badge-offset) + 1px)) calc(100% - 1px), calc(var(--badge-offset) + 1px) calc(100% - 1px), 1px calc(100% - calc(var(--badge-offset) + 1px)), 1px calc(var(--badge-offset) + 1px))"
  },
  // ── Graph-paper ledger grid — page texture ────────────────────────────────────
  // 24 px repeating grid in institutional navy at ~4.5 % opacity.
  // Unique: horizontal + vertical 1 px rules produce a genuine graph-paper effect.
  // At this opacity it reads as "precision" without being visible as texture.
  // No design system has shipped a repeating-linear-gradient grid as a genre overlay.
  ':where(html[data-genre="corporate"]) body::before': {
    content: '""',
    position: "fixed",
    inset: "0",
    zIndex: "0",
    pointerEvents: "none",
    backgroundImage: [
      "repeating-linear-gradient(rgba(29,53,87,0.045) 0 1px, transparent 1px 100%)",
      "repeating-linear-gradient(90deg, rgba(29,53,87,0.045) 0 1px, transparent 1px 100%)"
    ].join(", "),
    backgroundSize: "24px 24px"
  }
}, f = { name: m, tokens: v, swatches: u, styles: y }, k = "Phosphor", F = {
  brand: "#FF9F0A",
  success: "#6EC96C",
  danger: "#FF4E4E",
  info: "#5BBFFF"
}, $ = {
  // ── Brand — classic P3 phosphor amber ─────────────────────────────────────
  "--zyna": "#FF9F0A",
  // P3 phosphor amber — the precise hue of an Amber CRT tube
  "--zyna-dark": "#C97300",
  // deeper warm amber
  // ── Status colors — secondary phosphor emissions ───────────────────────────
  // Different phosphor chemical compounds emit at different wavelengths.
  // Green = P1, Red = alarm, Yellow-amber = P3 blend, Blue-white = P4.
  "--zp-success": "#6EC96C",
  // P1 phosphor green
  "--zp-danger": "#FF4E4E",
  // red alarm phosphor
  "--zp-warning": "#FFD060",
  // yellow-amber phosphor blend
  "--zp-info": "#5BBFFF",
  // P4 blue-white phosphor
  // ── Text — phosphor amber glow ─────────────────────────────────────────────
  "--zp-text": "#FFB742",
  // warm amber emission — slightly de-saturated vs brand
  "--z-color-text-inverse": "#0A0700",
  // text on primary (amber fill) buttons
  // ── Surfaces — near-black with warm amber tint ─────────────────────────────
  // A CRT display in the dark: not pure black but warm near-black from
  // residual amber phosphor emission and glass tinting.
  "--z-surface-page": "#0A0700",
  "--z-surface-inset": "#120D02",
  "--z-surface-inset-hover": "#1A1200",
  "--z-surface-inset-danger": "#1A0600",
  "--z-surface-inset-danger-hover": "#220800",
  "--z-surface-card": "linear-gradient(160deg, #120D02 0%, #0A0700 100%)",
  "--z-surface-card-deep": "linear-gradient(160deg, #1A1200 0%, #120D02 100%)",
  // ── Borders & overlays — amber-tinted ──────────────────────────────────────
  "--z-color-border": "rgba(255,159,10,0.12)",
  "--z-color-border-dim": "rgba(255,159,10,0.06)",
  "--z-color-overlay": "rgba(255,159,10,0.05)",
  // ── Shadows — phosphor bloom, not sharp drop ────────────────────────────────
  "--z-shadow-card": "0 2px 8px rgba(0,0,0,0.5), 0 0 20px rgba(255,159,10,0.04)",
  "--z-shadow-card-deep": "0 4px 16px rgba(0,0,0,0.7), 0 0 40px rgba(255,159,10,0.06)",
  // ── Docs chrome — amber phosphor palette for docs.css CSS variables ─────────
  "--bg": "#0A0700",
  "--bg2": "#120D02",
  "--bg3": "#1A1200",
  "--border": "rgba(255,159,10,0.13)",
  "--border2": "rgba(255,159,10,0.07)",
  "--text": "#FFB742",
  "--text2": "rgba(255,183,66,0.60)",
  "--text3": "rgba(255,183,66,0.35)",
  "--topbar-bg": "rgba(10,7,0,0.93)",
  "--z-panel-bg": "#120D02",
  "--z-panel-shadow": "0 8px 24px rgba(0,0,0,0.6), 0 0 30px rgba(255,159,10,0.05)",
  // ── Font — VT323: the definitive amber CRT terminal typeface ───────────────
  "--z-font-mono": "'VT323', 'Courier New', monospace",
  // ── Motion — STEPPED, not smooth ──────────────────────────────────────────
  // steps() easing is unique to PHOSPHOR — no other genre or design system uses
  // discrete step timing for interactive hover transitions.
  // Each state change snaps in discrete increments, simulating phosphor
  // persistence and digital-clock character refresh cycles.
  "--z-duration-fast": "0.16s",
  "--z-duration-base": "0.24s",
  "--z-duration-slow": "0.32s",
  "--z-duration-pulse": "4s",
  "--z-ease-enter": "steps(6, end)",
  // typewriter snap-in — 6 discrete frames
  "--z-ease-exit": "steps(4, start)",
  // typewriter snap-out — 4 discrete frames
  "--z-ease-spring": "steps(8, end)"
  // stepped persistence — phosphor decay
}, A = {
  // ── CRT phosphor sweep keyframe ────────────────────────────────────────────
  // Unique to this genre: simulates the CRT electron gun's raster scan pass.
  // The body::after element (200 px tall) descends from above the viewport
  // to below it in 8 s. translateY(100vh) is valid in CSS transforms.
  "@keyframes phosphor-sweep": {
    "0%": { transform: "translateY(-200px)" },
    "100%": { transform: "translateY(100vh)" }
  },
  // ── Structural overrides — scoped to html[data-genre="phosphor"] ───────────
  // Specificity [0,1,1] beats ops defaults on html [0,0,1].
  'html[data-genre="phosphor"]': {
    "color-scheme": "dark",
    // ── Button — terminal chevron notch ──────────────────────────────────────
    // The left edge indents to a point at vertical center, giving each button
    // the appearance of a punch-card slot or tape-drive bay entry port.
    // Each button reads as a terminal command-entry field.
    // polygon: (corner,0) top-left inset → (100%,0) top-right → (100%,100%)
    //          bottom-right → (corner,100%) bottom-left inset → (0,50%) point.
    "--z-btn-clip": "polygon(var(--btn-corner) 0, 100% 0, 100% 100%, var(--btn-corner) 100%, 0 50%)",
    // Inner clip: 1 px inset on all straight edges, point moved 1 px right.
    "--z-btn-inner-clip": "polygon(calc(var(--btn-corner) + 1px) 1px, calc(100% - 1px) 1px, calc(100% - 1px) calc(100% - 1px), calc(var(--btn-corner) + 1px) calc(100% - 1px), 1px 50%)",
    "--z-btn-corner": "14px",
    "--z-btn-active-scale": "0.97",
    "--z-btn-scan-stop": "55%",
    // ── Badge — sharp rectangular terminal tag ────────────────────────────────
    // No parallelogram, no pill — a sharp-cornered rectangle that reads as
    // a character-mode terminal status flag or punched label tape.
    "--z-badge-clip": "inset(0)",
    "--z-badge-radius": "0",
    "--z-badge-padding": "0.20rem 0.70rem",
    "--z-badge-letter-spacing": "0.10em",
    "--z-badge-inset-shadow": "inset 0 0 0 1px currentColor",
    "--z-badge-scan-duration": "9s",
    // phosphor persistence — afterglow fades slowly
    "--z-badge-inner-clip": "inset(2px)",
    // ── Alert — RIGHT-side bar, double-chevron prompt prefix ──────────────────
    // Bar on the RIGHT: the accent terminates the text line like a cursor at
    // end-of-line. No other genre or design system has a right-side alert bar.
    // Alert container: rounded left (open side), square right (bar terminus).
    "--z-alert-radius": "3px 0 0 3px",
    "--z-alert-bar-width": "3px",
    "--z-alert-prefix": '">> "',
    // double-chevron: terminal ready-for-input
    "--z-alert-bg-opacity": "8%",
    "--z-alert-border": "1px solid rgba(255,159,10,0.10)",
    "--z-alert-prefix-opacity": "0.55",
    "--z-alert-bar-glow": "0 0 10px var(--alert-bar-color), 0 0 20px color-mix(in oklch, var(--alert-bar-color) 40%, transparent)",
    "--z-alert-texture": "none",
    "--z-alert-padding-top": "0.875rem",
    "--z-alert-padding-left": "1.25rem",
    // no left bar — standard padding
    // Bar geometry: right side, full height.
    // inset shorthand: top right bottom left = 0 0 0 auto → top:0 right:0 bottom:0 left:auto
    "--z-alert-bar-inset": "0 0 0 auto",
    "--z-alert-bar-w": "var(--z-alert-bar-width)",
    "--z-alert-bar-h": "auto",
    "--z-alert-bar-radius": "0",
    // ── Card — phosphor terminal output pane ──────────────────────────────────
    "--z-card-clip": "none",
    "--z-card-filter": "none",
    "--z-card-texture": "none",
    "--z-card-gradient": "var(--z-surface-card)",
    "--z-card-border-color": "rgba(255,159,10,0.14)",
    "--z-card-shadow": "var(--z-shadow-card)",
    "--z-card-bracket-color": "color-mix(in oklch, var(--zyna) 38%, transparent)",
    "--z-card-bracket-size": "16px",
    "--z-card-bracket-stroke": "1px",
    // Top amber phosphor rule: fades right like a CRT trace
    "--z-card-bar-height": "1px",
    "--z-card-bar-bg": "linear-gradient(90deg, var(--zyna) 0%, color-mix(in oklch, var(--zyna) 0%, transparent) 100%)",
    "--z-card-bar-shadow": "0 0 8px rgba(255,159,10,0.6), 0 0 20px rgba(255,159,10,0.2)",
    // Header: amber-tinted band — terminal window titlebar
    "--z-card-header-bg": "rgba(255,159,10,0.06)",
    "--z-card-header-border": "rgba(255,159,10,0.14)",
    "--z-card-header-color": "var(--zyna)",
    "--z-card-header-letter-spacing": "0.16em",
    "--z-card-header-text-shadow": "0 0 12px color-mix(in oklch, var(--zyna) 55%, transparent)",
    "--z-card-header-dot-size": "5px",
    "--z-card-header-dot-bg": "var(--zyna)",
    "--z-card-header-dot-shadow": "0 0 6px var(--zyna), 0 0 14px color-mix(in oklch, var(--zyna) 50%, transparent)",
    "--z-card-header-dot-animation": "zyna-pulse-ring var(--z-duration-pulse) var(--z-ease-enter) infinite",
    "--z-card-title-text-shadow": "0 0 14px color-mix(in oklch, var(--zyna) 22%, transparent)",
    "--z-card-glow-duration": "6s",
    "--z-card-default-glow-lo": "rgba(255,159,10,0.04)",
    "--z-card-default-glow-hi": "rgba(255,159,10,0.12)",
    // ── Docs chrome ────────────────────────────────────────────────────────────
    "--z-topbar-border": "rgba(255,159,10,0.15)",
    "--z-topbar-glow": "0 1px 0 rgba(255,159,10,0.10), 0 2px 16px rgba(255,159,10,0.05)",
    "--z-sidebar-active-shadow": "inset 3px 0 0 var(--zyna), inset 6px 0 0 color-mix(in oklch, var(--zyna) 25%, transparent)"
  },
  // ── Badge color overrides — amber phosphor variants ────────────────────────
  ':where(html[data-genre="phosphor"]) :where(.badge-primary)': {
    "--badge-bg": "color-mix(in oklch, var(--zyna) 15%, transparent)",
    "--badge-glow": "drop-shadow(0 0 6px color-mix(in oklch, var(--zyna) 65%, transparent)) drop-shadow(0 0 16px color-mix(in oklch, var(--zyna) 25%, transparent))"
  },
  ':where(html[data-genre="phosphor"]) :where(.badge-success)': {
    "--badge-bg": "color-mix(in oklch, var(--z-color-success) 12%, transparent)",
    "--badge-glow": "drop-shadow(0 0 6px color-mix(in oklch, var(--z-color-success) 65%, transparent))"
  },
  ':where(html[data-genre="phosphor"]) :where(.badge-danger)': {
    "--badge-bg": "color-mix(in oklch, var(--z-color-danger) 12%, transparent)",
    "--badge-glow": "drop-shadow(0 0 6px color-mix(in oklch, var(--z-color-danger) 65%, transparent))"
  },
  ':where(html[data-genre="phosphor"]) :where(.badge-warning)': {
    "--badge-bg": "color-mix(in oklch, var(--z-color-warning) 12%, transparent)",
    "--badge-glow": "drop-shadow(0 0 6px color-mix(in oklch, var(--z-color-warning) 65%, transparent))"
  },
  ':where(html[data-genre="phosphor"]) :where(.badge-info)': {
    "--badge-bg": "color-mix(in oklch, var(--z-color-info) 12%, transparent)",
    "--badge-glow": "drop-shadow(0 0 6px color-mix(in oklch, var(--z-color-info) 65%, transparent))"
  },
  ':where(html[data-genre="phosphor"]) :where(.badge-secondary)': {
    "--badge-bg": "color-mix(in oklch, var(--zyna) 8%, transparent)",
    "--badge-glow": "drop-shadow(0 0 4px color-mix(in oklch, var(--zyna) 40%, transparent))"
  },
  // ── Badge animation easing overrides ──────────────────────────────────────
  // steps() is right for hover interactions (typewriter snap), but wrong for
  // continuous background animations. Phosphor glows and fades smoothly —
  // the pulse ring and scan sweep must use smooth easing, not discrete steps.
  ':where(html[data-genre="phosphor"]) :where(.badge)::after': {
    animation: "zyna-badge-scan var(--z-badge-scan-duration) linear infinite"
  },
  ':where(html[data-genre="phosphor"]) :where(.badge-pulse)::before': {
    animation: "zyna-pulse-ring var(--z-duration-pulse) ease-in-out infinite"
  },
  // ── CRT phosphor overlay — scanlines + radial vignette ────────────────────
  // Horizontal scanlines: authentic CRT raster line structure, 1 px every 3 px.
  // Radial vignette: barrel distortion — the glass darkens at the CRT bezel edges.
  ':where(html[data-genre="phosphor"]) body::before': {
    content: '""',
    position: "fixed",
    inset: "0",
    zIndex: "0",
    pointerEvents: "none",
    background: [
      "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)",
      "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.65) 100%)"
    ].join(", ")
  },
  // ── Animated phosphor sweep beam ───────────────────────────────────────────
  // The CRT electron gun's raster sweep: a faint amber glow band slowly descending.
  // At 5.5 % peak opacity it reads as "alive" without being distracting.
  // body::after is not used by any other genre, so no scoping conflicts.
  // This is the only CSS genre texture that animates a physical electron beam path.
  ':where(html[data-genre="phosphor"]) body::after': {
    content: '""',
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    height: "200px",
    zIndex: "0",
    pointerEvents: "none",
    background: "linear-gradient(transparent 0%, rgba(255,159,10,0.025) 35%, rgba(255,159,10,0.055) 50%, rgba(255,159,10,0.025) 65%, transparent 100%)",
    transform: "translateY(-200px)",
    animation: "phosphor-sweep 8s linear infinite"
  },
  // ── prefers-reduced-motion — sweep beam stops for vestibular disorder users ──
  // Must live here (inside the genre file, last in addBase source order) so it
  // wins over the animation declaration above. motion.js runs before genresPlugin()
  // and loses to genre rules via source order at equal specificity.
  "@media (prefers-reduced-motion: reduce)": {
    ':where(html[data-genre="phosphor"]) body::after': { animation: "none" }
  }
}, E = { name: k, tokens: $, swatches: F, styles: A }, C = "Military", B = {
  brand: "#8B9E4B",
  success: "#5B8A3C",
  danger: "#CC3300",
  info: "#4A7FA5"
}, D = {
  // ── Brand — Ranger olive ────────────────────────────────────────────────────
  // The authentic US Army uniform olive, slightly desaturated to avoid the
  // neon-green trap. Reads as "military" immediately without being cartoonish.
  "--zyna": "#8B9E4B",
  // Ranger olive — US Army OD (Olive Drab) green
  "--zyna-dark": "#5C6B2F",
  // Deep ranger — shadow side of an olive surface
  // ── Status colors — field operations palette ────────────────────────────────
  // Grounded in real operational color conventions:
  // Go = vegetation green (blend with terrain, safe to move)
  // Danger = infrared flare red / tracer round (universal alarm)
  // Warning = amber signal flare (caution, be alert)
  // Info = radio/comms blue / water feature blue from topo maps
  "--zp-success": "#5B8A3C",
  // vegetation green — clear to proceed
  "--zp-danger": "#CC3300",
  // flare red — stop, threat detected
  "--zp-warning": "#C98A00",
  // amber signal — proceed with caution
  "--zp-info": "#4A7FA5",
  // radio blue / topo water feature
  // ── Text — field notebook cream ─────────────────────────────────────────────
  // Not pure white (too high-contrast for night ops), not amber (that's Phosphor).
  // A warm gray-green: the color of paper in a military field manual printed
  // on government specification stock — aged, olive-tinted, readable under red light.
  "--zp-text": "#B8BD9B",
  // field notebook cream-green
  "--z-color-text-inverse": "#131510",
  // dark olive on brand (button fill)
  // ── Surfaces — tactical dark, olive-tinted ──────────────────────────────────
  // Near-black with a perceptible green tint — the ambient light in a tactical
  // operations center is dim olive from filtered overhead lights and display glow.
  // Not pure black (#000) and not warm black (Phosphor's #0A0700) — this is cold,
  // alert, field-operational dark.
  "--z-surface-page": "#131510",
  "--z-surface-inset": "#1A1D13",
  "--z-surface-inset-hover": "#1F2318",
  "--z-surface-inset-danger": "#1A1208",
  "--z-surface-inset-danger-hover": "#201508",
  "--z-surface-card": "linear-gradient(160deg, #1B1F13 0%, #131510 100%)",
  "--z-surface-card-deep": "linear-gradient(160deg, #1F2318 0%, #1A1D13 100%)",
  // ── Borders & overlays — olive-tinted ──────────────────────────────────────
  "--z-color-border": "rgba(139,158,75,0.12)",
  "--z-color-border-dim": "rgba(139,158,75,0.06)",
  "--z-color-overlay": "rgba(139,158,75,0.04)",
  // ── Shadows — terrain shadow, not neon bloom ────────────────────────────────
  // Military shadows read as depth under field lighting — no glow, no ambiance.
  // A slight olive tint in the diffuse layer simulates reflected ambient terrain.
  "--z-shadow-card": "0 2px 8px rgba(0,0,0,0.60), 0 0 24px rgba(139,158,75,0.03)",
  "--z-shadow-card-deep": "0 4px 18px rgba(0,0,0,0.75), 0 0 40px rgba(139,158,75,0.05)",
  // ── Docs chrome — olive field palette for docs.css CSS variables ─────────────
  "--bg": "#131510",
  "--bg2": "#1A1D13",
  // sidebar surface
  "--bg3": "#1F2318",
  // hover / active surface
  "--border": "rgba(139,158,75,0.13)",
  "--border2": "rgba(139,158,75,0.07)",
  "--text": "#B8BD9B",
  "--text2": "rgba(184,189,155,0.55)",
  "--text3": "rgba(184,189,155,0.32)",
  "--topbar-bg": "rgba(19,21,16,0.93)",
  "--z-panel-bg": "#1A1D13",
  "--z-panel-shadow": "0 8px 24px rgba(0,0,0,0.65), 0 0 28px rgba(139,158,75,0.04)",
  // ── Font — Share Tech Mono: SINCGARS / field radio comms display ─────────────
  // Designed for tactical data terminals and military communications readout.
  // Share Tech Mono vs VT323 (Phosphor): Share Tech is sharp, modern-military;
  // VT323 is 1980s civilian CRT. These are different worlds.
  "--z-font-mono": "'Share Tech Mono', 'Courier New', monospace",
  // ── Motion — Ballistic precision ─────────────────────────────────────────────
  // Enter: fast approach with precise, zero-overshoot settle.
  //        Like a rangefinder locking on target — it reaches position and stops.
  //        cubic-bezier(0.16, 1, 0.3, 1): very fast initial velocity, smooth deceleration.
  // Exit:  deliberate departure — pulling back from a firing position.
  //        cubic-bezier(0.4, 0, 1, 1): measured acceleration, no hesitation.
  // Spring: no spring. Military equipment doesn't bounce or recoil in UI.
  //         Same professional settle as Corporate but with military-tight timing.
  "--z-duration-fast": "0.15s",
  // rapid target acquisition
  "--z-duration-base": "0.22s",
  "--z-duration-slow": "0.30s",
  "--z-duration-pulse": "3s",
  // measured indicator pulse
  "--z-ease-enter": "cubic-bezier(0.16, 1, 0.3, 1)",
  // ballistic approach + lock
  "--z-ease-exit": "cubic-bezier(0.4, 0, 1, 1)",
  // deliberate departure
  "--z-ease-spring": "cubic-bezier(0.25, 0.46, 0.45, 0.94)"
  // no bounce, precision settle
}, I = {
  // ── Terrain surveillance sweep keyframe ─────────────────────────────────────
  // BOTTOM-TO-TOP — opposite direction from Phosphor (top-to-bottom CRT scan).
  // Simulates a ground-based LiDAR or surface surveillance radar sweeping upward
  // across terrain, "painting" a picture of the operational environment.
  // The beam starts below the viewport (at +100vh) and exits above it (at -160px).
  "@keyframes field-sweep": {
    "0%": { transform: "translateY(100vh)" },
    "100%": { transform: "translateY(-160px)" }
  },
  // ── Structural overrides — scoped to html[data-genre="military"] ─────────────
  // Specificity [0,1,1] beats ops defaults on html [0,0,1].
  'html[data-genre="military"]': {
    "color-scheme": "dark",
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
    "--z-btn-clip": "polygon(var(--btn-corner) 0, 100% 0, 100% calc(100% - var(--btn-corner)), calc(100% - var(--btn-corner)) 100%, 0 100%, 0 var(--btn-corner))",
    // Inner clip: 1 px inset on all edges, chamfer points pulled 1 px inward.
    "--z-btn-inner-clip": "polygon(calc(var(--btn-corner) + 1px) 1px, calc(100% - 1px) 1px, calc(100% - 1px) calc(100% - calc(var(--btn-corner) + 1px)), calc(100% - calc(var(--btn-corner) + 1px)) calc(100% - 1px), 1px calc(100% - 1px), 1px calc(var(--btn-corner) + 1px))",
    "--z-btn-corner": "10px",
    "--z-btn-active-scale": "0.97",
    "--z-btn-scan-stop": "60%",
    // tactical fill: present but not aggressive
    // ── Badge — bottom-left notch (field identification tab) ─────────────────
    // A physical punch-hole notch at the lower-left corner: the same shape
    // used on military ID cards, barcode label rolls, and MOLLE binding tabs.
    // Completely unique in UI design systems — no other library or genre uses
    // a bottom-left corner clip on badges.
    //
    // Clip polygon (clockwise): top-left → top-right → bottom-right → notch-end → notch-point
    // The notch is 8px — sufficient to read as a punch hole without consuming badge space.
    "--z-badge-clip": "polygon(0 0, 100% 0, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
    "--z-badge-radius": "0",
    "--z-badge-padding": "0.20rem 0.75rem",
    "--z-badge-letter-spacing": "0.11em",
    "--z-badge-inset-shadow": "inset 0 0 0 1px currentColor",
    "--z-badge-scan-duration": "6s",
    // tactical awareness cadence
    "--z-badge-inner-clip": "polygon(1px 1px, calc(100% - 1px) 1px, calc(100% - 1px) calc(100% - 1px), 9px calc(100% - 1px), 1px calc(100% - 9px))",
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
    "--z-alert-radius": "3px 3px 0 0",
    // rounded top, flat bottom (where bar lives)
    "--z-alert-bar-width": "3px",
    "--z-alert-prefix": '"◈ "',
    // filled diamond — NATO control point / waypoint marker
    "--z-alert-bg-opacity": "6%",
    "--z-alert-border": "none",
    "--z-alert-prefix-opacity": "0.45",
    "--z-alert-bar-glow": "none",
    // military doesn't bloom
    "--z-alert-texture": "none",
    "--z-alert-padding-top": "0.875rem",
    "--z-alert-padding-left": "1.25rem",
    // no left bar — standard side padding
    // Bar sits at the bottom; content padding keeps text well above it
    "--z-alert-bar-inset": "auto 0 0 0",
    // top:auto, right:0, bottom:0, left:0
    "--z-alert-bar-w": "auto",
    // left:0 + right:0 govern full width
    "--z-alert-bar-h": "var(--z-alert-bar-width)",
    // explicit thickness
    "--z-alert-bar-radius": "0",
    // ── Card — field situation board with acetate overlay texture ─────────────
    // The diagonal hatching texture (--z-card-texture) simulates acetate overlay
    // paper placed on a laminated field map — the medium of tactical planning
    // at every level from squad to corps.
    "--z-card-clip": "none",
    "--z-card-filter": "none",
    "--z-card-texture": "repeating-linear-gradient(45deg, rgba(139,158,75,0.022) 0px, rgba(139,158,75,0.022) 1px, transparent 1px, transparent 10px)",
    "--z-card-gradient": "var(--z-surface-card)",
    "--z-card-border-color": "rgba(139,158,75,0.13)",
    "--z-card-shadow": "var(--z-shadow-card)",
    "--z-card-bracket-color": "color-mix(in oklch, var(--zyna) 40%, transparent)",
    "--z-card-bracket-size": "18px",
    "--z-card-bracket-stroke": "1.5px",
    // Top rule: solid 2px olive line — hard edge like a stencil, no gradient fade.
    // Every other genre fades the bar. Military stencils are sharp.
    "--z-card-bar-height": "2px",
    "--z-card-bar-bg": "var(--zyna)",
    // solid, not gradient — stencil edge
    "--z-card-bar-shadow": "none",
    // Header: subtle olive-green wash — like a printed field label affixed to equipment
    "--z-card-header-bg": "rgba(139,158,75,0.06)",
    "--z-card-header-border": "rgba(139,158,75,0.12)",
    "--z-card-header-color": "var(--zyna)",
    "--z-card-header-letter-spacing": "0.14em",
    "--z-card-header-text-shadow": "none",
    // military doesn't glow
    "--z-card-header-dot-size": "5px",
    "--z-card-header-dot-bg": "var(--zyna)",
    "--z-card-header-dot-shadow": "none",
    // static — not pulsing
    "--z-card-header-dot-animation": "none",
    // status dots don't animate in the field
    "--z-card-title-text-shadow": "none",
    "--z-card-glow-duration": "5s",
    "--z-card-default-glow-lo": "rgba(139,158,75,0.03)",
    "--z-card-default-glow-hi": "rgba(139,158,75,0.08)",
    // ── Docs chrome ─────────────────────────────────────────────────────────────
    "--z-topbar-border": "rgba(139,158,75,0.12)",
    "--z-topbar-glow": "none",
    "--z-sidebar-active-shadow": "inset 3px 0 0 var(--zyna), inset 5px 0 0 color-mix(in oklch, var(--zyna) 22%, transparent)"
  },
  // ── Badge color overrides — earth-tone variants ──────────────────────────────
  // Military badges use de-saturated olive-tinted fills — not neon, not transparent.
  // The fill is real (not transparent like Corporate) but subdued (not bright like Cyberpunk).
  // No glows: FIELDCRAFT doesn't bloom. Everything is contained, flat, tactical.
  ':where(html[data-genre="military"]) :where(.badge-primary)': {
    "--badge-bg": "color-mix(in oklch, var(--zyna) 14%, transparent)",
    "--badge-glow": "none"
  },
  ':where(html[data-genre="military"]) :where(.badge-success)': {
    "--badge-bg": "color-mix(in oklch, var(--z-color-success) 12%, transparent)",
    "--badge-glow": "none"
  },
  ':where(html[data-genre="military"]) :where(.badge-danger)': {
    "--badge-bg": "color-mix(in oklch, var(--z-color-danger) 11%, transparent)",
    "--badge-glow": "none"
  },
  ':where(html[data-genre="military"]) :where(.badge-warning)': {
    "--badge-bg": "color-mix(in oklch, var(--z-color-warning) 11%, transparent)",
    "--badge-glow": "none"
  },
  ':where(html[data-genre="military"]) :where(.badge-info)': {
    "--badge-bg": "color-mix(in oklch, var(--z-color-info) 11%, transparent)",
    "--badge-glow": "none"
  },
  ':where(html[data-genre="military"]) :where(.badge-secondary)': {
    "--badge-bg": "color-mix(in oklch, var(--zyna) 8%, transparent)",
    "--badge-glow": "none"
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
    position: "fixed",
    inset: "0",
    zIndex: "0",
    pointerEvents: "none",
    backgroundImage: [
      "repeating-linear-gradient(45deg, rgba(139,158,75,0.03) 0px, rgba(139,158,75,0.03) 1px, transparent 1px, transparent 12px)",
      "repeating-linear-gradient(-45deg, rgba(139,158,75,0.02) 0px, rgba(139,158,75,0.02) 1px, transparent 1px, transparent 12px)"
    ].join(", ")
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
    position: "fixed",
    bottom: "0",
    left: "0",
    right: "0",
    height: "160px",
    zIndex: "0",
    pointerEvents: "none",
    background: "linear-gradient(transparent 0%, rgba(139,158,75,0.018) 30%, rgba(139,158,75,0.035) 50%, rgba(139,158,75,0.018) 70%, transparent 100%)",
    transform: "translateY(100vh)",
    animation: "field-sweep 12s linear infinite"
  },
  // ── prefers-reduced-motion — surveillance sweep stops ───────────────────────
  // Must live here (inside the genre file, last in addBase source order) so it
  // wins over the animation declaration above. motion.js runs before genresPlugin()
  // and would lose to genre rules via source order at equal specificity.
  "@media (prefers-reduced-motion: reduce)": {
    ':where(html[data-genre="military"]) body::after': { animation: "none" }
  }
}, Y = { name: C, tokens: D, swatches: B, styles: I };
function j({ name: a, palette: r = {}, tokens: e = {}, styles: c = {}, extends: d }) {
  const n = d ?? t;
  return {
    name: a,
    swatches: { ...n.swatches, ...r },
    tokens: { ...n.tokens, ...e },
    styles: { ...n.styles, ...c }
  };
}
function G(a) {
  o.find((r) => r.name === a.name) || o.push(a);
}
const o = [t, w, f, E, Y];
function N() {
  const a = {};
  for (const r of o)
    if (r.styles && Object.assign(a, r.styles), r.tokens) {
      const e = `html[data-genre="${r.name.toLowerCase()}"]`;
      a[e] && (a[e] = { ...r.tokens, ...a[e] });
    }
  return a;
}
export {
  o as GENRES,
  j as defineGenre,
  N as genresPlugin,
  G as registerGenre
};
