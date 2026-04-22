import { ZynaChart } from './base.js'
import { select } from 'd3-selection'
import { arc as arcGenerator } from 'd3-shape'

/**
 * <zyna-gauge>
 *
 * Segmented half-gauge — one scalar reading drawn against a set of
 * user-defined colour zones. A circular dot marker sits on the arc at the
 * value's position; zones past the marker render at reduced opacity so the
 * eye reads "up-to-here" without a needle.
 *
 * Attributes:
 *   value        — scalar reading (required). Clamped to [min, max] when drawing.
 *   min          — minimum of the range. Default: 0
 *   max          — maximum of the range. Default: 100
 *   zones        — JSON array of { from, to, color, label }. Defines segments and band labels.
 *   start-label  — optional text at the arc's start end
 *   end-label    — optional text at the arc's end end
 *   theme        — 'dark' (default) or 'light'
 *   label        — optional static caption below the value. When omitted, the
 *                  active zone's label is used instead.
 *   label-format — D3-style number format applied to the centre value.
 *   thickness    — arc thickness in px. Default: scales with radius (~15%)
 *   arc-degrees  — total arc sweep in degrees. Default: 180
 *   dim-opacity  — opacity of zones past the marker. Default: 0.35
 *   height       — explicit height in px. Auto-derived from width when omitted.
 */
export class ZynaGauge extends ZynaChart {
  static get observedAttributes() {
    return ['value', 'min', 'max', 'zones', 'start-label', 'end-label',
            'theme', 'label', 'label-format', 'thickness', 'arc-degrees',
            'dim-opacity', 'height']
  }

  _render() {
    const rawValue   = this._attr('value', '')
    const minAttr    = parseFloat(this._attr('min', '0'))
    const maxAttrRaw = parseFloat(this._attr('max', '100'))
    const labelAttr  = this._attr('label', '')
    const fmt        = this._attr('label-format', '')
    const thkAttr    = parseFloat(this._attr('thickness', '0'))
    const arcDegAttr = parseFloat(this._attr('arc-degrees', '180'))
    const dimAttr    = parseFloat(this._attr('dim-opacity', '0.35'))
    const heightAttr = parseInt(this._attr('height', '0'))
    const startLabel = this._attr('start-label', '')
    const endLabel   = this._attr('end-label', '')
    const zones      = this._json('zones', null)
    const dark       = this._attr('theme', 'dark') !== 'light'

    // Validate required inputs before doing any DOM or style work.
    if (rawValue === '' || rawValue === null) { this._warnEmpty('zyna-gauge'); return }
    const valueNum = parseFloat(rawValue)
    if (!Number.isFinite(valueNum)) { this._warnEmpty('zyna-gauge'); return }
    if (!Array.isArray(zones) || zones.length === 0) { this._warnEmpty('zyna-gauge'); return }

    const textC        = dark ? '#FFFFFF' : '#0B0B0F'
    const markerFill   = dark ? '#FFFFFF' : '#0B0B0F'
    const markerStroke = dark ? '#0B0B0F' : '#FFFFFF'

    const minVal = Number.isFinite(minAttr) ? minAttr : 0
    const maxVal = Number.isFinite(maxAttrRaw) && maxAttrRaw > minVal ? maxAttrRaw : minVal + 1
    const dimOp  = Number.isFinite(dimAttr) ? Math.max(0, Math.min(1, dimAttr)) : 0.35

    const arcDeg = Math.max(30, Math.min(360, Number.isFinite(arcDegAttr) ? arcDegAttr : 180))
    const isHalf = arcDeg <= 180

    const W = this.clientWidth || 360
    const H = heightAttr > 0 ? heightAttr : (isHalf ? Math.round(W * 0.6) : Math.round(W * 0.9))

    let svg = select(this).select('svg')
    if (svg.empty()) svg = select(this).append('svg').style('display', 'block')
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', W).attr('height', H)

    // Reserve horizontal margin for the start/end labels so they don't clip
    // at the edges of the viewBox. Approximate glyph width ≈ 0.6·fontSize.
    const fEnd0      = Math.max(10, W * 0.028)
    const labelChars = Math.max(startLabel.length, endLabel.length)
    const labelPad   = labelChars > 0 ? labelChars * fEnd0 * 0.6 + 6 : 0

    const cx     = W / 2
    const cy     = isHalf ? H * 0.82 : H * 0.55
    const outerR = Math.min(cx * 0.92 - labelPad, isHalf ? H * 0.78 : H * 0.44)
    const thickness = thkAttr > 0 ? thkAttr : Math.max(8, outerR * 0.15)
    const innerR    = Math.max(0, outerR - thickness)

    // Arc is centred about the top (0 rad). Positive angles sweep clockwise in
    // d3-shape, so startA is at the left end of the arc and endA at the right.
    const sweepRad = arcDeg * Math.PI / 180
    const startA   = -sweepRad / 2
    const endA     = sweepRad / 2

    const clamped = Math.max(minVal, Math.min(maxVal, valueNum))
    const ratio   = (clamped - minVal) / (maxVal - minVal)
    const markerAngle = startA + ratio * sweepRad

    // Gap between segments (radians). Fixed ~2° — any wider and segments start
    // to lose the "arc" feel at 180°; any tighter and the gap disappears.
    const gap = 2 * Math.PI / 180

    // Map a numeric value in [min,max] to an angle in [startA,endA].
    const toAngle = (v) => {
      const r = (Math.max(minVal, Math.min(maxVal, v)) - minVal) / (maxVal - minVal)
      return startA + r * sweepRad
    }

    // Clear old segment/marker nodes — simpler than a keyed join for a tiny N.
    svg.selectAll('.gauge-segment, .gauge-marker, .gauge-value, .gauge-label, .gauge-end-label').remove()

    // Locate the active zone using clamped value so out-of-range readings still
    // show the nearest zone label (min clamped → first zone, max clamped → last zone).
    let activeZone = null
    for (let i = 0; i < zones.length; i++) {
      const z      = zones[i]
      const from   = Number(z.from)
      const to     = Number(z.to)
      const isLast = i === zones.length - 1
      if (clamped >= from && (isLast ? clamped <= to : clamped < to)) {
        activeZone = z
        break
      }
    }

    // Draw each zone as its own arc segment.
    zones.forEach((z) => {
      const from = Number(z.from)
      const to   = Number(z.to)
      if (!Number.isFinite(from) || !Number.isFinite(to) || to <= from) return

      const rawStart = toAngle(from)
      const rawEnd   = toAngle(to)
      // Pull each end of a segment inward by half the gap so the visual gap
      // between adjacent segments equals `gap`. Clamp so an extremely narrow
      // zone doesn't flip start past end.
      const segStart = rawStart + gap / 2
      const segEnd   = Math.max(segStart + 0.0001, rawEnd - gap / 2)

      const isPast = markerAngle < rawStart - 0.0001

      // Cap corner radius so narrow zones don't visually collapse. A safe upper
      // bound is ~30% of the arc chord length at the segment's midpoint.
      const segSweep  = segEnd - segStart
      const centreR_  = (innerR + outerR) / 2
      const maxCorner = Math.max(0, segSweep * centreR_ * 0.3)
      const cornerR   = Math.min(thickness * 0.4, maxCorner)

      const segArc = arcGenerator()
        .innerRadius(innerR).outerRadius(outerR)
        .startAngle(segStart).endAngle(segEnd)
        .cornerRadius(cornerR)

      svg.append('path')
        .attr('class', 'gauge-segment')
        .attr('d', segArc())
        .attr('transform', `translate(${cx},${cy})`)
        .attr('fill', z.color || '#888')
        .attr('opacity', isPast ? dimOp : 1)
    })

    // Marker — a small filled circle sitting on the arc centre-line at the
    // value's angle. d3-shape's 0-rad points "up", so x = sin, y = -cos.
    const centreR = (innerR + outerR) / 2
    const mx = cx + Math.sin(markerAngle) * centreR
    const my = cy - Math.cos(markerAngle) * centreR
    const markerR = Math.max(6, thickness * 0.55)

    svg.append('circle')
      .attr('class', 'gauge-marker')
      .attr('cx', mx).attr('cy', my).attr('r', markerR)
      .attr('fill', markerFill)
      .attr('stroke', markerStroke)
      .attr('stroke-width', 1.5)

    // Centre value + label.
    const valText  = fmt ? this._fmt(valueNum, fmt) : String(valueNum)
    const fVal     = Math.max(18, W * 0.095)
    const fLbl     = Math.max(11, W * 0.034)
    const subLabel = labelAttr || (activeZone && activeZone.label) || ''

    svg.append('text')
      .attr('class', 'gauge-value')
      .attr('x', cx).attr('y', cy + fVal * 0.32)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'monospace').attr('font-weight', '700')
      .attr('font-size', `${fVal}px`).attr('fill', textC)
      .text(valText)

    svg.append('text')
      .attr('class', 'gauge-label')
      .attr('display', subLabel ? null : 'none')
      .attr('x', cx).attr('y', cy + fVal * 0.32 + fLbl + 6)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'monospace')
      .attr('font-size', `${fLbl}px`).attr('fill', textC).attr('opacity', 0.7)
      .text(subLabel)

    // Start / end labels sit just outside the arc ends, aligned away from centre.
    const fEnd   = fEnd0
    const labelR = outerR + thickness * 0.4 + fEnd * 0.2
    const placeEndLabel = (text, angle, anchor) => {
      if (!text) return
      const lx = cx + Math.sin(angle) * labelR
      const ly = cy - Math.cos(angle) * labelR + fEnd * 0.35
      svg.append('text')
        .attr('class', 'gauge-end-label')
        .attr('x', lx).attr('y', ly)
        .attr('text-anchor', anchor)
        .attr('font-family', 'monospace')
        .attr('font-size', `${fEnd}px`).attr('fill', textC).attr('opacity', 0.75)
        .attr('font-weight', '600')
        .text(text)
    }
    placeEndLabel(startLabel, startA, 'end')
    placeEndLabel(endLabel,   endA,   'start')
  }
}

if (!customElements.get('zyna-gauge')) {
  customElements.define('zyna-gauge', ZynaGauge)
}
