import { expect, fixture, fixtureCleanup } from '@open-wc/testing'
import '../../src/charts/stratum.js'

const DATA = JSON.stringify([
  { label: 'ALPHA',   values: [2, 4, 6, 8, 6, 4] },
  { label: 'BRAVO',   values: [1, 1, 2, 3, 5, 8] },
  { label: 'CHARLIE', values: [5, 4, 3, 2, 1, 1], color: '#4BBFA8' },
])
const XLABELS = JSON.stringify(['J', 'F', 'M', 'A', 'M', 'J'])

describe('zyna-stratum', () => {
  afterEach(() => fixtureCleanup())

  it('registers as a custom element', () => {
    expect(customElements.get('zyna-stratum')).to.exist
  })

  it('renders an SVG element when data is provided', async () => {
    const el  = await fixture(`<zyna-stratum data='${DATA}'></zyna-stratum>`)
    const svg = el.querySelector('svg')
    expect(svg).to.exist
    expect(svg.namespaceURI).to.equal('http://www.w3.org/2000/svg')
  })

  it('renders one cell rect per value across all rows', async () => {
    const el = await fixture(`<zyna-stratum data='${DATA}'></zyna-stratum>`)
    // 3 rows × 6 periods = 18 cells
    expect(el.querySelectorAll('rect.st-cell').length).to.equal(18)
  })

  it('renders one label per entity row', async () => {
    const el = await fixture(`<zyna-stratum data='${DATA}'></zyna-stratum>`)
    const labels = [...el.querySelectorAll('text.st-rowlabel')].map(t => t.textContent)
    expect(labels).to.deep.equal(['ALPHA', 'BRAVO', 'CHARLIE'])
  })

  it('renders x-axis period labels when provided', async () => {
    const el = await fixture(`<zyna-stratum data='${DATA}' x-labels='${XLABELS}'></zyna-stratum>`)
    const shown = [...el.querySelectorAll('text.st-xlabel')]
      .filter(t => t.getAttribute('display') !== 'none').map(t => t.textContent)
    expect(shown).to.deep.equal(['J', 'F', 'M', 'A', 'M', 'J'])
  })

  it('suppresses x labels for empty-string entries', async () => {
    const el = await fixture(`<zyna-stratum data='${DATA}' x-labels='${JSON.stringify(['J', '', '', 'A', '', ''])}'></zyna-stratum>`)
    const hidden = [...el.querySelectorAll('text.st-xlabel')].filter(t => t.getAttribute('display') === 'none')
    expect(hidden.length).to.equal(4)
  })

  it('per-row scale: each row peak reaches full cell height independently', async () => {
    const el = await fixture(`<zyna-stratum data='${DATA}' scale="row"></zyna-stratum>`)
    const cells = [...el.querySelectorAll('rect.st-cell')].map(c => +c.getAttribute('height'))
    const alphaMax   = Math.max(...cells.slice(0, 6))   // ALPHA peak = 8
    const charlieMax = Math.max(...cells.slice(12, 18)) // CHARLIE peak = 5
    // Row normalisation makes every row's own peak the same height.
    expect(Math.abs(alphaMax - charlieMax)).to.be.lessThan(0.5)
  })

  it('global scale: taller values dominate across rows', async () => {
    const el = await fixture(`<zyna-stratum data='${DATA}' scale="global"></zyna-stratum>`)
    const cells = [...el.querySelectorAll('rect.st-cell')].map(c => +c.getAttribute('height'))
    const alphaMax   = Math.max(...cells.slice(0, 6))   // contains global max 8
    const charlieMax = Math.max(...cells.slice(12, 18)) // max 5 < 8
    expect(charlieMax).to.be.lessThan(alphaMax)
  })

  it('handles rows with differing value lengths', async () => {
    const ragged = JSON.stringify([
      { label: 'A', values: [1, 2, 3, 4, 5] },
      { label: 'B', values: [1, 2] },
    ])
    const el = await fixture(`<zyna-stratum data='${ragged}'></zyna-stratum>`)
    expect(el.querySelectorAll('rect.st-cell').length).to.equal(7)
  })

  it('does not render SVG when data is empty', async () => {
    const el = await fixture(`<zyna-stratum data='[]' data-silent></zyna-stratum>`)
    expect(el.querySelector('svg')).to.be.null
  })

  it('re-renders when data changes', async () => {
    const el = await fixture(`<zyna-stratum data='${DATA}'></zyna-stratum>`)
    el.setAttribute('data', JSON.stringify([{ label: 'SOLO', values: [1, 2] }]))
    await new Promise(r => setTimeout(r, 50))
    expect(el.querySelectorAll('rect.st-cell').length).to.equal(2)
    expect([...el.querySelectorAll('text.st-rowlabel')].map(t => t.textContent)).to.deep.equal(['SOLO'])
  })

  it('sets an aria-label summary on the host', async () => {
    const el = await fixture(`<zyna-stratum data='${DATA}'></zyna-stratum>`)
    expect(el.getAttribute('role')).to.equal('img')
    expect(el.getAttribute('aria-label')).to.contain('3 entities')
    expect(el.getAttribute('aria-label')).to.contain('6 periods')
  })
})
