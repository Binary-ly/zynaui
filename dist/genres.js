const p = {
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
}, l = "Ops", i = {
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
    "--z-btn-inner-clip": p.diagonal("var(--btn-corner)").inner,
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
    "--z-alert-bar-radius": "3px 0 0 3px",
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
}, o = { name: l, tokens: s, swatches: i, styles: g }, b = "Cyberpunk", z = {
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
}, w = { name: b, tokens: x, swatches: z, styles: h }, m = "Corporate", u = {
  brand: "#1D3557",
  success: "#1A6B45",
  danger: "#A31621",
  info: "#2A5B8C"
}, f = {
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
}, v = {
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
}, y = { name: m, tokens: f, swatches: u, styles: v }, k = "Phosphor", F = {
  brand: "#FF9F0A",
  success: "#6EC96C",
  danger: "#FF4E4E",
  info: "#5BBFFF"
}, E = {
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
}, C = { name: k, tokens: E, swatches: F, styles: A }, D = "Military", B = {
  brand: "#8B9E4B",
  success: "#5B8A3C",
  danger: "#CC3300",
  info: "#4A7FA5"
}, $ = {
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
}, X = { name: D, tokens: $, swatches: B, styles: I }, j = "Blueprint", S = {
  brand: "#1B3A6B",
  success: "#1A6B3A",
  danger: "#C0392B",
  info: "#2456A4"
}, Y = {
  // ── Brand — Prussian Blue ──────────────────────────────────────────────────
  // The ferric cyanide blue of the original cyanotype blueprint process.
  // Not navy (#000080), not cobalt (#0047AB), not royal (#4169E1) —
  // #1B3A6B is the precise hue of a ferric cyanide annotation on sensitised linen.
  "--zyna": "#1B3A6B",
  "--zyna-dark": "#0D1F3C",
  // deep prussian — the shadow side of a folded linen drawing
  // ── Status colors — ISO drawing annotation palette ─────────────────────────
  // Reference: engineering inspection and revision marking conventions.
  // Green  = "within tolerance" — dimensional inspection PASS mark
  // Red    = "rejected / non-conformance" — out-of-tolerance rejection mark
  // Amber  = "reference dimension" — informational, not a controlled tolerance
  // Info   = medium prussian — standard annotation/reference callout colour
  "--zp-success": "#1A6B3A",
  // inspection pass — tolerance green
  "--zp-danger": "#C0392B",
  // rejection red — non-conformance mark
  "--zp-warning": "#A06800",
  // reference amber — informational dimension
  "--zp-info": "#2456A4",
  // annotation blue — standard callout
  // ── Text — prussian drafting ink ──────────────────────────────────────────
  "--zp-text": "#0D1B33",
  // deep prussian — ISO standard annotation ink
  "--z-color-text-inverse": "#EDF2FA",
  // drafting vellum on solid prussian buttons
  // ── Light page surfaces — drawing vellum ──────────────────────────────────
  // ISO 216 drafting paper: not pure white but slightly cool blue-white —
  // the natural tint of high-quality technical drafting vellum under overhead light.
  "--z-surface-page": "#EDF2FA",
  // drafting vellum
  "--z-surface-inset": "#E0E8F5",
  // inset — slightly deeper
  "--z-surface-inset-hover": "#D4DFEF",
  "--z-surface-inset-danger": "#F5E8E8",
  "--z-surface-inset-danger-hover": "#EDD9D9",
  "--z-surface-card": "linear-gradient(160deg, #FFFFFF 0%, #F4F8FE 100%)",
  "--z-surface-card-deep": "linear-gradient(160deg, #EDF2FA 0%, #E4EDF7 100%)",
  // ── Borders & overlays — prussian-tinted ──────────────────────────────────
  "--z-color-border": "rgba(27,58,107,0.12)",
  "--z-color-border-dim": "rgba(27,58,107,0.06)",
  "--z-color-overlay": "rgba(27,58,107,0.03)",
  // ── Shadows — paper-on-light-table lift ───────────────────────────────────
  // Drawings on a light table cast crisp, constrained shadows — not diffuse bloom.
  // The slight prussian tint in the diffuse layer reflects ambient vellum scatter.
  "--z-shadow-card": "0 1px 0 rgba(0,0,0,0.09), 0 4px 12px rgba(27,58,107,0.06), 0 1px 3px rgba(0,0,0,0.05)",
  "--z-shadow-card-deep": "0 2px 0 rgba(0,0,0,0.11), 0 8px 24px rgba(27,58,107,0.08), 0 2px 6px rgba(0,0,0,0.06)",
  // ── Docs chrome — drafting vellum palette ─────────────────────────────────
  "--bg": "#EDF2FA",
  "--bg2": "#E1E9F5",
  // sidebar
  "--bg3": "#D4DFEF",
  // hover / active states
  "--border": "rgba(27,58,107,0.13)",
  "--border2": "rgba(27,58,107,0.07)",
  "--text": "#0D1B33",
  "--text2": "#3A5580",
  "--text3": "#7A96B8",
  "--topbar-bg": "rgba(237,242,250,0.93)",
  "--z-panel-bg": "#E1E9F5",
  "--z-panel-shadow": "0 8px 24px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
  // ── Font — DM Mono: precision engineering notation ─────────────────────────
  // DM Mono's geometric axis reads as technical annotation lettering.
  // Chosen over Courier (typewriter), VT323 (CRT civilian), Share Tech (military comms).
  "--z-font-mono": "'DM Mono', 'Courier New', monospace",
  // ── Motion — CONSTANT VELOCITY (linear) ───────────────────────────────────
  // A drafting arm, T-square, or CMM probe moves at constant velocity.
  // No acceleration into position, no deceleration before stop.
  // This is the ONLY genre in ZynaUI using linear() for interactive transitions.
  // Reference: pantograph, optical comparator carriage, coordinate measuring machine.
  "--z-duration-fast": "0.16s",
  "--z-duration-base": "0.22s",
  "--z-duration-slow": "0.30s",
  "--z-duration-pulse": "4.5s",
  "--z-ease-enter": "linear",
  "--z-ease-exit": "linear",
  // Spring: a precision instrument finds its rest position with a micro-settle.
  // cubic-bezier over 1 by 0.02 = barely-perceptible overshoot then lock.
  "--z-ease-spring": "cubic-bezier(0.34, 1.02, 0.64, 1)"
}, M = {
  // ── Pen plotter sweep keyframe ─────────────────────────────────────────────
  // Simulates an HP 7475A pen plotter head traversing the drawing surface.
  // The ONLY left-to-right (horizontal) sweep animation in ZynaUI.
  // The ONLY sweep animation on a LIGHT background.
  "@keyframes schematic-plotter": {
    "0%": { transform: "translateX(-4px)" },
    "100%": { transform: "translateX(100vw)" }
  },
  // ── Structural overrides — scoped to html[data-genre="blueprint"] ──────────
  // Specificity [0,1,1] beats ops defaults on html [0,0,1].
  'html[data-genre="blueprint"]': {
    "color-scheme": "light",
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
    "--z-btn-clip": "polygon(0 0, calc(100% - var(--btn-corner)) 0, calc(100% - var(--btn-corner)) var(--btn-corner), 100% var(--btn-corner), 100% 100%, 0 100%)",
    "--z-btn-inner-clip": "polygon(1px 1px, calc(100% - var(--btn-corner) - 1px) 1px, calc(100% - var(--btn-corner) - 1px) calc(var(--btn-corner) + 1px), calc(100% - 1px) calc(var(--btn-corner) + 1px), calc(100% - 1px) calc(100% - 1px), 1px calc(100% - 1px))",
    "--z-btn-corner": "10px",
    "--z-btn-active-scale": "0.97",
    "--z-btn-scan-stop": "40%",
    // precision fill — restrained, like a CMM readout
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
    "--z-badge-clip": "polygon(0 0, calc(50% - 5px) 0, 50% 5px, calc(50% + 5px) 0, 100% 0, 100% 100%, 0 100%)",
    "--z-badge-radius": "0",
    "--z-badge-padding": "0.38rem 0.80rem 0.22rem 0.80rem",
    // extra top to clear the 5 px notch
    "--z-badge-letter-spacing": "0.09em",
    "--z-badge-inset-shadow": "inset 0 0 0 1px currentColor",
    "--z-badge-scan-duration": "8s",
    "--z-badge-inner-clip": "polygon(1px 1px, calc(50% - 4px) 1px, 50% 4px, calc(50% + 4px) 1px, calc(100% - 1px) 1px, calc(100% - 1px) calc(100% - 1px), 1px calc(100% - 1px))",
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
    "--z-alert-radius": "3px",
    // all corners rounded — bar floats inside, not flush
    "--z-alert-bar-width": "2px",
    // hairline witness line — ISO thin-line standard
    "--z-alert-prefix": '"⊗ "',
    // circled times: into-page vector / reference terminus
    "--z-alert-bg-opacity": "5%",
    "--z-alert-border": "1px solid rgba(27,58,107,0.08)",
    "--z-alert-prefix-opacity": "0.40",
    "--z-alert-bar-glow": "none",
    // light surface — no bloom
    "--z-alert-texture": "none",
    "--z-alert-padding-top": "0.875rem",
    "--z-alert-padding-left": "calc(1.25rem + var(--z-alert-bar-width))",
    "--z-alert-bar-inset": "15% auto 15% 0",
    // witness line: 15 % inset top + bottom
    "--z-alert-bar-w": "var(--z-alert-bar-width)",
    "--z-alert-bar-h": "auto",
    // top:15% + bottom:15% = 70 % height, centered
    "--z-alert-bar-radius": "1px",
    // clean line terminus
    // ── Card — precision data sheet ───────────────────────────────────────────
    "--z-card-clip": "none",
    "--z-card-filter": "none",
    // Ruled schedule lines — a blank engineering parts list or schedule table.
    // Horizontal rules at 18 px simulate the pre-printed ruling on an engineering
    // form or inspection schedule, ready for annotation.
    "--z-card-texture": "repeating-linear-gradient(0deg, rgba(27,58,107,0.022) 0px, rgba(27,58,107,0.022) 1px, transparent 1px, transparent 18px)",
    "--z-card-gradient": "var(--z-surface-card)",
    "--z-card-border-color": "rgba(27,58,107,0.09)",
    "--z-card-shadow": "var(--z-shadow-card)",
    // Corner registration marks — heavier than Ops, reads as print/CAD registration.
    // Drawing sheets use L-shaped corner marks for sheet alignment in reproduction.
    "--z-card-bracket-color": "color-mix(in oklch, var(--zyna) 50%, transparent)",
    "--z-card-bracket-size": "20px",
    "--z-card-bracket-stroke": "2px",
    // Title block top rule — SOLID, full-width.
    // Every ISO drawing sheet has a solid top border on the title block.
    // No gradient fade: drawings have hard edges, not soft ones.
    "--z-card-bar-height": "2px",
    "--z-card-bar-bg": "var(--zyna)",
    // solid rule — ISO line standard
    "--z-card-bar-shadow": "none",
    // Header: precise annotation band — like a printed drawing title block header
    "--z-card-header-bg": "rgba(27,58,107,0.04)",
    "--z-card-header-border": "rgba(27,58,107,0.10)",
    "--z-card-header-color": "var(--zyna)",
    "--z-card-header-letter-spacing": "0.10em",
    "--z-card-header-text-shadow": "none",
    "--z-card-header-dot-size": "5px",
    "--z-card-header-dot-bg": "var(--zyna)",
    // CMM position indicator: a precise, tight shadow — not a neon bloom.
    // Simulates the target dot on a coordinate measuring machine probe display.
    "--z-card-header-dot-shadow": "0 0 4px color-mix(in oklch, var(--zyna) 55%, transparent)",
    // Linear pulse: CMM cursor blinks at constant rate — no ease-in-out.
    "--z-card-header-dot-animation": "zyna-pulse-ring var(--z-duration-pulse) linear infinite",
    "--z-card-title-text-shadow": "none",
    "--z-card-glow-duration": "7s",
    // Barely-perceptible prussian field on light card surface
    "--z-card-default-glow-lo": "rgba(27,58,107,0.025)",
    "--z-card-default-glow-hi": "rgba(27,58,107,0.065)",
    // ── Docs chrome ───────────────────────────────────────────────────────────
    "--z-topbar-border": "rgba(27,58,107,0.09)",
    "--z-topbar-glow": "none",
    // DOUBLE WITNESS LINE sidebar indicator — two 2 px prussian lines with a 2 px gap.
    // Reference: the pair of extension/witness lines used in ISO 128 dimension callouts.
    // Built from three stacked inset box-shadows:
    //   shadow 1 (front) — 2 px prussian line at edge
    //   shadow 2         — 2 px gap (paints var(--bg) over the area between lines)
    //   shadow 3 (back)  — 6 px prussian behind, visible only in the 4–6 px band
    // Net result: 2 px prussian | 2 px gap | 2 px faint prussian — a dimension tick pair.
    // Never implemented in any design system or UI component library.
    "--z-sidebar-active-shadow": "inset 2px 0 0 var(--zyna), inset 4px 0 0 var(--bg), inset 6px 0 0 color-mix(in oklch, var(--zyna) 40%, transparent)"
  },
  // ── Badge color overrides — prussian annotation variants ─────────────────
  // Blueprint badges: faint tinted fill + solid 1 px border via inset shadow.
  // No glows — this is a light drafting surface, not a neon display.
  ':where(html[data-genre="blueprint"]) :where(.badge-primary)': {
    "--badge-bg": "color-mix(in oklch, var(--zyna) 7%, transparent)",
    "--badge-glow": "none"
  },
  ':where(html[data-genre="blueprint"]) :where(.badge-success)': {
    "--badge-bg": "color-mix(in oklch, var(--z-color-success) 7%, transparent)",
    "--badge-glow": "none"
  },
  ':where(html[data-genre="blueprint"]) :where(.badge-danger)': {
    "--badge-bg": "color-mix(in oklch, var(--z-color-danger) 7%, transparent)",
    "--badge-glow": "none"
  },
  ':where(html[data-genre="blueprint"]) :where(.badge-warning)': {
    "--badge-bg": "color-mix(in oklch, var(--z-color-warning) 7%, transparent)",
    "--badge-glow": "none"
  },
  ':where(html[data-genre="blueprint"]) :where(.badge-info)': {
    "--badge-bg": "color-mix(in oklch, var(--z-color-info) 7%, transparent)",
    "--badge-glow": "none"
  },
  ':where(html[data-genre="blueprint"]) :where(.badge-secondary)': {
    "--badge-bg": "color-mix(in oklch, var(--zyna) 5%, transparent)",
    "--badge-glow": "none"
  },
  // ── Polygon badge shape fixes (slant, bevel) on light surface ─────────────
  // Polygon shapes can't use box-shadow: inset for a border — the rectangular
  // shadow cuts abruptly at diagonal corners. Use the inner-clip border model:
  //   outer = border color (currentColor), ::before fill = page background.
  // Same technique as Corporate — required for all light-mode genres.
  ':where(html[data-genre="blueprint"]) :where(.badge-slant)': {
    "--z-badge-inset-shadow": "none",
    "--badge-bg": "currentColor",
    "--badge-interior": "var(--z-surface-page)",
    "--badge-inner-clip": "polygon(calc(var(--badge-offset) + 1px) 1px, calc(100% - 1px) 1px, calc(100% - calc(var(--badge-offset) + 1px)) calc(100% - 1px), 1px calc(100% - 1px))"
  },
  ':where(html[data-genre="blueprint"]) :where(.badge-bevel)': {
    "--z-badge-inset-shadow": "none",
    "--badge-bg": "currentColor",
    "--badge-interior": "var(--z-surface-page)",
    "--badge-inner-clip": "polygon(calc(var(--badge-offset) + 1px) 1px, calc(100% - calc(var(--badge-offset) + 1px)) 1px, calc(100% - 1px) calc(var(--badge-offset) + 1px), calc(100% - 1px) calc(100% - calc(var(--badge-offset) + 1px)), calc(100% - calc(var(--badge-offset) + 1px)) calc(100% - 1px), calc(var(--badge-offset) + 1px) calc(100% - 1px), 1px calc(100% - calc(var(--badge-offset) + 1px)), 1px calc(var(--badge-offset) + 1px))"
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
    position: "fixed",
    inset: "0",
    zIndex: "0",
    pointerEvents: "none",
    backgroundImage: [
      // Minor grid horizontal — 5 px pitch
      "repeating-linear-gradient(rgba(27,58,107,0.020) 0 1px, transparent 1px 100%)",
      // Minor grid vertical — 5 px pitch
      "repeating-linear-gradient(90deg, rgba(27,58,107,0.020) 0 1px, transparent 1px 100%)",
      // Major grid horizontal — 25 px pitch (5× minor)
      "repeating-linear-gradient(rgba(27,58,107,0.052) 0 1px, transparent 1px 100%)",
      // Major grid vertical — 25 px pitch
      "repeating-linear-gradient(90deg, rgba(27,58,107,0.052) 0 1px, transparent 1px 100%)"
    ].join(", "),
    backgroundSize: "5px 5px, 5px 5px, 25px 25px, 25px 25px"
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
    position: "fixed",
    top: "0",
    left: "0",
    width: "3px",
    height: "100%",
    zIndex: "0",
    pointerEvents: "none",
    background: "linear-gradient(to bottom, transparent 0%, rgba(27,58,107,0.03) 20%, rgba(27,58,107,0.06) 50%, rgba(27,58,107,0.03) 80%, transparent 100%)",
    transform: "translateX(-4px)",
    animation: "schematic-plotter 14s linear infinite"
  },
  // ── prefers-reduced-motion — plotter sweep stops ───────────────────────────
  "@media (prefers-reduced-motion: reduce)": {
    ':where(html[data-genre="blueprint"]) body::after': { animation: "none" }
  }
}, N = { name: j, tokens: Y, swatches: S, styles: M }, G = "Washi", P = {
  brand: "#C93C23",
  success: "#2D6B3C",
  danger: "#9B1A0A",
  info: "#3A6B8A"
}, O = {
  // ── Brand — Shu-iro (朱色) cinnabar vermilion ──────────────────────────────
  // The precise pigment colour of cinnabar (mercury sulfide / HgS) as used in
  // Japanese torii gate lacquer, hanko seal ink, and temple architectural paint.
  // Not orange-red (#FF4500), not western red (#FF0000), not Chinese lacquer red
  // (#D02020) — this is the warm orange-leaning vermilion of authentic shu-iro:
  // #C93C23. The exact value of Tōrii Vermilion, Pantone 7597 C.
  "--zyna": "#C93C23",
  "--zyna-dark": "#8B2210",
  // deep lacquer — dried cinnabar on aged wood
  // ── Status colors — Japanese natural dye vocabulary ───────────────────────
  // Japanese traditional dyes (Nihon no dentō-shoku) map perfectly to semantic states:
  // Success: 常盤色 (tokiwa-iro) — evergreen pine, denotes permanence and good fortune
  // Danger:  茜色  (akane-iro)  — madder root deep crimson, the colour of urgency in court
  // Warning: 山吹色 (yamabuki-iro) — golden kerria rose, the colour of a cautionary gift
  // Info:    納戸色 (nando-iro)  — indigo storage-room blue, calm and measured
  "--zp-success": "#2D6B3C",
  // tokiwa-iro — evergreen pine
  "--zp-danger": "#9B1A0A",
  // akane-iro  — madder crimson
  "--zp-warning": "#B07A00",
  // yamabuki-iro — golden kerria
  "--zp-info": "#3A6B8A",
  // nando-iro  — indigo storage blue
  // ── Text — sumi ink ───────────────────────────────────────────────────────
  // Sumi (墨) ink is not pure black — it carries a distinct warm brown-black tone
  // from the pine soot and animal glue it is made from. Under magnification it
  // appears warm sepia against the washi fiber background.
  // #2A1A0E is the precise observed color of freshly dried sumi on washi.
  "--zp-text": "#2A1A0E",
  // sumi ink — not neutral black, not cool graphite
  "--z-color-text-inverse": "#F7F0E6",
  // washi cream on cinnabar buttons
  // ── Light page surfaces — kozo washi ──────────────────────────────────────
  // Genuine handmade kozo (楮) washi paper is not white — it is a warm cream
  // with a perceptible golden undertone from the natural bast fibers.
  // #F7F0E6 is the measured color of new, unaged kozo washi from Echizen, Fukui.
  // Warmer than Corporate's ivory (#F5F4F0), cooler than aged parchment (#F5E7C7).
  "--z-surface-page": "#F7F0E6",
  // kozo washi — natural fiber cream
  "--z-surface-inset": "#EDE4D5",
  // deeper warm for inset fields
  "--z-surface-inset-hover": "#E4D7C3",
  "--z-surface-inset-danger": "#F5E4E0",
  "--z-surface-inset-danger-hover": "#EDD5CF",
  "--z-surface-card": "linear-gradient(160deg, #FDFAF6 0%, #F7F0E6 100%)",
  "--z-surface-card-deep": "linear-gradient(160deg, #F0E8DA 0%, #E9DFD0 100%)",
  // ── Borders & overlays — sumi-tinted ──────────────────────────────────────
  "--z-color-border": "rgba(42,26,14,0.11)",
  "--z-color-border-dim": "rgba(42,26,14,0.055)",
  "--z-color-overlay": "rgba(42,26,14,0.03)",
  // ── Shadows — warm afternoon light on paper ────────────────────────────────
  // Paper on a wooden desk under soft window light casts warm-toned shadows.
  // The sumi tint in the diffuse layer simulates reflected ambient paper warmth.
  "--z-shadow-card": "0 1px 2px rgba(42,26,14,0.09), 0 4px 14px rgba(42,26,14,0.06)",
  "--z-shadow-card-deep": "0 2px 4px rgba(42,26,14,0.11), 0 8px 28px rgba(42,26,14,0.08)",
  // ── Docs chrome — warm washi palette ──────────────────────────────────────
  "--bg": "#F7F0E6",
  "--bg2": "#EDE4D5",
  // sidebar
  "--bg3": "#E4D7C3",
  // hover / active
  "--border": "rgba(42,26,14,0.11)",
  "--border2": "rgba(42,26,14,0.06)",
  "--text": "#2A1A0E",
  "--text2": "#6B4D35",
  "--text3": "#A07E66",
  "--topbar-bg": "rgba(247,240,230,0.93)",
  "--z-panel-bg": "#EDE4D5",
  "--z-panel-shadow": "0 8px 24px rgba(42,26,14,0.09), 0 2px 6px rgba(42,26,14,0.05)",
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
  "--z-duration-fast": "0.17s",
  "--z-duration-base": "0.24s",
  "--z-duration-slow": "0.34s",
  "--z-duration-pulse": "5s",
  // hanko seal pulse — slow, ceremonial
  "--z-ease-enter": "cubic-bezier(0.06, 0.92, 0.16, 1)",
  // nyū-hō: brush strikes paper
  "--z-ease-exit": "cubic-bezier(0.70, 0, 0.94, 0.42)",
  // shū-hō: brush lifts away
  "--z-ease-spring": "cubic-bezier(0.22, 1.35, 0.36, 1)"
  // shimi: ink bleed + settle
}, T = {
  // ── Diagonal brushstroke sweep keyframe ───────────────────────────────────
  // The sweep element is rotated -12° and translates left-to-right.
  // Because it is much taller than the viewport and tilted, its leading edge
  // draws a diagonal line across the page at calligraphic angle.
  // translateX(calc(100vw + 400px)) ensures the element fully exits the viewport.
  "@keyframes brushwork-sweep": {
    "0%": { transform: "rotate(-12deg) translateX(-400px)" },
    "100%": { transform: "rotate(-12deg) translateX(calc(100vw + 400px))" }
  },
  // ── Structural overrides — scoped to html[data-genre="washi"] ─────────────
  // Specificity [0,1,1] beats ops defaults on html [0,0,1].
  'html[data-genre="washi"]': {
    "color-scheme": "light",
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
    "--z-btn-clip": "polygon(var(--btn-corner) 0, 100% 0, 100% 100%, 0 100%, 0 var(--btn-corner))",
    "--z-btn-inner-clip": "polygon(calc(var(--btn-corner) + 1px) 1px, calc(100% - 1px) 1px, calc(100% - 1px) calc(100% - 1px), 1px calc(100% - 1px), 1px calc(var(--btn-corner) + 1px))",
    "--z-btn-corner": "11px",
    "--z-btn-active-scale": "0.97",
    "--z-btn-scan-stop": "45%",
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
    "--z-badge-clip": "polygon(0 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%)",
    "--z-badge-radius": "0",
    "--z-badge-padding": "0.20rem 0.78rem",
    "--z-badge-letter-spacing": "0.09em",
    "--z-badge-inset-shadow": "inset 0 0 0 1px currentColor",
    "--z-badge-scan-duration": "7s",
    // hanko seal rhythm — slow deliberate pass
    "--z-badge-inner-clip": "polygon(1px 1px, calc(100% - 1px) 1px, calc(100% - 1px) calc(100% - 8px), calc(100% - 8px) calc(100% - 1px), 1px calc(100% - 1px))",
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
    "--z-alert-radius": "0 3px 3px 0",
    "--z-alert-bar-width": "3px",
    "--z-alert-prefix": '"「 "',
    // kagikakko: Japanese opening corner bracket
    "--z-alert-bg-opacity": "5%",
    "--z-alert-border": "1px solid rgba(42,26,14,0.07)",
    "--z-alert-prefix-opacity": "0.42",
    "--z-alert-bar-glow": "none",
    // no electric glow — ink on paper
    // Shimi texture: ink bleeds from the left bar into the paper.
    // linear-gradient from bar colour at 10% opacity at the left edge, fading to
    // transparent at 16 px — exactly the spread radius of sumi on kozo washi.
    "--z-alert-texture": "linear-gradient(to right, color-mix(in oklch, var(--alert-bar-color) 10%, transparent) 0px, transparent 16px)",
    "--z-alert-padding-top": "0.875rem",
    "--z-alert-padding-left": "calc(1.25rem + var(--z-alert-bar-width))",
    "--z-alert-bar-inset": "0 auto 0 0",
    // standard left bar
    "--z-alert-bar-w": "var(--z-alert-bar-width)",
    "--z-alert-bar-h": "auto",
    "--z-alert-bar-radius": "0",
    // ── Card — washi data sheet with sashiko texture ───────────────────────────
    "--z-card-clip": "none",
    "--z-card-filter": "none",
    // Sashiko diamond stitch (hishi-moyō 菱模様) — the simplest sashiko pattern.
    // Two 45° crossing gradient layers form a diamond grid at 12 px pitch.
    // At 1.8% opacity each, the combined pattern barely registers on cream paper
    // but adds a tactile depth that reads as handcrafted rather than printed.
    // No design system has rendered Japanese textile stitching as a card texture.
    "--z-card-texture": [
      "repeating-linear-gradient(45deg, rgba(201,60,35,0.018) 0px, rgba(201,60,35,0.018) 1px, transparent 1px, transparent 12px)",
      "repeating-linear-gradient(-45deg, rgba(201,60,35,0.018) 0px, rgba(201,60,35,0.018) 1px, transparent 1px, transparent 12px)"
    ].join(", "),
    "--z-card-gradient": "var(--z-surface-card)",
    "--z-card-border-color": "rgba(42,26,14,0.09)",
    "--z-card-shadow": "var(--z-shadow-card)",
    // Brackets visible but subtle — like the light pencil guidelines a calligrapher
    // draws before laying down ink, barely visible beneath the finished work.
    "--z-card-bracket-color": "color-mix(in oklch, var(--zyna) 30%, transparent)",
    "--z-card-bracket-size": "16px",
    "--z-card-bracket-stroke": "1px",
    // Tapered brushstroke top rule:
    // Heavy at the left where the brush presses down on entry (nyū-hō),
    // fades to transparent at the right where the brush runs dry (枯れ, kare).
    // 3 px height — the width of a single brush stroke at standard writing size.
    "--z-card-bar-height": "3px",
    "--z-card-bar-bg": "linear-gradient(90deg, var(--zyna) 0%, color-mix(in oklch, var(--zyna) 70%, transparent) 35%, color-mix(in oklch, var(--zyna) 20%, transparent) 65%, transparent 100%)",
    "--z-card-bar-shadow": "none",
    // Header: warm cinnabar-washed band — like a printed title area on a tanzaku
    "--z-card-header-bg": "rgba(201,60,35,0.05)",
    "--z-card-header-border": "rgba(42,26,14,0.09)",
    "--z-card-header-color": "var(--zyna)",
    "--z-card-header-letter-spacing": "0.11em",
    "--z-card-header-text-shadow": "none",
    "--z-card-header-dot-size": "5px",
    "--z-card-header-dot-bg": "var(--zyna)",
    // Hanko seal impression — no glow, just ink on paper
    "--z-card-header-dot-shadow": "none",
    "--z-card-header-dot-animation": "none",
    // static — a seal mark is fixed
    "--z-card-title-text-shadow": "none",
    "--z-card-glow-duration": "5s",
    // Barely-perceptible cinnabar warmth on cream surface
    "--z-card-default-glow-lo": "rgba(201,60,35,0.022)",
    "--z-card-default-glow-hi": "rgba(201,60,35,0.06)",
    // ── Docs chrome ───────────────────────────────────────────────────────────
    "--z-topbar-border": "rgba(42,26,14,0.08)",
    "--z-topbar-glow": "none",
    // 4 px cinnabar brush stroke — the width of a single calligraphy stroke at
    // reading scale. One mark. No double lines, no glow. Complete and contained.
    "--z-sidebar-active-shadow": "inset 4px 0 0 var(--zyna)"
  },
  // ── Badge color overrides — natural dye variants ────────────────────────────
  // Washi badges carry very faint dye-tinted fills — the opacity of a diluted
  // ink wash rather than solid pigment. Like watercolour on kozo paper.
  // No glows — sunlight on paper does not bloom; it reveals.
  ':where(html[data-genre="washi"]) :where(.badge-primary)': {
    "--badge-bg": "color-mix(in oklch, var(--zyna) 8%, transparent)",
    "--badge-glow": "none"
  },
  ':where(html[data-genre="washi"]) :where(.badge-success)': {
    "--badge-bg": "color-mix(in oklch, var(--z-color-success) 8%, transparent)",
    "--badge-glow": "none"
  },
  ':where(html[data-genre="washi"]) :where(.badge-danger)': {
    "--badge-bg": "color-mix(in oklch, var(--z-color-danger) 7%, transparent)",
    "--badge-glow": "none"
  },
  ':where(html[data-genre="washi"]) :where(.badge-warning)': {
    "--badge-bg": "color-mix(in oklch, var(--z-color-warning) 7%, transparent)",
    "--badge-glow": "none"
  },
  ':where(html[data-genre="washi"]) :where(.badge-info)': {
    "--badge-bg": "color-mix(in oklch, var(--z-color-info) 7%, transparent)",
    "--badge-glow": "none"
  },
  ':where(html[data-genre="washi"]) :where(.badge-secondary)': {
    "--badge-bg": "color-mix(in oklch, var(--zyna) 5%, transparent)",
    "--badge-glow": "none"
  },
  // ── Polygon badge shape fixes (slant, bevel) on warm cream surface ─────────
  // Polygon clip-paths cannot use inset box-shadow for a border — the rectangular
  // shadow cuts abruptly at diagonal corners. Use the inner-clip border model
  // with --z-surface-page as the interior fill. Same technique as Corporate.
  ':where(html[data-genre="washi"]) :where(.badge-slant)': {
    "--z-badge-inset-shadow": "none",
    "--badge-bg": "currentColor",
    "--badge-interior": "var(--z-surface-page)",
    "--badge-inner-clip": "polygon(calc(var(--badge-offset) + 1px) 1px, calc(100% - 1px) 1px, calc(100% - calc(var(--badge-offset) + 1px)) calc(100% - 1px), 1px calc(100% - 1px))"
  },
  ':where(html[data-genre="washi"]) :where(.badge-bevel)': {
    "--z-badge-inset-shadow": "none",
    "--badge-bg": "currentColor",
    "--badge-interior": "var(--z-surface-page)",
    "--badge-inner-clip": "polygon(calc(var(--badge-offset) + 1px) 1px, calc(100% - calc(var(--badge-offset) + 1px)) 1px, calc(100% - 1px) calc(var(--badge-offset) + 1px), calc(100% - 1px) calc(100% - calc(var(--badge-offset) + 1px)), calc(100% - calc(var(--badge-offset) + 1px)) calc(100% - 1px), calc(var(--badge-offset) + 1px) calc(100% - 1px), 1px calc(100% - calc(var(--badge-offset) + 1px)), 1px calc(var(--badge-offset) + 1px))"
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
    position: "fixed",
    inset: "0",
    zIndex: "0",
    pointerEvents: "none",
    backgroundImage: [
      // Primary kozo fibers — 8° clockwise lean, 22 px pitch
      "repeating-linear-gradient(8deg, rgba(42,26,14,0.025) 0px, rgba(42,26,14,0.025) 1px, transparent 1px, transparent 22px)",
      // Cross fibers — −5° counter-clockwise lean, 28 px pitch
      "repeating-linear-gradient(-5deg, rgba(42,26,14,0.020) 0px, rgba(42,26,14,0.020) 1px, transparent 1px, transparent 28px)",
      // Laid fibers — 83° near-horizontal (mould grid), 16 px pitch
      "repeating-linear-gradient(83deg, rgba(42,26,14,0.015) 0px, rgba(42,26,14,0.015) 1px, transparent 1px, transparent 16px)"
    ].join(", ")
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
    position: "fixed",
    top: "-50vh",
    left: "0",
    width: "12px",
    height: "200vh",
    zIndex: "0",
    pointerEvents: "none",
    background: "linear-gradient(to right, transparent 0%, rgba(201,60,35,0.022) 20%, rgba(201,60,35,0.055) 50%, rgba(201,60,35,0.022) 80%, transparent 100%)",
    transformOrigin: "center center",
    transform: "rotate(-12deg) translateX(-400px)",
    animation: "brushwork-sweep 18s linear infinite"
  },
  // ── prefers-reduced-motion — brushstroke sweep stops ──────────────────────
  "@media (prefers-reduced-motion: reduce)": {
    ':where(html[data-genre="washi"]) body::after': { animation: "none" }
  }
}, L = { name: G, tokens: O, swatches: P, styles: T }, R = "Laboratory", V = {
  brand: "#0090B0",
  success: "#1A7A4A",
  danger: "#C42B1A",
  info: "#007A96"
}, W = {
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
  "--zyna": "#0090B0",
  "--zyna-dark": "#006B84",
  // deep cobalt titanate — UV filter glass dense
  // ── Status colors — laboratory chemistry indicator vocabulary ──────────────
  // Each color maps to the observable colour of a standard bench reagent:
  //   Success: bromothymol blue (BTB) at neutral/basic pH — green at pH 7–7.6
  //   Danger:  litmus in acid solution — crimson at pH < 5
  //   Warning: potassium dichromate K₂Cr₂O₇ at standard concentration — amber
  //   Info:    cobalt titanate reference — mid-teal, darker than brand
  "--zp-success": "#1A7A4A",
  // BTB indicator green — neutral/basic
  "--zp-danger": "#C42B1A",
  // litmus acid red
  "--zp-warning": "#B87200",
  // K₂Cr₂O₇ amber
  "--zp-info": "#007A96",
  // cobalt titanate deep teal
  // ── Text — cool dark teal-black ───────────────────────────────────────────
  // India ink in a teal-lit environment appears as a very dark teal-black.
  // #0C1E24 = darkest readable tone on the teal-white surface, with enough
  // teal undertone to read as part of the same palette.
  "--zp-text": "#0C1E24",
  "--z-color-text-inverse": "#EDFAFC",
  // teal-white on cobalt titanate buttons
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
  "--z-surface-page": "#EDFAFC",
  "--z-surface-inset": "#D4EFF5",
  "--z-surface-inset-hover": "#BEE4EE",
  "--z-surface-inset-danger": "#F5E8EB",
  "--z-surface-inset-danger-hover": "#EDD4DA",
  "--z-surface-card": "linear-gradient(160deg, #F5FCFD 0%, #EDFAFC 100%)",
  "--z-surface-card-deep": "linear-gradient(160deg, #D4EFF5 0%, #BEE4EE 100%)",
  // ── Borders & overlays — teal-tinted ──────────────────────────────────────
  "--z-color-border": "rgba(12,30,36,0.10)",
  "--z-color-border-dim": "rgba(12,30,36,0.05)",
  "--z-color-overlay": "rgba(12,30,36,0.025)",
  // ── Shadows — diffuse teal-cool ────────────────────────────────────────────
  "--z-shadow-card": "0 1px 2px rgba(12,30,36,0.08), 0 4px 14px rgba(12,30,36,0.05)",
  "--z-shadow-card-deep": "0 2px 4px rgba(12,30,36,0.10), 0 8px 28px rgba(12,30,36,0.06)",
  // ── Docs chrome — teal clinical palette ───────────────────────────────────
  // The sidebar and hover states carry a clearly visible teal tint — immediately
  // distinguishable from Corporate's warm grey (#EDEAE3) and Blueprint's
  // grey-blue (#E1E9F5). The teal chrome reads as "instrument panel" not "document."
  "--bg": "#EDFAFC",
  "--bg2": "#CBE9F3",
  // clearly teal sidebar — no ambiguity with Blueprint
  "--bg3": "#B5DCEC",
  "--border": "rgba(12,30,36,0.10)",
  "--border2": "rgba(12,30,36,0.05)",
  "--text": "#0C1E24",
  "--text2": "#1A5C70",
  // dark teal secondary text
  "--text3": "#4A8899",
  // medium teal tertiary
  "--topbar-bg": "rgba(237,250,252,0.93)",
  "--z-panel-bg": "#CBE9F3",
  "--z-panel-shadow": "0 8px 24px rgba(12,30,36,0.07), 0 2px 6px rgba(12,30,36,0.04)",
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
  "--z-duration-fast": "0.11s",
  // fastest in ZynaUI — instrument response
  "--z-duration-base": "0.18s",
  // fastest base in ZynaUI
  "--z-duration-slow": "0.28s",
  "--z-duration-pulse": "3.5s",
  // instrument polling pulse
  "--z-ease-enter": "cubic-bezier(0.22, 1.58, 0.44, 1)",
  // galvanometer snap-to reading
  "--z-ease-exit": "cubic-bezier(0.40, 0, 1.00, 1)",
  // crisp instrument release
  "--z-ease-spring": "cubic-bezier(0.18, 1.85, 0.38, 1)"
  // under-damped transient + settle
}, q = {
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
  "@keyframes labbook-scan": {
    "0%": { transform: "translateX(-4px)", opacity: "1" },
    "85%": { transform: "translateX(calc(100vw + 4px))", opacity: "1" },
    "85.001%": { transform: "translateX(-4px)", opacity: "0" },
    "94%": { transform: "translateX(-4px)", opacity: "0" },
    "94.001%": { transform: "translateX(-4px)", opacity: "1" },
    "100%": { transform: "translateX(-4px)", opacity: "1" }
  },
  // ── Structural overrides scoped to html[data-genre="laboratory"] ───────────
  'html[data-genre="laboratory"]': {
    "color-scheme": "light",
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
    "--z-btn-clip": "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))",
    // Inner clip: match outer polygon inset by 1px on all edges.
    // Top edge: 1px down. Right/left straight edges: 1px in.
    // Bottom-right diagonal: corner point shifts +1px inward on both axes (so 10+1=11px).
    // Bottom-left diagonal: same shift.
    "--z-btn-inner-clip": "polygon(1px 1px, calc(100% - 1px) 1px, calc(100% - 1px) calc(100% - 11px), calc(100% - 11px) calc(100% - 1px), 11px calc(100% - 1px), 1px calc(100% - 11px))",
    "--z-btn-corner": "10px",
    "--z-btn-active-scale": "0.97",
    "--z-btn-scan-stop": "40%",
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
    "--z-badge-clip": "polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)",
    "--z-badge-radius": "0",
    "--z-badge-padding": "0.18rem 1.0rem 0.18rem 0.72rem",
    // extra right padding for arrow shoulder
    "--z-badge-letter-spacing": "0.07em",
    "--z-badge-inset-shadow": "inset 0 0 0 1px currentColor",
    "--z-badge-scan-duration": "5s",
    // Inner clip for badge in inner-clip border model (arrow shape, ~1px inset):
    // Top shoulder: 8+1=9px from right. Tip: ~2px from right edge (1px inset on diagonal).
    // Bottom shoulder: same as top. Left and bottom: 1px inset.
    "--z-badge-inner-clip": "polygon(1px 1px, calc(100% - 9px) 1px, calc(100% - 2px) 50%, calc(100% - 9px) calc(100% - 1px), 1px calc(100% - 1px))",
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
    "--z-alert-radius": "0 0 3px 3px",
    // top flush with bar; bottom corners rounded
    "--z-alert-bar-width": "0",
    // no left bar
    "--z-alert-prefix": '"∴ "',
    // therefore (U+2234) — scientific conclusion
    "--z-alert-bg-opacity": "5%",
    "--z-alert-border": "1px solid rgba(12,30,36,0.07)",
    "--z-alert-prefix-opacity": "0.36",
    "--z-alert-bar-glow": "none",
    "--z-alert-texture": "none",
    "--z-alert-padding-top": "calc(0.875rem + 3px)",
    // standard padding + bar height
    "--z-alert-padding-left": "1.25rem",
    // no bar-width offset
    "--z-alert-bar-inset": "0 0 auto 0",
    // TOP: top=0 right=0 bottom=auto left=0
    "--z-alert-bar-w": "auto",
    // left:0 + right:0 = full width
    "--z-alert-bar-h": "3px",
    // ruled line height
    "--z-alert-bar-radius": "0",
    // ── Card — vertical spectral lines + dual-beam bar ─────────────────────────
    "--z-card-clip": "none",
    "--z-card-filter": "none",
    // Fine vertical lines at 6 px pitch — spectrophotometric column spacing.
    // Pure 90° lines only (no horizontal component). Different from:
    //   Blueprint: horizontal rules at 18 px (perpendicular to Laboratory)
    //   Washi: ±45° sashiko diamond stitch (diagonal, different angle class)
    "--z-card-texture": "repeating-linear-gradient(90deg, rgba(0,144,176,0.042) 0px, rgba(0,144,176,0.042) 1px, transparent 1px, transparent 6px)",
    "--z-card-gradient": "var(--z-surface-card)",
    "--z-card-border-color": "rgba(12,30,36,0.08)",
    "--z-card-shadow": "var(--z-shadow-card)",
    "--z-card-bracket-color": "color-mix(in oklch, var(--zyna) 28%, transparent)",
    "--z-card-bracket-size": "14px",
    "--z-card-bracket-stroke": "1px",
    // Dual-beam spectrophotometer reference bar:
    //   Signal beam (top line):    1px solid cobalt at full intensity
    //   Gap:                       2px transparent (optical path separation)
    //   Reference beam (bottom):   1px cobalt at 42% intensity (reference = attenuated)
    // No other card bar in ZynaUI has two parallel lines. Height = 4px (1+2+1).
    "--z-card-bar-height": "4px",
    "--z-card-bar-bg": "linear-gradient(to bottom, var(--zyna) 0, var(--zyna) 1px, transparent 1px, transparent 3px, color-mix(in oklch, var(--zyna) 42%, transparent) 3px)",
    "--z-card-bar-shadow": "none",
    "--z-card-header-bg": "rgba(0,144,176,0.04)",
    "--z-card-header-border": "rgba(12,30,36,0.08)",
    "--z-card-header-color": "var(--zyna)",
    "--z-card-header-letter-spacing": "0.09em",
    "--z-card-header-text-shadow": "none",
    "--z-card-header-dot-size": "5px",
    "--z-card-header-dot-bg": "var(--zyna)",
    "--z-card-header-dot-shadow": "none",
    "--z-card-header-dot-animation": "none",
    "--z-card-title-text-shadow": "none",
    "--z-card-glow-duration": "3.5s",
    "--z-card-default-glow-lo": "rgba(0,144,176,0.018)",
    "--z-card-default-glow-hi": "rgba(0,144,176,0.048)",
    // ── Docs chrome ───────────────────────────────────────────────────────────
    "--z-topbar-border": "rgba(12,30,36,0.08)",
    "--z-topbar-glow": "none",
    "--z-sidebar-active-shadow": "inset 3px 0 0 var(--zyna)"
  },
  // ── Badge color overrides — reagent-tinted dilute washes ──────────────────
  // Very faint cobalt-tinted fills — the colour of a dilute aqueous reagent
  // solution at low molarity on white lab paper. No glows: fluorescent
  // overhead lighting does not produce bloom or phosphor afterglow.
  ':where(html[data-genre="laboratory"]) :where(.badge-primary)': {
    "--badge-bg": "color-mix(in oklch, var(--zyna) 8%, transparent)",
    "--badge-glow": "none"
  },
  ':where(html[data-genre="laboratory"]) :where(.badge-success)': {
    "--badge-bg": "color-mix(in oklch, var(--z-color-success) 8%, transparent)",
    "--badge-glow": "none"
  },
  ':where(html[data-genre="laboratory"]) :where(.badge-danger)': {
    "--badge-bg": "color-mix(in oklch, var(--z-color-danger) 7%, transparent)",
    "--badge-glow": "none"
  },
  ':where(html[data-genre="laboratory"]) :where(.badge-warning)': {
    "--badge-bg": "color-mix(in oklch, var(--z-color-warning) 7%, transparent)",
    "--badge-glow": "none"
  },
  ':where(html[data-genre="laboratory"]) :where(.badge-info)': {
    "--badge-bg": "color-mix(in oklch, var(--z-color-info) 7%, transparent)",
    "--badge-glow": "none"
  },
  ':where(html[data-genre="laboratory"]) :where(.badge-secondary)': {
    "--badge-bg": "color-mix(in oklch, var(--zyna) 5%, transparent)",
    "--badge-glow": "none"
  },
  // ── Polygon badge shape fixes on clinical white surface ───────────────────
  // clip-path polygon shapes cannot use inset box-shadow for a border — the
  // rectangular shadow clips abruptly at diagonal edges. Use the inner-clip
  // border model with --z-surface-page as the interior fill.
  ':where(html[data-genre="laboratory"]) :where(.badge-slant)': {
    "--z-badge-inset-shadow": "none",
    "--badge-bg": "currentColor",
    "--badge-interior": "var(--z-surface-page)",
    "--badge-inner-clip": "polygon(calc(var(--badge-offset) + 1px) 1px, calc(100% - 1px) 1px, calc(100% - calc(var(--badge-offset) + 1px)) calc(100% - 1px), 1px calc(100% - 1px))"
  },
  ':where(html[data-genre="laboratory"]) :where(.badge-bevel)': {
    "--z-badge-inset-shadow": "none",
    "--badge-bg": "currentColor",
    "--badge-interior": "var(--z-surface-page)",
    "--badge-inner-clip": "polygon(calc(var(--badge-offset) + 1px) 1px, calc(100% - calc(var(--badge-offset) + 1px)) 1px, calc(100% - 1px) calc(var(--badge-offset) + 1px), calc(100% - 1px) calc(100% - calc(var(--badge-offset) + 1px)), calc(100% - calc(var(--badge-offset) + 1px)) calc(100% - 1px), calc(var(--badge-offset) + 1px) calc(100% - 1px), 1px calc(100% - calc(var(--badge-offset) + 1px)), 1px calc(var(--badge-offset) + 1px))"
  },
  // ── Dot grid — page texture (radial-gradient) ─────────────────────────────
  // The ONLY radial-gradient page texture in ZynaUI. All other genres use
  // repeating-linear-gradient (line-based). This places 1 px circular dots at
  // 8 px pitch — matching the 2 mm dot grid of Leuchtturm1917 and Rhodia dotPad
  // notebooks at 96 dpi screen resolution. At 15% opacity per dot, the grid
  // is sensed as metric depth rather than seen as a printed pattern.
  ':where(html[data-genre="laboratory"]) body::before': {
    content: '""',
    position: "fixed",
    inset: "0",
    zIndex: "0",
    pointerEvents: "none",
    backgroundImage: "radial-gradient(circle, rgba(0,144,176,0.15) 1px, transparent 1px)",
    backgroundSize: "8px 8px"
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
    position: "fixed",
    top: "0",
    left: "0",
    width: "3px",
    height: "100vh",
    zIndex: "0",
    pointerEvents: "none",
    background: "linear-gradient(to bottom, transparent 0%, rgba(0,144,176,0.03) 12%, rgba(0,144,176,0.09) 50%, rgba(0,144,176,0.03) 88%, transparent 100%)",
    transform: "translateX(-4px)",
    animation: "labbook-scan 9s linear infinite"
  },
  // ── prefers-reduced-motion — scan stops ────────────────────────────────────
  "@media (prefers-reduced-motion: reduce)": {
    ':where(html[data-genre="laboratory"]) body::after': { animation: "none" }
  }
}, H = { name: R, tokens: W, swatches: V, styles: q };
function J({ name: a, palette: r = {}, tokens: e = {}, styles: c = {}, extends: d }) {
  const n = d ?? o;
  return {
    name: a,
    swatches: { ...n.swatches, ...r },
    tokens: { ...n.tokens, ...e },
    styles: { ...n.styles, ...c }
  };
}
function K(a) {
  t.find((r) => r.name === a.name) || t.push(a);
}
const t = [o, w, y, C, X, N, L, H];
function Q() {
  const a = {};
  for (const r of t)
    if (r.styles && Object.assign(a, r.styles), r.tokens) {
      const e = `html[data-genre="${r.name.toLowerCase()}"]`;
      a[e] && (a[e] = { ...r.tokens, ...a[e] });
    }
  return a;
}
export {
  t as GENRES,
  J as defineGenre,
  Q as genresPlugin,
  K as registerGenre
};
