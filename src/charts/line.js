import { ZynaChart } from './base.js'
import { select } from 'd3-selection'
import { min, max } from 'd3-array'
import { line, area, curveCardinal } from 'd3-shape'
import { scaleLinear } from 'd3-scale'

/**
 * <zyna-line>
 *
 * Multi-series area-line chart. Each series gets its own line and filled region.
 * Series are stacked visually: the first series in the array sits at the bottom,
 * the last sits on top. Fills cascade: below the bottom series, and between each
 * adjacent pair of series above it.
 *
 * Attributes:
 *   data         — JSON array of { label?, color?, values: [{ x, y }] }
 *                  Set x to '' on intermediate points to suppress x-axis labels.
 *   annotations  — JSON array of { series, x, label?, direction? }
 *                  series = 0-based index into data array.
 *                  direction = 'up'|'down' renders a ▲/▼ triangle above the dot.
 *   tension      — curve smoothing: 0 = straight lines (default), 1 = max smooth.
 *   theme        — 'dark' (default) or 'light'
 *   height       — explicit height in px. Auto-derived from width when omitted.
 *   y-min        — y-axis lower bound. Default: auto.
 *   y-max        — y-axis upper bound. Default: auto.
 *   ticks        — y-axis tick count. Default: 4
 */
export class ZynaLine extends ZynaChart {
  static get observedAttributes() {
    return ['data', 'annotations', 'tension', 'theme', 'height', 'y-min', 'y-max', 'ticks']
  }

  _render() {
    const raw = this._json('data', [])
    if (!raw.length) { this._warnEmpty('zyna-line'); return }

    const anns       = this._json('annotations', [])
    const dark       = this._attr('theme', 'dark') !== 'light'
    const textC      = dark ? '#F0EBE0' : '#1A1A20'
    const gridC      = dark ? '#1E1E24' : '#E5E0D8'
    const bgC        = dark ? '#16161C' : '#FFFFFF'
    const heightAttr = parseInt(this._attr('height', '0'))
    const tickCount  = Math.max(2, parseInt(this._attr('ticks', '4')) || 4)
    // tension: 0 = linear, 1 = max smooth. Maps to curveCardinal.tension(1 - t).
    const tension    = Math.min(1, Math.max(0, parseFloat(this._attr('tension', '0')) || 0))

    // Default color palette for series without an explicit color.
    // First slot uses the genre brand token so the primary series always matches the active genre.
    const palette = [this._brand(), '#4BBFA8', '#A07DC0', '#E07B54', '#5A8FC2', '#7CBD6B']
    const series = raw.map((s, i) => ({
      label:  s.label  || '',
      color:  s.color  || palette[i % palette.length],
      values: Array.isArray(s.values) ? s.values : [],
    }))

    if (!series.some(s => s.values.length)) return

    const n = max(series, s => s.values.length) || 1

    // Build y domain across all series
    const allY = series.flatMap(s => s.values.map(d => d.y)).filter(v => v != null && !isNaN(v))
    if (!allY.length) return

    const dataMin = min(allY)
    const dataMax = max(allY)
    const spread  = Math.max(dataMax - dataMin, 1)

    const yMinAttr = this._attr('y-min', '')
    const yMaxAttr = this._attr('y-max', '')
    const yMin = yMinAttr !== '' ? parseFloat(yMinAttr) : Math.floor(dataMin - spread * 0.08)
    const yMax = yMaxAttr !== '' ? parseFloat(yMaxAttr) : Math.ceil(dataMax  + spread * 0.05)

    const W = this.clientWidth || 600
    const H = heightAttr > 0 ? heightAttr : Math.max(280, W * 0.5)

    const fSm = Math.max(9,  W * 0.018)
    const fMd = Math.max(10, W * 0.02)

    const hasLegend = series.some(s => s.label)
    const legendH   = hasLegend ? fSm + 14 : 0

    const m      = { top: 20, right: Math.max(40, W * 0.08), bottom: 36 + legendH, left: Math.max(30, W * 0.05) }
    const innerW = W - m.left - m.right
    const innerH = H - m.top - m.bottom

    const xScale = scaleLinear().domain([0, Math.max(n - 1, 1)]).range([0, innerW])
    const yScale = scaleLinear().domain([yMin, yMax]).range([innerH, 0])

    // curveCardinal.tension(1) = linear, .tension(0) = max smooth
    const crv = curveCardinal.tension(1 - tension)

    const mkLine = values => line()
      .x((d, i) => xScale(i))
      .y(d => yScale(d.y))
      .defined(d => d != null && d.y != null)
      .curve(crv)(values)

    // Area from series i down to series i-1 (or baseline for i=0)
    const mkArea = (upper, lower) => area()
      .x((d, i) => xScale(i))
      .y0((d, i) => {
        const lv = lower?.[i]
        return lv != null && lv.y != null ? yScale(lv.y) : yScale(yMin)
      })
      .y1(d => d != null && d.y != null ? yScale(d.y) : yScale(yMin))
      .defined((d, i) => d != null && d.y != null)
      .curve(crv)(upper)

    const uid = this._uid

    let svg = select(this).select('svg')
    if (svg.empty()) svg = select(this).append('svg').style('display', 'block')
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', W).attr('height', H)

    // Clip path (group-local coordinates — applied to fills and lines)
    let defs = svg.select('defs')
    if (defs.empty()) defs = svg.insert('defs', ':first-child')
    let clipEl = defs.select(`#ln-clip-${uid}`)
    if (clipEl.empty()) {
      clipEl = defs.append('clipPath').attr('id', `ln-clip-${uid}`)
      clipEl.append('rect')
    }
    clipEl.select('rect').attr('x', 0).attr('y', 0).attr('width', innerW).attr('height', innerH)

    // Inner group — all chart elements use group-local coordinates
    let g = svg.select('g.ln-inner')
    if (g.empty()) g = svg.append('g').attr('class', 'ln-inner')
    g.attr('transform', `translate(${m.left},${m.top})`)

    // Y-axis: grid lines + right-side labels
    const yTicks = yScale.ticks(tickCount)
    g.selectAll('g.ln-ytick').data(yTicks, t => t)
      .join(enter => {
        const tg = enter.append('g').attr('class', 'ln-ytick')
        tg.append('line').attr('class', 'ln-grid')
        tg.append('text').attr('class', 'ln-yl')
        return tg
      })
      .each(function(t) {
        const tg = select(this)
        const ty = yScale(t)
        tg.select('.ln-grid')
          .attr('x1', 0).attr('x2', innerW)
          .attr('y1', ty).attr('y2', ty)
          .attr('stroke', gridC).attr('stroke-width', 0.8)
        tg.select('.ln-yl')
          .attr('x', innerW + 8).attr('y', ty + fSm * 0.4)
          .attr('font-size', `${fSm}px`).attr('fill', textC).text(t)
      })

    // X-axis: tick marks + labels only for points with non-empty x
    // Collect x labels from the first series that has any
    const xSource = series.find(s => s.values.length) || series[0]
    const xLabelPts = xSource.values.map((d, i) => ({ i, label: d.x })).filter(d => d.label)
    g.selectAll('g.ln-xtick').data(xLabelPts, d => String(d.i))
      .join(enter => {
        const xg = enter.append('g').attr('class', 'ln-xtick')
        xg.append('line').attr('class', 'ln-xtick-line')
        xg.append('text').attr('class', 'ln-xl')
        return xg
      })
      .each(function(d) {
        const xg = select(this)
        const tx = xScale(d.i)
        xg.select('.ln-xtick-line')
          .attr('x1', tx).attr('x2', tx)
          .attr('y1', innerH).attr('y2', innerH + 5)
          .attr('stroke', gridC).attr('stroke-width', 0.8)
        xg.select('.ln-xl')
          .attr('x', tx).attr('y', innerH + fMd + 8)
          .attr('text-anchor', 'middle')
          .attr('font-size', `${fSm}px`).attr('fill', textC).text(d.label)
      })

    // Baseline
    let baseline = g.select('.ln-baseline')
    if (baseline.empty()) baseline = g.append('line').attr('class', 'ln-baseline')
    baseline.attr('x1', 0).attr('x2', innerW)
      .attr('y1', innerH).attr('y2', innerH)
      .attr('stroke', gridC).attr('stroke-width', 1)

    // Fill areas — one per series, bottom-up
    // Remove stale fill paths before re-joining (series count may change)
    const fillKey  = (s, i) => `fill-${i}`
    g.selectAll('path.ln-fill').data(series, fillKey)
      .join(
        enter => enter.append('path').attr('class', 'ln-fill'),
        update => update,
        exit   => exit.remove()
      )
      .each(function(s, i) {
        const lower = i > 0 ? series[i - 1].values : null
        select(this)
          .attr('d', mkArea(s.values, lower))
          .attr('fill', s.color)
          .attr('fill-opacity', i === 0 ? 0.28 : 0.20)
          .attr('clip-path', `url(#ln-clip-${uid})`)
      })

    // Lines — one per series, drawn on top of fills
    g.selectAll('path.ln-line').data(series, (s, i) => `line-${i}`)
      .join(
        enter => enter.append('path').attr('class', 'ln-line'),
        update => update,
        exit   => exit.remove()
      )
      .each(function(s) {
        select(this)
          .attr('d', mkLine(s.values))
          .attr('fill', 'none')
          .attr('stroke', s.color)
          .attr('stroke-width', 2)
          .attr('stroke-linejoin', 'round')
          .attr('clip-path', `url(#ln-clip-${uid})`)
      })

    // Annotation markers: dot + optional triangle + label
    const dotR = Math.max(4, W * 0.007)
    const triS = Math.max(3, W * 0.005)

    const annData = anns.map(ann => {
      const si  = typeof ann.series === 'number' ? ann.series : 0
      const s   = series[si]
      if (!s) return null
      const idx = s.values.findIndex(d => String(d.x) === String(ann.x))
      if (idx === -1) return null
      const pt  = s.values[idx]
      if (pt == null || pt.y == null) return null
      return { ...ann, si, idx, yVal: pt.y, color: s.color }
    }).filter(Boolean)

    g.selectAll('g.ln-ann').data(annData, d => `${d.si}|${d.x}`)
      .join(enter => {
        const ag = enter.append('g').attr('class', 'ln-ann')
        ag.append('circle').attr('class', 'ln-ann-dot')
        ag.append('polygon').attr('class', 'ln-ann-tri')
        ag.append('text').attr('class', 'ln-ann-txt')
        return ag
      })
      .each(function(ann) {
        const ag    = select(this)
        const cx    = xScale(ann.idx)
        const cy    = yScale(ann.yVal)
        const c     = ann.color
        const above = cy > innerH * 0.2
        const triCy = above ? cy - dotR - triS - 1 : cy + dotR + triS + 1
        const txtY  = above ? triCy - triS - 3      : triCy + triS + fSm + 1
        const isUp  = ann.direction !== 'down'
        const triPts = isUp
          ? `${cx},${triCy - triS} ${cx - triS},${triCy + triS} ${cx + triS},${triCy + triS}`
          : `${cx},${triCy + triS} ${cx - triS},${triCy - triS} ${cx + triS},${triCy - triS}`

        ag.select('.ln-ann-dot')
          .attr('cx', cx).attr('cy', cy).attr('r', dotR)
          .attr('fill', c).attr('stroke', bgC).attr('stroke-width', 1.5)

        ag.select('.ln-ann-tri')
          .attr('display', ann.direction ? null : 'none')
          .attr('points', triPts).attr('fill', c)

        ag.select('.ln-ann-txt')
          .attr('display', ann.label ? null : 'none')
          .attr('x', cx).attr('y', txtY)
          .attr('text-anchor', 'middle')
          .attr('font-size', `${fSm}px`).attr('font-weight', '700').attr('font-family', 'monospace')
          .attr('fill', c).text(ann.label || '')
      })

    // Legend — one row, centered, below the x-axis labels
    if (hasLegend) {
      const legY      = innerH + 36 + legendH * 0.5
      const swatchW   = 16
      const gap       = 6
      const itemSpacingW = innerW / series.filter(s => s.label).length
      const legSeries = series.filter(s => s.label)

      g.selectAll('g.ln-leg').data(legSeries, (s, i) => `leg-${i}`)
        .join(enter => {
          const lg = enter.append('g').attr('class', 'ln-leg')
          lg.append('line').attr('class', 'ln-leg-swatch')
          lg.append('circle').attr('class', 'ln-leg-dot')
          lg.append('text').attr('class', 'ln-leg-label')
          return lg
        })
        .each(function(s, i) {
          const lg  = select(this)
          const lx  = (i + 0.5) * itemSpacingW - swatchW / 2
          lg.select('.ln-leg-swatch')
            .attr('x1', lx).attr('x2', lx + swatchW)
            .attr('y1', legY).attr('y2', legY)
            .attr('stroke', s.color).attr('stroke-width', 2)
          lg.select('.ln-leg-dot')
            .attr('cx', lx + swatchW / 2).attr('cy', legY)
            .attr('r', dotR * 0.7)
            .attr('fill', s.color).attr('stroke', bgC).attr('stroke-width', 1)
          lg.select('.ln-leg-label')
            .attr('x', lx + swatchW + gap).attr('y', legY + fSm * 0.4)
            .attr('font-size', `${fSm}px`).attr('fill', textC).text(s.label)
        })
    } else {
      g.selectAll('g.ln-leg').remove()
    }
  }
}

if (!customElements.get('zyna-line')) {
  customElements.define('zyna-line', ZynaLine)
}
