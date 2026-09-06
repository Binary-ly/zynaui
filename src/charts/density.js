import { ZynaChart } from './base.js'
import { select } from 'd3-selection'
import { extent, mean as d3mean, median as d3median } from 'd3-array'
import { scaleLinear, scalePoint } from 'd3-scale'
import { area as d3area, curveCatmullRom } from 'd3-shape'

/**
 * <zyna-density>
 *
 * Flow Density — each time period is drawn as a vertical density silhouette
 * (a violin), so reading left-to-right shows the whole distribution shifting,
 * splitting, or tightening — everything a line-of-averages hides. Medians are
 * connected by a flowing spine. Densities are estimated with an Epanechnikov
 * kernel over ~40 sample points.
 *
 * The y-axis is the sample value itself (e.g. response time): horizontal
 * gridlines and left-edge tick labels mark that scale, shared across all periods.
 *
 * Attributes:
 *   data         — JSON array of { label, values: [raw samples…] }
 *   bandwidth    — KDE smoothing. Default: auto (Silverman's rule, per period).
 *   y-min        — y-axis lower bound. Default: data extent.
 *   y-max        — y-axis upper bound. Default: data extent.
 *   y-label      — axis title drawn rotated on the left (e.g. 'Response time (ms)').
 *   label-format — D3-style number format for the y-axis tick labels.
 *   color        — accent for the silhouettes and spine. Default: var(--zyna)
 *   theme        — 'dark' (default) or 'light'
 *   height       — explicit height in px. Auto-derived from width when omitted.
 */
export class ZynaDensity extends ZynaChart {
  static get observedAttributes() {
    return ['data', 'bandwidth', 'y-min', 'y-max', 'y-label', 'label-format', 'color', 'theme', 'height']
  }

  _render() {
    const data       = this._json('data', [])
    const accent     = this._attr('color', this._brand())
    const dark       = this._theme() !== 'light'
    const bwAttr     = parseFloat(this._attr('bandwidth', ''))
    const heightAttr = parseInt(this._attr('height', '0'))
    const fmt        = this._attr('label-format', '')
    const fmtVal     = v => this._fmt(v, fmt)
    const yLabel     = this._attr('y-label', '')
    const textC      = dark ? '#F0EBE0' : '#1A1A20'
    const labelC     = this._muted()
    const gridC      = dark ? '#1E1E24' : '#E5E1D4'
    const uid        = this._uid

    if (!data.length) { this._warnEmpty('zyna-density'); return }

    const periods = data.map((d, i) => ({
      i,
      label:  d.label != null ? String(d.label) : `#${i + 1}`,
      values: (Array.isArray(d.values) ? d.values : []).map(v => +v).filter(Number.isFinite),
    }))
    const allVals = periods.flatMap(p => p.values)
    if (!allVals.length) { this._warnEmpty('zyna-density'); return }

    const [dLo, dHi] = extent(allVals)
    const yMinAttr = this._attr('y-min', ''), yMaxAttr = this._attr('y-max', '')
    const pad  = ((dHi - dLo) || Math.abs(dHi) || 1) * 0.08
    const yMinP = parseFloat(yMinAttr), yMaxP = parseFloat(yMaxAttr)
    const yMin = (yMinAttr !== '' && Number.isFinite(yMinP)) ? yMinP : dLo - pad
    const yMax = (yMaxAttr !== '' && Number.isFinite(yMaxP)) ? yMaxP : dHi + pad

    const M = periods.length
    const W = this.clientWidth || 640
    const H = heightAttr > 0 ? heightAttr : Math.max(260, Math.round(W * 0.55))
    const m = { left: Math.max(46, W * 0.09) + (yLabel ? 16 : 0), right: 16, top: 16, bottom: 28 }
    const innerH = H - m.top - m.bottom

    // Position by period index, not label: a point scale de-duplicates its
    // domain, so two periods with the same label would draw on top of each other.
    const xScale = scalePoint().domain(periods.map(p => p.i)).range([m.left + 30, W - m.right - 30]).padding(0.5)
    const yScale = scaleLinear().domain([yMin, yMax]).range([H - m.bottom, m.top])
    const step   = M > 1 ? (xScale(1) - xScale(0)) : (W - m.left - m.right)
    const halfW  = Math.min(Math.abs(step) * 0.44, W * 0.13)
    const fSm    = Math.max(9, W * 0.019)

    // ── KDE (Epanechnikov) ──────────────────────────────────────────────────
    const G = 40
    const thresholds = Array.from({ length: G }, (_, g) => yMin + (yMax - yMin) * g / (G - 1))
    const epan = bw => v => (Math.abs(v /= bw) <= 1 ? 0.75 * (1 - v * v) / bw : 0)
    const silverman = vals => {
      const n = vals.length
      if (n < 2) return (yMax - yMin) / 12 || 1
      const mu = d3mean(vals)
      const sd = Math.sqrt(d3mean(vals.map(v => (v - mu) ** 2))) || ((yMax - yMin) / 12) || 1
      // 1.3 ≈ 1.25× Silverman: this is a shape/silhouette chart, so we prefer a
      // touch of extra smoothing over the lumpy under-smoothing plain Silverman
      // gives at small sample sizes. Still narrow enough to keep modes separate.
      return (1.3 * sd * Math.pow(n, -1 / 5)) || 1
    }

    periods.forEach(p => {
      if (!p.values.length) { p.dens = null; p.med = null; return }
      const bw = (Number.isFinite(bwAttr) && bwAttr > 0) ? bwAttr : silverman(p.values)
      const k  = epan(bw)
      p.dens = thresholds.map(t => d3mean(p.values, s => k(t - s)) || 0)
      p.med  = d3median(p.values)
    })

    // Persist the SVG — only update viewBox/dimensions on resize.
    let svg = select(this).select('svg')
    if (svg.empty()) svg = select(this).append('svg').style('display', 'block')
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', W).attr('height', H)

    const withMed = periods.filter(p => p.med != null)
    const firstMed = withMed[0], lastMed = withMed[withMed.length - 1]
    this._applyA11y(svg,
      `Flow density across ${M} periods; ` +
      (firstMed && lastMed ? `median moved from ${fmtVal(firstMed.med)} (${firstMed.label}) to ${fmtVal(lastMed.med)} (${lastMed.label}).` : 'no samples.'))

    // Y-axis — horizontal gridlines + value labels so the vertical scale (the
    // sample value, e.g. response time) is legible; plus an optional rotated title.
    const yTicks = yScale.ticks(Math.max(3, Math.min(6, Math.round(innerH / 64))))
    svg.selectAll('g.dn-ytick').data(yTicks, t => t)
      .join(
        enter => {
          const g = enter.append('g').attr('class', 'dn-ytick')
          g.append('line').attr('class', 'dn-grid')
          g.append('text').attr('class', 'dn-ylabel')
          return g
        },
        update => update,
        exit   => exit.remove()
      )
      .each(function(t) {
        const g = select(this), ty = yScale(t)
        g.select('.dn-grid')
          .attr('x1', m.left).attr('x2', W - m.right).attr('y1', ty).attr('y2', ty)
          .attr('stroke', gridC).attr('stroke-width', 0.8)
        g.select('.dn-ylabel')
          .attr('x', m.left - 8).attr('y', ty + fSm * 0.35)
          .attr('text-anchor', 'end').attr('font-family', 'monospace')
          .attr('font-size', `${fSm}px`).attr('fill', labelC).text(fmtVal(t))
      })

    // Optional rotated axis title on the far left.
    let yTitle = svg.select('text.dn-ytitle')
    if (yLabel) {
      if (yTitle.empty()) yTitle = svg.append('text').attr('class', 'dn-ytitle')
      yTitle.attr('transform', `translate(${fSm + 2},${m.top + innerH / 2}) rotate(-90)`)
        .attr('text-anchor', 'middle').attr('font-family', 'monospace')
        .attr('font-size', `${fSm}px`).attr('fill', labelC).attr('letter-spacing', '0.05em')
        .text(yLabel)
    } else {
      yTitle.remove()
    }

    // Vertical brand gradient fading at the tails.
    let defs = svg.select('defs')
    if (defs.empty()) defs = svg.insert('defs', ':first-child')
    let grad = defs.select(`#dn-grad-${uid}`)
    if (grad.empty()) {
      grad = defs.append('linearGradient').attr('id', `dn-grad-${uid}`).attr('x1', '0').attr('y1', '0').attr('x2', '0').attr('y2', '1')
      grad.append('stop').attr('offset', '0%')
      grad.append('stop').attr('offset', '50%')
      grad.append('stop').attr('offset', '100%')
    }
    grad.select('stop:nth-child(1)').attr('stop-color', accent).attr('stop-opacity', 0.04)
    grad.select('stop:nth-child(2)').attr('stop-color', accent).attr('stop-opacity', 0.38)
    grad.select('stop:nth-child(3)').attr('stop-color', accent).attr('stop-opacity', 0.04)

    // Silhouettes — one per period with samples.
    svg.selectAll('path.dn-violin').data(periods, d => d.i)
      .join(
        enter  => enter.append('path').attr('class', 'dn-violin'),
        update => update,
        exit   => exit.remove()
      )
      .each(function(p) {
        const el = select(this)
        if (!p.dens) { el.attr('display', 'none'); return }
        const cx = xScale(p.i)
        // Width-normalise each violin to its OWN peak so every period's shape is
        // readable regardless of density. Draw the FULL shared domain: the body
        // bulges at the data and tapers to thin vertical whiskers through the empty
        // regions, running up and down to the plot edges (a shared-axis violin).
        const localMax = Math.max(...p.dens) || 1
        const pts = thresholds.map((t, g) => ({ y: yScale(t), hw: (p.dens[g] / localMax) * halfW }))
        // Smooth (Catmull-Rom) curve so the outline reads as an elegant spindle,
        // not a polygon — the whiskers stay clean vertical lines.
        const gen = d3area()
          .x0(d => cx - d.hw).x1(d => cx + d.hw)
          .y0(d => d.y).y1(d => d.y)
          .curve(curveCatmullRom.alpha(0.5))
        el.attr('display', null)
          .attr('d', gen(pts))
          .attr('fill', `url(#dn-grad-${uid})`).attr('stroke', accent).attr('stroke-width', 1)
      })

    // Median spine + dots.
    const medPts = withMed.map(p => [xScale(p.i), yScale(p.med)])
    let spine = svg.select('polyline.dn-spine')
    if (spine.empty()) spine = svg.append('polyline').attr('class', 'dn-spine')
    spine.attr('points', medPts.map(pt => `${pt[0].toFixed(1)},${pt[1].toFixed(1)}`).join(' '))
      .attr('fill', 'none').attr('stroke', accent).attr('stroke-width', 1.4).attr('opacity', 0.8)
      .attr('stroke-dasharray', '1 3').attr('stroke-linecap', 'round')

    svg.selectAll('circle.dn-median').data(withMed, d => d.i)
      .join(
        enter  => enter.append('circle').attr('class', 'dn-median'),
        update => update,
        exit   => exit.remove()
      )
      .each(function(p) {
        select(this).attr('cx', xScale(p.i)).attr('cy', yScale(p.med)).attr('r', 2.6).attr('fill', accent)
      })

    // Period labels.
    svg.selectAll('text.dn-xlabel').data(periods, d => d.i)
      .join(
        enter  => enter.append('text').attr('class', 'dn-xlabel'),
        update => update,
        exit   => exit.remove()
      )
      .each(function(p) {
        select(this)
          .attr('display', null)
          .attr('x', xScale(p.i)).attr('y', H - m.bottom + 16)
          .attr('text-anchor', 'middle').attr('font-family', 'monospace')
          .attr('font-size', `${fSm}px`).attr('fill', labelC)
          .text(p.label)
      })

    // Every period got its label whatever the spacing, so eight month names in
    // a card printed the axis as one overlapping run. Walk the labels left to
    // right and hide any whose box would touch the last one kept.
    const xl = []
    svg.selectAll('text.dn-xlabel').each(function(p) {
      const t    = select(this)
      const node = t.node()
      const w    = node.getComputedTextLength ? node.getComputedTextLength() : String(p.label).length * fSm * 0.6
      xl.push({ t, x: xScale(p.i), w })
    })
    xl.sort((a, b) => a.x - b.x)
    let lastRight = -Infinity
    for (const { t, x, w } of xl) {
      const left = x - w / 2
      if (left < lastRight + 6) t.attr('display', 'none')
      else lastRight = left + w
    }
  }
}

if (!customElements.get('zyna-density')) {
  customElements.define('zyna-density', ZynaDensity)
}
