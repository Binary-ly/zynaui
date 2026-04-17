import { expect, fixture, fixtureCleanup } from '@open-wc/testing'
import '../../src/charts/candlestick.js'

const sampleData = JSON.stringify([
  { date: '2026-01-02', open: 100, high: 108, low:  98, close: 106 }, // bull
  { date: '2026-01-03', open: 106, high: 110, low: 101, close: 103 }, // bear
  { date: '2026-01-06', open: 103, high: 107, low:  99, close: 105 }, // bull
  { date: '2026-01-07', open: 105, high: 106, low:  97, close:  98 }, // bear
])

describe('zyna-candlestick', () => {
  afterEach(() => fixtureCleanup())

  it('registers as a custom element', () => {
    expect(customElements.get('zyna-candlestick')).to.exist
  })

  it('renders an SVG element on connect', async () => {
    const el  = await fixture(`<zyna-candlestick data='${sampleData}'></zyna-candlestick>`)
    const svg = el.querySelector('svg')
    expect(svg).to.exist
    expect(svg.namespaceURI).to.equal('http://www.w3.org/2000/svg')
  })

  it('renders one wick line per data point', async () => {
    const el    = await fixture(`<zyna-candlestick data='${sampleData}'></zyna-candlestick>`)
    const wicks = el.querySelectorAll('line.cs-wick')
    expect(wicks.length).to.equal(4)
  })

  it('renders one body rect per data point', async () => {
    const el     = await fixture(`<zyna-candlestick data='${sampleData}'></zyna-candlestick>`)
    const bodies = el.querySelectorAll('rect.cs-body')
    expect(bodies.length).to.equal(4)
  })

  it('applies distinct fill colors to bullish and bearish candles', async () => {
    // Explicit hex attributes so we can assert the exact fill values.
    const el     = await fixture(`<zyna-candlestick data='${sampleData}' color="#2D8C4E" bear-color="#B03A2E"></zyna-candlestick>`)
    const bodies = [...el.querySelectorAll('rect.cs-body')]
    const fills  = bodies.map(b => b.getAttribute('fill'))
    expect(fills[0]).to.equal('#2D8C4E') // bull
    expect(fills[1]).to.equal('#B03A2E') // bear
    expect(fills[2]).to.equal('#2D8C4E') // bull
    expect(fills[3]).to.equal('#B03A2E') // bear
  })

  it('does not render SVG when data is empty', async () => {
    const el  = await fixture(`<zyna-candlestick data='[]' data-silent></zyna-candlestick>`)
    const svg = el.querySelector('svg')
    expect(svg).to.be.null
  })

  it('re-renders when data attribute changes', async () => {
    const el      = await fixture(`<zyna-candlestick data='${sampleData}'></zyna-candlestick>`)
    const newData = JSON.stringify([
      { date: '2026-02-01', open: 50, high: 55, low: 48, close: 54 },
      { date: '2026-02-02', open: 54, high: 56, low: 51, close: 52 },
    ])
    el.setAttribute('data', newData)
    await new Promise(r => setTimeout(r, 50))
    const bodies = el.querySelectorAll('rect.cs-body')
    expect(bodies.length).to.equal(2)
  })

  it('renders y-axis tick lines when show-axis is default', async () => {
    const el    = await fixture(`<zyna-candlestick data='${sampleData}'></zyna-candlestick>`)
    const ticks = el.querySelectorAll('g.cs-ytick')
    expect(ticks.length).to.be.greaterThan(0)
  })

  it('show-axis="false" removes axis ticks and x-labels', async () => {
    const el     = await fixture(`<zyna-candlestick data='${sampleData}' show-axis="false"></zyna-candlestick>`)
    const ticks  = el.querySelectorAll('g.cs-ytick')
    const labels = el.querySelectorAll('text.cs-xlabel')
    expect(ticks.length).to.equal(0)
    expect(labels.length).to.equal(0)
  })

  // ── Edge cases ────────────────────────────────────────────────────────────────

  it('single candle renders without errors', async () => {
    const data = JSON.stringify([
      { date: '2026-03-01', open: 100, high: 112, low: 98, close: 110 },
    ])
    const el     = await fixture(`<zyna-candlestick data='${data}'></zyna-candlestick>`)
    const bodies = el.querySelectorAll('rect.cs-body')
    const wicks  = el.querySelectorAll('line.cs-wick')
    expect(bodies.length).to.equal(1)
    expect(wicks.length).to.equal(1)
  })

  it('equal open and close (doji) is classed as bullish via close ≥ open rule', async () => {
    const data = JSON.stringify([
      { date: '2026-03-02', open: 100, high: 102, low: 98, close: 100 },
    ])
    const el    = await fixture(`<zyna-candlestick data='${data}' color="#ABC123" bear-color="#FFFFFF"></zyna-candlestick>`)
    const body  = el.querySelector('rect.cs-body')
    expect(body.getAttribute('fill')).to.equal('#ABC123')
  })
})
