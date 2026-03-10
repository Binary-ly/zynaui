import { expect, fixture, fixtureCleanup } from '@open-wc/testing'
import '../../src/charts/lollipop.js'

const sampleData = JSON.stringify([
  { label: 'Tripoli',   value: 1040 },
  { label: 'Al Jufara', value: 108 },
  { label: 'Sabha',     value: 51 },
  { label: 'Benghazi',  value: 45 },
])

describe('zyna-lollipop', () => {
  afterEach(() => fixtureCleanup())

  it('registers as a custom element', () => {
    expect(customElements.get('zyna-lollipop')).to.exist
  })

  it('renders an SVG element on connect', async () => {
    const el = await fixture(`<zyna-lollipop data='${sampleData}'></zyna-lollipop>`)
    const svg = el.querySelector('svg')
    expect(svg).to.exist
    expect(svg.namespaceURI).to.equal('http://www.w3.org/2000/svg')
  })

  it('renders one row group per data point', async () => {
    const el = await fixture(`<zyna-lollipop data='${sampleData}'></zyna-lollipop>`)
    const rows = el.querySelectorAll('g.ll-row')
    expect(rows.length).to.equal(4)
  })

  it('renders one stem line per data point', async () => {
    const el = await fixture(`<zyna-lollipop data='${sampleData}'></zyna-lollipop>`)
    const stems = el.querySelectorAll('line.ll-stem')
    expect(stems.length).to.equal(4)
  })

  it('renders one dot circle per data point', async () => {
    const el = await fixture(`<zyna-lollipop data='${sampleData}'></zyna-lollipop>`)
    const dots = el.querySelectorAll('circle.ll-dot')
    expect(dots.length).to.equal(4)
  })

  it('renders label text for each row', async () => {
    const el = await fixture(`<zyna-lollipop data='${sampleData}'></zyna-lollipop>`)
    const labels = [...el.querySelectorAll('text.ll-label')].map(t => t.textContent)
    expect(labels).to.include('Tripoli')
    expect(labels).to.include('Benghazi')
  })

  it('renders value text for each row', async () => {
    const el = await fixture(`<zyna-lollipop data='${sampleData}'></zyna-lollipop>`)
    const values = [...el.querySelectorAll('text.ll-value')].map(t => t.textContent)
    expect(values).to.include('1040')
    expect(values).to.include('45')
  })

  it('renders tick grid lines', async () => {
    const el = await fixture(`<zyna-lollipop data='${sampleData}'></zyna-lollipop>`)
    const ticks = el.querySelectorAll('g.ll-tick')
    expect(ticks.length).to.be.greaterThan(0)
  })

  it('first item dot is larger than subsequent dots (accent emphasis)', async () => {
    const el = await fixture(`<zyna-lollipop data='${sampleData}'></zyna-lollipop>`)
    const dots = [...el.querySelectorAll('circle.ll-dot')]
    const firstR = parseFloat(dots[0].getAttribute('r'))
    const secondR = parseFloat(dots[1].getAttribute('r'))
    expect(firstR).to.be.greaterThan(secondR)
  })

  it('does not render SVG when data is empty', async () => {
    const el = await fixture(`<zyna-lollipop data='[]' data-silent></zyna-lollipop>`)
    const svg = el.querySelector('svg')
    expect(svg).to.be.null
  })

  it('re-renders when data attribute changes', async () => {
    const el = await fixture(`<zyna-lollipop data='${sampleData}'></zyna-lollipop>`)
    const newData = JSON.stringify([
      { label: 'Alpha', value: 500 },
      { label: 'Beta',  value: 200 },
    ])
    el.setAttribute('data', newData)
    await new Promise(r => setTimeout(r, 50))
    const rows = el.querySelectorAll('g.ll-row')
    expect(rows.length).to.equal(2)
    const labels = [...el.querySelectorAll('text.ll-label')].map(t => t.textContent)
    expect(labels).to.include('Alpha')
    expect(labels).not.to.include('Tripoli')
  })
})
