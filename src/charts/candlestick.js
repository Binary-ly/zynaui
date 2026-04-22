import { ZynaChart } from './base.js'
import { select } from 'd3-selection'
import { min, max } from 'd3-array'
import { scaleBand, scaleLinear } from 'd3-scale'

/**
 * <zyna-candlestick>
 *
 * OHLC candlestick chart — wick (high→low) plus body (open↔close) per period.
 *
 * Attributes:
 *   data         — JSON array of { date, open, high, low, close }; date as ISO string.
 *   color        — fill for bullish candles (close ≥ open). Default: var(--zp-success)
 *   bear-color   — fill for bearish candles (close < open). Default: var(--zp-danger)
 *   theme        — 'dark' (default) or 'light'
 *   height       — explicit height in px. Auto-derived from width when omitted.
 *   show-axis    — set to "false" to hide axis ticks and labels. Default: true
 *   label-format — D3-style number format string applied to y-axis tick labels.
 *   ticks        — number of y-axis tick marks. Default: 5
 */
export class ZynaCandlestick extends ZynaChart {
  static get observedAttributes() {
    return ['data', 'color', 'bear-color', 'theme', 'height', 'show-axis', 'label-format', 'ticks']
  }

  _render() {
    const data       = this._json('data', [])
    const bull       = this._attr('color',      this._success())
    const bear       = this._attr('bear-color', this._danger())
    const dark       = this._attr('theme', 'dark') !== 'light'
    const heightAttr = parseInt(this._attr('height', '0'))
    const showAxis   = this._attr('show-axis', 'true') !== 'false'
    const fmt        = this._attr('label-format', '')
    const tickRaw    = parseInt(this._attr('ticks', '5'))
    const tickCount  = tickRaw > 0 ? tickRaw : 5
    const gridC      = dark ? '#1E1E24' : '#E5E1D4'
    const labelC     = dark ? '#5A5050' : '#8A8478'

    if (!data.length) { this._warnEmpty('zyna-candlestick'); return }

    const W = this.clientWidth || 600
    const H = heightAttr > 0 ? heightAttr : Math.max(280, Math.round(W * 0.55))

    const m      = {
      left:   showAxis ? Math.max(52, W * 0.10) : 12,
      right:  12,
      top:    10,
      bottom: showAxis ? 28 : 10
    }
    const innerW = W - m.left - m.right
    const innerH = H - m.top - m.bottom

    // Guard: all-equal OHLC wouldn't collapse the y domain and NaN-out yScale
    const lo   = min(data, d => d.low)
    const hi   = max(data, d => d.high)
    const span = (hi - lo) || (Math.abs(hi) || 1)
    const yMin = lo - span * 0.05
    const yMax = hi + span * 0.05

    const xScale = scaleBand().domain(data.map(d => d.date)).range([0, innerW]).paddingInner(0.3)
    const yScale = scaleLinear().domain([yMin, yMax]).range([innerH, 0])

    // Wick x uses band centre; body x uses band left edge
    const bw  = xScale.bandwidth()
    const fSm = Math.max(9, W * 0.02)

    // Persist the SVG — only update viewBox/dimensions on resize.
    let svg = select(this).select('svg')
    if (svg.empty()) {
      svg = select(this).append('svg').style('display', 'block')
    }
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', W).attr('height', H)

    if (showAxis) {
      // Y-axis ticks + gridlines
      const yTicks = yScale.ticks(tickCount)
      svg.selectAll('g.cs-ytick').data(yTicks, t => t)
        .join(
          enter => {
            const g = enter.append('g').attr('class', 'cs-ytick')
            g.append('line').attr('class', 'cs-tick-line')
            g.append('text').attr('class', 'cs-tick-label')
            return g
          },
          update => update,
          exit   => exit.remove()
        )
        .each((tick, i, nodes) => {
          const g  = select(nodes[i])
          const ty = m.top + yScale(tick)
          g.select('.cs-tick-line')
            .attr('x1', m.left).attr('x2', W - m.right)
            .attr('y1', ty).attr('y2', ty)
            .attr('stroke', gridC).attr('stroke-width', 0.8)
          g.select('.cs-tick-label')
            .attr('x', m.left - 10).attr('y', ty + fSm * 0.35)
            .attr('text-anchor', 'end').attr('direction', 'ltr')
            .attr('font-family', 'monospace')
            .attr('font-size', `${fSm}px`).attr('fill', labelC)
            .text(fmt ? this._fmt(tick, fmt) : tick)
        })

      // X-axis labels — every Nth candle so long series don't crowd.
      const maxLabels = Math.max(2, Math.floor(innerW / 80))
      const labelStep = Math.max(1, Math.ceil(data.length / maxLabels))
      svg.selectAll('text.cs-xlabel').data(data, d => d.date)
        .join(
          enter => enter.append('text').attr('class', 'cs-xlabel'),
          update => update,
          exit   => exit.remove()
        )
        .each((d, i, nodes) => {
          const visible = i % labelStep === 0
          const tx      = m.left + xScale(d.date) + bw / 2
          select(nodes[i])
            .attr('display', visible ? null : 'none')
            .attr('x', tx).attr('y', H - m.bottom + 16)
            .attr('text-anchor', 'middle').attr('direction', 'ltr')
            .attr('font-family', 'monospace')
            .attr('font-size', `${fSm}px`).attr('fill', labelC)
            .text(d.date)
        })
    } else {
      svg.selectAll('g.cs-ytick').remove()
      svg.selectAll('text.cs-xlabel').remove()
    }

    // Per-candle groups keyed by date so D3 reuses existing elements on resize.
    svg.selectAll('g.cs-candle').data(data, d => d.date)
      .join(
        enter => {
          const g = enter.append('g').attr('class', 'cs-candle')
          g.append('line').attr('class', 'cs-wick')
          g.append('rect').attr('class', 'cs-body')
          return g
        },
        update => update,
        exit   => exit.remove()
      )
      .each((pt, i, nodes) => {
        const g      = select(nodes[i])
        const isBull = pt.close >= pt.open
        const c      = isBull ? bull : bear
        const cx     = m.left + xScale(pt.date) + bw / 2
        const yHi    = m.top + yScale(pt.high)
        const yLo    = m.top + yScale(pt.low)
        const yTop   = m.top + yScale(Math.max(pt.open, pt.close))
        const yBot   = m.top + yScale(Math.min(pt.open, pt.close))
        const bodyH  = Math.max(1, yBot - yTop)

        g.select('.cs-wick')
          .attr('x1', cx).attr('x2', cx)
          .attr('y1', yHi).attr('y2', yLo)
          .attr('stroke', c).attr('stroke-width', 1)

        g.select('.cs-body')
          .attr('x', m.left + xScale(pt.date))
          .attr('y', yTop)
          .attr('width', Math.max(1, bw))
          .attr('height', bodyH)
          .attr('fill', c).attr('stroke', c).attr('stroke-width', 1)
      })
  }
}

if (!customElements.get('zyna-candlestick')) {
  customElements.define('zyna-candlestick', ZynaCandlestick)
}
