import { ZynaChart } from './base.js'
import { select } from 'd3-selection'
import { max } from 'd3-array'
import { arc as arcGenerator } from 'd3-shape'

/**
 * <zyna-nightingale>
 *
 * Radial rose chart — sector radius encodes value.
 *
 * Attributes:
 *   data         — JSON array of { label, value, color? }
 *   color        — fallback accent color. Default: #C9A84C
 *   theme        — 'dark' (default) or 'light'
 *   height       — explicit height in px. Auto-derived from width when omitted.
 *   show-values  — set to "false" to hide numeric value labels on leader lines. Default: true
 *   label-format — D3-style number format string (e.g. '$,.0f', '.1%', ',.2f'). Default: raw value
 */
export class ZynaNightingale extends ZynaChart {
  static get observedAttributes() {
    return ['data', 'color', 'theme', 'height', 'show-values', 'label-format']
  }

  _render() {
    const data       = this._json('data', [])
    const accent     = this._attr('color', '#C9A84C')
    const dark       = this._attr('theme', 'dark') !== 'light'
    const fmt        = this._attr('label-format', '')
    const fmtVal     = v => this._fmt(v, fmt)
    const showVals   = this._attr('show-values', 'true') !== 'false'
    const heightAttr = parseInt(this._attr('height', '0'))
    const textC      = dark ? '#F0EBE0' : '#1A1A20'
    const bgC        = dark ? '#0C0C0F' : '#FFFFFF'

    if (!data.length) { this._warnEmpty('zyna-nightingale'); return }

    const W = this.clientWidth || 700
    const H = heightAttr > 0 ? heightAttr : Math.max(400, W * 0.8)

    // Persist the SVG — only update viewBox/dimensions on resize.
    let svg = select(this).select('svg')
    if (svg.empty()) {
      svg = select(this).append('svg').style('display', 'block')
    }
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', W).attr('height', H)

    const cx = W / 2, cy = H / 2
    const maxR   = Math.min(cx, cy) * 0.52
    // Guard: maxVal prevents NaN from Math.sqrt(value / 0)
    const maxVal = max(data, d => d.value) || 1
    const n      = data.length
    const slice  = (2 * Math.PI) / n
    // Label ring radius and inner hole both scale with the container
    const labelR = maxR + Math.max(70, W * 0.14)
    const innerR = Math.max(6, maxR * 0.06)
    // Font sizes scale with container width
    const fSm = Math.max(10, W * 0.015)
    const fMd = Math.max(12, W * 0.018)

    // Per-sector groups — keyed by label so D3 reuses elements on resize.
    svg.selectAll('g.ng-sector').data(data, d => d.label)
      .join(enter => {
        const g = enter.append('g').attr('class', 'ng-sector')
        g.append('path').attr('class', 'ng-arc')
        g.append('text').attr('class', 'ng-label')
        g.append('text').attr('class', 'ng-value')
        g.append('polyline').attr('class', 'ng-leader')
        g.append('circle').attr('class', 'ng-dot')
        return g
      })
      .each(function(pt, i) {
        const g     = select(this)
        const sa    = i * slice - Math.PI / 2
        const ea    = sa + slice
        const r     = maxR * Math.sqrt(pt.value / maxVal)
        const mid   = (sa + ea) / 2
        const color = pt.color || accent

        g.select('.ng-arc')
          .attr('d', arcGenerator().innerRadius(innerR).outerRadius(r).startAngle(sa).endAngle(ea))
          .attr('transform', `translate(${cx},${cy})`)
          .attr('fill', color).attr('stroke', bgC).attr('stroke-width', 1.5)

        const ex = cx + (r + 10) * Math.sin(mid), ey = cy - (r + 10) * Math.cos(mid)
        const lx = cx + labelR * Math.sin(mid),   ly = cy - labelR * Math.cos(mid)
        const sm = Math.sin(mid)
        const anchor = sm < -0.1 ? 'end' : sm > 0.1 ? 'start' : 'middle'
        const xOff   = sm > 0.1 ? 6 : sm < -0.1 ? -6 : 0

        g.select('.ng-label')
          .attr('x', lx + xOff).attr('y', ly - 4)
          .attr('text-anchor', anchor).attr('font-size', `${fMd}px`).attr('fill', textC).text(pt.label)

        g.select('.ng-value')
          .attr('display', showVals ? null : 'none')
          .attr('x', lx + xOff).attr('y', ly + fSm + 2)
          .attr('text-anchor', anchor).attr('font-family', 'monospace').attr('font-size', `${fSm}px`)
          .attr('fill', color).text(fmtVal(pt.value))

        g.select('.ng-leader')
          .attr('points', `${lx},${ly + fSm + 12} ${lx - sm * 24},${ly + fSm + 12} ${ex},${ey}`)
          .attr('fill', 'none').attr('stroke', color).attr('stroke-width', 0.8).attr('opacity', 0.5)

        g.select('.ng-dot')
          .attr('cx', ex).attr('cy', ey).attr('r', 3).attr('fill', color)
      })

    // Centre cap — select-or-create so it doesn't stack on every resize.
    let cap = svg.select('.ng-cap')
    if (cap.empty()) cap = svg.append('circle').attr('class', 'ng-cap')
    cap.attr('cx', cx).attr('cy', cy).attr('r', innerR * 1.4)
      .attr('fill', bgC).attr('stroke', dark ? '#2A2A30' : '#E5E7EB').attr('stroke-width', 1)
  }
}

if (!customElements.get('zyna-nightingale')) {
  customElements.define('zyna-nightingale', ZynaNightingale)
}
