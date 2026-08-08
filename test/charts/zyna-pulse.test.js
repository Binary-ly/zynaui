import { expect, fixture, fixtureCleanup } from '@open-wc/testing'
import '../../src/charts/pulse.js'

const DATA = JSON.stringify([
  { label: 'CPU', values: [0, 2, -1, 5, -3, 1, 0] },
  { label: 'MEM', values: [1, 1, 2, 2, 3, 2, 1] },
  { label: 'NET', values: [0, -2, 3, -1, 2, -2, 0], color: '#00D4FF' },
])
const XLABELS = JSON.stringify(['t0', 't1', 't2', 't3', 't4', 't5', 't6'])

describe('zyna-pulse', () => {
  afterEach(() => fixtureCleanup())

  it('registers as a custom element', () => {
    expect(customElements.get('zyna-pulse')).to.exist
  })

  it('renders an SVG when data is provided', async () => {
    const el = await fixture(`<zyna-pulse data='${DATA}'></zyna-pulse>`)
    expect(el.querySelector('svg')).to.exist
  })

  it('renders one track, trace, glow and baseline per entity', async () => {
    const el = await fixture(`<zyna-pulse data='${DATA}'></zyna-pulse>`)
    expect(el.querySelectorAll('g.pl-track').length).to.equal(3)
    expect(el.querySelectorAll('polyline.pl-trace').length).to.equal(3)
    expect(el.querySelectorAll('polyline.pl-glow').length).to.equal(3)
    expect(el.querySelectorAll('line.pl-base').length).to.equal(3)
  })

  it('renders traces with finite point coordinates', async () => {
    const el = await fixture(`<zyna-pulse data='${DATA}'></zyna-pulse>`)
    el.querySelectorAll('polyline.pl-trace').forEach(p => {
      expect(p.getAttribute('points')).to.not.contain('NaN')
      expect(p.getAttribute('points').length).to.be.greaterThan(0)
    })
  })

  it('renders one track label per entity', async () => {
    const el = await fixture(`<zyna-pulse data='${DATA}'></zyna-pulse>`)
    expect([...el.querySelectorAll('text.pl-label')].map(t => t.textContent)).to.deep.equal(['CPU', 'MEM', 'NET'])
  })

  it('renders x-axis labels when provided', async () => {
    const el = await fixture(`<zyna-pulse data='${DATA}' x-labels='${XLABELS}'></zyna-pulse>`)
    const shown = [...el.querySelectorAll('text.pl-xlabel')].filter(t => t.getAttribute('display') !== 'none')
    expect(shown.length).to.equal(7)
  })

  it('draws an event marker resolved by x-label', async () => {
    const el = await fixture(`<zyna-pulse data='${DATA}' x-labels='${XLABELS}' marker='${JSON.stringify([{ x: 't3', label: 'spike' }])}'></zyna-pulse>`)
    expect(el.querySelectorAll('g.pl-marker').length).to.equal(1)
    expect(el.querySelector('text.pl-marker-label').textContent).to.equal('spike')
  })

  it('resolves an event marker by numeric index', async () => {
    const el = await fixture(`<zyna-pulse data='${DATA}' marker='${JSON.stringify([{ x: 2 }])}'></zyna-pulse>`)
    expect(el.querySelectorAll('g.pl-marker').length).to.equal(1)
  })

  it('handles an all-zero track without NaN', async () => {
    const el = await fixture(`<zyna-pulse data='${JSON.stringify([{ label: 'Z', values: [0, 0, 0, 0] }])}'></zyna-pulse>`)
    expect(el.querySelector('polyline.pl-trace').getAttribute('points')).to.not.contain('NaN')
  })

  it('does not render SVG when data is empty', async () => {
    const el = await fixture(`<zyna-pulse data='[]' data-silent></zyna-pulse>`)
    expect(el.querySelector('svg')).to.be.null
  })

  it('re-renders when data changes', async () => {
    const el = await fixture(`<zyna-pulse data='${DATA}'></zyna-pulse>`)
    el.setAttribute('data', JSON.stringify([{ label: 'Solo', values: [1, 2, 1] }]))
    await new Promise(r => setTimeout(r, 50))
    expect(el.querySelectorAll('g.pl-track').length).to.equal(1)
  })

  it('sets an aria-label summary', async () => {
    const el = await fixture(`<zyna-pulse data='${DATA}'></zyna-pulse>`)
    expect(el.getAttribute('role')).to.equal('img')
    expect(el.getAttribute('aria-label')).to.contain('signal tracks')
  })
})
