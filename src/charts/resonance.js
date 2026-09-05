import { ZynaChart } from './base.js'
import { select } from 'd3-selection'
import { mean as d3mean, deviation } from 'd3-array'

/**
 * <zyna-resonance>
 *
 * Radial deviation-from-the-mean diagram. The centre ring *is* the mean; each
 * item is a spoke whose length encodes |deviation|. Spokes above the mean point
 * outward with a solid line and a filled dot; spokes below are dashed with a
 * hollow dot. Perfect conformity collapses to the centre ring — outliers
 * literally stick out. A faint dashed ring marks ±1σ so noise reads apart from
 * signal.
 *
 * Attributes:
 *   data         — JSON array of { label, value }
 *   mean         — explicit centre value. Default: the computed mean.
 *   unit         — 'percent' (deviation as % of mean, default) or 'absolute'
 *   color        — accent for above-mean spokes. Default: var(--zyna)
 *   theme        — 'dark' (default) or 'light'
 *   height       — explicit height in px. Auto-derived from width when omitted.
 *   label-format — D3-style number format for absolute deviation labels.
 */
export class ZynaResonance extends ZynaChart {
  static get observedAttributes() {
    return ['data', 'mean', 'unit', 'color', 'theme', 'height', 'label-format']
  }

  _render() {
    const data       = this._json('data', [])
    const accent     = this._attr('color', this._brand())
    const dark       = this._theme() !== 'light'
    const unit       = this._attr('unit', 'percent') === 'absolute' ? 'absolute' : 'percent'
    const fmt        = this._attr('label-format', '')
    const fmtN       = v => fmt ? this._fmt(v, fmt) : Math.round(v * 10) / 10
    const meanAttr   = parseFloat(this._attr('mean', ''))
    const heightAttr = parseInt(this._attr('height', '0'))
    const textC      = dark ? '#F0EBE0' : '#1A1A20'
    const mutedC     = this._muted()
    const gridC      = dark ? '#2A2A30' : '#D8D3C6'
    const bgC        = dark ? '#0C0C0F' : '#FFFFFF'
    const danger     = this._danger()

    if (!data.length) { this._warnEmpty('zyna-resonance'); return }

    const items = data.map((d, i) => ({
      label: d.label != null ? String(d.label) : `#${i + 1}`,
      value: Number.isFinite(+d.value) ? +d.value : 0,
    }))

    const mean  = Number.isFinite(meanAttr) ? meanAttr : (d3mean(items, d => d.value) || 0)
    const sigma = deviation(items.map(d => d.value)) || 0
    items.forEach(d => { d.dev = d.value - mean })
    const maxAbs = Math.max(1e-9, ...items.map(d => Math.abs(d.dev)))

    const n  = items.length
    const W  = this.clientWidth || 500
    const H  = heightAttr > 0 ? heightAttr : Math.max(320, Math.min(560, W * 0.85))
    const cx = W / 2
    const cy = H / 2

    const maxR    = Math.min(cx, cy) * 0.70
    const centerR = Math.max(8, maxR * 0.13)
    const lenOf   = devAbs => centerR + (devAbs / maxAbs) * (maxR - centerR)
    const fSm     = Math.max(9,  W * 0.02)
    const fMd     = Math.max(11, W * 0.026)

    // Persist the SVG — only update viewBox/dimensions on resize.
    let svg = select(this).select('svg')
    if (svg.empty()) svg = select(this).append('svg').style('display', 'block').style('overflow', 'visible')
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', W).attr('height', H)

    // A11y: largest positive and negative deviations.
    const sorted  = [...items].sort((a, b) => b.dev - a.dev)
    const topPos  = sorted[0]
    const topNeg  = sorted[sorted.length - 1]
    this._applyA11y(svg,
      `Deviation from mean ${fmtN(mean)} for ${n} items; ` +
      `largest ${topPos.dev >= 0 ? '+' : '−'}${fmtN(Math.abs(topPos.dev))} (${topPos.label}), ` +
      `largest ${topNeg.dev >= 0 ? '+' : '−'}${fmtN(Math.abs(topNeg.dev))} (${topNeg.label}).`)

    // ±1σ ring (dashed) + label.
    const sigmaR = Math.min(maxR, lenOf(sigma))
    let sig = svg.select('circle.rs-sigma')
    if (sig.empty()) sig = svg.append('circle').attr('class', 'rs-sigma')
    sig.attr('cx', cx).attr('cy', cy).attr('r', sigmaR)
      .attr('fill', 'none').attr('stroke', gridC).attr('stroke-width', 1).attr('stroke-dasharray', '3 3')
    let sigLbl = svg.select('text.rs-sigma-label')
    if (sigLbl.empty()) sigLbl = svg.append('text').attr('class', 'rs-sigma-label')
    sigLbl.attr('x', cx + 4).attr('y', cy - sigmaR - 4)
      .attr('font-family', 'monospace').attr('font-size', `${fSm}px`).attr('fill', mutedC).text('±1σ')

    // Centre ring (the mean) + μ glyph.
    let ctr = svg.select('circle.rs-center')
    if (ctr.empty()) ctr = svg.append('circle').attr('class', 'rs-center')
    ctr.attr('cx', cx).attr('cy', cy).attr('r', centerR)
      .attr('fill', 'none').attr('stroke', mutedC).attr('stroke-width', 1)
    let mu = svg.select('text.rs-mu')
    if (mu.empty()) mu = svg.append('text').attr('class', 'rs-mu')
    mu.attr('x', cx).attr('y', cy + fSm * 0.35).attr('text-anchor', 'middle')
      .attr('font-family', 'monospace').attr('font-size', `${fSm}px`).attr('fill', mutedC).text('μ')

    const devLabel = d => {
      if (unit === 'percent' && mean !== 0) return `${d.dev >= 0 ? '+' : '−'}${Math.round(Math.abs(d.dev / mean * 100))}%`
      return `${d.dev >= 0 ? '+' : '−'}${fmtN(Math.abs(d.dev))}`
    }

    // Spokes — keyed by label so elements are reused on resize.
    svg.selectAll('g.rs-item').data(items, d => d.label)
      .join(
        enter => {
          const g = enter.append('g').attr('class', 'rs-item')
          g.append('line').attr('class', 'rs-spoke')
          g.append('circle').attr('class', 'rs-dot')
          g.append('text').attr('class', 'rs-label')
          return g
        },
        update => update,
        exit   => exit.remove()
      )
      .each(function(d, i) {
        const g     = select(this)
        const a     = i * (2 * Math.PI / n) - Math.PI / 2
        const cos   = Math.cos(a), sin = Math.sin(a)
        const above = d.dev >= 0
        const col   = above ? accent : danger
        const len   = lenOf(Math.abs(d.dev))
        const sx    = cx + centerR * cos, sy = cy + centerR * sin
        const tx    = cx + len * cos,     ty = cy + len * sin
        const isMax = i === items.indexOf(topPos) || i === items.indexOf(topNeg)

        g.select('.rs-spoke')
          .attr('x1', sx).attr('y1', sy).attr('x2', tx).attr('y2', ty)
          .attr('stroke', col).attr('stroke-width', isMax ? 2.6 : 1.8)
          .attr('stroke-dasharray', above ? null : '3 2')

        g.select('.rs-dot')
          .attr('cx', tx).attr('cy', ty).attr('r', isMax ? 4 : 3.2)
          .attr('fill', above ? col : bgC)
          .attr('stroke', col).attr('stroke-width', above ? 0 : 1.5)

        // Labels sit on a common outer ring (not at each tip) so short, near-mean
        // spokes don't pile their labels onto the centre; the angle ties each label
        // to its spoke.
        const lr     = maxR + Math.max(16, fSm * 1.4)
        const lx     = cx + lr * cos, ly = cy + lr * sin
        const anchor = cos < -0.2 ? 'end' : cos > 0.2 ? 'start' : 'middle'
        g.select('.rs-label')
          .attr('x', lx).attr('y', ly + fSm * 0.35)
          .attr('text-anchor', anchor)
          .attr('font-size', `${fSm}px`).attr('fill', isMax ? col : mutedC)
          .attr('font-weight', isMax ? '700' : '400')
          .text(isMax ? `${d.label} ${devLabel(d)}` : d.label)
      })
  }
}

if (!customElements.get('zyna-resonance')) {
  customElements.define('zyna-resonance', ZynaResonance)
}
