/**
 * Genre definitions — single source of truth.
 *
 * Each genre is a flat token map. Tokens fall into two groups:
 *
 *   Color tokens    (--zyna, --zp-*, --z-font-*)  — swap the palette & typography
 *   Structural tokens (--z-btn-*, --z-card-*, --z-alert-*, --z-*)
 *                    — change component shapes, decoration, and chrome
 *
 * All structural tokens are un-registered CSS custom properties. They are set
 * on :root by applyGenre() and inherit down the DOM. Components read them via
 * var() with Ops-default fallbacks. When switching to Ops the tokens are
 * removed and the fallbacks activate automatically.
 *
 * To add a new genre: add one object here. Zero CSS files to touch.
 */

export const GENRES = [
  {
    name: 'Ops',
    tokens: {},   // default: all structural tokens fall back to their CSS defaults
    swatches: {
      brand:   '#C9A84C',
      success: '#00FFB2',
      danger:  '#FF3366',
      info:    '#00D4FF',
    }
  },

  {
    name: 'Cyberpunk',
    tokens: {
      // ── Color tokens ───────────────────────────────────────────────────
      '--zyna':        '#39FF14',
      '--zyna-dark':   '#1A8A00',
      '--zp-success':  '#39FF14',
      '--zp-danger':   '#FF073A',
      '--zp-warning':  '#FFD700',
      '--zp-info':     '#7B61FF',
      '--zp-text':     '#E0FFE0',
      '--z-font-mono': "'Share Tech Mono', 'Courier New', monospace",

      // ── Button structural tokens ────────────────────────────────────────
      '--z-btn-clip':       'inset(0)',   // sharp by default (explicit modifiers override)
      '--z-btn-inner-clip': 'inset(1.5px)', // outlined interior matches sharp outer — no chamfer mismatch
      '--z-btn-corner':     '18px',       // larger cuts for chamfer / notch modifiers
      '--z-btn-hover-shadow': '0 0 16px color-mix(in srgb, var(--zyna) 50%, transparent), 0 0 4px color-mix(in srgb, var(--zyna) 80%, transparent)',

      // ── Badge structural tokens ─────────────────────────────────────────
      '--zp-corner-badge': '12px',   // more aggressive parallelogram skew

      // ── Alert structural tokens ─────────────────────────────────────────
      '--z-alert-radius':    '0',    // sharp (no radius)
      '--z-alert-bar-width': '5px',  // thicker left accent bar
      '--z-alert-prefix':    '"> "', // terminal prompt instead of // comment

      // ── Card structural tokens ──────────────────────────────────────────
      // NOTE: polygon values must be literal px — nested var() inside a custom property
      // set via JS style.setProperty is NOT recursively resolved by the browser at
      // clip-path parse time. 16px matches --zp-corner-card defined in the plugin :root.
      '--z-card-clip': 'polygon(16px 0%, calc(100% - 16px) 0%, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0% calc(100% - 16px), 0% 16px)',
      '--z-card-border-color': 'color-mix(in srgb, var(--zyna) 45%, transparent)',
      // box-shadow is clipped by clip-path:polygon so outer glow is invisible.
      // Use filter:drop-shadow instead — it's applied after clip-path compositing
      // and traces the notch outline, making the neon glow actually visible.
      '--z-card-shadow':       'none',
      '--z-card-filter':       'drop-shadow(0 0 18px color-mix(in srgb, var(--zyna) 20%, transparent)) drop-shadow(0 0 6px color-mix(in srgb, var(--zyna) 12%, transparent))',
      '--z-card-bar-height':   '3px',
      '--z-card-bar-bg':       'var(--zyna)',
      '--z-card-bar-shadow':   '0 0 12px var(--zyna)',
      '--z-card-header-bg':    'color-mix(in srgb, var(--zyna) 6%, transparent)',

      // ── Docs chrome tokens ──────────────────────────────────────────────
      '--z-topbar-border':        'color-mix(in srgb, var(--zyna) 30%, transparent)',
      '--z-topbar-glow':          '0 1px 0 color-mix(in srgb, var(--zyna) 15%, transparent)',
      '--z-sidebar-active-shadow': 'inset 2px 0 0 var(--zyna)',
    },
    swatches: {
      brand:   '#39FF14',
      success: '#39FF14',
      danger:  '#FF073A',
      info:    '#7B61FF',
    }
  }
]

const STORAGE_KEY = 'zyna-genre'

export function applyGenre(name) {
  const genre = GENRES.find(g => g.name === name)
  if (!genre) return

  const root = document.documentElement

  // Clear all token overrides from all genres first
  for (const g of GENRES) {
    for (const prop of Object.keys(g.tokens)) {
      root.style.removeProperty(prop)
    }
  }

  // Apply new genre tokens (Ops has none — just clears)
  for (const [prop, value] of Object.entries(genre.tokens)) {
    root.style.setProperty(prop, value)
  }

  // Set data-genre attribute for CSS rules that need selector scoping
  // (currently only the Cyberpunk body::before scan-line overlay)
  if (name === 'Ops') {
    delete root.dataset.genre
  } else {
    root.dataset.genre = name.toLowerCase()
  }

  try { localStorage.setItem(STORAGE_KEY, name) } catch {}
}

export function loadGenre() {
  let name = 'Ops'
  try { name = localStorage.getItem(STORAGE_KEY) || 'Ops' } catch {}
  applyGenre(name)
  return name
}

// Apply immediately to prevent FOUC
loadGenre()
