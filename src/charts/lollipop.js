import { ZynaChart } from './base.js'
import { select } from 'd3-selection'
import { max } from 'd3-array'
import { scaleLinear } from 'd3-scale'

/**
 * <zyna-lollipop>
 *
 * Horizontal lollipop chart — line + circle encodes value.
 *
 * Attributes:
 *   data         — JSON array of { label, value } sorted descending recommended
 *   color        — accent color for the highlighted item. Default: #C9A84C
 *   theme        — 'dark' (default) or 'light'
 *   highlight    — label of the item to accent. Default: first item (index 0)
 *   muted-color  — color for non-highlighted stems, dots and labels. Default: #7A6230 / #8A8478
 *   height       — explicit height in px. Auto-derived from data length when omitted.
 *   show-values  — set to "false" to hide value labels at the end of each stem. Default: true
 *   label-format — D3-style number format string (e.g. '$,.0f', '.1%', ',.2f'). Default: raw value
 *   ticks        — number of x-axis tick marks. Default: 5
 */
export class ZynaLollipop extends ZynaChart {
  static get observedAttributes() {
    return ['data', 'color', 'theme', 'highlight', 'muted-color', 'height', 'show-values', 'label-format', 'ticks']
  }

  _render() {
    const data       = this._json('data', [])
    const accent     = this._attr('color', '#C9A84C')
    const mutedAttr  = this._attr('muted-color', '')
    const muted      = mutedAttr || '#7A6230'
    const mutedT     = mutedAttr || '#8A8478'
    const hlLabel    = this._attr('highlight', '') || data[0]?.label || ''
    const fmt        = this._attr('label-format', '')
    const fmtVal     = v => this._fmt(v, fmt)
    const showVals   = this._attr('show-values', 'true') !== 'false'
    const heightAttr = parseInt(this._attr('height', '0'))
    const tickCount  = parseInt(this._attr('ticks', '5'))
    const dark       = this._attr('theme', 'dark') !== 'light'
    const textC      = dark ? '#F0EBE0' : '#1A1A20'

    if (!data.length) { this._warnEmpty('zyna-lollipop'); return }

    // Guard: maxVal prevents xScale domain from collapsing to [0, 0]
    const maxVal    = max(data, d => d.value) || 1
    const domainMax = maxVal * 1.1

    const W    = this.clientWidth || 420
    // Row height clamps between 44px and 70px and scales with container width
    const rowH = Math.max(44, Math.min(70, W * 0.14))
    const H    = heightAttr > 0 ? heightAttr : Math.max(200, data.length * rowH + 60)

    // Margins scale with container width to accommodate long labels
    const m      = { left: Math.max(60, W * 0.18), right: Math.max(50, W * 0.15), top: 10, bottom: 28 }
    const innerW = W - m.left - m.right
    const innerH = H - m.top - m.bottom
    const xScale = scaleLinear().domain([0, domainMax]).range([0, innerW])
    // Font sizes scale with container width
    const fSm    = Math.max(9, W * 0.022)
    const fMd    = Math.max(11, W * 0.026)

    // Persist the SVG — only update viewBox/dimensions on resize.
    let svg = select(this).select('svg')
    if (svg.empty()) {
      svg = select(this).append('svg').style('display', 'block')
    }
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', W).attr('height', H)

    // Tick grid lines — keyed by tick value so they reuse elements on resize.
    const ticks = xScale.ticks(tickCount)
    svg.selectAll('g.ll-tick').data(ticks, t => t)
      .join(enter => {
        const g = enter.append('g').attr('class', 'll-tick')
        g.append('line').attr('class', 'll-tick-line')
        g.append('text').attr('class', 'll-tick-label')
        return g
      })
      .each(function(tick) {
        const g  = select(this)
        const tx = m.left + xScale(tick)
        g.select('.ll-tick-line')
          .attr('x1', tx).attr('x2', tx)
          .attr('y1', m.top).attr('y2', H - m.bottom + 4)
          .attr('stroke', '#1E1E24').attr('stroke-width', 0.8)
        g.select('.ll-tick-label')
          .attr('x', tx).attr('y', H - m.bottom + 16)
          .attr('text-anchor', 'middle').attr('font-family', 'monospace')
          .attr('font-size', `${fSm}px`).attr('fill', '#5A5050').text(tick)
      })

    // Per-row groups — keyed by label so D3 reuses existing elements on resize.
    svg.selectAll('g.ll-row').data(data, d => d.label)
      .join(enter => {
        const g = enter.append('g').attr('class', 'll-row')
        g.append('line').attr('class', 'll-stem')
        g.append('circle').attr('class', 'll-dot')
        g.append('text').attr('class', 'll-label')
        g.append('text').attr('class', 'll-value')
        return g
      })
      .each(function(pt, i) {
        const g     = select(this)
        const y     = m.top + (i + 0.5) * (innerH / data.length)
        const x     = m.left + xScale(pt.value)
        const isTop = pt.label === hlLabel
        const c     = isTop ? accent : muted
        const ct    = isTop ? textC : mutedT

        g.select('.ll-stem')
          .attr('x1', m.left).attr('x2', x)
          .attr('y1', y).attr('y2', y)
          .attr('stroke', c).attr('stroke-width', isTop ? 1.5 : 1)

        g.select('.ll-dot')
          .attr('cx', x).attr('cy', y)
          .attr('r', isTop ? 7 : 5).attr('fill', c)

        g.select('.ll-label')
          .attr('x', m.left - 6).attr('y', y + fSm * 0.4)
          .attr('text-anchor', 'end').attr('font-size', `${fMd}px`).attr('fill', ct).text(pt.label)

        g.select('.ll-value')
          .attr('display', showVals ? null : 'none')
          .attr('x', x + 10).attr('y', y + fSm * 0.4)
          .attr('font-family', 'monospace').attr('font-size', `${fSm}px`).attr('fill', c).text(fmtVal(pt.value))
      })
  }
}

if (!customElements.get('zyna-lollipop')) {
  customElements.define('zyna-lollipop', ZynaLollipop)
}
