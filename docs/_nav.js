import { GENRES, applyGenre, loadGenre } from './_genres.js'
import './_search.js'
import { version } from './_version.js'

// Apply genre immediately (before DOMContentLoaded) to prevent FOUC
loadGenre()

// Unified nav — all sections visible on every page
const NAV = [
  {
    label: 'Project',
    items: [
      { label: 'Overview',   href: '/',           meta: 'home' },
      { label: 'Changelog',  href: '/changelog/',  meta: 'log'  },
      { label: 'Roadmap',    href: '/roadmap/',    meta: 'map'  },
      { label: 'CSS API',    href: '/css-api/',    meta: 'api'  }
    ]
  },
  {
    label: 'Components',
    count: 4,
    items: [
      { label: 'All Components', href: '/components/'           },
      { label: 'Button',         href: '/components/btn/',    meta: '.btn'   },
      { label: 'Card',           href: '/components/card/',   meta: '.card'  },
      { label: 'Badge',          href: '/components/badge/',  meta: '.badge' },
      { label: 'Alert',          href: '/components/alert/',  meta: '.alert' }
    ]
  },
  {
    label: 'Charts',
    count: 5,
    items: [
      { label: 'All Charts',  href: '/charts/'                        },
      { label: 'Waffle',      href: '/charts/waffle/',      meta: 'grid'  },
      { label: 'Timeline',    href: '/charts/timeline/',    meta: 'bar'   },
      { label: 'Nightingale', href: '/charts/nightingale/', meta: 'arc'   },
      { label: 'Lollipop',    href: '/charts/lollipop/',    meta: 'dot'   },
      { label: 'Orbital',     href: '/charts/orbital/',     meta: 'orbit' }
    ]
  }
]

// Which category should be open by default for a given path (no saved state)
function getDefaultOpen(path) {
  if (path.startsWith('/components/')) return 'Components'
  if (path.startsWith('/charts/'))     return 'Charts'
  return 'Project'
}

// Build "you are here" path segments for sidebar breadcrumb
function getPosition(path) {
  if (path === '/') return null
  const slugMap = {
    components: 'components', charts: 'charts',
    btn: 'button', card: 'card', badge: 'badge', alert: 'alert',
    waffle: 'waffle', timeline: 'timeline', nightingale: 'nightingale',
    lollipop: 'lollipop', orbital: 'orbital',
    changelog: 'changelog', roadmap: 'roadmap', genres: 'genres'
  }
  return path.replace(/^\/|\/$/g, '').split('/').map(s => slugMap[s] || s)
}

// Topbar HTML
function topbarHTML(currentPath) {
  const topbarLinks = [
    { href: '/components/', label: 'Components',   num: '01', group: 'library' },
    { href: '/charts/',     label: 'Charts',        num: '02', group: 'library' },
    { href: '/changelog/',  label: 'Changelog',     num: '03', group: 'project' },
    { href: '/roadmap/',    label: 'Roadmap',        num: '04', group: 'project' },
    { href: '/genres/',     label: 'Genre Builder', num: '05', group: 'tools'   },
    { href: '/css-api/',    label: 'CSS API',        num: '06', group: 'project' },
  ]
  let prevGroup = null
  const navHTML = topbarLinks.map(({ href, label, num, group }) => {
    let sep = ''
    if (prevGroup && prevGroup !== group) {
      sep = '<span class="topbar-group-sep" aria-hidden="true"></span>'
    }
    prevGroup = group
    const isActive = currentPath === href || (href !== '/' && currentPath.startsWith(href))
    return sep + `<a href="${href}" class="topbar-nav-link"${isActive ? ' aria-current="page"' : ''}><span class="topbar-num" aria-hidden="true">${num}</span>${label}</a>`
  }).join('\n      ')
  return `
    <a href="/" class="topbar-logo" aria-label="ZynaUI home">
      <span class="logo-cycle-wrap">
        <span class="logo-icon-wrap" aria-hidden="true">
          <svg class="logo-svg" viewBox="0 0 510 413" xmlns="http://www.w3.org/2000/svg" focusable="false">
            <g class="logo-z-group">
              <path fill="var(--text)" d="m4.05 66.97c-2.5 0.16-2.67 0.28-2.92 1.66-0.48 2.5 0 79.92 0.47 80.27 0.42 0.3 9.1 0.35 60.5 0.37 93.3 0.03 96.9 0.05 96.9 0.98 0 0.52-8.3 8.88-88.75 89.5-57.57 57.67-55.82 55.9-58.1 59.35-4.03 6.03-7.95 15.35-9.38 22.15-1.72 8.27-2.22 23.52-1 30.08 2.41 12.69 8.21 24.84 16.23 33.92 1.4 1.58 2.75 3.13 2.98 3.45 0.22 0.3 1.92 1.93 3.77 3.6 10.2 9.15 22.52 15.42 35.25 17.97 2.5 0.5 3.93 0.68 9.62 1.23 4.9 0.45 237.53 0.33 237.98-0.15 0.75-0.72 0.38-1.18-11.3-12.8-6.42-6.42-17.97-18.08-25.67-25.9-24.73-25.1-32.43-30.7-48.75-35.52-10.33-3.03-8.95-2.96-57-3.13-43.05-0.12-42.38-0.1-42.38-1.15 0-0.58 81.9-82.83 101.93-102.35 2.9-2.85 6-6 6.87-7 6.05-7 17.65-19.18 33.2-34.88 29.28-29.49 44.35-44.45 45.83-45.37 0.87-0.58 4.95-4.4 10.5-9.9 4.97-4.93 11.27-11.1 14.02-13.72 2.73-2.61 5.7-5.66 6.6-6.75 0.93-1.11 11.2-11.61 22.85-23.33 20.8-20.92 21.78-21.98 20.78-22.45-0.5-0.25-377.25-0.35-381.03-0.13z"/>
            </g>
            <g class="logo-dot-group">
              <path fill="var(--brand)" d="m467.38 1.15c-20.85 2.23-36.35 18.77-35.93 38.35 0.1 4.2 0.75 8.07 1.98 11.75 10.97 32.92 57.57 36.07 72.12 4.87 12.55-26.9-9.1-58.07-38.17-54.97z"/>
            </g>
            <g class="logo-ui-group">
              <path fill="var(--brand)" d="m437.2 103.72c-4.05 0.13-4.75 0.2-5.12 0.6-0.43 0.43-0.45 4.35-0.6 85.5-0.13 58.1-0.25 85.45-0.43 86.31-0.15 0.67-0.4 2.2-0.55 3.37-3.02 21.77-16.47 36.35-36.5 39.52-30.4 4.85-53.57-11.44-57.02-40.15-0.15-1.1-0.43-3.29-0.68-4.87-0.47-3.38-0.77-129.7-0.32-142 0.25-7 0.62-9.13 2.32-13.15 1.73-4.1 0.23-2.85-18.35 15.6-4.75 4.7-8.75 8.45-9.62 9.03-2.13 1.37-53.95 53.25-65.7 65.77-15.05 16.02-15.18 16.2-9.93 14.35 8.38-2.93 17.08-0.15 19.65 6.3 0.7 1.73 0.7 1.73 0.75 30.6 0.03 22.97 0.1 29.1 0.38 30 0.17 0.62 0.47 2.47 0.65 4.12 0.67 6.23 4.6 22.58 6.52 27.18 0.33 0.8 0.6 1.57 0.6 1.72 0 0.18 0.33 1.06 0.73 1.95 0.4 0.9 1.6 3.63 2.65 6.03 3.45 7.85 9.6 18.3 13.97 23.7 0.85 1.07 1.9 2.45 2.33 3.05 14.65 21.17 47.4 41.92 78.2 49.55 2.42 0.58 9.12 1.92 10.5 2.08 0.82 0.07 2.4 0.32 3.5 0.5 1.1 0.2 3.52 0.47 5.37 0.62 1.85 0.15 4.28 0.38 5.38 0.5 4.55 0.5 120.82 0.3 121.32-0.2 1-1 1.33-305.85 0.33-307.08-0.48-0.6-54.55-0.97-70.33-0.5z"/>
            </g>
          </svg>
        </span>
        <span class="logo-text-wrap" aria-hidden="true">
          <span class="logo-wordmark">zyna<span class="logo-ui-text">ui</span></span>
        </span>
      </span>
    </a>
    <nav aria-label="Site">
      ${navHTML}
    </nav>
    <div class="topbar-right">
      <button class="scan-trigger" id="scan-trigger" type="button" aria-label="Search (⌘K)">
        <span>[ SCAN ]</span><kbd>⌘K</kbd>
      </button>
      <span class="badge-version">v${version}</span>
      <div class="genre-selector" id="genre-selector">
        <button class="genre-trigger" id="genre-trigger" aria-haspopup="listbox" aria-controls="genre-panel" aria-expanded="false">
          <span class="genre-trigger-label">[ <span id="genre-active-name">OPS</span> ]</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="genre-panel" id="genre-panel" role="listbox" tabindex="0" aria-label="Select genre">
          <!-- populated by initGenreSwitcher() -->
        </div>
      </div>
      <a href="https://github.com/binary-ly/zynaui" class="github-icon-link" target="_blank" rel="noopener" aria-label="GitHub (opens in new tab)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
      </a>
    </div>
    <button class="hamburger" id="nav-hamburger" aria-label="Toggle navigation" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  `
}

// Sidebar HTML
function sidebarHTML(currentPath) {
  const STORAGE_KEY = 'zyna-nav-open'
  let savedOpen
  try {
    savedOpen = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))
  } catch {
    savedOpen = new Set()
  }

  // Always open the section containing the active page
  const activeSection = NAV.find(cat => cat.items.some(i => i.href === currentPath))?.label

  // If nothing saved yet, use path-based default
  if (savedOpen.size === 0) savedOpen.add(getDefaultOpen(currentPath))

  // Merge: saved state + active section (active always wins open)
  const openCategories = new Set([...savedOpen, ...(activeSection ? [activeSection] : [])])

  // Position breadcrumb — "you are here" terminal path
  const posParts = getPosition(currentPath)
  const posHTML = posParts ? `<div class="sidebar-position" aria-label="Current location">
    <span>~</span>${posParts.map((p, i) => {
      const isLast = i === posParts.length - 1
      return `<span class="sidebar-pos-sep" aria-hidden="true">/</span><span${isLast ? ' class="sidebar-pos-leaf"' : ''}>${p}</span>`
    }).join('')}
  </div>` : ''

  const categories = NAV.map(cat => {
    const isOpen = openCategories.has(cat.label)
    const items = cat.items.map(item => {
      const isActive = item.href === currentPath
      const metaHTML = item.meta ? `<span class="sidebar-item-meta" aria-hidden="true">${item.meta}</span>` : ''
      return `<a href="${item.href}" class="sidebar-item${isActive ? ' active' : ''}"${isActive ? ' aria-current="page"' : ''}>
        <span class="sidebar-dot" aria-hidden="true"></span>
        ${item.label}${metaHTML}
      </a>`
    }).join('\n')

    const countHTML = cat.count
      ? `<span class="sidebar-cat-count" aria-label="${cat.count} items">${cat.count}</span>`
      : ''

    return `<details class="sidebar-category" data-category="${cat.label}"${isOpen ? ' open' : ''}>
      <summary class="sidebar-category-header">
        <span>${cat.label}${countHTML}</span>
        <span class="arrow" aria-hidden="true">›</span>
      </summary>
      ${items}
    </details>`
  }).join('\n')

  const isCharts = currentPath.startsWith('/charts/')
  const snippet = isCharts
    ? `<code>npm i -D zynaui</code><code>import 'zynaui/charts'</code>`
    : `<code>npm i -D zynaui</code>`
  const extraLinks = isCharts
    ? `<a href="https://d3js.org" class="sidebar-item" target="_blank" rel="noopener" aria-label="D3.js v7 (opens in new tab)" style="font-size:0.8rem">D3.js v7 →</a>`
    : ''

  return `
    ${posHTML}
    ${categories}
    <div class="sidebar-divider"></div>
    <div class="sidebar-snippet">
      ${snippet}
    </div>
    <div style="margin-top:0.75rem">
      ${extraLinks}
      <a href="https://github.com/binary-ly/zynaui" class="sidebar-item" target="_blank" rel="noopener" aria-label="GitHub (opens in new tab)" style="font-size:0.8rem">GitHub →</a>
    </div>
  `
}

// Normalize pathname for matching
function getCurrentPath() {
  let path = location.pathname
  // Normalise /index.html → / so the Overview link stays active
  if (path === '/index.html' || path === '') path = '/'
  return path
}

function initGenreSwitcher() {
  const trigger = document.getElementById('genre-trigger')
  const panel   = document.getElementById('genre-panel')
  const nameEl  = document.getElementById('genre-active-name')
  if (!trigger || !panel) return

  let activeName
  try { activeName = localStorage.getItem('zyna-genre') || 'Ops' } catch { activeName = 'Ops' }

  function setTriggerColor(genre) {
    const color = genre.swatches.brand
    trigger.style.setProperty('--genre-trigger-color', color)
  }

  function buildPanel() {
    panel.innerHTML = GENRES.map((genre, i) => {
      const isActive = genre.name === activeName
      const swatches = Object.values(genre.swatches).map(color =>
        `<span class="genre-swatch" style="background:${color}"></span>`
      ).join('')
      return `<div class="genre-option${isActive ? ' is-active-descendant' : ''}" role="option" id="genre-opt-${i}" aria-selected="${isActive}" data-genre="${genre.name}" tabindex="-1">
        <span>${genre.name}</span>
        <span class="genre-swatches">${swatches}</span>
      </div>`
    }).join('')
    const activeOpt = panel.querySelector('[aria-selected="true"]')
    if (activeOpt) panel.setAttribute('aria-activedescendant', activeOpt.id)
  }

  function updateActive(name) {
    activeName = name
    nameEl.textContent = name.toUpperCase()
    const genre = GENRES.find(g => g.name === name)
    if (genre) setTriggerColor(genre)
    panel.querySelectorAll('.genre-option').forEach(el => {
      const isMatch = el.dataset.genre === name
      el.setAttribute('aria-selected', String(isMatch))
      el.classList.toggle('is-active-descendant', isMatch)
      if (isMatch) panel.setAttribute('aria-activedescendant', el.id)
    })
  }

  function openPanel() {
    panel.classList.add('open')
    trigger.setAttribute('aria-expanded', 'true')
    panel.focus()
  }

  function closePanel() {
    panel.classList.remove('open')
    trigger.setAttribute('aria-expanded', 'false')
  }

  buildPanel()
  updateActive(activeName)

  trigger.addEventListener('click', () => {
    const isOpen = panel.classList.contains('open')
    isOpen ? closePanel() : openPanel()
  })

  panel.addEventListener('click', e => {
    const option = e.target.closest('.genre-option')
    if (!option) return
    const name = option.dataset.genre
    applyGenre(name)
    updateActive(name)
    closePanel()
    trigger.focus()
  })

  document.addEventListener('click', e => {
    const selector = document.getElementById('genre-selector')
    if (selector && !selector.contains(e.target)) closePanel()
  })

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closePanel()
      trigger.focus()
      return
    }
    if (e.key === 'Tab' && panel.classList.contains('open')) {
      closePanel()
      return
    }
    if (!panel.classList.contains('open')) return
    const options = [...panel.querySelectorAll('[role="option"]')]
    if (!options.length) return
    const currentId = panel.getAttribute('aria-activedescendant')
    const currentEl = currentId ? document.getElementById(currentId) : null
    const idx = currentEl ? options.indexOf(currentEl) : -1
    let nextIdx = idx
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      nextIdx = Math.min(idx + 1, options.length - 1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      nextIdx = Math.max(idx - 1, 0)
    } else if (e.key === 'Home') {
      e.preventDefault()
      nextIdx = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      nextIdx = options.length - 1
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (currentEl) currentEl.click()
      return
    }
    if (nextIdx !== idx && nextIdx >= 0) {
      options.forEach(o => o.classList.remove('is-active-descendant'))
      options[nextIdx].classList.add('is-active-descendant')
      panel.setAttribute('aria-activedescendant', options[nextIdx].id)
      options[nextIdx].scrollIntoView({ block: 'nearest' })
    }
  })
}

export function init() {
  document.addEventListener('DOMContentLoaded', () => {
    const currentPath = getCurrentPath()

    // Inject topbar
    const topbarEl = document.getElementById('topbar')
    if (topbarEl) topbarEl.innerHTML = topbarHTML(currentPath)

    // Inject sidebar
    const sidebarEl = document.getElementById('sidebar')
    if (sidebarEl) {
      sidebarEl.setAttribute('aria-label', 'Page navigation')
      sidebarEl.innerHTML = sidebarHTML(currentPath)
    }

    // Inject mobile nav overlay for pages without a sidebar (e.g. landing page)
    if (!sidebarEl) {
      const mobileNav = document.createElement('nav')
      mobileNav.id = 'mobile-nav'
      mobileNav.setAttribute('aria-label', 'Mobile navigation')
      mobileNav.innerHTML = `
        <a href="/components/" class="mobile-nav-link">Components</a>
        <a href="/charts/" class="mobile-nav-link">Charts</a>
        <a href="/genres/" class="mobile-nav-link">Genre Builder</a>
        <a href="/changelog/" class="mobile-nav-link">Changelog</a>
        <a href="/roadmap/" class="mobile-nav-link">Roadmap</a>
      `
      document.body.insertBefore(mobileNav, document.body.firstChild)
    }

    // Init genre switcher
    initGenreSwitcher()

    // Hero scroll transparency — landing page only
    if (currentPath === '/') {
      const topbar = document.getElementById('topbar')
      if (topbar) {
        topbar.classList.add('topbar--hero')
        window.addEventListener('scroll', () => {
          topbar.classList.toggle('topbar--scrolled', window.scrollY > 20)
        }, { passive: true })
      }
    }

    // Persist category open/close state
    document.querySelectorAll('.sidebar-category').forEach(details => {
      details.addEventListener('toggle', () => {
        const STORAGE_KEY = 'zyna-nav-open'
        const open = new Set(
          [...document.querySelectorAll('.sidebar-category[open]')].map(d => d.dataset.category)
        )
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...open])) } catch {}
      })
    })

    // Mobile hamburger toggle
    const hamburger = document.getElementById('nav-hamburger')
    if (hamburger) {
      hamburger.addEventListener('click', () => {
        const isOpen = document.body.classList.toggle('nav-open')
        hamburger.setAttribute('aria-expanded', String(isOpen))
      })
    }

    // Close nav on overlay click (mobile)
    document.addEventListener('click', e => {
      if (!document.body.classList.contains('nav-open')) return
      const sidebar = document.getElementById('sidebar')
      const mobileNav = document.getElementById('mobile-nav')
      const hamburger = document.getElementById('nav-hamburger')
      const clickedInsideNav = sidebar?.contains(e.target) || mobileNav?.contains(e.target)
      if (!clickedInsideNav && !hamburger?.contains(e.target)) {
        document.body.classList.remove('nav-open')
        hamburger?.setAttribute('aria-expanded', 'false')
      }
    })
  })
}

// Auto-init
init()
