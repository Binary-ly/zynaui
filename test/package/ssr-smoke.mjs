/**
 * Package smoke test — imports every documented export map entry the way a
 * Node/SSR consumer would (self-referencing imports resolve through the
 * "exports" field in package.json, same as an installed copy).
 *
 * Catches: subpath exports that crash Node (HTMLElement at module top level),
 * stubs without named exports, and React wrappers that are documented but
 * missing. Requires `npm run build` first — it exercises dist/, not src/.
 */
const CHART_EXPORTS = [
  'ZynaWaffle', 'ZynaTimeline', 'ZynaNightingale', 'ZynaLollipop',
  'ZynaOrbital', 'ZynaCandlestick', 'ZynaGauge', 'ZynaLine',
]
const SUBPATHS = [
  'waffle', 'timeline', 'nightingale', 'lollipop',
  'orbital', 'candlestick', 'gauge', 'line',
]

let failed = false
const fail = msg => { console.error(`✘ ${msg}`); failed = true }

// Main charts entry — named ESM imports must parse under Node (stub path).
const charts = await import('zynaui/charts')
for (const name of CHART_EXPORTS) {
  if (typeof charts[name] !== 'function') fail(`zynaui/charts is missing named export ${name}`)
}

// Every per-chart subpath must be importable in Node without crashing.
for (const p of SUBPATHS) {
  try {
    await import(`zynaui/charts/${p}`)
  } catch (e) {
    fail(`import 'zynaui/charts/${p}' crashed in Node: ${e.message}`)
  }
}

// React wrappers — every chart documented in the README must be exported.
const react = await import('zynaui/react')
for (const name of CHART_EXPORTS) {
  if (typeof react[name] !== 'function') fail(`zynaui/react is missing wrapper ${name}`)
}

// Genres entry.
const genres = await import('zynaui/genres')
for (const name of ['defineGenre', 'registerGenre', 'genresPlugin', 'GENRES']) {
  if (!(name in genres)) fail(`zynaui/genres is missing export ${name}`)
}

// Root plugin entry (CJS main via import interop).
const plugin = await import('zynaui')
if (typeof (plugin.default ?? plugin) !== 'function' && typeof (plugin.default ?? plugin) !== 'object') {
  fail('zynaui root export is not a plugin')
}

if (failed) process.exit(1)
console.log('✔ package smoke: all export map entries import cleanly in Node')
