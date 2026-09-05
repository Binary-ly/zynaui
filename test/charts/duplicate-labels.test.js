/**
 * Duplicate-label robustness — every chart must render one element per data
 * row, at its own position, even when two rows share a label (two "Other"
 * categories, two candles on the same date string, two periods both called "Q1").
 *
 * Real bug (candlestick, density): the x scales were built from label strings,
 * and d3's band/point scales de-duplicate their domain — so two rows sharing a
 * label collapsed onto one x position and drew on top of each other. Both
 * scales are now built from row indices.
 *
 * The other charts key their joins by label; a d3 keyed join still creates an
 * element per datum (duplicate keys enter separately, and on re-render one is
 * cycled through exit+enter), so they never lost a row — these cases pin that
 * behaviour down.
 */
import { expect, fixture, fixtureCleanup } from '@open-wc/testing'
import '../../src/charts/index.js'

const three = JSON.stringify([
  { label: 'A', value: 10 }, { label: 'A', value: 20 }, { label: 'B', value: 30 },
])

describe('charts render every row when labels repeat', () => {
  afterEach(() => fixtureCleanup())

  it('zyna-timeline', async () => {
    const el = await fixture(`<zyna-timeline data='${three}'></zyna-timeline>`)
    expect(el.querySelectorAll('g.tl-pt').length).to.equal(3)
  })

  it('zyna-nightingale', async () => {
    const el = await fixture(`<zyna-nightingale data='${three}'></zyna-nightingale>`)
    expect(el.querySelectorAll('g.ng-sector').length).to.equal(3)
  })

  it('zyna-lollipop', async () => {
    const el = await fixture(`<zyna-lollipop data='${three}'></zyna-lollipop>`)
    expect(el.querySelectorAll('g.ll-row').length).to.equal(3)
  })

  it('zyna-stratum', async () => {
    const data = JSON.stringify([
      { label: 'North', values: [1, 2, 3] }, { label: 'North', values: [3, 2, 1] },
    ])
    const el = await fixture(`<zyna-stratum data='${data}'></zyna-stratum>`)
    expect(el.querySelectorAll('text.st-rowlabel').length).to.equal(2)
  })

  it('zyna-delta', async () => {
    const data = JSON.stringify([
      { label: 'X', value: 10, baseline: 5 }, { label: 'X', value: 4, baseline: 8 }, { label: 'Y', value: 6, baseline: 6 },
    ])
    const el = await fixture(`<zyna-delta data='${data}'></zyna-delta>`)
    expect(el.querySelectorAll('g.dl-cat').length).to.equal(3)
  })

  it('zyna-resonance', async () => {
    const el = await fixture(`<zyna-resonance data='${three}'></zyna-resonance>`)
    expect(el.querySelectorAll('g.rs-item').length).to.equal(3)
  })

  it('zyna-tension', async () => {
    const data = JSON.stringify([
      { label: 'A', before: 1, after: 2 }, { label: 'A', before: 2, after: 1 }, { label: 'B', before: 3, after: 3 },
    ])
    const el = await fixture(`<zyna-tension data='${data}'></zyna-tension>`)
    expect(el.querySelectorAll('path.tn-link').length).to.equal(3)
    expect(el.querySelectorAll('g.tn-node').length).to.equal(6)
  })

  it('zyna-pulse', async () => {
    const data = JSON.stringify([
      { label: 'CPU', values: [1, 2, 3] }, { label: 'CPU', values: [3, 2, 1] },
    ])
    const el = await fixture(`<zyna-pulse data='${data}'></zyna-pulse>`)
    expect(el.querySelectorAll('g.pl-track').length).to.equal(2)
  })

  it('zyna-density draws both periods at distinct x positions', async () => {
    const data = JSON.stringify([
      { label: 'Q1', values: [1, 2, 3, 4, 5] }, { label: 'Q1', values: [5, 6, 7, 8, 9] },
    ])
    const el = await fixture(`<zyna-density data='${data}'></zyna-density>`)
    const violins = [...el.querySelectorAll('path.dn-violin')].filter(p => p.getAttribute('display') !== 'none')
    expect(violins.length).to.equal(2)
    const xs = [...el.querySelectorAll('text.dn-xlabel')].map(t => t.getAttribute('x'))
    expect(new Set(xs).size).to.equal(2)
    expect(el.querySelectorAll('circle.dn-median').length).to.equal(2)
  })

  it('zyna-candlestick draws both candles at distinct x positions', async () => {
    const data = JSON.stringify([
      { date: '2026-01-02', open: 1, high: 3, low: 0, close: 2 },
      { date: '2026-01-02', open: 2, high: 4, low: 1, close: 3 },
    ])
    const el = await fixture(`<zyna-candlestick data='${data}'></zyna-candlestick>`)
    const bodies = [...el.querySelectorAll('rect.cs-body')]
    expect(bodies.length).to.equal(2)
    expect(new Set(bodies.map(b => b.getAttribute('x'))).size).to.equal(2)
  })
})
