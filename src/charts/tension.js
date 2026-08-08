import { ZynaChart } from './base.js'
import { select } from 'd3-selection'
import { linkHorizontal } from 'd3-shape'

/**
 * <zyna-tension>
 *
 * Ranked before/after comparison. Two ranked columns are joined by curved
 * connectors; each connector's slope and colour encode the rank change —
 * rising (gained rank) in the success colour, falling in danger, holding flat
 * in muted. Stroke width scales with |Δrank|, so the crossing lines are where
 * the story is.
 *
 * Attributes:
 *   data       — JSON array of { label, before, after }
 *   rank-by    — 'rank' (default; before/after are ranks, 1 = top) or 'value'
 *                (before/after are raw values; higher value ranks higher)
 *   highlight  — label to spotlight; every other connector dims to ~18%.
 *   color      — accent used for the highlight glow. Default: var(--zyna)
 *   theme      — 'dark' (default) or 'light'
 *   height     — explicit height in px. Auto-derived from item count when omitted.
 */
export class ZynaTension extends ZynaChart {
  static get observedAttributes() {
    return ['data', 'rank-by', 'highlight', 'color', 'theme', 'height']
  }

  _render() {
    const data       = this._json('data', [])
    const accent     = this._attr('color', this._brand())
    const dark       = this._theme() !== 'light'
    const rankByVal  = this._attr('rank-by', 'rank') === 'value'
    const highlight  = this._attr('highlight', '')
    const heightAttr = parseInt(this._attr('height', '0'))
    const textC      = dark ? '#F0EBE0' : '#1A1A20'
    const mutedC     = dark ? '#5A5050' : '#8A8478'
    const bgC        = dark ? '#0C0C0F' : '#FFFFFF'
    const success    = this._success()
    const danger     = this._danger()

    if (!data.length) { this._warnEmpty('zyna-tension'); return }

    const items = data.map((d, i) => ({
      label:  d.label != null ? String(d.label) : `#${i + 1}`,
      before: Number.isFinite(+d.before) ? +d.before : 0,
      after:  Number.isFinite(+d.after)  ? +d.after  : 0,
    }))
    const n = items.length

    // Derive display ranks (1..n) for each side. In 'value' mode higher = top;
    // in 'rank' mode the given number is a rank, so lower = top.
    const toRanks = (key) => {
      const order = items.map((d, i) => ({ i, v: d[key] }))
        .sort((a, b) => rankByVal ? b.v - a.v : a.v - b.v)
      const r = new Array(n)
      order.forEach((o, pos) => { r[o.i] = pos + 1 })
      return r
    }
    const beforeRank = toRanks('before')
    const afterRank  = toRanks('after')
    items.forEach((d, i) => {
      d.br = beforeRank[i]
      d.ar = afterRank[i]
      d.delta = d.br - d.ar // positive = moved up the ranking
    })

    const W    = this.clientWidth || 520
    const rowH = Math.max(26, Math.min(52, W * 0.09))
    const H    = heightAttr > 0 ? heightAttr : Math.max(180, n * rowH + 54)
    const uid  = this._uid

    const fLbl  = Math.max(9, W * 0.02)
    const badge = Math.max(14, fLbl * 1.5)
    const gutter = Math.max(70, W * 0.24)
    const xL   = gutter
    const xR   = W - gutter
    const top  = 40
    const rowGap = n > 1 ? (H - top - 22) / (n - 1) : 0
    const yFor = rank => top + (rank - 1) * rowGap

    // Persist the SVG — only update viewBox/dimensions on resize.
    let svg = select(this).select('svg')
    if (svg.empty()) svg = select(this).append('svg').style('display', 'block').style('overflow', 'visible')
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', W).attr('height', H)

    // A11y: biggest riser / faller by Δrank.
    const sorted = [...items].sort((a, b) => b.delta - a.delta)
    const riser  = sorted[0]
    const faller = sorted[sorted.length - 1]
    const riseTxt = riser.delta  > 0 ? `biggest riser ${riser.label} (+${riser.delta})`   : 'no risers'
    const fallTxt = faller.delta < 0 ? `biggest faller ${faller.label} (−${Math.abs(faller.delta)})` : 'no fallers'
    this._applyA11y(svg, `Ranked before/after comparison of ${n} items; ${riseTxt}, ${fallTxt}.`)

    // Brand-coloured glow filter for the highlighted connector.
    let defs = svg.select('defs')
    if (defs.empty()) defs = svg.insert('defs', ':first-child')
    let glow = defs.select(`#tn-glow-${uid}`)
    if (glow.empty()) {
      glow = defs.append('filter').attr('id', `tn-glow-${uid}`)
        .attr('x', '-40%').attr('y', '-40%').attr('width', '180%').attr('height', '180%')
      glow.append('feDropShadow').attr('dx', 0).attr('dy', 0).attr('stdDeviation', 2.4).attr('flood-opacity', 0.9)
    }
    glow.select('feDropShadow').attr('flood-color', accent)

    // An unmatched highlight (typo / stale prop / filtered-out label) must be a
    // no-op, not a full-chart dim — otherwise the whole chart reads as broken.
    const hasHl = highlight !== '' && items.some(d => d.label === highlight)
    const colorFor = d => d.delta > 0 ? success : (d.delta < 0 ? danger : mutedC)

    // Column headers.
    const header = (x, txt) => {
      const cls = `tn-head-${x === xL ? 'l' : 'r'}`
      let t = svg.select(`text.${cls}`)
      if (t.empty()) t = svg.append('text').attr('class', cls)
      t.attr('x', x).attr('y', 18).attr('text-anchor', 'middle')
        .attr('font-family', 'monospace').attr('font-size', `${fLbl}px`).attr('fill', mutedC)
        .attr('letter-spacing', '0.08em').text(txt)
    }
    header(xL, 'BEFORE')
    header(xR, 'AFTER')

    const link = linkHorizontal().x(d => d[0]).y(d => d[1])

    // Connectors — drawn first so nodes/badges sit on top. Keyed by label.
    svg.selectAll('path.tn-link').data(items, d => d.label)
      .join(
        enter  => enter.append('path').attr('class', 'tn-link').attr('fill', 'none'),
        update => update,
        exit   => exit.remove()
      )
      .each(function(d) {
        const hot = hasHl && d.label === highlight
        const dim = hasHl && !hot
        select(this)
          .attr('d', link({ source: [xL, yFor(d.br)], target: [xR, yFor(d.ar)] }))
          .attr('stroke', colorFor(d))
          .attr('stroke-width', Math.min(1 + Math.abs(d.delta) * 0.9, rowGap > 0 ? Math.max(3, rowGap * 0.55) : 8) + (hot ? 1.5 : 0))
          .attr('stroke-linecap', 'round')
          .attr('opacity', dim ? 0.18 : 0.9)
          .attr('filter', hot ? `url(#tn-glow-${uid})` : null)
      })

    // Endpoint nodes + rank badges + labels, one group per item per side.
    const nodes = []
    items.forEach(d => {
      nodes.push({ key: `${d.label}|b`, side: 'b', d, x: xL, y: yFor(d.br), rank: d.br })
      nodes.push({ key: `${d.label}|a`, side: 'a', d, x: xR, y: yFor(d.ar), rank: d.ar })
    })

    // Truncate labels to the gutter so long names never overflow the container.
    const maxLabelChars = Math.max(4, Math.floor((gutter - badge - 12) / (fLbl * 0.6)))
    const trunc = s => s.length > maxLabelChars ? s.slice(0, maxLabelChars - 1) + '…' : s

    svg.selectAll('g.tn-node').data(nodes, d => d.key)
      .join(
        enter => {
          const g = enter.append('g').attr('class', 'tn-node')
          g.append('rect').attr('class', 'tn-badge')
          g.append('text').attr('class', 'tn-rank')
          g.append('text').attr('class', 'tn-label')
          return g
        },
        update => update,
        exit   => exit.remove()
      )
      .each(function(nd) {
        const g    = select(this)
        const isB  = nd.side === 'b'
        const col  = colorFor(nd.d)
        const hot  = hasHl && nd.d.label === highlight
        const dim  = hasHl && !hot
        const bx   = isB ? nd.x - badge - 4 : nd.x + 4         // badge left edge
        const bcx  = bx + badge / 2
        const op   = dim ? 0.25 : 1

        g.select('.tn-badge')
          .attr('x', bx).attr('y', nd.y - badge / 2)
          .attr('width', badge).attr('height', badge).attr('rx', 2)
          .attr('fill', 'none').attr('stroke', col).attr('stroke-width', hot ? 1.6 : 1)
          .attr('opacity', op)

        g.select('.tn-rank')
          .attr('x', bcx).attr('y', nd.y + fLbl * 0.35)
          .attr('text-anchor', 'middle').attr('font-family', 'monospace')
          .attr('font-size', `${fLbl}px`).attr('fill', textC).attr('opacity', op)
          .text(nd.rank)

        g.select('.tn-label')
          .attr('x', isB ? bx - 6 : bx + badge + 6).attr('y', nd.y + fLbl * 0.35)
          .attr('text-anchor', isB ? 'end' : 'start')
          .attr('font-size', `${fLbl}px`).attr('fill', dim ? mutedC : textC).attr('opacity', op)
          .text(trunc(nd.d.label))
      })
  }
}

if (!customElements.get('zyna-tension')) {
  customElements.define('zyna-tension', ZynaTension)
}
