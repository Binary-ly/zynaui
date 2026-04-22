import { expect, fixture, fixtureCleanup } from '@open-wc/testing'
import '../../src/charts/line.js'

const twoSeries = JSON.stringify([
  { label: 'MEB Basket', color: '#C9A84C', values: [
    { x: 'Jan', y: 312 }, { x: 'Feb', y: 298 }, { x: 'Mar', y: 341 },
    { x: 'Apr', y: 367 }, { x: 'May', y: 355 }, { x: 'Jun', y: 389 },
  ]},
  { label: 'FX Index', color: '#4BBFA8', values: [
    { x: 'Jan', y: 100 }, { x: 'Feb', y: 112 }, { x: 'Mar', y: 108 },
    { x: 'Apr', y: 121 }, { x: 'May', y: 119 }, { x: 'Jun', y: 134 },
  ]},
])

const singleSeries = JSON.stringify([
  { label: 'Revenue', values: [
    { x: 'Q1', y: 400 }, { x: 'Q2', y: 520 }, { x: 'Q3', y: 480 }, { x: 'Q4', y: 610 },
  ]},
])

describe('zyna-line', () => {
  afterEach(() => fixtureCleanup())

  it('registers as a custom element', () => {
    expect(customElements.get('zyna-line')).to.exist
  })

  it('renders an SVG element on connect', async () => {
    const el = await fixture(`<zyna-line data='${singleSeries}'></zyna-line>`)
    const svg = el.querySelector('svg')
    expect(svg).to.exist
    expect(svg.namespaceURI).to.equal('http://www.w3.org/2000/svg')
  })

  it('does not render SVG when data is empty', async () => {
    const el = await fixture(`<zyna-line data='[]' data-silent></zyna-line>`)
    expect(el.querySelector('svg')).to.be.null
  })

  it('does not render SVG when data attribute is missing', async () => {
    const el = await fixture(`<zyna-line data-silent></zyna-line>`)
    expect(el.querySelector('svg')).to.be.null
  })

  // ── Series rendering ──────────────────────────────────────────────────────────

  it('renders one fill path per series', async () => {
    const el = await fixture(`<zyna-line data='${twoSeries}'></zyna-line>`)
    const fills = el.querySelectorAll('path.ln-fill')
    expect(fills.length).to.equal(2)
  })

  it('renders one line path per series', async () => {
    const el = await fixture(`<zyna-line data='${twoSeries}'></zyna-line>`)
    const lines = el.querySelectorAll('path.ln-line')
    expect(lines.length).to.equal(2)
  })

  it('applies explicit series color to fill and line', async () => {
    const el = await fixture(`<zyna-line data='${twoSeries}'></zyna-line>`)
    const fills = [...el.querySelectorAll('path.ln-fill')]
    const lines = [...el.querySelectorAll('path.ln-line')]
    expect(fills[0].getAttribute('fill')).to.equal('#C9A84C')
    expect(lines[0].getAttribute('stroke')).to.equal('#C9A84C')
    expect(fills[1].getAttribute('fill')).to.equal('#4BBFA8')
    expect(lines[1].getAttribute('stroke')).to.equal('#4BBFA8')
  })

  it('single series renders without errors', async () => {
    const el = await fixture(`<zyna-line data='${singleSeries}'></zyna-line>`)
    expect(el.querySelectorAll('path.ln-line').length).to.equal(1)
    expect(el.querySelectorAll('path.ln-fill').length).to.equal(1)
  })

  // ── X-axis labels ─────────────────────────────────────────────────────────────

  it('renders x-axis tick groups for labelled points', async () => {
    const el = await fixture(`<zyna-line data='${singleSeries}'></zyna-line>`)
    const ticks = el.querySelectorAll('g.ln-xtick')
    expect(ticks.length).to.equal(4)
    const labels = [...ticks].map(g => g.querySelector('text.ln-xl').textContent)
    expect(labels).to.include('Q1')
    expect(labels).to.include('Q4')
  })

  it('suppresses x-axis label when x is empty string', async () => {
    const data = JSON.stringify([
      { values: [{ x: 'Jan', y: 100 }, { x: '', y: 120 }, { x: 'Mar', y: 140 }] },
    ])
    const el = await fixture(`<zyna-line data='${data}'></zyna-line>`)
    const ticks = el.querySelectorAll('g.ln-xtick')
    // Only 'Jan' and 'Mar' should produce ticks — '' is filtered out
    expect(ticks.length).to.equal(2)
  })

  // ── Y-axis ticks ──────────────────────────────────────────────────────────────

  it('renders y-axis tick groups', async () => {
    const el = await fixture(`<zyna-line data='${singleSeries}'></zyna-line>`)
    const ticks = el.querySelectorAll('g.ln-ytick')
    expect(ticks.length).to.be.greaterThan(0)
  })

  // ── Legend ────────────────────────────────────────────────────────────────────

  it('renders legend entries when series have labels', async () => {
    const el = await fixture(`<zyna-line data='${twoSeries}'></zyna-line>`)
    const legGroups = el.querySelectorAll('g.ln-leg')
    expect(legGroups.length).to.equal(2)
    const labels = [...legGroups].map(g => g.querySelector('text.ln-leg-label').textContent)
    expect(labels).to.include('MEB Basket')
    expect(labels).to.include('FX Index')
  })

  it('renders no legend when no series have labels', async () => {
    const data = JSON.stringify([
      { values: [{ x: 'A', y: 1 }, { x: 'B', y: 2 }] },
    ])
    const el = await fixture(`<zyna-line data='${data}'></zyna-line>`)
    expect(el.querySelectorAll('g.ln-leg').length).to.equal(0)
  })

  // ── Annotations ───────────────────────────────────────────────────────────────

  it('renders annotation groups for valid annotation entries', async () => {
    const anns = JSON.stringify([
      { series: 0, x: 'Q2', label: 'Peak', direction: 'up' },
    ])
    const el = await fixture(`<zyna-line data='${singleSeries}' annotations='${anns}'></zyna-line>`)
    const annGroups = el.querySelectorAll('g.ln-ann')
    expect(annGroups.length).to.equal(1)
    const txt = el.querySelector('text.ln-ann-txt')
    expect(txt.textContent).to.equal('Peak')
  })

  it('ignores annotations with out-of-range series index', async () => {
    const anns = JSON.stringify([
      { series: 99, x: 'Q1', label: 'Ghost' },
    ])
    const el = await fixture(`<zyna-line data='${singleSeries}' annotations='${anns}'></zyna-line>`)
    expect(el.querySelectorAll('g.ln-ann').length).to.equal(0)
  })

  it('ignores annotations with x value not found in series', async () => {
    const anns = JSON.stringify([
      { series: 0, x: 'Q9', label: 'Missing' },
    ])
    const el = await fixture(`<zyna-line data='${singleSeries}' annotations='${anns}'></zyna-line>`)
    expect(el.querySelectorAll('g.ln-ann').length).to.equal(0)
  })

  it('hides triangle when direction is not set', async () => {
    const anns = JSON.stringify([{ series: 0, x: 'Q1', label: 'Note' }])
    const el = await fixture(`<zyna-line data='${singleSeries}' annotations='${anns}'></zyna-line>`)
    const tri = el.querySelector('polygon.ln-ann-tri')
    expect(tri.getAttribute('display')).to.equal('none')
  })

  // ── Edge cases ────────────────────────────────────────────────────────────────

  it('handles single data point without crashing', async () => {
    const data = JSON.stringify([
      { values: [{ x: 'Only', y: 50 }] },
    ])
    const el = await fixture(`<zyna-line data='${data}'></zyna-line>`)
    expect(el.querySelector('svg')).to.exist
  })

  it('handles all-same y values without crashing (zero spread guard)', async () => {
    // All y=100 — spread would be 0 without the Math.max(dataMax - dataMin, 1) guard
    const data = JSON.stringify([
      { values: [{ x: 'A', y: 100 }, { x: 'B', y: 100 }, { x: 'C', y: 100 }] },
    ])
    const el = await fixture(`<zyna-line data='${data}'></zyna-line>`)
    expect(el.querySelector('svg')).to.exist
    expect(el.querySelectorAll('path.ln-line').length).to.equal(1)
  })

  it('handles negative y values', async () => {
    const data = JSON.stringify([
      { values: [{ x: 'A', y: -50 }, { x: 'B', y: -20 }, { x: 'C', y: 10 }] },
    ])
    const el = await fixture(`<zyna-line data='${data}'></zyna-line>`)
    expect(el.querySelector('svg')).to.exist
    expect(el.querySelectorAll('path.ln-line').length).to.equal(1)
  })

  it('respects explicit y-min and y-max attributes', async () => {
    const el = await fixture(`<zyna-line data='${singleSeries}' y-min="0" y-max="1000"></zyna-line>`)
    // With explicit bounds the chart should still render
    expect(el.querySelector('svg')).to.exist
    expect(el.querySelectorAll('path.ln-line').length).to.equal(1)
  })

  it('tension="1" renders without crashing', async () => {
    const el = await fixture(`<zyna-line data='${singleSeries}' tension="1"></zyna-line>`)
    expect(el.querySelectorAll('path.ln-line').length).to.equal(1)
  })

  it('tension="0" renders without crashing', async () => {
    const el = await fixture(`<zyna-line data='${singleSeries}' tension="0"></zyna-line>`)
    expect(el.querySelectorAll('path.ln-line').length).to.equal(1)
  })

  it('re-renders when data attribute changes', async () => {
    const el = await fixture(`<zyna-line data='${singleSeries}'></zyna-line>`)
    const newData = JSON.stringify([
      { label: 'Alpha', values: [{ x: 'X', y: 1 }, { x: 'Y', y: 2 }] },
      { label: 'Beta',  values: [{ x: 'X', y: 3 }, { x: 'Y', y: 4 }] },
      { label: 'Gamma', values: [{ x: 'X', y: 5 }, { x: 'Y', y: 6 }] },
    ])
    el.setAttribute('data', newData)
    await new Promise(r => setTimeout(r, 50))
    expect(el.querySelectorAll('path.ln-line').length).to.equal(3)
    const legLabels = [...el.querySelectorAll('text.ln-leg-label')].map(t => t.textContent)
    expect(legLabels).to.include('Alpha')
    expect(legLabels).to.include('Gamma')
  })

  it('clip-path attribute is set on fill and line paths', async () => {
    const el = await fixture(`<zyna-line data='${singleSeries}'></zyna-line>`)
    const fills = [...el.querySelectorAll('path.ln-fill')]
    const lines = [...el.querySelectorAll('path.ln-line')]
    fills.forEach(p => expect(p.getAttribute('clip-path')).to.match(/^url\(#ln-clip-/))
    lines.forEach(p => expect(p.getAttribute('clip-path')).to.match(/^url\(#ln-clip-/))
  })
})
