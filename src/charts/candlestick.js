import { ZynaChart } from './base.js'
import { select, pointer } from 'd3-selection'
import { min, max } from 'd3-array'
import { scaleBand, scaleLinear } from 'd3-scale'

/**
 * <zyna-candlestick>
 *
 * OHLC candlestick chart — wick (high→low) plus body (open↔close) per period.
 *
 * Attributes:
 *   data         — JSON array of { date, open, high, low, close }; date as ISO string.
 *   color        — fill for bullish candles (close ≥ open). Default: var(--zyna)
 *   bear-color   — fill for bearish candles (close < open). Default: #B03A2E
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
    const bull       = this._attr('color', '#4CAF50')
    const bear       = this._attr('bear-color', '#FF5252')
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
      left:   showAxis ? Math.max(42, W * 0.08) : 12,
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
        .join(enter => {
          const g = enter.append('g').attr('class', 'cs-ytick')
          g.append('line').attr('class', 'cs-tick-line')
          g.append('text').attr('class', 'cs-tick-label')
          return g
        })
        .each((tick, i, nodes) => {
          const g  = select(nodes[i])
          const ty = m.top + yScale(tick)
          g.select('.cs-tick-line')
            .attr('x1', m.left).attr('x2', W - m.right)
            .attr('y1', ty).attr('y2', ty)
            .attr('stroke', gridC).attr('stroke-width', 0.8)
          g.select('.cs-tick-label')
            .attr('x', m.left - 6).attr('y', ty + fSm * 0.35)
            .attr('text-anchor', 'end').attr('font-family', 'monospace')
            .attr('font-size', `${fSm}px`).attr('fill', labelC)
            .text(fmt ? this._fmt(tick, fmt) : tick)
        })

      // X-axis labels — every Nth candle so long series don't crowd.
      const maxLabels = Math.max(2, Math.floor(innerW / 80))
      const labelStep = Math.max(1, Math.ceil(data.length / maxLabels))
      svg.selectAll('text.cs-xlabel').data(data, d => d.date)
        .join(enter => enter.append('text').attr('class', 'cs-xlabel'))
        .each((d, i, nodes) => {
          const visible = i % labelStep === 0
          const tx      = m.left + xScale(d.date) + bw / 2
          select(nodes[i])
            .attr('display', visible ? null : 'none')
            .attr('x', tx).attr('y', H - m.bottom + 16)
            .attr('text-anchor', 'middle').attr('font-family', 'monospace')
            .attr('font-size', `${fSm}px`).attr('fill', labelC)
            .text(d.date)
        })
    } else {
      svg.selectAll('g.cs-ytick').remove()
      svg.selectAll('text.cs-xlabel').remove()
    }

    // Per-candle groups keyed by date so D3 reuses existing elements on resize.
    svg.selectAll('g.cs-candle').data(data, d => d.date)
      .join(enter => {
        const g = enter.append('g').attr('class', 'cs-candle')
        g.append('line').attr('class', 'cs-wick')
        g.append('rect').attr('class', 'cs-body')
        return g
      })
      .each((pt, i, nodes) => {
        const g     = select(nodes[i])
        const isBull = pt.close >= pt.open
        const c     = isBull ? bull : bear
        const cx    = m.left + xScale(pt.date) + bw / 2
        const yHi   = m.top + yScale(pt.high)
        const yLo   = m.top + yScale(pt.low)
        const yTop  = m.top + yScale(Math.max(pt.open, pt.close))
        const yBot  = m.top + yScale(Math.min(pt.open, pt.close))
        const bodyH = Math.max(1, yBot - yTop)

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

    // ── Crosshair + tooltip ───────────────────────────────────────────────────
    const crossC   = dark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.18)'
    const tipBgC   = dark ? '#16161E' : '#F5F2EA'
    const tipBrC   = dark ? '#2A2A36' : '#D8D4C8'
    const tipTextC = dark ? '#8A8090' : '#6A6460'
    const tipHlC   = dark ? '#E0D8CC' : '#1A1510'

    const tipPad = 8
    const lineH  = Math.round(fSm * 1.65)
    const tipW   = Math.max(96, fSm * 9)
    const tipH   = tipPad * 2 + lineH * 2

    let xhG = svg.select('g.cs-crosshair')
    if (xhG.empty()) {
      xhG = svg.append('g').attr('class', 'cs-crosshair').attr('display', 'none')
      xhG.append('line').attr('class', 'cs-ch-v')
      xhG.append('line').attr('class', 'cs-ch-h')
      const tip = xhG.append('g').attr('class', 'cs-tip')
      tip.append('rect').attr('class', 'cs-tip-bg').attr('rx', 4)
      ;['cs-tip-date', 'cs-tip-price'].forEach(cls => {
        tip.append('text').attr('class', cls).attr('font-family', 'monospace')
      })
    }

    const chV = xhG.select('.cs-ch-v')
    const chH = xhG.select('.cs-ch-h')
    const tip = xhG.select('.cs-tip')

    chV.attr('y1', m.top).attr('y2', m.top + innerH)
       .attr('stroke', crossC).attr('stroke-width', 1).attr('stroke-dasharray', '3,3')
    chH.attr('x1', m.left).attr('x2', m.left + innerW)
       .attr('stroke', crossC).attr('stroke-width', 1).attr('stroke-dasharray', '3,3')

    tip.select('.cs-tip-bg')
       .attr('width', tipW).attr('height', tipH)
       .attr('fill', tipBgC).attr('stroke', tipBrC).attr('stroke-width', 1)

    // transparent overlay on top — captures all mouse events
    let overlay = svg.select('rect.cs-overlay')
    if (overlay.empty()) {
      overlay = svg.append('rect').attr('class', 'cs-overlay')
                   .attr('fill', 'none').style('pointer-events', 'all')
                   .attr('cursor', 'crosshair')
    }
    overlay.attr('x', m.left).attr('y', m.top).attr('width', innerW).attr('height', innerH)

    const step = xScale.step()

    overlay.on('mousemove', (event) => {
      const [mx, my] = pointer(event, svg.node())
      const relX = mx - m.left
      const relY = my - m.top
      if (relX < 0 || relX > innerW || relY < 0 || relY > innerH) {
        xhG.attr('display', 'none'); return
      }

      const idx   = Math.min(data.length - 1, Math.max(0, Math.floor(relX / step)))
      const pt    = data[idx]
      const cx    = m.left + xScale(pt.date) + bw / 2
      const price = yScale.invert(relY)

      xhG.attr('display', null)
      chV.attr('x1', cx).attr('x2', cx)
      chH.attr('y1', my).attr('y2', my)

      // position tooltip — flip when near right or bottom edge
      let tx = cx + 12
      if (tx + tipW > m.left + innerW - 4) tx = cx - tipW - 12
      let ty = my - tipH / 2
      if (ty < m.top + 4) ty = m.top + 4
      if (ty + tipH > m.top + innerH - 4) ty = m.top + innerH - tipH - 4

      tip.select('.cs-tip-bg').attr('x', tx).attr('y', ty)

      const rows = [
        { cls: 'cs-tip-date',  text: pt.date,                                         color: tipHlC,   bold: true },
        { cls: 'cs-tip-price', text: fmt ? this._fmt(price, fmt) : price.toFixed(2),  color: tipTextC },
      ]
      rows.forEach(({ cls, text, color, bold }, i) => {
        tip.select(`.${cls}`)
           .attr('x', tx + tipPad)
           .attr('y', ty + tipPad + fSm + i * lineH)
           .attr('font-size', `${fSm}px`)
           .attr('fill', color)
           .attr('font-weight', bold ? 'bold' : 'normal')
           .text(text)
      })
    })

    overlay.on('mouseleave', () => xhG.attr('display', 'none'))
  }
}

if (!customElements.get('zyna-candlestick')) {
  customElements.define('zyna-candlestick', ZynaCandlestick)
}
