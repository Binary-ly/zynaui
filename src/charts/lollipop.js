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
 *   color        — accent color for the highlighted item. Default: var(--zyna)
 *   theme        — 'dark' (default) or 'light'
 *   highlight    — label of the item to accent. Default: first item (index 0)
 *   muted-color  — color for non-highlighted stems, dots and labels. Default: var(--zyna-dark) for
 *                  stems and dots, #8A8478 (dark) / #6B6560 (light) for labels
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
    const accent     = this._attr('color', this._brand())
    const mutedAttr  = this._attr('muted-color', '')
    const muted      = mutedAttr || this._brandDark()
    const mutedT     = mutedAttr || this._muted()
    const hlLabel    = this._attr('highlight', '') || data[0]?.label || ''
    const fmt        = this._attr('label-format', '')
    const fmtVal     = v => this._fmt(v, fmt)
    const showVals   = this._attr('show-values', 'true') !== 'false'
    const heightAttr = parseInt(this._attr('height', '0'))
    const tickCountRaw = parseInt(this._attr('ticks', '5'))
    const tickCount    = tickCountRaw > 0 ? tickCountRaw : 5
    const dark       = this._theme() !== 'light'
    const textC      = dark ? '#F0EBE0' : '#1A1A20'
    const gridC      = dark ? '#1E1E24' : '#E5E1D4'
    const tickTextC  = this._muted()

    if (!data.length) { this._warnEmpty('zyna-lollipop'); return }

    // Guard: maxVal prevents xScale domain from collapsing to [0, 0]
    const maxVal    = max(data, d => d.value) || 1
    const domainMax = maxVal * 1.1

    const W    = this.clientWidth || 420
    // Row height clamps between 44px and 70px and scales with container width
    const rowH = Math.max(44, Math.min(70, W * 0.14))
    const H    = heightAttr > 0 ? heightAttr : Math.max(200, data.length * rowH + 60)

    // Font sizes scale with container width
    const fSm    = Math.max(9, W * 0.022)
    const fMd    = Math.max(11, W * 0.026)

    // Persist the SVG — only update viewBox/dimensions on resize.
    let svg = select(this).select('svg')
    if (svg.empty()) {
      svg = select(this).append('svg').style('display', 'block')
    }

    // The label gutter used to be a fixed share of the width, so any label
    // longer than about nine characters ran off the left edge and was cut.
    // Measure the widest label in the label font and widen the gutter to fit
    // it, up to 45% of the width; a label longer than that is trimmed with an
    // ellipsis instead of being clipped.
    let probe = svg.select('text.ll-probe')
    if (probe.empty()) {
      probe = svg.append('text').attr('class', 'll-probe').attr('visibility', 'hidden').attr('aria-hidden', 'true')
    }
    probe.attr('font-size', `${fMd}px`)
    const measure = t => {
      probe.text(t)
      const node = probe.node()
      return node.getComputedTextLength ? node.getComputedTextLength() : String(t).length * fMd * 0.6
    }
    const labelW = Math.max(0, ...data.map(d => measure(String(d.label ?? ''))))
    const fit = (sel, maxW) => {
      const node = sel.node()
      let t = String(sel.text())
      if (!node.getComputedTextLength) return
      while (t.length > 1 && node.getComputedTextLength() > maxW) {
        t = t.slice(0, -1)
        sel.text(t.trimEnd() + '…')
      }
    }

    const m      = { left: Math.min(Math.max(60, W * 0.18, labelW + 12), W * 0.45), right: Math.max(50, W * 0.15), top: 10, bottom: 28 }
    const innerW = W - m.left - m.right
    const innerH = H - m.top - m.bottom
    const xScale = scaleLinear().domain([0, domainMax]).range([0, innerW])

    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', W).attr('height', H)
    this._applyA11y(svg, `Lollipop chart: ${data.map(d => `${d.label} ${fmtVal(d.value)}`).join(', ')}`)

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
          .attr('stroke', gridC).attr('stroke-width', 0.8)
        g.select('.ll-tick-label')
          .attr('x', tx).attr('y', H - m.bottom + 16)
          .attr('text-anchor', 'middle').attr('font-family', 'monospace')
          .attr('font-size', `${fSm}px`).attr('fill', tickTextC).text(tick)
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
        // Clamp into the [0, domainMax] domain — negative or non-numeric values
        // otherwise place the dot left of the margin, unclipped.
        const x     = m.left + xScale(Math.max(0, Number.isFinite(+pt.value) ? +pt.value : 0))
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

        const label = g.select('.ll-label')
          .attr('x', m.left - 6).attr('y', y + fSm * 0.4)
          .attr('text-anchor', 'end').attr('font-size', `${fMd}px`).attr('fill', ct).text(pt.label)
        fit(label, m.left - 8)

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
