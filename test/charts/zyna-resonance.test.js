import { expect, fixture, fixtureCleanup } from '@open-wc/testing'
import '../../src/charts/resonance.js'

// mean 25 → deviations −15, −5, +5, +15
const DATA = JSON.stringify([
  { label: 'A', value: 10 },
  { label: 'B', value: 20 },
  { label: 'C', value: 30 },
  { label: 'D', value: 40 },
])

describe('zyna-resonance', () => {
  afterEach(() => fixtureCleanup())

  it('registers as a custom element', () => {
    expect(customElements.get('zyna-resonance')).to.exist
  })

  it('renders an SVG when data is provided', async () => {
    const el = await fixture(`<zyna-resonance data='${DATA}'></zyna-resonance>`)
    expect(el.querySelector('svg')).to.exist
  })

  it('renders one spoke and one dot per item', async () => {
    const el = await fixture(`<zyna-resonance data='${DATA}'></zyna-resonance>`)
    expect(el.querySelectorAll('line.rs-spoke').length).to.equal(4)
    expect(el.querySelectorAll('circle.rs-dot').length).to.equal(4)
  })

  it('dashes below-mean spokes and leaves above-mean spokes solid', async () => {
    const el = await fixture(`<zyna-resonance data='${DATA}'></zyna-resonance>`)
    const dashed = [...el.querySelectorAll('line.rs-spoke')].filter(s => s.getAttribute('stroke-dasharray'))
    expect(dashed.length).to.equal(2) // A, B below mean 25
  })

  it('renders the ±1σ ring and the mean centre', async () => {
    const el = await fixture(`<zyna-resonance data='${DATA}'></zyna-resonance>`)
    expect(el.querySelector('circle.rs-sigma')).to.exist
    expect(el.querySelector('circle.rs-center')).to.exist
    expect(el.querySelector('text.rs-mu').textContent).to.equal('μ')
  })

  it('honours an explicit mean attribute', async () => {
    const el = await fixture(`<zyna-resonance data='${DATA}' mean="35"></zyna-resonance>`)
    const dashed = [...el.querySelectorAll('line.rs-spoke')].filter(s => s.getAttribute('stroke-dasharray'))
    expect(dashed.length).to.equal(3) // A, B, C below mean 35
  })

  it('labels the extreme spokes with a percentage by default', async () => {
    const el = await fixture(`<zyna-resonance data='${DATA}'></zyna-resonance>`)
    const withPct = [...el.querySelectorAll('text.rs-label')].filter(t => /%/.test(t.textContent))
    expect(withPct.length).to.equal(2) // largest + and largest −
  })

  it('uses absolute deviation labels when unit="absolute"', async () => {
    const el = await fixture(`<zyna-resonance data='${DATA}' unit="absolute"></zyna-resonance>`)
    const anyPct = [...el.querySelectorAll('text.rs-label')].some(t => /%/.test(t.textContent))
    expect(anyPct).to.be.false
  })

  it('does not render SVG when data is empty', async () => {
    const el = await fixture(`<zyna-resonance data='[]' data-silent></zyna-resonance>`)
    expect(el.querySelector('svg')).to.be.null
  })

  it('handles all-equal values without NaN', async () => {
    const el = await fixture(`<zyna-resonance data='${JSON.stringify([{ label: 'A', value: 5 }, { label: 'B', value: 5 }, { label: 'C', value: 5 }])}'></zyna-resonance>`)
    el.querySelectorAll('line.rs-spoke').forEach(s => {
      expect(s.getAttribute('x2')).to.match(/^-?\d/)
      expect(s.getAttribute('y2')).to.match(/^-?\d/)
    })
  })

  it('re-renders when data changes', async () => {
    const el = await fixture(`<zyna-resonance data='${DATA}'></zyna-resonance>`)
    el.setAttribute('data', JSON.stringify([{ label: 'X', value: 1 }, { label: 'Y', value: 2 }]))
    await new Promise(r => setTimeout(r, 50))
    expect(el.querySelectorAll('line.rs-spoke').length).to.equal(2)
  })

  it('sets an aria-label summary', async () => {
    const el = await fixture(`<zyna-resonance data='${DATA}'></zyna-resonance>`)
    expect(el.getAttribute('role')).to.equal('img')
    expect(el.getAttribute('aria-label')).to.contain('Deviation from mean')
  })
})
