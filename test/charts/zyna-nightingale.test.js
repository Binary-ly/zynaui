import { expect, fixture, fixtureCleanup } from '@open-wc/testing'
import '../../src/charts/nightingale.js'

const sampleData = JSON.stringify([
  { label: 'Emergency',    value: 607, color: '#B03A2E' },
  { label: 'Governance',   value: 408, color: '#C0392B' },
  { label: 'Peacebuilding',value: 243, color: '#922B21' },
  { label: 'Health',       value: 124, color: '#2D8C4E' },
])

describe('zyna-nightingale', () => {
  afterEach(() => fixtureCleanup())

  it('registers as a custom element', () => {
    expect(customElements.get('zyna-nightingale')).to.exist
  })

  it('renders an SVG element on connect', async () => {
    const el = await fixture(`<zyna-nightingale data='${sampleData}'></zyna-nightingale>`)
    const svg = el.querySelector('svg')
    expect(svg).to.exist
    expect(svg.namespaceURI).to.equal('http://www.w3.org/2000/svg')
  })

  it('renders one sector group per data point', async () => {
    const el = await fixture(`<zyna-nightingale data='${sampleData}'></zyna-nightingale>`)
    const sectors = el.querySelectorAll('g.ng-sector')
    expect(sectors.length).to.equal(4)
  })

  it('renders one arc path per data point', async () => {
    const el = await fixture(`<zyna-nightingale data='${sampleData}'></zyna-nightingale>`)
    const arcs = el.querySelectorAll('path.ng-arc')
    expect(arcs.length).to.equal(4)
  })

  it('arc paths have non-empty d attribute', async () => {
    const el = await fixture(`<zyna-nightingale data='${sampleData}'></zyna-nightingale>`)
    const arcs = [...el.querySelectorAll('path.ng-arc')]
    arcs.forEach(arc => {
      expect(arc.getAttribute('d')).to.not.be.empty
    })
  })

  it('applies per-item fill colors to arcs', async () => {
    const el = await fixture(`<zyna-nightingale data='${sampleData}'></zyna-nightingale>`)
    const arcs = [...el.querySelectorAll('path.ng-arc')]
    const fills = arcs.map(a => a.getAttribute('fill'))
    expect(fills).to.include('#B03A2E')
    expect(fills).to.include('#2D8C4E')
  })

  it('renders label text for each sector', async () => {
    const el = await fixture(`<zyna-nightingale data='${sampleData}'></zyna-nightingale>`)
    const labels = [...el.querySelectorAll('text.ng-label')].map(t => t.textContent)
    expect(labels).to.include('Emergency')
    expect(labels).to.include('Health')
  })

  it('renders a leader polyline per sector', async () => {
    const el = await fixture(`<zyna-nightingale data='${sampleData}'></zyna-nightingale>`)
    const leaders = el.querySelectorAll('polyline.ng-leader')
    expect(leaders.length).to.equal(4)
  })

  it('renders a centre cap circle', async () => {
    const el = await fixture(`<zyna-nightingale data='${sampleData}'></zyna-nightingale>`)
    const cap = el.querySelector('circle.ng-cap')
    expect(cap).to.exist
  })

  it('does not render SVG when data is empty', async () => {
    const el = await fixture(`<zyna-nightingale data='[]' data-silent></zyna-nightingale>`)
    const svg = el.querySelector('svg')
    expect(svg).to.be.null
  })

  it('re-renders when data attribute changes', async () => {
    const el = await fixture(`<zyna-nightingale data='${sampleData}'></zyna-nightingale>`)
    const newData = JSON.stringify([
      { label: 'Alpha', value: 100 },
      { label: 'Beta',  value: 200 },
      { label: 'Gamma', value: 150 },
    ])
    el.setAttribute('data', newData)
    await new Promise(r => setTimeout(r, 50))
    const labels = [...el.querySelectorAll('text.ng-label')].map(t => t.textContent)
    expect(labels).to.include('Alpha')
    expect(labels).not.to.include('Emergency')
  })
})
