import { ZynaChart } from './base.js'
import { select } from 'd3-selection'
import { max } from 'd3-array'
import { scalePoint } from 'd3-scale'

/**
 * <zyna-pulse>
 *
 * Stacked ECG / seismograph tracks — one horizontal track per entity, each with
 * its own zero baseline. Because every track shares the same x-axis, simultaneous
 * events line up vertically: the chart is built for "what happened everywhere at
 * point N?". Values dip below each track's own baseline when negative. Strokes
 * get a soft same-colour trail so the traces glow, strongest under the Phosphor
 * genre.
 *
 * Attributes:
 *   data       — JSON array of { label, values: [n, …], color? }
 *   x-labels   — JSON array of point labels. '' entries suppress that label.
 *   amplitude  — px of vertical swing per track. Default: auto (scales to track).
 *   marker     — JSON array of { x, label? } vertical event rules spanning all
 *                tracks. `x` matches an x-label or a 0-based point index.
 *   color      — fallback accent for tracks without their own colour. Default: var(--zyna)
 *   theme      — 'dark' (default) or 'light'
 *   height     — explicit height in px. Auto-derived from track count when omitted.
 */
export class ZynaPulse extends ZynaChart {
  static get observedAttributes() {
    return ['data', 'x-labels', 'amplitude', 'marker', 'color', 'theme', 'height']
  }

  _render() {
    const data       = this._json('data', [])
    const xLabels    = this._json('x-labels', [])
    const markers    = this._json('marker', [])
    const accent     = this._attr('color', this._brand())
    const dark       = this._theme() !== 'light'
    const ampAttr    = parseFloat(this._attr('amplitude', '0'))
    const heightAttr = parseInt(this._attr('height', '0'))
    const textC      = dark ? '#F0EBE0' : '#1A1A20'
    const labelC     = this._muted()
    const gridC      = dark ? '#1E1E24' : '#E5E1D4'
    const danger     = this._danger()
    const palette    = [accent, '#00D4FF', this._success(), '#BF5FFF', '#E07B54', danger]

    if (!data.length) { this._warnEmpty('zyna-pulse'); return }

    const tracks = data.map((d, i) => ({
      label:  d.label != null ? String(d.label) : `#${i + 1}`,
      color:  d.color || palette[i % palette.length],
      values: (Array.isArray(d.values) ? d.values : []).map(v => (Number.isFinite(+v) ? +v : 0)),
    }))
    const M = max(tracks, t => t.values.length) || 0
    if (!M) { this._warnEmpty('zyna-pulse'); return }

    // Event markers — resolved up front because a captioned marker reserves a
    // band above the tracks; drawn last so the rules sit on top of the traces.
    const mk = (Array.isArray(markers) ? markers : []).map(mrk => {
      let idx = -1
      if (xLabels.length) idx = xLabels.findIndex(l => String(l) === String(mrk.x))
      if (idx === -1 && (typeof mrk.x === 'number' || (typeof mrk.x === 'string' && mrk.x.trim() !== '')) && Number.isFinite(+mrk.x)) idx = +mrk.x
      return (idx >= 0 && idx < M) ? { idx, label: mrk.label != null ? String(mrk.label) : '', key: `${idx}|${mrk.label || ''}` } : null
    }).filter(Boolean)

    const n    = tracks.length
    const W    = this.clientWidth || 600
    const trkH = Math.max(28, Math.min(64, W * 0.1))
    const fSm  = Math.max(9, W * 0.02)
    // Captions get their own band above the first track instead of sitting
    // inside it, where the trace's upper swing ran straight through the text.
    const capH = mk.some(d => d.label) ? fSm + 6 : 0
    const H    = heightAttr > 0 ? heightAttr : Math.max(160, n * trkH + 40 + capH)

    const m      = { left: Math.max(52, W * 0.13), right: 14, top: 16 + capH, bottom: 26 }
    const innerW = W - m.left - m.right
    const innerH = H - m.top - m.bottom
    const trackH = innerH / n
    const amp    = ampAttr > 0 ? ampAttr : trackH * 0.38

    const x = scalePoint().domain(Array.from({ length: M }, (_, j) => j)).range([0, innerW]).padding(0)

    // Persist the SVG — only update viewBox/dimensions on resize.
    let svg = select(this).select('svg')
    if (svg.empty()) svg = select(this).append('svg').style('display', 'block')
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', W).attr('height', H)

    // A11y: track with the greatest amplitude.
    let peak = { amp: -Infinity, label: tracks[0].label }
    tracks.forEach(t => {
      const a = max(t.values.map(v => Math.abs(v))) || 0
      if (a > peak.amp) peak = { amp: a, label: t.label }
    })
    this._applyA11y(svg, `Pulse sequence, ${n} signal tracks over ${M} points; peak amplitude on ${peak.label}.`)

    const baselineOf = i => m.top + (i + 0.5) * trackH

    // Per-track group: baseline + glow trail + main trace + label.
    svg.selectAll('g.pl-track').data(tracks, d => d.label)
      .join(
        enter => {
          const g = enter.append('g').attr('class', 'pl-track')
          g.append('line').attr('class', 'pl-base')
          g.append('polyline').attr('class', 'pl-glow')
          g.append('polyline').attr('class', 'pl-trace')
          g.append('text').attr('class', 'pl-label')
          return g
        },
        update => update,
        exit   => exit.remove()
      )
      .each(function(t, i) {
        const g       = select(this)
        const base    = baselineOf(i)
        const maxAbs  = max(t.values.map(v => Math.abs(v))) || 1
        const pts     = t.values.map((v, j) => `${(m.left + x(j)).toFixed(1)},${(base - v / maxAbs * amp).toFixed(1)}`).join(' ')

        g.select('.pl-base')
          .attr('x1', m.left).attr('x2', m.left + innerW).attr('y1', base).attr('y2', base)
          .attr('stroke', gridC).attr('stroke-width', 0.8)
        g.select('.pl-glow')
          .attr('points', pts).attr('fill', 'none')
          .attr('stroke', t.color).attr('stroke-width', 4.5).attr('opacity', 0.14)
          .attr('stroke-linejoin', 'round')
        g.select('.pl-trace')
          .attr('points', pts).attr('fill', 'none')
          .attr('stroke', t.color).attr('stroke-width', 1.3)
          .attr('stroke-linejoin', 'round')
        g.select('.pl-label')
          .attr('x', m.left - 8).attr('y', base + fSm * 0.35)
          .attr('text-anchor', 'end').attr('font-size', `${fSm}px`).attr('fill', textC)
          .text(t.label)
      })

    // X-axis point labels (bottom). '' suppresses.
    const xData = Array.from({ length: M }, (_, j) => ({ j, label: xLabels[j] != null ? String(xLabels[j]) : '' }))
    svg.selectAll('text.pl-xlabel').data(xData, d => d.j)
      .join(
        enter  => enter.append('text').attr('class', 'pl-xlabel'),
        update => update,
        exit   => exit.remove()
      )
      .each(function(d) {
        // Anchor the edge labels inward so the first/last never clip the viewBox.
        const first = d.j === 0, last = d.j === M - 1
        select(this)
          .attr('display', d.label ? null : 'none')
          .attr('x', m.left + x(d.j)).attr('y', H - m.bottom + 16)
          .attr('text-anchor', first ? 'start' : last ? 'end' : 'middle').attr('font-family', 'monospace')
          .attr('font-size', `${fSm}px`).attr('fill', labelC)
          .text(d.label)
      })

    svg.selectAll('g.pl-marker').data(mk, d => d.key)
      .join(
        enter => {
          const g = enter.append('g').attr('class', 'pl-marker')
          g.append('line').attr('class', 'pl-marker-line')
          g.append('text').attr('class', 'pl-marker-label')
          return g
        },
        update => update,
        exit   => exit.remove()
      )
      .each(function(d) {
        const g  = select(this)
        const mx = m.left + x(d.idx)
        g.select('.pl-marker-line')
          .attr('x1', mx).attr('x2', mx).attr('y1', m.top).attr('y2', m.top + innerH)
          .attr('stroke', danger).attr('stroke-width', 1).attr('stroke-dasharray', '4 3')
        const lbl = g.select('.pl-marker-label')
          .attr('display', d.label ? null : 'none')
          .attr('x', mx + 4).attr('y', m.top - 6).attr('text-anchor', 'start')
          .attr('font-family', 'monospace').attr('font-size', `${fSm}px`).attr('fill', danger)
          .text(d.label)
        // A caption near the right edge flips to the left of its rule so it
        // stays inside the viewBox.
        const tw = lbl.node().getComputedTextLength ? lbl.node().getComputedTextLength() : 0
        if (mx + 4 + tw > W - 2) lbl.attr('x', mx - 4).attr('text-anchor', 'end')
      })
  }
}

if (!customElements.get('zyna-pulse')) {
  customElements.define('zyna-pulse', ZynaPulse)
}
