import { expect, fixture, fixtureCleanup } from '@open-wc/testing'
import '../../src/charts/rupture.js'

// rises through the threshold (50) between C(30) and D(55)
const DATA = JSON.stringify([
  { x: 'A', y: 10 }, { x: 'B', y: 20 }, { x: 'C', y: 30 },
  { x: 'D', y: 55 }, { x: 'E', y: 70 }, { x: 'F', y: 90 },
])

describe('zyna-rupture', () => {
  afterEach(() => fixtureCleanup())

  it('registers as a custom element', () => {
    expect(customElements.get('zyna-rupture')).to.exist
  })

  it('renders an SVG when data and threshold are provided', async () => {
    const el = await fixture(`<zyna-rupture data='${DATA}' threshold="50"></zyna-rupture>`)
    expect(el.querySelector('svg')).to.exist
  })

  it('does not render SVG when threshold is missing', async () => {
    const el = await fixture(`<zyna-rupture data='${DATA}' data-silent></zyna-rupture>`)
    expect(el.querySelector('svg')).to.be.null
  })

  it('does not render SVG when data is empty', async () => {
    const el = await fixture(`<zyna-rupture data='[]' threshold="50" data-silent></zyna-rupture>`)
    expect(el.querySelector('svg')).to.be.null
  })

  it('splits into calm and breach segments when the series crosses', async () => {
    const el = await fixture(`<zyna-rupture data='${DATA}' threshold="50"></zyna-rupture>`)
    expect(el.querySelector('path.rp-calm-line').getAttribute('display')).to.not.equal('none')
    expect(el.querySelector('path.rp-breach-line').getAttribute('display')).to.not.equal('none')
    expect(el.querySelector('path.rp-breach-fill').getAttribute('display')).to.not.equal('none')
  })

  it('draws a jagged fracture seam at the crossing', async () => {
    const el = await fixture(`<zyna-rupture data='${DATA}' threshold="50"></zyna-rupture>`)
    const seam = el.querySelector('path.rp-seam')
    expect(seam.getAttribute('display')).to.not.equal('none')
    expect(seam.getAttribute('d')).to.not.contain('NaN')
  })

  it('renders the threshold line and a default label', async () => {
    const el = await fixture(`<zyna-rupture data='${DATA}' threshold="50"></zyna-rupture>`)
    expect(el.querySelector('line.rp-threshold')).to.exist
    expect(el.querySelector('text.rp-threshold-label').textContent).to.equal('50')
  })

  it('uses a custom threshold-label when provided', async () => {
    const el = await fixture(`<zyna-rupture data='${DATA}' threshold="50" threshold-label="SLA"></zyna-rupture>`)
    expect(el.querySelector('text.rp-threshold-label').textContent).to.equal('SLA')
  })

  it('hides the breach segment and seam when never breached', async () => {
    const el = await fixture(`<zyna-rupture data='${DATA}' threshold="200"></zyna-rupture>`)
    expect(el.querySelector('path.rp-breach-line').getAttribute('display')).to.equal('none')
    expect(el.querySelector('path.rp-seam').getAttribute('display')).to.equal('none')
    expect(el.querySelector('path.rp-calm-line').getAttribute('display')).to.not.equal('none')
  })

  it('supports a below-threshold (floor) breach direction', async () => {
    const floorData = JSON.stringify([{ x: 'A', y: 90 }, { x: 'B', y: 70 }, { x: 'C', y: 40 }, { x: 'D', y: 20 }])
    const el = await fixture(`<zyna-rupture data='${floorData}' threshold="50" direction="below"></zyna-rupture>`)
    expect(el.querySelector('path.rp-breach-line').getAttribute('display')).to.not.equal('none')
    expect(el.querySelector('text.rp-threshold-label').textContent).to.contain('floor')
  })

  it('re-renders when data changes', async () => {
    const el = await fixture(`<zyna-rupture data='${DATA}' threshold="50"></zyna-rupture>`)
    el.setAttribute('data', JSON.stringify([{ x: 'A', y: 10 }, { x: 'B', y: 12 }]))
    await new Promise(r => setTimeout(r, 50))
    // now never breaches 50 → breach hidden
    expect(el.querySelector('path.rp-breach-line').getAttribute('display')).to.equal('none')
  })

  it('re-indexes after dropping non-finite points so nothing renders off-canvas', async () => {
    // B has a non-numeric y and is filtered; the remaining points must stay on-scale.
    const data = JSON.stringify([{ x: 'A', y: 10 }, { x: 'B', y: 'N/A' }, { x: 'C', y: 30 }, { x: 'D', y: 55 }, { x: 'E', y: 70 }])
    const el  = await fixture(`<zyna-rupture threshold="50" data='${data}'></zyna-rupture>`)
    const svg = el.querySelector('svg')
    const W   = parseFloat(svg.getAttribute('viewBox').split(' ')[2])
    const d   = ['rp-calm-line', 'rp-breach-line']
      .map(c => el.querySelector('path.' + c))
      .filter(p => p && p.getAttribute('display') !== 'none')
      .map(p => p.getAttribute('d')).join(' ')
    const xs = [...d.matchAll(/[ML](-?\d+(?:\.\d+)?),/g)].map(m => parseFloat(m[1]))
    expect(xs.length).to.be.greaterThan(0)
    xs.forEach(x => {
      expect(x).to.be.at.most(W + 1)
      expect(x).to.be.at.least(-1)
    })
  })

  it('sets an aria-label summary', async () => {
    const el = await fixture(`<zyna-rupture data='${DATA}' threshold="50"></zyna-rupture>`)
    expect(el.getAttribute('role')).to.equal('img')
    expect(el.getAttribute('aria-label')).to.contain('threshold')
    expect(el.getAttribute('aria-label')).to.contain('breached')
  })
})
