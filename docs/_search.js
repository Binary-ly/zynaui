import { applyGenre, GENRES } from './_genres.js'

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
    <div class="scan-noresult" id="scan-noresult" hidden></div>
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
    desc: 'ZynaUI home — genre-powered CSS component library with dark and light themes.',
    classes: [],
    tokens: [],
    keywords: ['home', 'overview', 'start', 'intro', 'zyna', 'zynaui', 'design system', 'getting started', 'install', 'theme', 'light', 'dark', 'genre'],
    sections: [{ heading: 'ZynaUI', content: 'CSS component library genre theming light dark zero dependency tailwind plugin' }]
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
    keywords: ['components', 'index', 'library', 'list', 'all', 'ui', 'scan', 'animation'],
    sections: [{ heading: 'Components', content: 'Interactive UI components scan-fill animations' }]
  },
  {
    id: 'btn',
    title: 'Button',
    type: 'component',
    url: '/components/btn/',
    section: 'components',
    desc: 'Interactive button with scan-fill animation. Primary, secondary, ghost, danger variants. Shape modifiers: round, bevel, cut, square.',
    classes: [
      '.btn', '.btn-primary', '.btn-secondary', '.btn-ghost', '.btn-danger',
      '.btn-sm', '.btn-lg', '.btn-icon',
      '.btn-round', '.btn-bevel', '.btn-cut', '.btn-square'
    ],
    tokens: [
      '--btn-bg', '--btn-color', '--btn-filter', '--btn-scan-color',
      '--btn-hover-bg', '--btn-hover-color', '--btn-hover-filter', '--btn-hover-text-shadow',
      '--btn-active-filter', '--btn-focus-color',
      '--btn-interior', '--btn-hover-interior', '--btn-inner-clip', '--btn-corner'
    ],
    keywords: [
      'button', 'click', 'press', 'primary', 'secondary', 'ghost', 'danger', 'plasma',
      'scan', 'glow', 'filter', 'action', 'trigger', 'interactive', 'fill', 'animation', 'cta',
      'round', 'bevel', 'cut', 'square', 'shape', 'focus', 'hover', 'interior', 'outlined', 'corner'
    ],
    sections: [
      { heading: 'Variants', content: 'Primary secondary ghost danger plasma sm lg icon disabled' },
      { heading: 'Shape Modifiers', content: 'Round bevel cut square clip-path corner' },
      { heading: 'Scan Fill', content: 'Animated scan-fill on click hover glow drop-shadow filter' },
      { heading: 'Tokens', content: 'bg color filter scan-color hover-bg hover-color hover-filter hover-text-shadow active-filter focus-color interior hover-interior inner-clip corner' }
    ]
  },
  {
    id: 'card',
    title: 'Card',
    type: 'component',
    url: '/components/card/',
    section: 'components',
    desc: 'Container with L-bracket corners and power bar header. Variants: dark, glow, round, sm, bevel.',
    classes: [
      '.card', '.card-dark', '.card-glow', '.card-round', '.card-sm', '.card-bevel',
      '.card-header', '.card-body', '.card-footer', '.card-title', '.card-subtitle'
    ],
    tokens: [
      '--card-gradient', '--card-border-color', '--card-shadow',
      '--card-bracket-color', '--card-bracket-size', '--card-bracket-stroke',
      '--card-bar-gradient', '--card-bar-shadow',
      '--card-animation', '--card-glow-lo', '--card-glow-hi',
      '--card-header-border', '--card-header-bg', '--card-header-color',
      '--card-header-dot-color', '--card-header-dot-shadow',
      '--card-header-text-shadow', '--card-title-text-shadow'
    ],
    keywords: [
      'card', 'container', 'panel', 'header', 'body', 'footer', 'title', 'subtitle', 'layout',
      'dark', 'glow', 'round', 'bevel', 'cyber', 'bracket', 'L-bracket', 'corner',
      'pulse', 'animation', 'power bar', 'gradient', 'shadow', 'dot'
    ],
    sections: [
      { heading: 'Variants', content: 'Dark glow round sm bevel cyber' },
      { heading: 'Anatomy', content: 'Card header body footer title subtitle slots' },
      { heading: 'L-Bracket', content: 'Corner bracket decoration bracket-color bracket-size bracket-stroke' },
      { heading: 'Power Bar', content: 'Top luminescent header bar bar-gradient bar-shadow' },
      { heading: 'Tokens', content: 'gradient border-color shadow bracket-color bracket-size bracket-stroke bar-gradient bar-shadow animation glow-lo glow-hi header-border header-bg header-color' }
    ]
  },
  {
    id: 'badge',
    title: 'Badge',
    type: 'component',
    url: '/components/badge/',
    section: 'components',
    desc: 'Status label with shape variants: slant, pill, rect, bevel. Pulse animation. Primary, secondary, success, warning, danger, info, neutral variants.',
    classes: [
      '.badge', '.badge-primary', '.badge-secondary', '.badge-success', '.badge-warning',
      '.badge-danger', '.badge-info', '.badge-neutral',
      '.badge-sm', '.badge-lg',
      '.badge-outline', '.badge-pill', '.badge-rect', '.badge-slant', '.badge-bevel',
      '.badge-pulse'
    ],
    tokens: [
      '--badge-bg', '--badge-color', '--badge-glow', '--badge-scan-color',
      '--badge-dot-size', '--badge-interior', '--badge-offset', '--badge-inner-clip'
    ],
    keywords: [
      'badge', 'status', 'label', 'tag', 'chip', 'pill', 'slant', 'bevel', 'rect', 'indicator',
      'count', 'pulse', 'dot', 'outline', 'neutral', 'plasma', 'info', 'glow', 'offset', 'shape', 'animation'
    ],
    sections: [
      { heading: 'Color Variants', content: 'Primary secondary success warning danger info neutral plasma' },
      { heading: 'Shape Variants', content: 'Slant pill rect bevel outline clip-path offset' },
      { heading: 'Pulse', content: 'Animated pulse dot status indicator' },
      { heading: 'Tokens', content: 'bg color glow scan-color dot-size interior offset inner-clip' }
    ]
  },
  {
    id: 'alert',
    title: 'Alert',
    type: 'component',
    url: '/components/alert/',
    section: 'components',
    desc: 'Notification banner with accent bar. Info, success, warning, danger, dark, neutral variants. Shape: round, square.',
    classes: [
      '.alert', '.alert-info', '.alert-success', '.alert-warning', '.alert-danger',
      '.alert-dark', '.alert-neutral',
      '.alert-sm', '.alert-lg',
      '.alert-round', '.alert-square',
      '.alert-icon', '.alert-title'
    ],
    tokens: [
      '--alert-bar-color', '--alert-bg', '--alert-color', '--alert-shadow', '--alert-title-shadow'
    ],
    keywords: [
      'alert', 'notification', 'banner', 'info', 'success', 'warning', 'danger',
      'dark', 'neutral', 'plasma', 'bar', 'accent bar', 'severity', 'message',
      'round', 'square', 'shape', 'icon', 'title', 'shadow', 'glow'
    ],
    sections: [
      { heading: 'Variants', content: 'Info success warning danger dark neutral plasma' },
      { heading: 'Sizes & Shapes', content: 'sm lg round square' },
      { heading: 'Accent Bar', content: 'Left right top bottom bar-color position genre' },
      { heading: 'Tokens', content: 'bar-color bg color shadow title-shadow' }
    ]
  },
  {
    id: 'charts',
    title: 'All Charts',
    type: 'guide',
    url: '/charts/',
    section: 'charts',
    desc: 'ZynaUI D3.js Web Component charts — waffle, timeline, nightingale, lollipop, orbital.',
    classes: [],
    tokens: [],
    keywords: ['charts', 'data', 'visualization', 'd3', 'all', 'index', 'graph', 'web component', 'zyna-waffle', 'zyna-timeline', 'zyna-nightingale', 'zyna-lollipop', 'zyna-orbital'],
    sections: [{ heading: 'Charts', content: 'D3.js web component data visualization waffle timeline nightingale lollipop orbital' }]
  },
  {
    id: 'waffle',
    title: 'Waffle Chart',
    type: 'chart',
    url: '/charts/waffle/',
    section: 'charts',
    desc: 'Grid of squares showing proportional data. Web component: zyna-waffle.',
    classes: [],
    tokens: [],
    keywords: ['waffle', 'zyna-waffle', 'grid', 'square', 'proportion', 'percentage', 'area', 'fill', 'cells', 'treemap', 'color', 'cols', 'gap', 'theme', 'height', 'outline'],
    sections: [
      { heading: 'Usage', content: 'zyna-waffle proportional grid data visualization percentage cells' },
      { heading: 'Attributes', content: 'data color cols gap theme height outline' }
    ]
  },
  {
    id: 'timeline',
    title: 'Timeline Chart',
    type: 'chart',
    url: '/charts/timeline/',
    section: 'charts',
    desc: 'Horizontal Gantt-style bar chart for duration and schedule data. Web component: zyna-timeline.',
    classes: [],
    tokens: [],
    keywords: ['timeline', 'zyna-timeline', 'gantt', 'bar', 'duration', 'schedule', 'horizontal', 'time', 'project', 'highlight', 'muted', 'muted-color', 'show-values', 'label-format'],
    sections: [
      { heading: 'Usage', content: 'zyna-timeline duration schedule gantt horizontal bar' },
      { heading: 'Attributes', content: 'data color theme highlight muted-color height show-values label-format' }
    ]
  },
  {
    id: 'nightingale',
    title: 'Nightingale Chart',
    type: 'chart',
    url: '/charts/nightingale/',
    section: 'charts',
    desc: 'Rose/polar area chart — radial segments scaled by value. Web component: zyna-nightingale.',
    classes: [],
    tokens: [],
    keywords: ['nightingale', 'zyna-nightingale', 'rose', 'polar', 'radial', 'arc', 'circular', 'florence', 'coxcomb', 'show-values', 'label-format'],
    sections: [
      { heading: 'Usage', content: 'zyna-nightingale polar area radial rose chart circular segments' },
      { heading: 'Attributes', content: 'data color theme height show-values label-format' }
    ]
  },
  {
    id: 'lollipop',
    title: 'Lollipop Chart',
    type: 'chart',
    url: '/charts/lollipop/',
    section: 'charts',
    desc: 'Dot-on-stem chart for ranked data. Web component: zyna-lollipop.',
    classes: [],
    tokens: [],
    keywords: ['lollipop', 'zyna-lollipop', 'dot', 'stem', 'ranked', 'bar', 'categorical', 'highlight', 'muted', 'muted-color', 'ticks', 'show-values', 'label-format'],
    sections: [
      { heading: 'Usage', content: 'zyna-lollipop ranked categorical data comparison dot stem' },
      { heading: 'Attributes', content: 'data color theme highlight muted-color ticks height show-values label-format' }
    ]
  },
  {
    id: 'orbital',
    title: 'Orbital Chart',
    type: 'chart',
    url: '/charts/orbital/',
    section: 'charts',
    desc: 'Concentric ring chart for multi-level proportion data. Web component: zyna-orbital.',
    classes: [],
    tokens: [],
    keywords: ['orbital', 'zyna-orbital', 'orbit', 'ring', 'concentric', 'radial', 'donut', 'hierarchy', 'multi-level', 'ring-thickness', 'show-values', 'label-format'],
    sections: [
      { heading: 'Usage', content: 'zyna-orbital hierarchical multi-level concentric ring chart donut' },
      { heading: 'Attributes', content: 'data color theme ring-thickness height show-values label-format' }
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
    desc: 'Visual editor for creating and customising ZynaUI genre themes — Ops, Cyberpunk, Corporate, Phosphor, Military.',
    classes: [],
    tokens: ['--brand', '--bg', '--bg2', '--bg3', '--text', '--text2', '--text3', '--border'],
    keywords: [
      'genre', 'theme', 'builder', 'customize', 'colors', 'tokens', 'visual', 'editor', 'palette', 'design',
      'ops', 'tactical', 'cyberpunk', 'neon',
      'corporate', 'ledger', 'light', 'ivory', 'navy',
      'phosphor', 'terminal', 'amber', 'crt', 'monochrome',
      'military', 'fieldcraft', 'olive', 'dark', 'export', 'json', 'css'
    ],
    sections: [
      { heading: 'Genre Builder', content: 'Visual editor theme customization export JSON CSS' },
      { heading: 'Ops', content: 'Default dark military HUD aesthetic amber gold' },
      { heading: 'Cyberpunk', content: 'Neon purple dark futuristic glitch' },
      { heading: 'Corporate', content: 'Light ivory warm navy professional ledger document' },
      { heading: 'Phosphor', content: 'Amber CRT terminal dark monochrome phosphor scan' },
      { heading: 'Military', content: 'Tactical olive dark fieldcraft earth tone Share Tech Mono' }
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

// ── Helpers ───────────────────────────────────────────────────────────────────
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const isMac = /mac/i.test(navigator.userAgent)
const modKey = isMac ? '⌘K' : 'Ctrl+K'

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
let scanEl, inputEl, resultsEl, noresultEl, statusEl, freqEl, memoryEl

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
    resultsEl.innerHTML = ''
    if (noresultEl) { noresultEl.textContent = '— NO SIGNAL —'; noresultEl.hidden = false }
    statusEl.textContent = 'NO SIGNAL'
    statusEl.className   = 'scan-status no-signal'
    freqFlat()
    return
  }

  if (noresultEl) noresultEl.hidden = true
  const maxScore = results[0].score
  statusEl.textContent = `${results.length} SIGNAL${results.length === 1 ? '' : 'S'} LOCKED`
  statusEl.className   = 'scan-status has-results'
  freqLock()

  resultsEl.innerHTML = results.map((r, i) => {
    const pct = Math.round((r.score / maxScore) * 100)
    return `<div class="scan-result" id="scan-result-${i}" role="option" aria-selected="false" tabindex="-1" data-index="${i}" data-url="${r.doc.url}">
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
        <span class="scan-mem-query">${escapeHTML(q)}</span>
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
  if (resultsEl) resultsEl.setAttribute('aria-activedescendant', `scan-result-${clamped}`)
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
  if (statusEl)    { statusEl.textContent = 'STANDBY'; statusEl.className = 'scan-status' }
  if (resultsEl)   resultsEl.innerHTML = ''
  if (noresultEl)  noresultEl.hidden = true
  if (inputEl)     inputEl.value = ''
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
    // Sync genre trigger border colour
    const trigger = document.getElementById('genre-trigger')
    const genre   = GENRES.find(g => g.name === name)
    if (trigger && genre?.swatches?.brand) {
      trigger.style.setProperty('--genre-trigger-color', genre.swatches.brand)
    }
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
    if (noresultEl) noresultEl.hidden = true
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
    // Command mode — show prompt, clear results, do not search
    statusEl.textContent = 'COMMAND MODE'
    statusEl.className   = 'scan-status cmd-mode'
    clearTimeout(debounceTimer)
    resultsEl.innerHTML = ''
    if (noresultEl) noresultEl.hidden = true
    currentResults = []
    activeIndex    = -1
    return
  } else {
    statusEl.textContent = 'SCANNING…'
    statusEl.className   = 'scan-status'
  }

  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    renderResults(runSearch(q, location.pathname))
  }, 80)
}

// ── Tab Completion ────────────────────────────────────────────────────────────
const COMMANDS = ['genre']

function tabComplete(value) {
  // Stage 1: completing the command name — e.g. /ge → /genre·
  if (!value.includes(' ')) {
    const partial = value.slice(1).toLowerCase()
    const match = COMMANDS.find(cmd => cmd.startsWith(partial))
    if (match) return `/${match} `
    return null
  }

  // Stage 2: completing the argument — e.g. /genre Cyb → /genre Cyberpunk
  const spaceIdx = value.indexOf(' ')
  const cmd      = value.slice(1, spaceIdx).toLowerCase()
  const arg      = value.slice(spaceIdx + 1)

  if (cmd === 'genre') {
    const partial = arg.toLowerCase()
    if (!partial) return null
    const match = GENRES.find(g => g.name.toLowerCase().startsWith(partial))
    if (match && match.name.toLowerCase() !== partial) return `/genre ${match.name}`
  }

  return null
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
    // Tab completion when input is focused and value starts with /
    if (!e.shiftKey && document.activeElement === inputEl && inputEl?.value.startsWith('/')) {
      const completed = tabComplete(inputEl.value)
      if (completed !== null) {
        e.preventDefault()
        inputEl.value = completed
        inputEl.dispatchEvent(new Event('input'))
        return
      }
    }
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
  scanEl     = document.getElementById('z-scan')
  inputEl    = document.getElementById('scan-input')
  resultsEl  = document.getElementById('scan-results')
  noresultEl = document.getElementById('scan-noresult')
  statusEl   = document.getElementById('scan-status')
  freqEl     = document.getElementById('scan-freq')
  memoryEl   = document.getElementById('scan-memory')

  // Platform-aware keyboard shortcut hint
  const kbdEl = document.querySelector('#scan-trigger kbd')
  if (kbdEl) kbdEl.textContent = modKey

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
