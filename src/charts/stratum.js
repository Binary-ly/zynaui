import { ZynaChart } from './base.js'
import { select } from 'd3-selection'
import { max } from 'd3-array'
import { scaleBand } from 'd3-scale'

/**
 * <zyna-stratum>
 *
 * Geological core-sample grid. Each entity is a row; within a row, one butted
 * segment per time period whose HEIGHT encodes the value. Because the encoding
 * is height (not colour), the chart survives monochrome genres (e.g. Phosphor)
 * intact. Cross-entity patterns emerge as the strata profile aligns vertically
 * across the grid.
 *
 * Attributes:
 *   data         — JSON array of { label, values: [n, n, …], color? }
 *   x-labels     — JSON array of period labels. '' entries suppress that label.
 *   scale        — 'row' (default, per-entity normalisation) or 'global'
 *   color        — fallback accent colour for rows without their own. Default: var(--zyna)
 *   theme        — 'dark' (default) or 'light'
 *   height       — explicit height in px. Auto-derived from row count when omitted.
 *   label-format — D3-style number format applied to values in the a11y summary.
 */
export class ZynaStratum extends ZynaChart {
  static get observedAttributes() {
    return ['data', 'x-labels', 'scale', 'color', 'theme', 'height', 'label-format']
  }

  _render() {
    const data       = this._json('data', [])
    const xLabels    = this._json('x-labels', [])
    const scaleMode  = this._attr('scale', 'row') === 'global' ? 'global' : 'row'
    const accent     = this._attr('color', this._brand())
    const dark       = this._theme() !== 'light'
    const fmt        = this._attr('label-format', '')
    const heightAttr = parseInt(this._attr('height', '0'))
    const textC      = dark ? '#F0EBE0' : '#1A1A20'
    const labelC     = this._muted()
    const bgC        = dark ? '#0C0C0F' : '#FFFFFF'

    if (!data.length) { this._warnEmpty('zyna-stratum'); return }

    // Normalise rows: coerce values to finite numbers (non-numeric → 0).
    const rows = data.map((d, i) => ({
      label:  d.label != null ? String(d.label) : `Row ${i + 1}`,
      color:  d.color || accent,
      values: (Array.isArray(d.values) ? d.values : []).map(v => (Number.isFinite(+v) ? +v : 0)),
    }))

    // M = widest row. Guard: an all-empty-values payload has nothing to draw.
    const M = max(rows, r => r.values.length) || 0
    if (!M) { this._warnEmpty('zyna-stratum'); return }

    const globalMax = max(rows, r => max(r.values)) || 1

    const W    = this.clientWidth || 600
    const rowH = Math.max(26, Math.min(60, W * 0.09))
    const H    = heightAttr > 0 ? heightAttr : Math.max(160, rows.length * rowH + 44)

    const m      = { left: Math.max(56, W * 0.16), right: 14, top: 12, bottom: 26 }
    const innerW = W - m.left - m.right
    const innerH = H - m.top - m.bottom
    const bandH  = innerH / rows.length

    // Butted columns (no inner padding) — the 1px background seam between cells
    // does the visual separation, reading as drafting lines under paper genres.
    const xScale = scaleBand().domain(Array.from({ length: M }, (_, j) => j)).range([0, innerW]).paddingInner(0)
    const colW   = xScale.bandwidth()
    const fSm    = Math.max(9, W * 0.02)

    // Persist the SVG — only update viewBox/dimensions on resize.
    let svg = select(this).select('svg')
    if (svg.empty()) svg = select(this).append('svg').style('display', 'block')
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', W).attr('height', H)

    // A11y: global peak entity + period.
    let peak = { v: -Infinity, row: rows[0].label, col: 0 }
    rows.forEach(r => r.values.forEach((v, j) => { const cv = Math.max(0, v); if (cv > peak.v) peak = { v: cv, row: r.label, col: j } }))
    const peakPeriod = xLabels[peak.col] || `period ${peak.col + 1}`
    this._applyA11y(svg, `Stratum grid, ${rows.length} entities over ${M} periods; peak ${this._fmt(peak.v, fmt)} in ${peak.row}, ${peakPeriod}.`)

    // Flatten to cells for a single keyed join (stable across resize).
    const cells = []
    rows.forEach((r, i) => {
      const rowMax = max(r.values) || 1
      const denom  = scaleMode === 'global' ? globalMax : rowMax
      r.values.forEach((v, j) => {
        const norm = denom > 0 ? Math.max(0, v) / denom : 0
        cells.push({ key: `${i}-${j}`, i, j, norm, color: r.color })
      })
    })

    svg.selectAll('rect.st-cell').data(cells, d => d.key)
      .join(
        enter  => enter.append('rect').attr('class', 'st-cell'),
        update => update,
        exit   => exit.remove()
      )
      .each(function(c) {
        const baseY = m.top + (c.i + 1) * bandH
        const h     = Math.max(0, c.norm * (bandH - 6))
        select(this)
          .attr('x', m.left + xScale(c.j)).attr('y', baseY - h)
          .attr('width', Math.max(1, colW)).attr('height', h)
          .attr('fill', c.color)
          .attr('fill-opacity', 0.5 + c.norm * 0.45)
          .attr('stroke', bgC).attr('stroke-width', 1)
      })

    // Entity labels (left).
    svg.selectAll('text.st-rowlabel').data(rows, d => d.label)
      .join(
        enter  => enter.append('text').attr('class', 'st-rowlabel'),
        update => update,
        exit   => exit.remove()
      )
      .each(function(r, i) {
        select(this)
          .attr('x', m.left - 8).attr('y', m.top + (i + 0.5) * bandH + fSm * 0.35)
          .attr('text-anchor', 'end').attr('font-size', `${fSm}px`).attr('fill', textC)
          .text(r.label)
      })

    // X-axis period labels (bottom). '' suppresses, matching <zyna-line>.
    const xData = Array.from({ length: M }, (_, j) => ({ j, label: xLabels[j] != null ? String(xLabels[j]) : '' }))
    svg.selectAll('text.st-xlabel').data(xData, d => d.j)
      .join(
        enter  => enter.append('text').attr('class', 'st-xlabel'),
        update => update,
        exit   => exit.remove()
      )
      .each(function(d) {
        select(this)
          .attr('display', d.label ? null : 'none')
          .attr('x', m.left + xScale(d.j) + colW / 2).attr('y', H - m.bottom + 16)
          .attr('text-anchor', 'middle').attr('font-family', 'monospace')
          .attr('font-size', `${fSm}px`).attr('fill', labelC)
          .text(d.label)
      })

    // Every period got its label whatever the column width, so two dozen
    // columns in a card printed the axis as one overlapping run. Walk the
    // labels left to right and hide any whose box would touch the last kept.
    const xl = []
    svg.selectAll('text.st-xlabel').each(function(d) {
      if (!d.label) return
      const t    = select(this)
      const node = t.node()
      const w    = node.getComputedTextLength ? node.getComputedTextLength() : d.label.length * fSm * 0.6
      xl.push({ t, x: m.left + xScale(d.j) + colW / 2, w })
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

if (!customElements.get('zyna-stratum')) {
  customElements.define('zyna-stratum', ZynaStratum)
}
