import { ZynaChart } from './base.js'
import { select } from 'd3-selection'

/**
 * <zyna-waffle>
 *
 * Square-grid waffle chart. Designed for 100-cell (10×10) proportion grids;
 * works with any `cols` value — keep total data values ≤ 100 for best results.
 *
 * Attributes:
 *   data   — JSON array of { label, value, color?, outline? }
 *   color  — fallback cell colour. Default: var(--zyna)
 *   cols   — grid columns. Default: 10
 *   gap    — gap between cells in px. Default: 3
 *   theme  — 'dark' (default) or 'light'
 *   height — explicit height in px. Auto-derived from data when omitted.
 */
export class ZynaWaffle extends ZynaChart {
  static get observedAttributes() {
    return ['data', 'color', 'cols', 'gap', 'theme', 'height']
  }

  _render() {
    const data   = this._json('data', [])
    const accent = this._attr('color', this._brand())
    const colsRaw = parseInt(this._attr('cols', '10'))
    const cols    = colsRaw > 0 ? colsRaw : 10
    const gapRaw  = parseInt(this._attr('gap', '3'))
    const gap     = gapRaw >= 0 ? gapRaw : 3
    const dark       = this._attr('theme', 'dark') !== 'light'
    const heightAttr = parseInt(this._attr('height', '0'))

    if (!data.length) { this._warnEmpty('zyna-waffle'); return }

    const total = data.reduce((s, d) => s + d.value, 0)
    // Cap at 100 cells — this chart is a proportion-grid, not a bar chart.
    const cells = Math.min(total, 100)
    const rows  = Math.ceil(cells / cols)

    const W  = this.clientWidth || 480
    const cs = Math.floor((W - gap * (cols - 1)) / cols)
    // Guard: cs ≤ 0 means the container is too narrow for the requested column count.
    if (cs <= 0) return
    const H  = heightAttr > 0 ? heightAttr : rows * (cs + gap) - gap
    // Border-radius scales with cell size so it looks right at any width.
    const rx = Math.max(1, Math.floor(cs * 0.08))

    const bgC = dark ? 'transparent' : '#FFFFFF'

    // Persist the SVG — only update viewBox/dimensions on resize.
    let svg = select(this).select('svg')
    if (svg.empty()) {
      svg = select(this).append('svg').style('display', 'block')
    }
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', W).attr('height', H)
      .style('background', bgC)

    const cellData = []
    data.forEach(d => {
      const color   = d.color || accent
      const outline = !!d.outline
      for (let j = 0; j < d.value && cellData.length < cells; j++) {
        cellData.push({ color, outline })
      }
    })

    svg.selectAll('rect').data(cellData).join('rect')
      .attr('x', (d, i) => (i % cols) * (cs + gap))
      .attr('y', (d, i) => Math.floor(i / cols) * (cs + gap))
      .attr('width', cs).attr('height', cs).attr('rx', rx)
      .attr('fill', d => d.outline ? 'transparent' : d.color)
      .attr('stroke', d => d.outline ? d.color : 'none')
      .attr('stroke-width', 1.5)
  }
}

if (!customElements.get('zyna-waffle')) {
  customElements.define('zyna-waffle', ZynaWaffle)
}
