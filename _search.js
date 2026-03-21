import { applyGenre } from './_genres.js'

// ── CSS ───────────────────────────────────────────────────────────────────────
const SEARCH_CSS = `
#z-scan {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: none;
  align-items: flex-start;
  justify-content: center;
  padding-top: calc(var(--topbar-h, 48px) + 3vh);
  background: rgba(0,0,0,0.72);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}
#z-scan.is-open {
  display: flex;
}

/* Scan sweep — one-shot on open */
#z-scan.is-sweeping::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    color-mix(in srgb, var(--brand) 60%, transparent) 49.9%,
    color-mix(in srgb, var(--brand) 80%, transparent) 50%,
    color-mix(in srgb, var(--brand) 60%, transparent) 50.1%,
    transparent 100%
  );
  background-size: 100% 40px;
  background-repeat: no-repeat;
  animation: z-scan-sweep 350ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
@keyframes z-scan-sweep {
  from { background-position: 0 -40px; }
  to   { background-position: 0 calc(100vh + 40px); }
}

/* Shell */
.scan-shell {
  width: min(700px, 92vw);
  background: var(--bg2);
  border: 1px solid var(--border);
  border-top: 2px solid var(--brand);
  font-family: var(--mono, 'Courier New', monospace);
  font-size: 0.82rem;
  color: var(--text);
  position: relative;
  z-index: 2;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.scan-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.32rem 0.75rem;
  border-bottom: 1px solid var(--border);
  background: color-mix(in srgb, var(--bg2) 78%, var(--brand) 22%);
  flex-shrink: 0;
  gap: 0.5rem;
}
.scan-title {
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  color: var(--brand);
  text-transform: uppercase;
  flex-shrink: 0;
}
.scan-status {
  font-size: 0.66rem;
  letter-spacing: 0.1em;
  color: var(--text3);
  text-transform: uppercase;
  transition: color 0.2s ease;
  text-align: right;
}
.scan-status.has-results { color: var(--brand); }
.scan-status.no-signal   { color: #ef5350; }
.scan-status.token-mode  { color: #4fc3f7; }
.scan-status.cmd-mode    { color: #b39ddb; }

/* Input row */
.scan-input-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.scan-prompt {
  color: var(--brand);
  font-size: 0.9rem;
  flex-shrink: 0;
  opacity: 0.75;
  user-select: none;
}
.scan-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text);
  font-family: var(--mono, 'Courier New', monospace);
  font-size: 0.85rem;
  caret-color: var(--brand);
  min-width: 0;
}
.scan-input::placeholder {
  color: var(--text3);
  opacity: 0.5;
}

/* Frequency bars */
.scan-freq {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 20px;
  flex-shrink: 0;
  padding-bottom: 2px;
}
.freq-bar {
  width: 3px;
  background: var(--brand);
  opacity: 0.55;
  border-radius: 1px 1px 0 0;
  height: var(--h, 4px);
  transition: height 0.12s ease, opacity 0.3s ease;
  animation: freq-idle var(--dur, 1.4s) ease-in-out infinite alternate;
}
@keyframes freq-idle {
  from { height: 2px; }
  to   { height: var(--h-max, 8px); }
}
.scan-freq.is-flat   .freq-bar { height: 2px !important; opacity: 0.2 !important; animation: none; }
.scan-freq.is-locked .freq-bar { height: 6px !important; opacity: 0.5  !important; animation: none; }
.scan-freq.is-pulse  .freq-bar { animation: none; opacity: 0.9; }

/* Recent searches */
.scan-memory {
  padding: 0.5rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.scan-mem-header {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  color: var(--text3);
  text-transform: uppercase;
}
.scan-mem-header svg { opacity: 0.6; flex-shrink: 0; }
.scan-mem-list {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.scan-mem-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  background: transparent;
  border: none;
  padding: 0.2rem 0.1rem;
  cursor: pointer;
  font-family: var(--mono, monospace);
  text-align: left;
  color: var(--text2);
  font-size: 0.78rem;
  transition: color 0.12s;
  border-radius: 2px;
}
.scan-mem-item:hover { color: var(--text); }
.scan-mem-item:hover .scan-mem-arrow { color: var(--brand); }
.scan-mem-arrow {
  font-size: 0.65rem;
  color: var(--text3);
  flex-shrink: 0;
  transition: color 0.12s;
}
.scan-mem-query {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Results */
.scan-results {
  flex: 1;
  overflow-y: auto;
  padding: 0.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-height: 0;
}
.scan-results::-webkit-scrollbar { width: 3px; }
.scan-results::-webkit-scrollbar-track { background: transparent; }
.scan-results::-webkit-scrollbar-thumb { background: var(--border); }

/* Result card */
.scan-result {
  position: relative;
  padding: 0.55rem 0.65rem;
  border: 1px solid var(--border);
  background: var(--bg3);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  outline: none;
}
.scan-result:hover,
.scan-result.is-active {
  border-color: var(--brand);
  background: color-mix(in srgb, var(--bg3) 82%, var(--brand) 18%);
}

/* Targeting reticle */
.rc-tl, .rc-tr, .rc-bl, .rc-br {
  position: absolute;
  width: 0;
  height: 0;
  transition: width 0.18s ease, height 0.18s ease, opacity 0.18s ease;
  opacity: 0;
  pointer-events: none;
}
.scan-result.is-active .rc-tl,
.scan-result.is-active .rc-tr,
.scan-result.is-active .rc-bl,
.scan-result.is-active .rc-br {
  width: 12px;
  height: 12px;
  opacity: 1;
}
.rc-tl { top: -1px;    left: -1px;  border-top:    2px solid var(--brand); border-left:  2px solid var(--brand); }
.rc-tr { top: -1px;    right: -1px; border-top:    2px solid var(--brand); border-right: 2px solid var(--brand); }
.rc-bl { bottom: -1px; left: -1px;  border-bottom: 2px solid var(--brand); border-left:  2px solid var(--brand); }
.rc-br { bottom: -1px; right: -1px; border-bottom: 2px solid var(--brand); border-right: 2px solid var(--brand); }

/* Signal bar */
.scan-result-top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.28rem;
}
.scan-signal-wrap {
  flex: 1;
  height: 4px;
  background: color-mix(in srgb, var(--border) 55%, transparent 45%);
  border-radius: 1px;
  overflow: hidden;
}
.scan-signal-bar {
  height: 100%;
  background: var(--brand);
  border-radius: 1px;
  width: 0;
  transition: width 0.32s ease-out;
}
.scan-signal-pct {
  font-size: 0.63rem;
  color: var(--text3);
  min-width: 2.4rem;
  text-align: right;
  flex-shrink: 0;
}

/* Type badge */
.scan-type {
  font-size: 0.6rem;
  letter-spacing: 0.09em;
  padding: 0.08rem 0.28rem;
  border: 1px solid currentColor;
  text-transform: uppercase;
  flex-shrink: 0;
}
.scan-type[data-type="component"] { color: var(--brand); }
.scan-type[data-type="chart"]     { color: #4fc3f7; }
.scan-type[data-type="genre"]     { color: #b39ddb; }
.scan-type[data-type="guide"]     { color: var(--text2); }

/* Title row */
.scan-result-row2 {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}
.scan-result-title {
  font-size: 0.85rem;
  color: var(--text);
  font-weight: 600;
}
.scan-result-url {
  font-size: 0.63rem;
  color: var(--text3);
  margin-left: auto;
  flex-shrink: 0;
}
.scan-result-desc {
  font-size: 0.71rem;
  color: var(--text2);
  margin-top: 0.18rem;
  line-height: 1.45;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* No results */
.scan-noresult {
  padding: 1.75rem 0.75rem;
  text-align: center;
  color: var(--text3);
  font-size: 0.76rem;
  letter-spacing: 0.1em;
}

/* Footer */
.scan-footer {
  padding: 0.28rem 0.75rem;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 1.5rem;
  flex-shrink: 0;
  background: color-mix(in srgb, var(--bg2) 88%, var(--brand) 12%);
}
.scan-hint {
  font-size: 0.6rem;
  color: var(--text3);
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

/* Topbar SCAN button */
.scan-trigger {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text2);
  font-family: var(--mono, monospace);
  font-size: 0.7rem;
  padding: 0.22rem 0.5rem;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  letter-spacing: 0.06em;
  white-space: nowrap;
}
.scan-trigger:hover {
  color: var(--brand);
  border-color: var(--brand);
}
.scan-trigger kbd {
  font-family: var(--mono, monospace);
  font-size: 0.62rem;
  color: var(--text3);
  background: var(--bg3);
  border: 1px solid var(--border);
  padding: 0.04rem 0.22rem;
}
`

// ── HTML ──────────────────────────────────────────────────────────────────────
function buildHTML() {
  const freqBars = Array.from({ length: 7 }, (_, i) =>
    `<div class="freq-bar" style="--h:${3 + i}px;--h-max:${6 + i * 2}px;--dur:${(1.2 + i * 0.18).toFixed(2)}s"></div>`
  ).join('')

  return `<div id="z-scan" role="dialog" aria-modal="true" aria-label="Signal Acquisition Search">
  <div class="scan-shell">
    <div class="scan-header">
      <span class="scan-title">⬡ Signal Acquisition</span>
      <span class="scan-status" id="scan-status" aria-live="polite" aria-atomic="true">STANDBY</span>
    </div>
    <div class="scan-input-row">
      <span class="scan-prompt" aria-hidden="true">&gt;</span>
      <input
        class="scan-input"
        id="scan-input"
        type="text"
        autocomplete="off"
        spellcheck="false"
        aria-label="Search"
        aria-autocomplete="list"
        aria-controls="scan-results"
        placeholder="query · --token · /genre name"
      >
      <div class="scan-freq" id="scan-freq" aria-hidden="true">${freqBars}</div>
    </div>
    <div class="scan-memory" id="scan-memory" hidden aria-label="Recent searches"></div>
    <div class="scan-results" id="scan-results" role="listbox" aria-label="Search results"></div>
    <div class="scan-footer" aria-hidden="true">
      <span class="scan-hint">↑↓ Navigate</span>
      <span class="scan-hint">↵ Lock On</span>
      <span class="scan-hint">Esc Abort</span>
    </div>
  </div>
</div>`
}

// ── Search Index ──────────────────────────────────────────────────────────────
const INDEX = [
  {
    id: 'home',
    title: 'Overview',
    type: 'guide',
    url: '/',
    section: 'project',
    desc: 'ZynaUI home — military-aesthetic design system with genre-powered theming.',
    classes: [],
    tokens: [],
    keywords: ['home', 'overview', 'start', 'intro', 'zyna', 'zynaui', 'design system', 'getting started', 'install'],
    sections: [{ heading: 'ZynaUI', content: 'Military aesthetic CSS component library genre theming zero dependency' }]
  },
  {
    id: 'components',
    title: 'All Components',
    type: 'guide',
    url: '/components/',
    section: 'components',
    desc: 'Full index of ZynaUI components — buttons, badges, alerts, cards.',
    classes: ['.btn', '.badge', '.alert', '.card'],
    tokens: [],
    keywords: ['components', 'index', 'library', 'list', 'all', 'ui'],
    sections: [{ heading: 'Components', content: 'Interactive UI components scan-fill animations' }]
  },
  {
    id: 'btn',
    title: 'Button',
    type: 'component',
    url: '/components/btn/',
    section: 'components',
    desc: 'Interactive action trigger with scan-fill animation. Primary, ghost, danger variants.',
    classes: ['.btn', '.btn-primary', '.btn-ghost', '.btn-danger', '.btn-sm', '.btn-lg', '.btn-icon'],
    tokens: ['--btn-bg', '--btn-color', '--btn-clip', '--btn-border', '--btn-radius', '--btn-px', '--btn-py',
             '--btn-font-size', '--btn-font-weight', '--btn-letter-spacing', '--btn-hover-filter',
             '--btn-active-scale', '--btn-scan-duration'],
    keywords: ['button', 'click', 'press', 'primary', 'ghost', 'danger', 'scan', 'glow', 'clip',
               'action', 'trigger', 'interactive', 'fill', 'animation', 'cta'],
    sections: [
      { heading: 'Variants', content: 'Primary ghost danger sm lg icon disabled' },
      { heading: 'Scan Fill', content: 'Animated clip-path fill on click configurable duration' },
      { heading: 'Tokens', content: 'CSS custom properties bg color clip border radius sizing hover' }
    ]
  },
  {
    id: 'card',
    title: 'Card',
    type: 'component',
    url: '/components/card/',
    section: 'components',
    desc: 'Container component with header, body and optional media slot.',
    classes: ['.card', '.card-header', '.card-body', '.card-media', '.card-title', '.card-meta'],
    tokens: ['--card-bg', '--card-border', '--card-radius', '--card-padding', '--card-shadow', '--card-gap'],
    keywords: ['card', 'container', 'panel', 'header', 'body', 'media', 'layout', 'box'],
    sections: [
      { heading: 'Anatomy', content: 'Card header body media title meta slots' },
      { heading: 'Tokens', content: 'Background border radius padding shadow gap' }
    ]
  },
  {
    id: 'badge',
    title: 'Badge',
    type: 'component',
    url: '/components/badge/',
    section: 'components',
    desc: 'Status indicator with shape variants — pill, rect, slant, bevel.',
    classes: ['.badge', '.badge-primary', '.badge-success', '.badge-warning', '.badge-danger', '.badge-sm', '.badge-lg'],
    tokens: ['--badge-bg', '--badge-color', '--badge-border', '--badge-radius', '--badge-px',
             '--badge-py', '--badge-font-size', '--badge-clip'],
    keywords: ['badge', 'status', 'label', 'tag', 'chip', 'pill', 'slant', 'bevel', 'indicator', 'count'],
    sections: [
      { heading: 'Shape Variants', content: 'Pill rect slant bevel custom clip-path' },
      { heading: 'Color Variants', content: 'Primary success warning danger muted' },
      { heading: 'Tokens', content: 'Background color border clip radius sizing' }
    ]
  },
  {
    id: 'alert',
    title: 'Alert',
    type: 'component',
    url: '/components/alert/',
    section: 'components',
    desc: 'Dismissible notification banner with severity variants and accent bar.',
    classes: ['.alert', '.alert-info', '.alert-success', '.alert-warning', '.alert-danger', '.alert-bar'],
    tokens: ['--alert-bg', '--alert-color', '--alert-border', '--alert-radius',
             '--alert-bar-width', '--alert-bar-pos', '--alert-padding'],
    keywords: ['alert', 'notification', 'banner', 'info', 'success', 'warning', 'danger', 'dismiss', 'bar', 'severity', 'message'],
    sections: [
      { heading: 'Severity', content: 'Info success warning danger severity variants' },
      { heading: 'Accent Bar', content: 'Left right top bottom bar position token' },
      { heading: 'Dismiss', content: 'Closeable dismissible notification' }
    ]
  },
  {
    id: 'charts',
    title: 'All Charts',
    type: 'guide',
    url: '/charts/',
    section: 'charts',
    desc: 'ZynaUI chart components built with D3.js — waffle, timeline, nightingale, lollipop, orbital.',
    classes: [],
    tokens: [],
    keywords: ['charts', 'data', 'visualization', 'd3', 'all', 'index', 'graph'],
    sections: [{ heading: 'Charts', content: 'D3.js powered data visualization components' }]
  },
  {
    id: 'waffle',
    title: 'Waffle Chart',
    type: 'chart',
    url: '/charts/waffle/',
    section: 'charts',
    desc: 'Grid-based area chart showing proportional data as filled squares.',
    classes: [],
    tokens: ['--waffle-cell-size', '--waffle-gap', '--waffle-fill', '--waffle-empty'],
    keywords: ['waffle', 'grid', 'square', 'proportion', 'percentage', 'area', 'fill', 'cells', 'treemap'],
    sections: [
      { heading: 'Usage', content: 'Proportional grid data visualization percentage' },
      { heading: 'Options', content: 'Cell size gap fill empty color' }
    ]
  },
  {
    id: 'timeline',
    title: 'Timeline Chart',
    type: 'chart',
    url: '/charts/timeline/',
    section: 'charts',
    desc: 'Horizontal Gantt-style bar chart for duration and schedule data.',
    classes: [],
    tokens: ['--timeline-bar-h', '--timeline-fill', '--timeline-track'],
    keywords: ['timeline', 'gantt', 'bar', 'duration', 'schedule', 'horizontal', 'time', 'project'],
    sections: [
      { heading: 'Usage', content: 'Duration schedule visualization gantt horizontal bar' },
      { heading: 'Options', content: 'Bar height fill track color' }
    ]
  },
  {
    id: 'nightingale',
    title: 'Nightingale Chart',
    type: 'chart',
    url: '/charts/nightingale/',
    section: 'charts',
    desc: 'Rose/polar area chart — radial segments scaled by value.',
    classes: [],
    tokens: ['--nightingale-fill', '--nightingale-stroke', '--nightingale-r'],
    keywords: ['nightingale', 'rose', 'polar', 'radial', 'arc', 'circular', 'florence', 'coxcomb'],
    sections: [
      { heading: 'Usage', content: 'Polar area radial rose chart circular' },
      { heading: 'Options', content: 'Fill stroke radius segments' }
    ]
  },
  {
    id: 'lollipop',
    title: 'Lollipop Chart',
    type: 'chart',
    url: '/charts/lollipop/',
    section: 'charts',
    desc: 'Dot-on-stem chart — cleaner alternative to bar chart for ranked data.',
    classes: [],
    tokens: ['--lollipop-dot-r', '--lollipop-stem-w', '--lollipop-fill'],
    keywords: ['lollipop', 'dot', 'stem', 'ranked', 'bar', 'clean', 'minimal', 'categorical'],
    sections: [
      { heading: 'Usage', content: 'Ranked categorical data comparison dot stem' },
      { heading: 'Options', content: 'Dot radius stem width fill color' }
    ]
  },
  {
    id: 'orbital',
    title: 'Orbital Chart',
    type: 'chart',
    url: '/charts/orbital/',
    section: 'charts',
    desc: 'Concentric ring chart for hierarchical or multi-level proportion data.',
    classes: [],
    tokens: ['--orbital-ring-gap', '--orbital-fill', '--orbital-stroke'],
    keywords: ['orbital', 'orbit', 'ring', 'concentric', 'radial', 'donut', 'hierarchy', 'multi-level'],
    sections: [
      { heading: 'Usage', content: 'Hierarchical multi-level concentric ring chart' },
      { heading: 'Options', content: 'Ring gap fill stroke layers' }
    ]
  },
  {
    id: 'changelog',
    title: 'Changelog',
    type: 'guide',
    url: '/changelog/',
    section: 'project',
    desc: 'Version history and release notes for ZynaUI.',
    classes: [],
    tokens: [],
    keywords: ['changelog', 'release', 'version', 'history', 'updates', 'notes', 'v0.1', 'v0.2', 'log'],
    sections: [{ heading: 'Changelog', content: 'Release notes version history updates' }]
  },
  {
    id: 'roadmap',
    title: 'Roadmap',
    type: 'guide',
    url: '/roadmap/',
    section: 'project',
    desc: 'Upcoming features and planned improvements for ZynaUI.',
    classes: [],
    tokens: [],
    keywords: ['roadmap', 'upcoming', 'planned', 'future', 'features', 'todo', 'backlog', 'milestones'],
    sections: [{ heading: 'Roadmap', content: 'Upcoming features planned work milestones' }]
  },
  {
    id: 'genres',
    title: 'Genre Builder',
    type: 'genre',
    url: '/genres/',
    section: 'project',
    desc: 'Visual editor for creating and customising ZynaUI genre themes — Ops, Cyberpunk.',
    classes: [],
    tokens: ['--brand', '--bg', '--bg2', '--bg3', '--text', '--text2', '--text3', '--border'],
    keywords: ['genre', 'theme', 'builder', 'ops', 'cyberpunk', 'customize', 'colors', 'tokens',
               'visual', 'editor', 'palette', 'design'],
    sections: [
      { heading: 'Genre Builder', content: 'Visual editor theme customization' },
      { heading: 'Ops', content: 'Default military-aesthetic dark theme' },
      { heading: 'Cyberpunk', content: 'Neon-bright cyberpunk theme colors' }
    ]
  }
]

// ── Search Algorithm ──────────────────────────────────────────────────────────
function getCurrentSection(path) {
  if (path.startsWith('/components/')) return 'components'
  if (path.startsWith('/charts/'))     return 'charts'
  return 'project'
}

function runSearch(query, currentPath) {
  const q = query.trim().toLowerCase()
  if (!q) return []

  // Token mode: query starts with --
  if (q.startsWith('--')) {
    return INDEX
      .filter(doc => doc.tokens.some(t => t.toLowerCase().includes(q)))
      .slice(0, 7)
      .map(doc => ({ doc, score: 100 }))
  }

  const currentSection = getCurrentSection(currentPath)
  const terms = q.split(/\s+/).filter(Boolean)

  const scored = INDEX.map(doc => {
    const titleL = doc.title.toLowerCase()
    const descL  = doc.desc.toLowerCase()
    let score = 0

    for (const term of terms) {
      // Title
      if (titleL === term)            score += 120
      else if (titleL.includes(term)) score += 70

      // Classes
      for (const cls of doc.classes) {
        if (cls.toLowerCase().includes(term)) { score += 90; break }
      }

      // Tokens
      for (const tok of doc.tokens) {
        if (tok.toLowerCase().includes(term)) { score += 85; break }
      }

      // Keywords
      for (const kw of doc.keywords) {
        const kwL = kw.toLowerCase()
        if (kwL === term)              score += 60
        else if (kwL.includes(term))  score += 35
      }

      // Description
      if (descL.includes(term)) score += 25

      // Sections
      for (const sec of doc.sections) {
        if (sec.heading.toLowerCase().includes(term))       score += 40
        else if (sec.content.toLowerCase().includes(term))  score += 15
      }
    }

    // Contextual boost — same section as current page
    if (doc.section === currentSection) score += 20

    return { doc, score }
  })

  return scored
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 7)
}

// ── State ─────────────────────────────────────────────────────────────────────
let activeIndex    = -1
let currentResults = []
let debounceTimer  = null
const RECENT_KEY   = 'zyna-search-recent'

function getRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') } catch { return [] }
}

function saveRecent(q) {
  if (!q) return
  try {
    const r = getRecent().filter(x => x !== q)
    r.unshift(q)
    localStorage.setItem(RECENT_KEY, JSON.stringify(r.slice(0, 5)))
  } catch {}
}

// ── DOM Refs ──────────────────────────────────────────────────────────────────
let scanEl, inputEl, resultsEl, statusEl, freqEl, memoryEl

// ── Frequency Bars ────────────────────────────────────────────────────────────
function freqPulse() {
  if (!freqEl) return
  freqEl.className = 'scan-freq is-pulse'
  freqEl.querySelectorAll('.freq-bar').forEach(bar => {
    bar.style.height = (4 + Math.random() * 16) + 'px'
  })
  clearTimeout(freqEl._t)
  freqEl._t = setTimeout(() => {
    freqEl.querySelectorAll('.freq-bar').forEach(bar => { bar.style.height = '' })
    freqEl.className = 'scan-freq'
  }, 180)
}

function freqLock() {
  if (!freqEl) return
  clearTimeout(freqEl._t)
  freqEl.className = 'scan-freq is-locked'
}

function freqFlat() {
  if (!freqEl) return
  clearTimeout(freqEl._t)
  freqEl.className = 'scan-freq is-flat'
}

function freqIdle() {
  if (!freqEl) return
  clearTimeout(freqEl._t)
  freqEl.querySelectorAll('.freq-bar').forEach(bar => { bar.style.height = '' })
  freqEl.className = 'scan-freq'
}

// ── Render Results ────────────────────────────────────────────────────────────
function renderResults(results) {
  if (!resultsEl || !statusEl) return
  currentResults = results
  activeIndex    = -1

  if (!results.length) {
    resultsEl.innerHTML = '<div class="scan-noresult">— NO SIGNAL —</div>'
    statusEl.textContent = 'NO SIGNAL'
    statusEl.className   = 'scan-status no-signal'
    freqFlat()
    return
  }

  const maxScore = results[0].score
  statusEl.textContent = `${results.length} SIGNAL${results.length === 1 ? '' : 'S'} LOCKED`
  statusEl.className   = 'scan-status has-results'
  freqLock()

  resultsEl.innerHTML = results.map((r, i) => {
    const pct = Math.round((r.score / maxScore) * 100)
    return `<div class="scan-result" role="option" aria-selected="false" tabindex="-1" data-index="${i}" data-url="${r.doc.url}">
      <span class="rc-tl" aria-hidden="true"></span>
      <span class="rc-tr" aria-hidden="true"></span>
      <span class="rc-bl" aria-hidden="true"></span>
      <span class="rc-br" aria-hidden="true"></span>
      <div class="scan-result-top">
        <div class="scan-signal-wrap"><div class="scan-signal-bar" data-pct="${pct}"></div></div>
        <span class="scan-signal-pct">${pct}%</span>
        <span class="scan-type" data-type="${r.doc.type}">[${r.doc.type.toUpperCase()}]</span>
      </div>
      <div class="scan-result-row2">
        <span class="scan-result-title">${r.doc.title}</span>
        <span class="scan-result-url">${r.doc.url}</span>
      </div>
      <div class="scan-result-desc">${r.doc.desc}</div>
    </div>`
  }).join('')

  // Animate signal bars after paint
  requestAnimationFrame(() => {
    resultsEl.querySelectorAll('.scan-signal-bar').forEach(bar => {
      bar.style.width = bar.dataset.pct + '%'
    })
    resultsEl.querySelectorAll('.scan-result').forEach(card => {
      card.addEventListener('click', () => {
        const url = card.dataset.url
        if (url) { saveRecent(inputEl?.value.trim() || ''); location.href = url }
      })
      card.addEventListener('mouseenter', () => {
        selectResult(parseInt(card.dataset.index, 10))
      })
    })
  })
}

// ── Render Memory ─────────────────────────────────────────────────────────────
function renderMemory() {
  if (!memoryEl) return
  const recent = getRecent()
  if (!recent.length) { memoryEl.hidden = true; return }

  memoryEl.hidden = false
  memoryEl.innerHTML = `
    <div class="scan-mem-header">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      Recent
    </div>
    <div class="scan-mem-list">
      ${recent.map(q => `<button class="scan-mem-item" type="button">
        <span class="scan-mem-arrow">↵</span>
        <span class="scan-mem-query">${q}</span>
      </button>`).join('')}
    </div>`

  memoryEl.querySelectorAll('.scan-mem-item').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      if (!inputEl) return
      inputEl.value = recent[i]
      inputEl.dispatchEvent(new Event('input'))
      inputEl.focus()
    })
  })
}

// ── Select Result ─────────────────────────────────────────────────────────────
function selectResult(n) {
  if (!resultsEl) return
  const cards = [...resultsEl.querySelectorAll('.scan-result')]
  if (!cards.length) return

  const clamped = Math.max(0, Math.min(n, cards.length - 1))
  cards.forEach((c, i) => {
    const active = i === clamped
    c.classList.toggle('is-active', active)
    c.setAttribute('aria-selected', String(active))
  })
  activeIndex = clamped
  cards[clamped].scrollIntoView({ block: 'nearest' })
}

// ── Open / Close ──────────────────────────────────────────────────────────────
let prevFocus = null

function openScan() {
  if (!scanEl) return
  prevFocus = document.activeElement

  scanEl.classList.add('is-open')

  // Sweep animation (one-shot)
  scanEl.classList.add('is-sweeping')
  setTimeout(() => scanEl.classList.remove('is-sweeping'), 420)

  // Reset state
  if (statusEl) { statusEl.textContent = 'STANDBY'; statusEl.className = 'scan-status' }
  if (resultsEl) resultsEl.innerHTML = ''
  if (inputEl)   inputEl.value = ''
  currentResults = []
  activeIndex    = -1
  freqIdle()
  renderMemory()

  document.body.style.overflow = 'hidden'
  requestAnimationFrame(() => inputEl?.focus())
}

function closeScan() {
  if (!scanEl) return
  scanEl.classList.remove('is-open')
  document.body.style.overflow = ''

  // Restore focus
  if (prevFocus && prevFocus.focus) {
    prevFocus.focus()
  } else {
    document.getElementById('scan-trigger')?.focus()
  }
  prevFocus = null
}

// ── Command Mode ──────────────────────────────────────────────────────────────
function execCommand(q) {
  const m = q.match(/^\/genre\s+(.+)$/i)
  if (m) {
    const raw  = m[1].trim()
    const name = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase()
    applyGenre(name)
    // Sync genre label in topbar
    const nameEl = document.getElementById('genre-active-name')
    if (nameEl) nameEl.textContent = name.toUpperCase()
    closeScan()
    return true
  }
  return false
}

// ── Input Handler ─────────────────────────────────────────────────────────────
function handleInput() {
  if (!inputEl || !statusEl || !resultsEl || !memoryEl) return
  const q = inputEl.value.trim()
  freqPulse()

  if (!q) {
    resultsEl.innerHTML = ''
    currentResults      = []
    activeIndex         = -1
    statusEl.textContent = 'STANDBY'
    statusEl.className   = 'scan-status'
    freqIdle()
    renderMemory()
    return
  }

  memoryEl.hidden = true

  // Update status label immediately
  if (q.startsWith('--')) {
    statusEl.textContent = 'TOKEN SCAN'
    statusEl.className   = 'scan-status token-mode'
  } else if (q.startsWith('/')) {
    statusEl.textContent = 'COMMAND MODE'
    statusEl.className   = 'scan-status cmd-mode'
  } else {
    statusEl.textContent = 'SCANNING…'
    statusEl.className   = 'scan-status'
  }

  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    renderResults(runSearch(q, location.pathname))
  }, 80)
}

// ── Focus Trap ────────────────────────────────────────────────────────────────
function trapFocus(e) {
  if (!scanEl?.classList.contains('is-open')) return
  if (e.key !== 'Tab') return

  const focusable = [...scanEl.querySelectorAll(
    'input, button, [tabindex="0"], [tabindex="-1"]:not([disabled])'
  )].filter(el => el.tabIndex >= 0 || el === inputEl)

  if (!focusable.length) { e.preventDefault(); return }

  const first = focusable[0]
  const last  = focusable[focusable.length - 1]

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

// ── Global Keyboard ───────────────────────────────────────────────────────────
function handleKey(e) {
  const isOpen = scanEl?.classList.contains('is-open')

  // Toggle open/close
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    isOpen ? closeScan() : openScan()
    return
  }

  if (!isOpen) return

  if (e.key === 'Escape') {
    e.preventDefault()
    closeScan()
    return
  }

  if (e.key === 'Tab') {
    trapFocus(e)
    return
  }

  const cards = [...(resultsEl?.querySelectorAll('.scan-result') || [])]

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (!cards.length) return
    selectResult(activeIndex < 0 ? 0 : Math.min(activeIndex + 1, cards.length - 1))
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (!cards.length) return
    selectResult(activeIndex < 0 ? 0 : Math.max(activeIndex - 1, 0))
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const q = inputEl?.value.trim() || ''

    // Try command mode first
    if (q.startsWith('/') && execCommand(q)) return

    // Navigate to result
    if (activeIndex >= 0 && currentResults[activeIndex]) {
      saveRecent(q)
      location.href = currentResults[activeIndex].doc.url
    } else if (currentResults.length > 0) {
      saveRecent(q)
      location.href = currentResults[0].doc.url
    }
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────
function initSearch() {
  // Inject CSS once
  if (!document.getElementById('z-scan-style')) {
    const style = document.createElement('style')
    style.id    = 'z-scan-style'
    style.textContent = SEARCH_CSS
    document.head.appendChild(style)
  }

  // Inject HTML once
  if (!document.getElementById('z-scan')) {
    document.body.insertAdjacentHTML('beforeend', buildHTML())
  }

  // Cache DOM refs
  scanEl    = document.getElementById('z-scan')
  inputEl   = document.getElementById('scan-input')
  resultsEl = document.getElementById('scan-results')
  statusEl  = document.getElementById('scan-status')
  freqEl    = document.getElementById('scan-freq')
  memoryEl  = document.getElementById('scan-memory')

  // Input listener
  inputEl?.addEventListener('input', handleInput)

  // Global keyboard
  document.addEventListener('keydown', handleKey)

  // Click backdrop to close
  scanEl?.addEventListener('click', e => {
    if (e.target === scanEl) closeScan()
  })

  // Topbar trigger button (delegated, safe for dynamic injection)
  document.addEventListener('click', e => {
    if (e.target.closest('#scan-trigger')) openScan()
  })
}

// Run after DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSearch)
} else {
  initSearch()
}
