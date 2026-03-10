import { ZynaChart } from './base.js'
import { select } from 'd3-selection'
import { max } from 'd3-array'

/**
 * <zyna-timeline>
 *
 * Proportional-circle timeline — bubble area encodes value.
 *
 * Attributes:
 *   data         — JSON array of { label, value, note? }
 *   color        — accent color. Default: #C9A84C
 *   theme        — 'dark' (default) or 'light'
 *   highlight    — label of the item to emphasize. Default: highest value item
 *   muted-color  — color for non-highlighted items. Default: #8A8478
 *   height       — explicit height in px. Auto-derived from width when omitted.
 *   show-values  — set to "false" to hide value labels below each bubble. Default: true
 *   label-format — D3-style number format string (e.g. '$,.0f', '.1%', ',.2f'). Default: raw value
 */
export class ZynaTimeline extends ZynaChart {
  static get observedAttributes() {
    return ['data', 'color', 'theme', 'highlight', 'muted-color', 'height', 'show-values', 'label-format']
  }

  _render() {
    const data       = this._json('data', [])
    const accent     = this._attr('color', '#C9A84C')
    const muted      = this._attr('muted-color', '#8A8478')
    const hl         = this._attr('highlight', '')
    const fmt        = this._attr('label-format', '')
    const fmtVal     = v => this._fmt(v, fmt)
    const showVals   = this._attr('show-values', 'true') !== 'false'
    const heightAttr = parseInt(this._attr('height', '0'))

    if (!data.length) { this._warnEmpty('zyna-timeline'); return }

    const hlLabel = hl || data.reduce((a, b) => b.value > a.value ? b : a).label

    const W = this.clientWidth || 700
    const H = heightAttr > 0 ? heightAttr : Math.max(300, W * 0.55)
    // Cap maxR so no two adjacent circles can overlap regardless of container width.
    // Derived from: xStep = (W - 2·maxR - 40) / (n-1) ≥ 2·maxR → maxR ≤ (W-40)/(2·n)
    const maxR = Math.min(80, W * 0.11, (W - 40) / (2 * data.length))

    // Guard: maxVal prevents NaN from Math.sqrt(value / 0)
    const maxVal = max(data, d => d.value) || 1
    const rScale = d => maxR * Math.sqrt(d.value / maxVal)
    const padL   = Math.ceil(rScale(data[0])) + 20
    const padR   = Math.ceil(rScale(data[data.length - 1])) + 20
    const xStep  = (W - padL - padR) / Math.max(data.length - 1, 1)
    // Layout anchors as fractions of H so they scale with container height
    const baseY  = H * 0.78
    const railY  = H * 0.12
    // Font sizes scale with container width
    const fSm  = Math.max(10, W * 0.016)
    const fMd  = Math.max(12, W * 0.018)

    // Persist the SVG — only update viewBox/dimensions on resize.
    let svg = select(this).select('svg')
    if (svg.empty()) {
      svg = select(this).append('svg').style('display', 'block')
    }
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', W).attr('height', H)

    // Static baseline and rail — select-or-create rather than append-every-render.
    let baseline = svg.select('.tl-baseline')
    if (baseline.empty()) baseline = svg.append('line').attr('class', 'tl-baseline')
    baseline.attr('x1', padL).attr('x2', W - padR)
      .attr('y1', baseY).attr('y2', baseY).attr('stroke', '#1E1E24').attr('stroke-width', 1.5)

    let rail = svg.select('.tl-rail')
    if (rail.empty()) rail = svg.append('line').attr('class', 'tl-rail')
    rail.attr('x1', padL).attr('x2', W - padR)
      .attr('y1', railY + 16).attr('y2', railY + 16).attr('stroke', '#1E1E24').attr('stroke-width', 1)

    // Per-point groups — keyed by label so D3 reuses existing elements on resize.
    const groups = svg.selectAll('g.tl-pt').data(data, d => d.label)
      .join(enter => {
        const g = enter.append('g').attr('class', 'tl-pt')
        g.append('line').attr('class', 'tl-noteline')
        g.append('text').attr('class', 'tl-note')
        g.append('circle').attr('class', 'tl-circle')
        g.append('text').attr('class', 'tl-label')
        g.append('text').attr('class', 'tl-value')
        return g
      })

    groups.each(function(pt, i) {
      const g    = select(this)
      const cx   = padL + i * xStep
      const r    = rScale(pt)
      const cy   = baseY - r
      const isHL = pt.label === hlLabel
      const c    = isHL ? accent : muted

      g.select('.tl-noteline')
        .attr('display', pt.note ? null : 'none')
        .attr('x1', cx).attr('x2', cx)
        .attr('y1', railY + 20).attr('y2', cy - r)
        .attr('stroke', c).attr('stroke-width', isHL ? 1.5 : 1).attr('stroke-dasharray', '4,3')

      g.select('.tl-note')
        .attr('display', pt.note ? null : 'none')
        .attr('x', cx).attr('y', railY + 12)
        .attr('text-anchor', 'middle').attr('font-size', `${isHL ? fMd : fSm}px`)
        .attr('font-weight', isHL ? '700' : '400').attr('fill', c).text(pt.note || '')

      g.select('.tl-circle')
        .attr('cx', cx).attr('cy', cy).attr('r', r)
        .attr('fill', isHL ? accent : 'transparent')
        .attr('stroke', accent).attr('stroke-width', isHL ? 0 : 1.5)

      g.select('.tl-label')
        .attr('x', cx).attr('y', baseY + fMd + 8)
        .attr('text-anchor', 'middle').attr('font-size', `${fMd}px`).attr('fill', c).text(pt.label)

      g.select('.tl-value')
        .attr('display', showVals ? null : 'none')
        .attr('x', cx).attr('y', baseY + fMd * 2 + 14)
        .attr('text-anchor', 'middle').attr('font-family', 'monospace')
        .attr('font-size', `${fSm}px`).attr('fill', c).text(fmtVal(pt.value))
    })
  }
}

if (!customElements.get('zyna-timeline')) {
  customElements.define('zyna-timeline', ZynaTimeline)
}
