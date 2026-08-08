import { expect, fixture, fixtureCleanup } from '@open-wc/testing'
import '../../src/charts/delta.js'

const DATA = JSON.stringify([
  { label: 'Q1', value: 120, baseline: 100 }, // +20%
  { label: 'Q2', value: 80,  baseline: 100 }, // −20%
  { label: 'Q3', value: 150, baseline: 150 }, // 0%
])

describe('zyna-delta', () => {
  afterEach(() => fixtureCleanup())

  it('registers as a custom element', () => {
    expect(customElements.get('zyna-delta')).to.exist
  })

  it('renders an SVG when data is provided', async () => {
    const el  = await fixture(`<zyna-delta data='${DATA}'></zyna-delta>`)
    const svg = el.querySelector('svg')
    expect(svg).to.exist
    expect(svg.namespaceURI).to.equal('http://www.w3.org/2000/svg')
  })

  it('renders one ring group per category', async () => {
    const el = await fixture(`<zyna-delta data='${DATA}'></zyna-delta>`)
    expect(el.querySelectorAll('g.dl-cat').length).to.equal(3)
  })

  it('renders current, baseline and band arcs per category', async () => {
    const el = await fixture(`<zyna-delta data='${DATA}'></zyna-delta>`)
    expect(el.querySelectorAll('path.dl-cur').length).to.equal(3)
    expect(el.querySelectorAll('path.dl-base').length).to.equal(3)
    expect(el.querySelectorAll('path.dl-band').length).to.equal(3)
  })

  it('shows a signed percentage in each ring centre', async () => {
    const el   = await fixture(`<zyna-delta data='${DATA}'></zyna-delta>`)
    const pcts = [...el.querySelectorAll('text.dl-pct')].map(t => t.textContent)
    expect(pcts[0]).to.equal('+20%')
    expect(pcts[1]).to.equal('−20%')
    expect(pcts[2]).to.equal('+0%')
  })

  it('fills the band with the gain hatch for a gain and loss hatch for a loss', async () => {
    const el    = await fixture(`<zyna-delta data='${DATA}'></zyna-delta>`)
    const bands = [...el.querySelectorAll('path.dl-band')]
    expect(bands[0].getAttribute('fill')).to.contain('dl-gain')
    expect(bands[1].getAttribute('fill')).to.contain('dl-loss')
  })

  it('renders both hatch patterns in defs', async () => {
    const el = await fixture(`<zyna-delta data='${DATA}'></zyna-delta>`)
    expect(el.querySelectorAll('pattern[id^="dl-gain"]').length).to.equal(1)
    expect(el.querySelectorAll('pattern[id^="dl-loss"]').length).to.equal(1)
  })

  it('renders a label per category', async () => {
    const el = await fixture(`<zyna-delta data='${DATA}'></zyna-delta>`)
    expect([...el.querySelectorAll('text.dl-label')].map(t => t.textContent)).to.deep.equal(['Q1', 'Q2', 'Q3'])
  })

  it('does not render SVG when data is empty', async () => {
    const el = await fixture(`<zyna-delta data='[]' data-silent></zyna-delta>`)
    expect(el.querySelector('svg')).to.be.null
  })

  it('handles a zero baseline without NaN (shows the raw delta)', async () => {
    const el = await fixture(`<zyna-delta data='${JSON.stringify([{ label: 'New', value: 40, baseline: 0 }])}'></zyna-delta>`)
    expect(el.querySelector('text.dl-pct').textContent).to.equal('+40')
    expect(el.querySelector('path.dl-cur').getAttribute('d')).to.not.contain('NaN')
  })

  it('re-renders when data changes', async () => {
    const el = await fixture(`<zyna-delta data='${DATA}'></zyna-delta>`)
    el.setAttribute('data', JSON.stringify([{ label: 'Solo', value: 90, baseline: 60 }]))
    await new Promise(r => setTimeout(r, 50))
    expect(el.querySelectorAll('g.dl-cat').length).to.equal(1)
    expect(el.querySelector('text.dl-pct').textContent).to.equal('+50%')
  })

  it('signs a sub-1% loss as a loss (no contradictory "+0%")', async () => {
    const el  = await fixture(`<zyna-delta data='${JSON.stringify([{ label: 'X', value: 99.7, baseline: 100 }])}'></zyna-delta>`)
    const pct = el.querySelector('text.dl-pct').textContent
    expect(pct.startsWith('−')).to.be.true // U+2212, matches a loss
    expect(el.querySelector('path.dl-band').getAttribute('fill')).to.contain('dl-loss')
  })

  it('sets an aria-label summary', async () => {
    const el = await fixture(`<zyna-delta data='${DATA}'></zyna-delta>`)
    expect(el.getAttribute('role')).to.equal('img')
    expect(el.getAttribute('aria-label')).to.contain('categories vs baseline')
  })
})
