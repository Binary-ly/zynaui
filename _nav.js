const NAV = [
  {
    label: 'Getting Started',
    items: [
      { label: 'Overview', href: '/' }
    ]
  },
  {
    label: 'Actions',
    items: [
      { label: 'Button', href: '/components/btn/' }
    ]
  },
  {
    label: 'Data Display',
    items: [
      { label: 'Card',  href: '/components/card/' },
      { label: 'Badge', href: '/components/badge/' }
    ]
  },
  {
    label: 'Feedback',
    items: [
      { label: 'Alert', href: '/components/alert/' }
    ]
  },
  {
    label: 'Charts',
    items: [
      { label: 'Waffle',      href: '/charts/waffle/' },
      { label: 'Timeline',    href: '/charts/timeline/' },
      { label: 'Nightingale', href: '/charts/nightingale/' },
      { label: 'Lollipop',    href: '/charts/lollipop/' },
      { label: 'Orbital',     href: '/charts/orbital/' }
    ]
  }
]

// Topbar HTML
function topbarHTML() {
  return `
    <a href="/" class="topbar-logo">
      <div class="logo-mark">Z</div>
      <span>zyna<span style="color:var(--gold)">ui</span></span>
    </a>
    <div class="topbar-divider"></div>
    <div class="topbar-right">
      <span class="badge-version">v0.1.0-beta</span>
      <a href="https://github.com/binary-ly/zynaui" class="btn-topbar btn-github-topbar" target="_blank" rel="noopener">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
        GitHub
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
  let openCategories
  try {
    openCategories = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))
  } catch {
    openCategories = new Set()
  }

  // Default: open the category of the active page
  const activeHref = NAV.flatMap(c => c.items).find(i => i.href === currentPath)?.href
  NAV.forEach(cat => {
    if (cat.items.some(i => i.href === currentPath)) {
      openCategories.add(cat.label)
    }
  })

  const categories = NAV.map(cat => {
    const isOpen = openCategories.has(cat.label)
    const items = cat.items.map(item => {
      const isActive = item.href === currentPath
      return `<a href="${item.href}" class="sidebar-item${isActive ? ' active' : ''}"${isActive ? ' aria-current="page"' : ''}>
        <span class="sidebar-dot"></span>
        ${item.label}
      </a>`
    }).join('\n')

    return `<details class="sidebar-category" data-category="${cat.label}"${isOpen ? ' open' : ''}>
      <summary class="sidebar-category-header">
        ${cat.label}
        <span class="arrow">›</span>
      </summary>
      ${items}
    </details>`
  }).join('\n')

  return `
    ${categories}
    <div class="sidebar-divider"></div>
    <div class="sidebar-snippet">
      <code>npm i -D zynaui</code>
      <code>import 'zynaui/charts'</code>
    </div>
    <div style="margin-top:0.75rem">
      <a href="https://d3js.org" class="sidebar-item" target="_blank" rel="noopener" style="font-size:0.8rem">D3.js v7 →</a>
      <a href="https://github.com/binary-ly/zynaui" class="sidebar-item" target="_blank" rel="noopener" style="font-size:0.8rem">GitHub →</a>
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

export function init() {
  document.addEventListener('DOMContentLoaded', () => {
    const currentPath = getCurrentPath()

    // Inject topbar
    const topbarEl = document.getElementById('topbar')
    if (topbarEl) topbarEl.innerHTML = topbarHTML()

    // Inject sidebar
    const sidebarEl = document.getElementById('sidebar')
    if (sidebarEl) sidebarEl.innerHTML = sidebarHTML(currentPath)

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

    // Close sidebar on overlay click (mobile)
    document.addEventListener('click', e => {
      if (!document.body.classList.contains('nav-open')) return
      const sidebar = document.getElementById('sidebar')
      const hamburger = document.getElementById('nav-hamburger')
      if (sidebar && !sidebar.contains(e.target) && !hamburger?.contains(e.target)) {
        document.body.classList.remove('nav-open')
        hamburger?.setAttribute('aria-expanded', 'false')
      }
    })
  })
}

// Auto-init
init()
