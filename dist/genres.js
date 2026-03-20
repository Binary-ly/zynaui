const i = {
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
}, d = "Ops", s = {
  brand: "#C9A84C",
  success: "#00FFB2",
  danger: "#FF3366",
  info: "#00D4FF"
}, p = {
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
}, z = {
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
    "--z-btn-inner-clip": i.diagonal("var(--btn-corner)").inner,
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
}, t = { name: d, tokens: p, swatches: s, styles: z }, x = "Cyberpunk", b = {
  brand: "#39FF14",
  success: "#39FF14",
  danger: "#FF073A",
  info: "#7B61FF"
}, g = {
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
}, m = { name: x, tokens: g, swatches: b, styles: h };
function w({ name: a, palette: r = {}, tokens: e = {}, styles: c = {}, extends: l }) {
  const n = l ?? t;
  return {
    name: a,
    swatches: { ...n.swatches, ...r },
    tokens: { ...n.tokens, ...e },
    styles: { ...n.styles, ...c }
  };
}
function u(a) {
  o.find((r) => r.name === a.name) || o.push(a);
}
const o = [t, m];
function k() {
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
  w as defineGenre,
  k as genresPlugin,
  u as registerGenre
};
