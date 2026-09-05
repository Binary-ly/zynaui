import { ZynaChart } from './base.js'
import { select } from 'd3-selection'
import { max } from 'd3-array'
import { arc as arcGenerator } from 'd3-shape'

/**
 * <zyna-delta>
 *
 * Delta Ring — one paired-arc ring per category, laid out in a horizontal row.
 * The outer arc encodes the current value, the inner arc the baseline; the
 * annular gap between the two radii is filled over the change wedge — green for
 * a gain, red for a loss — with a 45° hatch so the direction reads even for
 * colour-blind viewers. The signed % change sits in the ring centre.
 *
 * Attributes:
 *   data         — JSON array of { label, value, baseline, color? }
 *   max          — shared scale ceiling (angle = value / max). Default: data max.
 *   arc-degrees  — total arc sweep in degrees. Default: 270 (echoes <zyna-gauge>).
 *   color        — accent for the current arc. Default: var(--zyna)
 *   theme        — 'dark' (default) or 'light'
 *   height       — explicit height in px. Auto-derived from width when omitted.
 *   label-format — D3-style number format for the centre delta when a baseline is 0.
 */
export class ZynaDelta extends ZynaChart {
  static get observedAttributes() {
    return ['data', 'max', 'arc-degrees', 'color', 'theme', 'height', 'label-format']
  }

  _render() {
    const data       = this._json('data', [])
    const accent     = this._attr('color', this._brand())
    const dark       = this._theme() !== 'light'
    const fmt        = this._attr('label-format', '')
    const maxAttr    = parseFloat(this._attr('max', ''))
    const arcDegAttr = parseFloat(this._attr('arc-degrees', '270'))
    const heightAttr = parseInt(this._attr('height', '0'))
    const textC      = dark ? '#F0EBE0' : '#1A1A20'
    const labelC     = this._muted()
    const gridC      = dark ? '#1E1E24' : '#E5E1D4'
    const success    = this._success()
    const danger     = this._danger()

    if (!data.length) { this._warnEmpty('zyna-delta'); return }

    const cats = data.map((d, i) => ({
      label:    d.label != null ? String(d.label) : `#${i + 1}`,
      value:    Number.isFinite(+d.value)    ? +d.value    : 0,
      baseline: Number.isFinite(+d.baseline) ? +d.baseline : 0,
      color:    d.color || accent,
    }))

    const rawCeil = max(cats, c => Math.max(c.value, c.baseline))
    const ceiling = (Number.isFinite(maxAttr) && maxAttr > 0)
      ? maxAttr
      : (rawCeil > 0 ? rawCeil : 1)
    const arcDeg = Math.max(30, Math.min(360, Number.isFinite(arcDegAttr) ? arcDegAttr : 270))
    const sweep  = arcDeg * Math.PI / 180
    const angle  = v => Math.max(0, Math.min(ceiling, v)) / ceiling * sweep
    const fmtVal = v => this._fmt(v, fmt)

    const n      = cats.length
    const W      = this.clientWidth || 600
    const H      = heightAttr > 0 ? heightAttr : Math.max(190, Math.min(300, W * 0.42))
    const uid    = this._uid

    const pad    = 14
    const labelH = 22
    const cellW  = (W - pad * 2) / n
    const cy     = (H - labelH) / 2 + 6
    const rO     = Math.max(10, Math.min(cellW * 0.42, (H - labelH) / 2 - 6))
    const rI     = rO * 0.58
    const tw     = Math.max(3, rO * 0.14)
    const tb     = Math.max(2, rO * 0.11)
    const fPct   = Math.max(10, rO * 0.34)
    const fLbl   = Math.max(9,  W * 0.018)

    // Persist the SVG — only update viewBox/dimensions on resize.
    let svg = select(this).select('svg')
    if (svg.empty()) svg = select(this).append('svg').style('display', 'block')
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', W).attr('height', H)

    // A11y summary — largest gain / loss by % change (baseline ≠ 0).
    let topGain = null, topLoss = null
    cats.forEach(c => {
      if (c.baseline === 0) return
      const pct = (c.value - c.baseline) / Math.abs(c.baseline) * 100
      if (pct >= 0 && (!topGain || pct > topGain.pct)) topGain = { label: c.label, pct }
      if (pct <  0 && (!topLoss || pct < topLoss.pct)) topLoss = { label: c.label, pct }
    })
    const gainTxt = topGain ? `largest gain ${topGain.label} +${Math.round(topGain.pct)}%` : 'no gains'
    const lossTxt = topLoss ? `largest loss ${topLoss.label} −${Math.round(Math.abs(topLoss.pct))}%` : 'no losses'
    this._applyA11y(svg, `Delta rings, ${n} categories vs baseline; ${gainTxt}, ${lossTxt}.`)

    // 45° hatch patterns (gain / loss) — created once, reused across renders.
    let defs = svg.select('defs')
    if (defs.empty()) defs = svg.insert('defs', ':first-child')
    const hatch = (id, c) => {
      let p = defs.select(`#${id}`)
      if (p.empty()) {
        p = defs.append('pattern').attr('id', id)
          .attr('width', 4).attr('height', 4)
          .attr('patternTransform', 'rotate(45)').attr('patternUnits', 'userSpaceOnUse')
        p.append('rect').attr('class', 'hbg').attr('width', 4).attr('height', 4)
        p.append('line').attr('class', 'hln').attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 4).attr('stroke-width', 1.4)
      }
      p.select('.hbg').attr('fill', c).attr('opacity', 0.12)
      p.select('.hln').attr('stroke', c).attr('opacity', 0.6)
    }
    hatch(`dl-gain-${uid}`, success)
    hatch(`dl-loss-${uid}`, danger)

    const mkArc = (inner, outer, a0, a1, corner) => arcGenerator()
      .innerRadius(inner).outerRadius(outer)
      .startAngle(a0).endAngle(a1)
      .cornerRadius(corner || 0)()

    svg.selectAll('g.dl-cat').data(cats, d => d.label)
      .join(
        enter => {
          const g = enter.append('g').attr('class', 'dl-cat')
          g.append('path').attr('class', 'dl-track-o')
          g.append('path').attr('class', 'dl-track-i')
          g.append('path').attr('class', 'dl-band')
          g.append('path').attr('class', 'dl-base')
          g.append('path').attr('class', 'dl-cur')
          g.append('text').attr('class', 'dl-pct')
          g.append('text').attr('class', 'dl-label')
          return g
        },
        update => update,
        exit   => exit.remove()
      )
      .each(function(c, i) {
        const g    = select(this)
        const cx   = pad + (i + 0.5) * cellW
        const aC   = angle(c.value)
        const aB   = angle(c.baseline)
        const gain = c.value >= c.baseline
        const tr   = `translate(${cx},${cy})`

        g.select('.dl-track-o')
          .attr('d', mkArc(rO - tw / 2, rO + tw / 2, 0, sweep)).attr('transform', tr)
          .attr('fill', gridC).attr('opacity', 0.6)
        g.select('.dl-track-i')
          .attr('d', mkArc(rI - tb / 2, rI + tb / 2, 0, sweep)).attr('transform', tr)
          .attr('fill', gridC).attr('opacity', 0.6)

        g.select('.dl-band')
          .attr('d', mkArc(rI + tb / 2, rO - tw / 2, Math.min(aC, aB), Math.max(aC, aB))).attr('transform', tr)
          .attr('fill', `url(#${gain ? 'dl-gain' : 'dl-loss'}-${uid})`)

        g.select('.dl-base')
          .attr('d', mkArc(rI - tb / 2, rI + tb / 2, 0, aB, tb / 2)).attr('transform', tr)
          .attr('fill', labelC).attr('opacity', 0.85)
        g.select('.dl-cur')
          .attr('d', mkArc(rO - tw / 2, rO + tw / 2, 0, aC, tw / 2)).attr('transform', tr)
          .attr('fill', c.color)

        const pct = c.baseline !== 0 ? Math.round((c.value - c.baseline) / Math.abs(c.baseline) * 100) : null
        const centerTxt = pct != null
          ? (gain ? '+' : '−') + Math.abs(pct) + '%'
          : (gain ? '+' : '−') + fmtVal(Math.abs(c.value - c.baseline))
        g.select('.dl-pct')
          .attr('x', cx).attr('y', cy + fPct * 0.34)
          .attr('text-anchor', 'middle').attr('font-family', 'monospace').attr('font-weight', '700')
          .attr('font-size', `${fPct}px`).attr('fill', gain ? success : danger)
          .text(centerTxt)

        g.select('.dl-label')
          .attr('x', cx).attr('y', H - 6)
          .attr('text-anchor', 'middle').attr('font-size', `${fLbl}px`).attr('fill', labelC)
          .text(c.label)
      })
  }
}

if (!customElements.get('zyna-delta')) {
  customElements.define('zyna-delta', ZynaDelta)
}
