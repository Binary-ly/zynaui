import { ZynaChart } from './base.js'
import { select } from 'd3-selection'
import { min, max } from 'd3-array'
import { area as d3area, line as d3line } from 'd3-shape'
import { scaleLinear } from 'd3-scale'

/**
 * <zyna-rupture>
 *
 * Threshold-breach area chart. Below the threshold the fill is calm and brand-
 * coloured; at the exact crossing point a jagged seam splits the fill, and past
 * it the fill and stroke shift to danger with a hot glow. The chart performs the
 * alarm rather than annotating it.
 *
 * Attributes:
 *   data            — JSON array of { x, y } (single series). `x` is the axis label.
 *   threshold       — the breach level (required, numeric).
 *   threshold-label — caption drawn on the threshold line.
 *   direction       — 'above' (default; breach when exceeding) or 'below'
 *                     (breach when dipping under, e.g. funding levels).
 *   color           — accent for the calm segment. Default: var(--zyna)
 *   theme           — 'dark' (default) or 'light'
 *   height          — explicit height in px. Auto-derived from width when omitted.
 *   label-format    — D3-style number format for the threshold label value.
 */
export class ZynaRupture extends ZynaChart {
  static get observedAttributes() {
    return ['data', 'threshold', 'threshold-label', 'direction', 'color', 'theme', 'height', 'label-format']
  }

  _render() {
    const raw        = this._json('data', [])
    const accent     = this._attr('color', this._brand())
    const dark       = this._theme() !== 'light'
    const thrAttr    = parseFloat(this._attr('threshold', ''))
    const thrLabel   = this._attr('threshold-label', '')
    const below      = this._attr('direction', 'above') === 'below'
    const fmt        = this._attr('label-format', '')
    const heightAttr = parseInt(this._attr('height', '0'))
    const textC      = dark ? '#F0EBE0' : '#1A1A20'
    const labelC     = this._muted()
    const gridC      = dark ? '#1E1E24' : '#E5E1D4'
    const danger     = this._danger()
    const uid        = this._uid

    if (!raw.length) { this._warnEmpty('zyna-rupture'); return }
    if (!Number.isFinite(thrAttr)) {
      if (!this.hasAttribute('data-silent')) {
        console.warn('[zyna-rupture] Missing or invalid `threshold`. Provide a numeric `threshold` attribute.')
      }
      return
    }

    // Keep points with a finite y; position by index, label by x.
    // Filter non-finite y FIRST, then index — so x-positions and the crossing
    // share one contiguous [0, N-1] space (a dropped point mustn't shift later
    // points off the scale).
    const points = raw
      .map(d => ({ x: d.x, y: +d.y }))
      .filter(d => Number.isFinite(d.y))
      .map((d, i) => ({ i, x: d.x != null ? String(d.x) : String(i), y: d.y }))
    if (points.length < 2) { this._warnEmpty('zyna-rupture'); return }
    const N = points.length

    const W = this.clientWidth || 600
    const H = heightAttr > 0 ? heightAttr : Math.max(240, Math.round(W * 0.5))
    const m = { left: Math.max(40, W * 0.08), right: 14, top: 16, bottom: 28 }

    const lo   = Math.min(min(points, d => d.y), thrAttr)
    const hi   = Math.max(max(points, d => d.y), thrAttr)
    const span = (hi - lo) || Math.abs(hi) || 1
    const yMin = lo - span * 0.08
    const yMax = hi + span * 0.08

    const xScale = scaleLinear().domain([0, N - 1]).range([m.left, W - m.right])
    const yScale = scaleLinear().domain([yMin, yMax]).range([H - m.bottom, m.top])
    const baseY  = H - m.bottom
    const fSm    = Math.max(9, W * 0.02)

    const breachState = y => below ? y < thrAttr : y > thrAttr

    // First index in a breach state, and the interpolated crossing point.
    let bi = points.findIndex(d => breachState(d.y))
    let cross = null
    if (bi > 0) {
      const a = points[bi - 1], b = points[bi]
      const t = (thrAttr - a.y) / ((b.y - a.y) || 1)
      cross = { i: (bi - 1) + Math.max(0, Math.min(1, t)), y: thrAttr }
    } else if (bi === 0) {
      cross = { i: 0, y: thrAttr }
    }

    const calmPts   = bi > 0 ? points.slice(0, bi).map(d => ({ i: d.i, y: d.y })).concat([cross]) : (bi === -1 ? points.map(d => ({ i: d.i, y: d.y })) : [])
    const breachPts = bi >= 0 ? [cross].concat(points.slice(bi).map(d => ({ i: d.i, y: d.y }))) : []

    // Persist the SVG — only update viewBox/dimensions on resize.
    let svg = select(this).select('svg')
    if (svg.empty()) svg = select(this).append('svg').style('display', 'block')
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', W).attr('height', H)

    const breachLabel = bi >= 0 ? points[bi].x : null
    this._applyA11y(svg,
      `Threshold-breach chart, ${N} points against threshold ${this._fmt(thrAttr, fmt)}; ` +
      (breachLabel != null ? `breached ${below ? 'below' : 'above'} at ${breachLabel}.` : 'never breached.'))

    const thY = yScale(thrAttr)

    // ── defs: fine hatch · depth gradients · hot glow ────────────────────────
    let defs = svg.select('defs')
    if (defs.empty()) defs = svg.insert('defs', ':first-child')
    let pat = defs.select(`#rp-hatch-${uid}`)
    if (pat.empty()) {
      pat = defs.append('pattern').attr('id', `rp-hatch-${uid}`)
        .attr('width', 6).attr('height', 6).attr('patternTransform', 'rotate(45)').attr('patternUnits', 'userSpaceOnUse')
      pat.append('line').attr('class', 'ln').attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 6).attr('stroke-width', 1)
    }
    pat.select('.ln').attr('stroke', danger).attr('opacity', 0.38)
    // Vertical depth gradient per fill — brighter near the line, fading to the baseline.
    const mkGrad = (id, color, top, bot) => {
      let g = defs.select(`#${id}`)
      if (g.empty()) {
        g = defs.append('linearGradient').attr('id', id).attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 1)
        g.append('stop').attr('offset', '0%'); g.append('stop').attr('offset', '100%')
      }
      g.select('stop:nth-child(1)').attr('stop-color', color).attr('stop-opacity', top)
      g.select('stop:nth-child(2)').attr('stop-color', color).attr('stop-opacity', bot)
    }
    mkGrad(`rp-calm-${uid}`, accent, 0.30, 0.05)
    mkGrad(`rp-breach-${uid}`, danger, 0.32, 0.06)
    let glow = defs.select(`#rp-glow-${uid}`)
    if (glow.empty()) {
      glow = defs.append('filter').attr('id', `rp-glow-${uid}`)
        .attr('x', '-30%').attr('y', '-40%').attr('width', '160%').attr('height', '180%')
      glow.append('feDropShadow').attr('dx', 0).attr('dy', 0).attr('stdDeviation', 2.6).attr('flood-opacity', 0.85)
    }
    glow.select('feDropShadow').attr('flood-color', danger)

    const areaGen = d3area().x(d => xScale(d.i)).y0(baseY).y1(d => yScale(d.y))
    const lineGen = d3line().x(d => xScale(d.i)).y(d => yScale(d.y))
    const setPath = (cls, d, attrs) => {
      let p = svg.select(`path.${cls}`)
      if (p.empty()) p = svg.append('path').attr('class', cls)
      p.attr('d', d || null).attr('display', d ? null : 'none')
      for (const k in attrs) p.attr(k, attrs[k])
      return p
    }

    // ── Fracture fault — a fine, irregular crack the two fills interlock along
    // at the crossing, so the surface genuinely appears ruptured (not a straight
    // edge with a zigzag drawn over it). ─────────────────────────────────────
    const sx = cross ? xScale(cross.i) : 0
    let faultPts = null, faultD = null
    if (bi > 0 && cross) {
      const hgt  = baseY - thY
      const segs = Math.max(8, Math.min(28, Math.round(hgt / 12)))
      const amp  = Math.max(2, Math.min(4.5, W * 0.006))
      faultPts = []
      for (let k = 0; k <= segs; k++) {
        const y = thY + hgt * (k / segs)
        let dx = 0
        if (k > 0 && k < segs) {
          const r = Math.abs(Math.sin(k * 12.9898 + cross.i * 7.13) * 43758.5453) % 1
          dx = (k % 2 ? -1 : 1) * amp * (0.4 + 0.6 * r)
        }
        faultPts.push([sx + dx, y])
      }
      faultD = 'M' + faultPts.map(p => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L')
    }

    const px = d => xScale(d.i).toFixed(1), py = d => yScale(d.y).toFixed(1)
    const xEnd = xScale(points[N - 1].i)

    // Calm region — left of the fault (or the whole area when nothing breaches).
    const calmFillD = faultPts
      ? `M${m.left.toFixed(1)} ${baseY.toFixed(1)} ` +
        calmPts.map(d => `L${px(d)} ${py(d)} `).join('') +
        faultPts.slice(1).map(p => `L${p[0].toFixed(1)} ${p[1].toFixed(1)} `).join('') + 'Z'
      : (calmPts.length > 1 ? areaGen(calmPts) : null)
    // Breach region — right of the fault (or the whole area when it starts breached).
    const breachFillD = faultPts
      ? `M${sx.toFixed(1)} ${baseY.toFixed(1)} ` +
        [...faultPts].reverse().slice(1).map(p => `L${p[0].toFixed(1)} ${p[1].toFixed(1)} `).join('') +
        breachPts.slice(1).map(d => `L${px(d)} ${py(d)} `).join('') +
        `L${xEnd.toFixed(1)} ${baseY.toFixed(1)} Z`
      : (breachPts.length > 1 ? areaGen(breachPts) : null)

    // Fills + hatch (bottom), then reference line, then data lines, then the seam on top.
    setPath('rp-calm-fill',    calmFillD,   { fill: `url(#rp-calm-${uid})`,   stroke: 'none' })
    setPath('rp-breach-fill',  breachFillD, { fill: `url(#rp-breach-${uid})`, stroke: 'none' })
    setPath('rp-breach-hatch', breachFillD, { fill: `url(#rp-hatch-${uid})`,  stroke: 'none' })

    // Threshold reference line + label.
    let thLine = svg.select('line.rp-threshold')
    if (thLine.empty()) thLine = svg.append('line').attr('class', 'rp-threshold')
    thLine.attr('x1', m.left).attr('x2', W - m.right).attr('y1', thY).attr('y2', thY)
      .attr('stroke', labelC).attr('stroke-width', 1).attr('stroke-dasharray', '5 3').attr('opacity', 0.7)
    let thTxt = svg.select('text.rp-threshold-label')
    if (thTxt.empty()) thTxt = svg.append('text').attr('class', 'rp-threshold-label')
    thTxt.attr('x', m.left + 2).attr('y', thY - 4)
      .attr('font-family', 'monospace').attr('font-size', `${fSm}px`).attr('fill', labelC)
      .text(thrLabel || `${this._fmt(thrAttr, fmt)}${below ? ' (floor)' : ''}`)

    setPath('rp-calm-line',   calmPts.length > 1 ? lineGen(calmPts) : null,   { fill: 'none', stroke: accent, 'stroke-width': 1.6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' })
    setPath('rp-breach-line', breachPts.length > 1 ? lineGen(breachPts) : null, { fill: 'none', stroke: danger, 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', filter: `url(#rp-glow-${uid})` })

    // The fracture seam: a soft hot glow under a crisp bright crack.
    setPath('rp-seam-glow', faultD, { fill: 'none', stroke: danger, 'stroke-width': 3.5, 'stroke-linejoin': 'round', opacity: 0.22, filter: `url(#rp-glow-${uid})` })
    setPath('rp-seam',      faultD, { fill: 'none', stroke: danger, 'stroke-width': 1.4, 'stroke-linejoin': 'round', opacity: 0.95 })

    // X-axis labels — every Nth to avoid crowding.
    const maxLabels = Math.max(2, Math.floor((W - m.left - m.right) / 70))
    const step      = Math.max(1, Math.ceil(N / maxLabels))
    svg.selectAll('text.rp-xlabel').data(points, d => d.i)
      .join(
        enter  => enter.append('text').attr('class', 'rp-xlabel'),
        update => update,
        exit   => exit.remove()
      )
      .each(function(d, idx) {
        // Anchor the edge labels inward so the first/last never clip the viewBox.
        const first = idx === 0, last = idx === N - 1
        select(this)
          .attr('display', idx % step === 0 ? null : 'none')
          .attr('x', first ? m.left : last ? W - m.right : xScale(d.i)).attr('y', H - m.bottom + 16)
          .attr('text-anchor', first ? 'start' : last ? 'end' : 'middle').attr('font-family', 'monospace')
          .attr('font-size', `${fSm}px`).attr('fill', labelC)
          .text(d.x)
      })
  }
}

if (!customElements.get('zyna-rupture')) {
  customElements.define('zyna-rupture', ZynaRupture)
}
