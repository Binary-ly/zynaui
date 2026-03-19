import { expect, fixture, fixtureCleanup } from '@open-wc/testing'
import '../../src/charts/waffle.js'

const twoSegment = JSON.stringify([
  { label: 'Category A', value: 35 },
  { label: 'Category B', value: 65 },
])

describe('zyna-waffle', () => {
  afterEach(() => fixtureCleanup())

  it('registers as a custom element', () => {
    expect(customElements.get('zyna-waffle')).to.exist
  })

  it('renders an SVG element on connect', async () => {
    const el = await fixture(`<zyna-waffle data='${twoSegment}'></zyna-waffle>`)
    const svg = el.querySelector('svg')
    expect(svg).to.exist
    expect(svg.namespaceURI).to.equal('http://www.w3.org/2000/svg')
  })

  it('renders 100 rect elements for a 10×10 grid totalling 100', async () => {
    const el = await fixture(`<zyna-waffle data='${twoSegment}'></zyna-waffle>`)
    const rects = el.querySelectorAll('rect')
    expect(rects.length).to.equal(100)
  })

  it('applies per-item fill colors', async () => {
    const data = JSON.stringify([
      { label: 'A', value: 50, color: '#ff0000' },
      { label: 'B', value: 50, color: '#0000ff' },
    ])
    const el = await fixture(`<zyna-waffle data='${data}'></zyna-waffle>`)
    const rects = [...el.querySelectorAll('rect')]
    const fills = rects.map(r => r.getAttribute('fill'))
    expect(fills.filter(f => f === '#ff0000').length).to.equal(50)
    expect(fills.filter(f => f === '#0000ff').length).to.equal(50)
  })

  it('renders outline cells with transparent fill and colored stroke', async () => {
    const data = JSON.stringify([
      { label: 'Filled', value: 60, color: '#C9A84C' },
      { label: 'Outline', value: 40, color: '#C9A84C', outline: true },
    ])
    const el = await fixture(`<zyna-waffle data='${data}'></zyna-waffle>`)
    const rects = [...el.querySelectorAll('rect')]
    const outlineRects = rects.filter(r => r.getAttribute('fill') === 'transparent')
    expect(outlineRects.length).to.equal(40)
    outlineRects.forEach(r => {
      expect(r.getAttribute('stroke')).to.equal('#C9A84C')
    })
  })

  it('caps grid at 100 cells when total exceeds 100', async () => {
    const data = JSON.stringify([
      { label: 'A', value: 80 },
      { label: 'B', value: 80 },
    ])
    const el = await fixture(`<zyna-waffle data='${data}'></zyna-waffle>`)
    const rects = el.querySelectorAll('rect')
    expect(rects.length).to.equal(100)
  })

  it('re-renders with new data when attribute changes', async () => {
    const el = await fixture(`<zyna-waffle data='${twoSegment}'></zyna-waffle>`)
    const newData = JSON.stringify([
      { label: 'X', value: 50, color: '#aaaaaa' },
      { label: 'Y', value: 50, color: '#bbbbbb' },
    ])
    el.setAttribute('data', newData)
    await new Promise(r => setTimeout(r, 50))
    const rects = [...el.querySelectorAll('rect')]
    const fills = new Set(rects.map(r => r.getAttribute('fill')))
    expect(fills.has('#aaaaaa')).to.be.true
    expect(fills.has('#bbbbbb')).to.be.true
  })

  it('does not render SVG when data is empty', async () => {
    const el = await fixture(`<zyna-waffle data='[]' data-silent></zyna-waffle>`)
    const svg = el.querySelector('svg')
    expect(svg).to.be.null
  })

  // ── Edge cases ────────────────────────────────────────────────────────────────

  it('renders a single data item: one segment fills all 100 cells', async () => {
    // Real scenario: developer passes [{ label: 'All', value: 100 }] — should render fine
    const data = JSON.stringify([{ label: 'All', value: 100, color: '#ff0000' }])
    const el = await fixture(`<zyna-waffle data='${data}'></zyna-waffle>`)
    const rects = el.querySelectorAll('rect')
    expect(rects.length).to.equal(100)
    const fills = [...rects].map(r => r.getAttribute('fill'))
    expect(fills.every(f => f === '#ff0000')).to.be.true
  })

  it('partial fill: total < 100 renders only total cells', async () => {
    // A 70-cell waffle grid — developer has data that only covers 70 out of 100
    const data = JSON.stringify([
      { label: 'A', value: 40, color: '#ff0000' },
      { label: 'B', value: 30, color: '#0000ff' },
    ])
    const el = await fixture(`<zyna-waffle data='${data}'></zyna-waffle>`)
    const rects = el.querySelectorAll('rect')
    expect(rects.length).to.equal(70)
  })

  it('cols=5 produces 5-column grid layout (x positions are multiples of cell+gap)', async () => {
    // Developer needs a 5-wide waffle for a narrow sidebar widget
    const data = JSON.stringify([{ label: 'A', value: 50, color: '#aaaaaa' }])
    const el = await fixture(`<zyna-waffle cols="5" data='${data}'></zyna-waffle>`)
    const rects = [...el.querySelectorAll('rect')]
    // Row 1: rects[0]–[4] must each have a unique x (they are in 5 different columns)
    const row1x = rects.slice(0, 5).map(r => parseFloat(r.getAttribute('x')))
    expect(new Set(row1x).size).to.equal(5)
    // Row 2: rects[5]–[9] start a new row — rects[5].x must equal rects[0].x (column wraps)
    expect(parseFloat(rects[5].getAttribute('x'))).to.equal(row1x[0])
    // rects[5].y must be greater than rects[0].y (it is on the next row)
    expect(parseFloat(rects[5].getAttribute('y'))).to.be.greaterThan(parseFloat(rects[0].getAttribute('y')))
  })

  it('uses fallback color attribute when item has no color key', async () => {
    // Developer provides a custom accent color but their data items have no color key.
    // waffle.js: accent = _attr('color', brand); cell color = d.color || accent
    // #123456 is a plain hex string — we can assert the exact fill value.
    const data = JSON.stringify([
      { label: 'NoColor', value: 10 },
    ])
    const el = await fixture(`<zyna-waffle color="#123456" data='${data}'></zyna-waffle>`)
    const rects = [...el.querySelectorAll('rect')]
    expect(rects.length).to.equal(10)
    rects.forEach(r => {
      expect(r.getAttribute('fill')).to.equal('#123456')
    })
  })
})
