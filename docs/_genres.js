/**
 * Genre runtime — applies genre token maps to :root at page load.
 * Genre definitions (tokens, swatches, styles) live in src/plugin/genres/.
 */
import { GENRES } from '../src/plugin/genres/index.js'

export { GENRES }

const STORAGE_KEY = 'zyna-genre'

export function applyGenre(name) {
  const genre = GENRES.find(g => g.name === name)
  if (!genre) return

  const root = document.documentElement

  // Core DOM mutation — extracted so View Transitions API can capture before/after frames.
  // New genre tokens (including --z-ease-enter/exit) are set INSIDE this function so the
  // browser uses the new genre's easing curves when animating the transition itself.
  function apply() {
    // Clear all token overrides from all genres first
    for (const g of GENRES) {
      for (const prop of Object.keys(g.tokens)) {
        root.style.removeProperty(prop)
      }
    }

    // Apply new genre tokens
    for (const [prop, value] of Object.entries(genre.tokens)) {
      root.style.setProperty(prop, value)
    }

    if (name === 'Ops') {
      delete root.dataset.genre
    } else {
      root.dataset.genre = name.toLowerCase()
    }

    try {
      localStorage.setItem(STORAGE_KEY, name)
      if (name === 'Ops') localStorage.removeItem(STORAGE_KEY + '-tokens')
      else localStorage.setItem(STORAGE_KEY + '-tokens', JSON.stringify(genre.tokens))
    } catch {}

    window.dispatchEvent(new CustomEvent('zyna-genre', { detail: { name } }))
  }

  // Progressive enhancement — browsers without View Transitions API snap as before.
  if (document.startViewTransition) {
    document.startViewTransition(apply)
  } else {
    apply()
  }
}

export function loadGenre() {
  let name = 'Ops'
  try { name = localStorage.getItem(STORAGE_KEY) || 'Ops' } catch {}
  applyGenre(name)
  return name
}

// Apply immediately to prevent FOUC
loadGenre()
