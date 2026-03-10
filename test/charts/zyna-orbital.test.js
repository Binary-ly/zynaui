import { expect, fixture, fixtureCleanup } from '@open-wc/testing'
import '../../src/charts/orbital.js'

const sampleData = JSON.stringify([
  { label: 'EU Funding',   value: 0.82, color: '#C9A84C' },
  { label: 'UN System',    value: 0.65, color: '#009EDB' },
  { label: 'USAID',        value: 0.48, color: '#4A6741' },
])

describe('zyna-orbital', () => {
  afterEach(() => fixtureCleanup())

  it('registers as a custom element', () => {
    expect(customElements.get('zyna-orbital')).to.exist
  })

  it('renders an SVG element on connect', async () => {
    const el = await fixture(`<zyna-orbital data='${sampleData}'></zyna-orbital>`)
    const svg = el.querySelector('svg')
    expect(svg).to.exist
    expect(svg.namespaceURI).to.equal('http://www.w3.org/2000/svg')
  })

  it('renders a <defs> element with a radial gradient', async () => {
    const el = await fixture(`<zyna-orbital data='${sampleData}'></zyna-orbital>`)
    const defs = el.querySelector('defs')
    expect(defs).to.exist
    const gradient = defs.querySelector('radialGradient')
    expect(gradient).to.exist
  })

  it('radial gradient id contains the component uid', async () => {
    const el = await fixture(`<zyna-orbital data='${sampleData}'></zyna-orbital>`)
    const gradient = el.querySelector('defs radialGradient')
    expect(gradient.getAttribute('id')).to.match(/^zyna-bg-/)
  })

  it('renders one ring group per data point', async () => {
    const el = await fixture(`<zyna-orbital data='${sampleData}'></zyna-orbital>`)
    const rings = el.querySelectorAll('g.orb-ring')
    expect(rings.length).to.equal(3)
  })

  it('renders one arc path per ring', async () => {
    const el = await fixture(`<zyna-orbital data='${sampleData}'></zyna-orbital>`)
    const arcs = el.querySelectorAll('path.orb-arc')
    expect(arcs.length).to.equal(3)
  })

  it('arc paths have non-empty d attribute', async () => {
    const el = await fixture(`<zyna-orbital data='${sampleData}'></zyna-orbital>`)
    const arcs = [...el.querySelectorAll('path.orb-arc')]
    arcs.forEach(arc => {
      expect(arc.getAttribute('d')).to.not.be.empty
    })
  })

  it('renders track ring circles', async () => {
    const el = await fixture(`<zyna-orbital data='${sampleData}'></zyna-orbital>`)
    const tracks = el.querySelectorAll('circle.orb-track')
    expect(tracks.length).to.equal(3)
  })

  it('renders one endpoint dot per ring', async () => {
    const el = await fixture(`<zyna-orbital data='${sampleData}'></zyna-orbital>`)
    const dots = el.querySelectorAll('circle.orb-dot')
    expect(dots.length).to.equal(3)
  })

  it('renders label text for each ring', async () => {
    const el = await fixture(`<zyna-orbital data='${sampleData}'></zyna-orbital>`)
    const labels = [...el.querySelectorAll('text.orb-label')].map(t => t.textContent)
    expect(labels).to.include('EU Funding')
    expect(labels).to.include('USAID')
  })

  it('renders percentage text for each ring', async () => {
    const el = await fixture(`<zyna-orbital data='${sampleData}'></zyna-orbital>`)
    const pcts = [...el.querySelectorAll('text.orb-pct')].map(t => t.textContent)
    expect(pcts).to.include('82.0%')
    expect(pcts).to.include('65.0%')
    expect(pcts).to.include('48.0%')
  })

  it('renders a background circle', async () => {
    const el = await fixture(`<zyna-orbital data='${sampleData}'></zyna-orbital>`)
    const bg = el.querySelector('circle.orb-bg')
    expect(bg).to.exist
    expect(bg.getAttribute('fill')).to.match(/^url\(#zyna-bg-/)
  })

  it('renders tick marks around the outer ring', async () => {
    const el = await fixture(`<zyna-orbital data='${sampleData}'></zyna-orbital>`)
    const ticks = el.querySelectorAll('line.orb-tick')
    expect(ticks.length).to.be.greaterThan(0)
  })

  it('does not render SVG when data is empty', async () => {
    const el = await fixture(`<zyna-orbital data='[]' data-silent></zyna-orbital>`)
    const svg = el.querySelector('svg')
    expect(svg).to.be.null
  })

  it('re-renders when data attribute changes', async () => {
    const el = await fixture(`<zyna-orbital data='${sampleData}'></zyna-orbital>`)
    const newData = JSON.stringify([
      { label: 'New Ring', value: 0.5 },
    ])
    el.setAttribute('data', newData)
    await new Promise(r => setTimeout(r, 50))
    const rings = el.querySelectorAll('g.orb-ring')
    expect(rings.length).to.equal(1)
    const labels = [...el.querySelectorAll('text.orb-label')].map(t => t.textContent)
    expect(labels).to.include('New Ring')
  })
})
