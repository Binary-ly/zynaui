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
})
