import { ZynaChart } from './base.js'
import { select } from 'd3-selection'

// Resolve any CSS colour to [r, g, b] (0–255). Hex is parsed directly; every
// other syntax (rgb(), hsl(), oklch(), named colours — anything a genre or a
// consumer might put in --zyna) goes through a canvas context, which normalises
// it. Returns null when the colour cannot be resolved.
let _colorCtx = null
function toRGB(color) {
  const s = String(color || '').trim()
  const m = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(s)
  if (m) {
    let h = m[1]; if (h.length === 3) h = h.split('').map(c => c + c).join('')
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
  }
  try {
    if (!_colorCtx) _colorCtx = document.createElement('canvas').getContext('2d')
    if (!_colorCtx) return null
    const SENTINEL = '#010203'
    _colorCtx.fillStyle = SENTINEL
    _colorCtx.fillStyle = s
    const v = String(_colorCtx.fillStyle)
    if (v === SENTINEL && s.toLowerCase() !== SENTINEL) return null   // unparseable — left the sentinel in place
    let r
    if ((r = /^#([0-9a-f]{6})$/i.exec(v))) return toRGB('#' + r[1])
    if ((r = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(v))) return [+r[1], +r[2], +r[3]]
    if ((r = /^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/.exec(v))) return [r[1], r[2], r[3]].map(x => Math.round(+x * 255))
  } catch {}
  return null
}

// Pick a readable label colour for a coloured block, by fill luminance — so
// labels stay legible on light or dark blocks in either theme. Falls back to
// the theme's text colour when the fill cannot be resolved.
function textOn(fill, fallback) {
  const rgb = toRGB(fill)
  if (!rgb) return fallback
  const [r, g, b] = rgb
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? '#0B0B0F' : '#F5F1E6'
}

// Preference/forced-colors fallbacks, injected once into the SVG so they respond
// automatically (no JS media listener) and work standalone without the plugin CSS:
//  · Windows High-Contrast → a Canvas/CanvasText wireframe (colour differentiation
//    is lost in that mode regardless, so keep shapes bordered and labels legible).
//  · reduced-transparency / increased-contrast / print → drop the bloom and paint
//    ribbons as their solid branch colour (`currentColor`, set per ribbon) at full
//    opacity instead of the translucent gradient.
// A <style> inside an inline SVG is document-global, so every selector is scoped
// to this instance's SVG (svg[data-zc="<uid>"]) rather than matching any
// `.cs-block` in the host page.
const A11Y_CSS =
  '@media (forced-colors:active){' +
    '.cs-blocks{filter:none}' +
    '.cs-block{fill:Canvas;stroke:CanvasText;stroke-width:1.5px;forced-color-adjust:none}' +
    '.cs-ribbon{fill:Canvas;stroke:CanvasText;stroke-width:1px;opacity:1;forced-color-adjust:none}' +
    '.cs-blabel,.cs-rowlabel{fill:CanvasText;forced-color-adjust:none}' +
  '}' +
  '@media (prefers-reduced-transparency:reduce),(prefers-contrast:more){' +
    '.cs-blocks{filter:none}.cs-block{opacity:1}.cs-ribbon{fill:currentColor;opacity:0.95}' +
  '}' +
  '@media print{' +
    '.cs-blocks{filter:none}.cs-block{opacity:1}.cs-ribbon{fill:currentColor;opacity:0.9}' +
  '}'
const scopedA11yCSS = uid => A11Y_CSS.replace(/\.cs-/g, `svg[data-zc="${uid}"] .cs-`)

/**
 * <zyna-cascade>
 *
 * Hierarchical split waterfall. A total fractures downward through successive
 * levels; each level shows its proportional splits as stacked blocks, connected
 * to their parent by tapering alluvial ribbons. It answers "where did it go",
 * level by level.
 *
 * Attributes:
 *   data         — nested { label, value?, children: [...] }. Parent values are
 *                  optional (summed from leaves when omitted). Depth capped at 4.
 *   level-labels — JSON array naming each tier (e.g. ["Total","Region","Program"]).
 *   min-share    — collapse slivers below this fraction of their parent into an
 *                  "Other" block. Default: 0.03 (3%).
 *   color        — accent for the first branch. Default: var(--zyna)
 *   theme        — 'dark' (default) or 'light'
 *   height       — explicit height in px. Auto-derived from width when omitted.
 *   label-format — D3-style number format for block value labels.
 *   variant      — 'sankey' renders molten gradient flows with a soft bloom;
 *                  omit (or 'waterfall') for the standard split waterfall.
 */
export class ZynaCascade extends ZynaChart {
  static get observedAttributes() {
    return ['data', 'level-labels', 'min-share', 'color', 'theme', 'height', 'label-format', 'variant']
  }

  _render() {
    const rawData    = this._json('data', null)
    const levelLbls  = this._json('level-labels', [])
    const accent     = this._attr('color', this._brand())
    const dark       = this._theme() !== 'light'
    const fmt        = this._attr('label-format', '')
    const sankey     = String(this._attr('variant', '')).toLowerCase() === 'sankey'
    const msRaw      = parseFloat(this._attr('min-share', '0.03'))
    const minShare   = Math.max(0, Math.min(0.5, Number.isFinite(msRaw) ? msRaw : 0.03))
    const heightAttr = parseInt(this._attr('height', '0'))
    const textC      = dark ? '#F0EBE0' : '#1A1A20'
    const labelC     = dark ? '#5A5050' : '#8A8478'
    const inkC       = dark ? '#09080F' : '#F7F3E8'
    const fmtVal     = v => this._fmt(v, fmt)
    const MAXD       = 4

    const isEmpty = !rawData || (Array.isArray(rawData) && !rawData.length) ||
      (!Array.isArray(rawData) && !rawData.label && !rawData.children && rawData.value == null)
    if (isEmpty) { this._warnEmpty('zyna-cascade'); return }

    // Accept either a root object or a bare array of top-level splits.
    const root = Array.isArray(rawData)
      ? { label: 'Total', children: rawData }
      : rawData

    // Compute values bottom-up (parent value optional).
    const build = (node, depth) => {
      // Recurse the FULL tree to roll up values; the depth cap only limits which
      // levels are drawn, so a value that lives below the cap still reaches the total.
      const all = Array.isArray(node.children) ? node.children.map(k => build(k, depth + 1)) : []
      const value = (node.value != null && Number.isFinite(+node.value))
        ? +node.value
        : all.reduce((s, k) => s + k.value, 0)
      return { label: node.label != null ? String(node.label) : '', value, kids: depth < MAXD ? all : [], color: node.color, depth }
    }
    const tree = build(root, 0)
    if (!(tree.value > 0)) { this._warnEmpty('zyna-cascade'); return }

    const W = this.clientWidth || 640
    const H = heightAttr > 0 ? heightAttr : Math.max(240, Math.round(W * 0.5))
    // In sankey mode the bloom overshoots the bars; pad the plot so the glow is
    // not clipped flat at the viewBox edges (left already has ample gutter).
    const sPad = sankey ? Math.max(8, Math.round(W * 0.01)) : 0
    const m = { left: Math.max(52, W * 0.13), right: 12 + sPad, top: 14 + sPad, bottom: 12 + sPad }
    const X = m.left, RW = W - m.left - m.right
    const GAP = Math.max(2, W * 0.006)
    // Dark violet darkened from #7A6ABF so a label clears WCAG AA (light text on
    // #6E5EA8 ≈ 4.85:1; the brighter tone left both text colours below 4.5:1).
    const palette = [accent, '#8A94A6', dark ? '#6E5EA8' : '#5B4A85', '#4BBFA8', '#E07B54', '#00D4FF']

    // Lay out px extents. sx0/sx1 = source slice on the parent's bottom edge
    // (no gap, ∝ share); x0/x1 = the inset block (gaps between siblings).
    let idSeq = 0
    let maxDepth = 0
    const layout = (node, x0, x1, branchColor) => {
      node.id = idSeq++
      node.x0 = x0; node.x1 = x1
      node.bcolor = branchColor
      if (node.depth > maxDepth) maxDepth = node.depth
      if (!node.kids.length || !(node.value > 0)) return

      // Collapse slivers into "Other".
      let kids = node.kids
      const big = [], small = []
      kids.forEach(k => (k.value / node.value >= minShare ? big : small).push(k))
      if (small.length) {
        const otherVal = small.reduce((s, k) => s + k.value, 0)
        if (otherVal > 0) big.push({ label: 'Other', value: otherVal, kids: [], depth: node.depth + 1, _other: true })
      }
      node.draw = big

      const k  = big.length
      const PW = x1 - x0
      const g  = Math.min(GAP, PW / (k * 3 + 1))
      const availW = PW - g * (k - 1)
      let cursor = x0, shareCum = 0
      big.forEach((kd, i) => {
        const share = kd.value / node.value
        kd.sx0 = x0 + shareCum * PW
        kd.sx1 = x0 + (shareCum + share) * PW
        kd.x0  = cursor
        kd.x1  = cursor + share * availW
        cursor = kd.x1 + g
        shareCum += share
        const col = node.depth === 0 ? palette[i % palette.length] : branchColor
        layout(kd, kd.x0, kd.x1, kd.color || col)
      })
    }
    layout(tree, X, X + RW, accent)

    const levels = maxDepth + 1
    const rowGap = Math.max(16, (H - m.top - m.bottom) * 0.16)
    const rowH   = Math.max(1, ((H - m.top - m.bottom) - rowGap * (levels - 1)) / levels)
    const yTop   = d => m.top + d * (rowH + rowGap)
    const yBot   = d => yTop(d) + rowH
    const fSm    = Math.max(8, W * 0.017)

    // Flatten for rendering.
    const nodes = []
    const walk = n => { nodes.push(n); (n.draw || []).forEach(walk) }
    walk(tree)

    // Persist the SVG — rebuild the tree geometry each render (shape varies).
    const uid = this._uid
    let svg = select(this).select('svg')
    if (svg.empty()) svg = select(this).append('svg').style('display', 'block').attr('data-zc', uid)
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', W).attr('height', H)
    svg.selectAll('.cs-ribbon, .cs-block, .cs-blocks, .cs-blabel, .cs-rowlabel, .cs-defs').remove()

    // Preference/forced-colors fallbacks — injected once; survives geometry rebuilds.
    if (svg.select('.cs-a11y-style').empty()) svg.append('style').attr('class', 'cs-a11y-style').text(scopedA11yCSS(uid))

    // A11y: largest leaf.
    const leaves = nodes.filter(n => !(n.draw && n.draw.length))
    const topLeaf = leaves.reduce((a, b) => (b.value > (a ? a.value : -1) ? b : a), null)
    this._applyA11y(svg,
      `Cascade of ${fmtVal(tree.value)} split across ${levels} levels; ` +
      (topLeaf ? `largest leaf ${topLeaf.label || 'Other'} (${Math.round(topLeaf.value / tree.value * 100)}%).` : ''))

    const OP_RIB = 0.16, OP_RIB_SANKEY = 0.5, OP_BLK = 0.85

    // Molten-sankey defs: a vertical gradient (bright at the source edge, fading
    // as the flow pours downward) and a soft coloured bloom — one pair per
    // distinct branch colour. Rebuilt each render since colours vary by genre.
    const fillOf = n => (n.depth === 0 ? accent : n.bcolor)
    const gradId = {}, glowId = {}
    if (sankey) {
      const defs  = svg.append('defs').attr('class', 'cs-defs')
      const bloom = Math.max(2.5, Math.min(5, W * 0.007))
      ;[...new Set(nodes.map(fillOf))].forEach((col, i) => {
        const gid = `cs-g-${uid}-${i}`, fid = `cs-glow-${uid}-${i}`
        gradId[col] = gid; glowId[col] = fid
        const g = defs.append('linearGradient').attr('id', gid)
          .attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 1)
        g.append('stop').attr('offset', '0%').attr('stop-color', col).attr('stop-opacity', 0.95)
        // Keep the tail visible where the flow meets the child block — on a light
        // page a very low tail opacity makes the alluvial join dissolve.
        g.append('stop').attr('offset', '100%').attr('stop-color', col).attr('stop-opacity', dark ? 0.12 : 0.3)
        const f = defs.append('filter').attr('id', fid)
          .attr('color-interpolation-filters', 'sRGB')
          .attr('x', '-60%').attr('y', '-60%').attr('width', '220%').attr('height', '220%')
        f.append('feDropShadow').attr('dx', 0).attr('dy', 0)
          .attr('stdDeviation', bloom).attr('flood-color', col).attr('flood-opacity', dark ? 0.5 : 0.32)
      })
    }

    // Ribbons parent → child (drawn first, under the blocks).
    nodes.forEach(n => {
      (n.draw || []).forEach(c => {
        const yB = yBot(n.depth), yT = yTop(c.depth)
        const midY = (yB + yT) / 2
        const d = `M${c.sx0.toFixed(1)} ${yB.toFixed(1)} C${c.sx0.toFixed(1)} ${midY.toFixed(1)}, ${c.x0.toFixed(1)} ${midY.toFixed(1)}, ${c.x0.toFixed(1)} ${yT.toFixed(1)} ` +
          `L${c.x1.toFixed(1)} ${yT.toFixed(1)} C${c.x1.toFixed(1)} ${midY.toFixed(1)}, ${c.sx1.toFixed(1)} ${midY.toFixed(1)}, ${c.sx1.toFixed(1)} ${yB.toFixed(1)} Z`
        // `color` carries the solid branch colour for the reduced-transparency /
        // print fallbacks (fill:currentColor); unused in the normal gradient render.
        const rib = svg.append('path').attr('class', 'cs-ribbon').attr('d', d).attr('stroke', 'none').style('color', c.bcolor)
        if (sankey) rib.attr('fill', `url(#${gradId[c.bcolor]})`).attr('opacity', OP_RIB_SANKEY)
        else        rib.attr('fill', c.bcolor).attr('opacity', OP_RIB)
      })
    })

    // Blocks. In sankey mode, group same-colour bars under one <g filter> so the
    // bloom is computed once per colour rather than once per bar (a wide tree
    // would otherwise allocate one offscreen blur buffer per node, every render).
    const glowLayer = {}
    const blockParent = col => {
      if (!sankey) return svg
      if (!glowLayer[col]) glowLayer[col] = svg.append('g').attr('class', 'cs-blocks').attr('filter', `url(#${glowId[col]})`)
      return glowLayer[col]
    }
    nodes.forEach(n => {
      const y = yTop(n.depth), h = rowH, w = Math.max(0.5, n.x1 - n.x0)
      const isRoot = n.depth === 0
      const fill = isRoot ? accent : n.bcolor
      const block = blockParent(fill).append('rect').attr('class', 'cs-block')
        .attr('x', n.x0).attr('y', y).attr('width', w).attr('height', h)
        .attr('fill', fill)
      if (sankey) block.attr('rx', Math.min(3, h * 0.25)).attr('opacity', 1)
      else        block.attr('opacity', isRoot ? 0.95 : OP_BLK)
    })

    // Value labels — a separate pass, appended after every block group so labels
    // always sit above the bloom and are never themselves blurred.
    nodes.forEach(n => {
      const y = yTop(n.depth), h = rowH, w = Math.max(0.5, n.x1 - n.x0)
      const isRoot = n.depth === 0
      // Fit the label to the block: full "label value", else a truncated label +
      // value, else the value alone, else nothing — never overflow the block.
      const valStr   = String(fmtVal(n.value))
      const maxChars = Math.floor((w - 6) / (fSm * 0.6))
      const full     = n.label ? `${n.label} ${valStr}` : valStr
      let txt = ''
      if (full.length <= maxChars) txt = full
      else if (n.label && valStr.length + 3 <= maxChars) txt = `${n.label.slice(0, maxChars - valStr.length - 2)}… ${valStr}`
      else if (valStr.length <= maxChars) txt = valStr
      if (txt) {
        const cx = (n.x0 + n.x1) / 2
        svg.append('text').attr('class', 'cs-blabel')
          .attr('x', cx).attr('y', y + h / 2 + fSm * 0.35).attr('text-anchor', 'middle')
          .attr('font-family', 'monospace').attr('font-size', `${fSm}px`)
          .attr('fill', textOn(isRoot ? accent : n.bcolor, textC))
          .attr('pointer-events', 'none')
          .text(txt)
      }
    })

    // Row (level) labels.
    for (let d = 0; d < levels; d++) {
      svg.append('text').attr('class', 'cs-rowlabel')
        .attr('x', 4).attr('y', yTop(d) + rowH / 2 + fSm * 0.35)
        .attr('font-family', 'monospace').attr('font-size', `${fSm}px`).attr('fill', labelC)
        .attr('letter-spacing', '0.06em')
        .text((levelLbls[d] != null ? String(levelLbls[d]) : (d === 0 ? 'TOTAL' : `L${d}`)).toUpperCase())
    }

  }
}

if (!customElements.get('zyna-cascade')) {
  customElements.define('zyna-cascade', ZynaCascade)
}
