import { ZynaChart } from './base.js'
import { select } from 'd3-selection'
import { arc as arcGenerator } from 'd3-shape'

/**
 * <zyna-orbital>
 *
 * Concentric arc chart — each ring filled as a proportion of a full circle.
 * Outermost ring = first item in data array.
 *
 * Attributes:
 *   data           — JSON array of { label, value, color? } where value is 0–1
 *   color          — fallback accent color. Default: var(--zyna)
 *   theme          — 'dark' (default) or 'light'
 *   height         — explicit height in px. Auto-derived from width when omitted.
 *   show-values    — set to "false" to hide label and percentage text. Default: true
 *   label-format   — D3-style number format string applied to the raw value (0–1).
 *                    Default: displays as percentage (e.g. 0.42 → "42.0%")
 *   ring-thickness — ring width as a fraction of outerRadius (e.g. 0.08). Default: 0.115
 */
export class ZynaOrbital extends ZynaChart {
  static get observedAttributes() {
    return ['data', 'color', 'theme', 'height', 'show-values', 'label-format', 'ring-thickness']
  }

  _render() {
    const data       = this._json('data', [])
    const accent     = this._attr('color', this._brand())
    const dark       = this._attr('theme', 'dark') !== 'light'
    const fmt        = this._attr('label-format', '')
    const fmtVal     = v => this._fmt(v, fmt)
    const showVals   = this._attr('show-values', 'true') !== 'false'
    const heightAttr = parseInt(this._attr('height', '0'))
    const rtAttr     = parseFloat(this._attr('ring-thickness', '0'))

    if (!data.length) { this._warnEmpty('zyna-orbital'); return }

    const W = this.clientWidth || 600
    const H = heightAttr > 0 ? heightAttr : Math.min(W * 0.9, 500)

    // Persist the SVG — only update viewBox/dimensions on resize.
    let svg = select(this).select('svg')
    if (svg.empty()) {
      svg = select(this).append('svg')
        .style('display', 'block').style('overflow', 'visible')
    }
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', W).attr('height', H)

    const cx      = W / 2, cy = H / 2
    const outerR  = Math.min(cx, cy) * 0.80
    const ringTW  = rtAttr > 0 ? outerR * rtAttr : outerR * 0.115
    // Adapt spacing so all rings stay above a positive radius regardless of data length.
    // For ≤5 items the default 0.21 factor is unchanged; for more items it scales down.
    const spacing = data.length > 1
      ? Math.min(outerR * 0.21, (outerR - ringTW) / (data.length - 1))
      : outerR * 0.21
    const radii   = data.map((_, i) => outerR - i * spacing)

    // _uid is inherited from ZynaChart — stable across renders for the same element.
    const uid = this._uid

    // Persist <defs> — radial gradient only needs updating if accent colour changes.
    let defs = svg.select('defs')
    if (defs.empty()) defs = svg.append('defs')

    // Radial background gradient
    let rg = defs.select(`#zyna-bg-${uid}`)
    if (rg.empty()) {
      rg = defs.append('radialGradient').attr('id', `zyna-bg-${uid}`)
        .attr('cx', '50%').attr('cy', '50%').attr('r', '50%')
      rg.append('stop').attr('offset', '0%')
      rg.append('stop').attr('offset', '55%')
      rg.append('stop').attr('offset', '100%')
    }
    rg.select('stop:nth-child(1)').attr('stop-color', accent).attr('stop-opacity', 0.18)
    rg.select('stop:nth-child(2)').attr('stop-color', accent).attr('stop-opacity', 0.04)
    rg.select('stop:nth-child(3)').attr('stop-color', accent).attr('stop-opacity', 0)

    // Background circle
    let bgCircle = svg.select('.orb-bg')
    if (bgCircle.empty()) bgCircle = svg.append('circle').attr('class', 'orb-bg')
    bgCircle.attr('cx', cx).attr('cy', cy).attr('r', outerR).attr('fill', `url(#zyna-bg-${uid})`)

    // Track rings (ghost outlines) — keyed by index
    svg.selectAll('circle.orb-track').data(data, (_, i) => i)
      .join(enter => enter.append('circle').attr('class', 'orb-track'))
      .attr('cx', cx).attr('cy', cy)
      .attr('r', (d, i) => radii[i])
      .attr('fill', 'none')
      .attr('stroke', (d) => d.color || accent)
      .attr('stroke-width', ringTW)
      .attr('opacity', 0.16)

    // Outer tick marks — count proportional to radius so they scale with container.
    // Replace feGaussianBlur filter with CSS filter on the group — GPU-accelerated.
    const tickCount = Math.max(36, Math.min(120, Math.round(outerR)))
    const tickData  = Array.from({ length: tickCount }, (_, t) => t)

    svg.selectAll('line.orb-tick').data(tickData, t => t)
      .join(enter => enter.append('line').attr('class', 'orb-tick'))
      .each(function(t) {
        const a  = (t / tickCount) * 2 * Math.PI - Math.PI / 2
        const r1 = outerR + ringTW / 2 + 4
        const r2 = outerR + ringTW / 2 + 9
        select(this)
          .attr('x1', cx + r1 * Math.cos(a)).attr('y1', cy + r1 * Math.sin(a))
          .attr('x2', cx + r2 * Math.cos(a)).attr('y2', cy + r2 * Math.sin(a))
          .attr('stroke', accent).attr('stroke-width', 0.7).attr('opacity', 0.18)
      })

    // Font sizes scale with container width
    const fSm = Math.max(10, W * 0.018)
    const fMd = Math.max(12, W * 0.022)

    // Per-ring groups — keyed by index.
    // End-point dots use CSS filter: blur() rather than SVG feGaussianBlur —
    // blur() runs on the GPU compositor and does not re-execute the filter graph.
    svg.selectAll('g.orb-ring').data(data, (_, i) => i)
      .join(enter => {
        const g = enter.append('g').attr('class', 'orb-ring')
        g.append('path').attr('class', 'orb-arc')
        g.append('circle').attr('class', 'orb-dot')
          // CSS filter: blur() is GPU-composited; SVG feGaussianBlur is CPU-only.
          .style('filter', 'blur(2px) brightness(1.8)')
        g.append('polyline').attr('class', 'orb-leader')
        g.append('text').attr('class', 'orb-label')
        g.append('text').attr('class', 'orb-pct')
        return g
      })
      .each(function(s, i) {
        const g     = select(this)
        const r     = radii[i]
        const color = s.color || accent
        const endD3 = 2 * Math.PI * s.value
        const endT  = endD3 - Math.PI / 2

        const arcPath = arcGenerator()
          .innerRadius(r - ringTW / 2).outerRadius(r + ringTW / 2)
          .startAngle(0).endAngle(endD3)

        g.select('.orb-arc')
          .attr('d', arcPath()).attr('transform', `translate(${cx},${cy})`)
          .attr('fill', color).attr('opacity', i === 0 ? 0.95 : 0.78)

        const dotX = cx + r * Math.cos(endT), dotY = cy + r * Math.sin(endT)
        g.select('.orb-dot')
          .attr('cx', dotX).attr('cy', dotY).attr('r', 3)
          .attr('fill', dark ? '#FFFFFF' : color).attr('opacity', 0.9)

        const lineEndR = outerR + ringTW / 2 + outerR * 0.08 + i * outerR * 0.016
        const cosA     = Math.cos(endT), sinA = Math.sin(endT)
        const ex       = cx + lineEndR * cosA, ey = cy + lineEndR * sinA
        const footDir  = cosA >= 0 ? 1 : -1
        const fx       = ex + footDir * (outerR * 0.04), fy = ey

        g.select('.orb-leader')
          .attr('points', `${dotX},${dotY} ${ex},${ey} ${fx},${fy}`)
          .attr('fill', 'none').attr('stroke', accent).attr('stroke-width', 0.8).attr('opacity', 0.55)

        const anchor = cosA < -0.15 ? 'end' : cosA > 0.15 ? 'start' : 'middle'
        const tx     = fx + (footDir > 0 ? 5 : -5)

        g.select('.orb-label')
          .attr('display', showVals ? null : 'none')
          .attr('x', tx).attr('y', fy - fMd - 4)
          .attr('text-anchor', anchor).attr('font-size', `${fMd}px`).attr('fill', color).text(s.label)

        g.select('.orb-pct')
          .attr('display', showVals ? null : 'none')
          .attr('x', tx).attr('y', fy - 2)
          .attr('text-anchor', anchor).attr('font-family', 'monospace').attr('font-size', `${fSm}px`)
          .attr('fill', '#FFFFFF').attr('opacity', 0.70)
          .text(fmt ? fmtVal(s.value) : `${(s.value * 100).toFixed(1)}%`)
      })
  }
}

if (!customElements.get('zyna-orbital')) {
  customElements.define('zyna-orbital', ZynaOrbital)
}
