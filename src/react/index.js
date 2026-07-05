// Added during Next.js integration testing (Phase 5 — Turbopack):
// React wrapper components for ZynaUI charts. The IIFE content is inlined
// as a string at build time via Vite's ?raw import — dist/react.js ships
// fully self-contained with no runtime file or CDN dependency.
// 'use client' is injected as a banner in vite.react.config.js so it
// survives Rollup tree-shaking and lands at the top of the output file.

import { createElement, useEffect } from 'react'

// Vite resolves ?raw at build time — the output has the IIFE as a string literal.
// This keeps the import completely opaque to Turbopack's static analysis: no
// zynaui/charts module import, no HTMLElement reference at import time.
import _iife from '../../dist/zyna-charts.iife.js?raw'

let _loaded = false

function _inject() {
  if (_loaded || typeof window === 'undefined') return
  _loaded = true
  const s = document.createElement('script')
  s.textContent = _iife
  document.head.appendChild(s)
}

function useZyna() {
  useEffect(_inject, [])
}

export function ZynaWaffle({ data, cols = 10, gap = 3, color, theme, ...rest }) {
  useZyna()
  return createElement('zyna-waffle', {
    data: JSON.stringify(data),
    cols: String(cols),
    gap: String(gap),
    ...(color != null && { color }),
    ...(theme != null && { theme }),
    ...rest,
  })
}

export function ZynaTimeline({ data, highlight, height, color, theme, ...rest }) {
  useZyna()
  return createElement('zyna-timeline', {
    data: JSON.stringify(data),
    ...(highlight != null && { highlight }),
    ...(height  != null && { height: String(height) }),
    ...(color   != null && { color }),
    ...(theme   != null && { theme }),
    ...rest,
  })
}

export function ZynaNightingale({ data, height, color, theme, ...rest }) {
  useZyna()
  return createElement('zyna-nightingale', {
    data: JSON.stringify(data),
    ...(height != null && { height: String(height) }),
    ...(color  != null && { color }),
    ...(theme  != null && { theme }),
    ...rest,
  })
}

export function ZynaLollipop({ data, height, color, theme, ...rest }) {
  useZyna()
  return createElement('zyna-lollipop', {
    data: JSON.stringify(data),
    ...(height != null && { height: String(height) }),
    ...(color  != null && { color }),
    ...(theme  != null && { theme }),
    ...rest,
  })
}

export function ZynaOrbital({ data, height, color, theme, ...rest }) {
  useZyna()
  return createElement('zyna-orbital', {
    data: JSON.stringify(data),
    ...(height != null && { height: String(height) }),
    ...(color  != null && { color }),
    ...(theme  != null && { theme }),
    ...rest,
  })
}

export function ZynaCandlestick({ data, height, ticks, color, theme, ...rest }) {
  useZyna()
  return createElement('zyna-candlestick', {
    data: JSON.stringify(data),
    ...(height != null && { height: String(height) }),
    ...(ticks  != null && { ticks: String(ticks) }),
    ...(color  != null && { color }),
    ...(theme  != null && { theme }),
    ...rest,
  })
}

export function ZynaGauge({ value, min, max, zones, label, height, thickness, color, theme, ...rest }) {
  useZyna()
  return createElement('zyna-gauge', {
    ...(value     != null && { value: String(value) }),
    ...(min       != null && { min: String(min) }),
    ...(max       != null && { max: String(max) }),
    ...(zones     != null && { zones: JSON.stringify(zones) }),
    ...(label     != null && { label }),
    ...(height    != null && { height: String(height) }),
    ...(thickness != null && { thickness: String(thickness) }),
    ...(color     != null && { color }),
    ...(theme     != null && { theme }),
    ...rest,
  })
}

export function ZynaLine({ data, annotations, height, tension, theme, ...rest }) {
  useZyna()
  return createElement('zyna-line', {
    data: JSON.stringify(data),
    ...(annotations != null && { annotations: JSON.stringify(annotations) }),
    ...(height      != null && { height: String(height) }),
    ...(tension     != null && { tension: String(tension) }),
    ...(theme       != null && { theme }),
    ...rest,
  })
}
