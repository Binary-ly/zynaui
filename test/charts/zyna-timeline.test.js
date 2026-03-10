import { expect, fixture, fixtureCleanup } from '@open-wc/testing'
import '../../src/charts/timeline.js'

const sampleData = JSON.stringify([
  { label: 'Tripoli', value: 1040, note: 'Capital' },
  { label: 'Sabha',   value: 51 },
  { label: 'Benghazi', value: 45 },
])

describe('zyna-timeline', () => {
  afterEach(() => fixtureCleanup())

  it('registers as a custom element', () => {
    expect(customElements.get('zyna-timeline')).to.exist
  })

  it('renders an SVG element on connect', async () => {
    const el = await fixture(`<zyna-timeline data='${sampleData}'></zyna-timeline>`)
    const svg = el.querySelector('svg')
    expect(svg).to.exist
    expect(svg.namespaceURI).to.equal('http://www.w3.org/2000/svg')
  })

  it('renders one group per data point', async () => {
    const el = await fixture(`<zyna-timeline data='${sampleData}'></zyna-timeline>`)
    const groups = el.querySelectorAll('g.tl-pt')
    expect(groups.length).to.equal(3)
  })

  it('renders one circle per data point', async () => {
    const el = await fixture(`<zyna-timeline data='${sampleData}'></zyna-timeline>`)
    const circles = el.querySelectorAll('circle.tl-circle')
    expect(circles.length).to.equal(3)
  })

  it('renders one label text per data point', async () => {
    const el = await fixture(`<zyna-timeline data='${sampleData}'></zyna-timeline>`)
    const labels = el.querySelectorAll('text.tl-label')
    expect(labels.length).to.equal(3)
    const texts = [...labels].map(t => t.textContent)
    expect(texts).to.include('Tripoli')
    expect(texts).to.include('Sabha')
    expect(texts).to.include('Benghazi')
  })

  it('renders a baseline line element', async () => {
    const el = await fixture(`<zyna-timeline data='${sampleData}'></zyna-timeline>`)
    const baseline = el.querySelector('line.tl-baseline')
    expect(baseline).to.exist
  })

  it('renders a rail line element', async () => {
    const el = await fixture(`<zyna-timeline data='${sampleData}'></zyna-timeline>`)
    const rail = el.querySelector('line.tl-rail')
    expect(rail).to.exist
  })

  it('only shows note elements for points with notes', async () => {
    const el = await fixture(`<zyna-timeline data='${sampleData}'></zyna-timeline>`)
    const notes = [...el.querySelectorAll('text.tl-note')]
    // Notes with display:none or display:block via attr
    const visibleNotes = notes.filter(n => n.getAttribute('display') !== 'none')
    expect(visibleNotes.length).to.equal(1)
    expect(visibleNotes[0].textContent).to.equal('Capital')
  })

  it('does not render SVG when data is empty', async () => {
    const el = await fixture(`<zyna-timeline data='[]' data-silent></zyna-timeline>`)
    const svg = el.querySelector('svg')
    expect(svg).to.be.null
  })

  it('re-renders when data attribute changes', async () => {
    const el = await fixture(`<zyna-timeline data='${sampleData}'></zyna-timeline>`)
    const newData = JSON.stringify([
      { label: 'Alpha', value: 100 },
      { label: 'Beta', value: 200 },
    ])
    el.setAttribute('data', newData)
    await new Promise(r => setTimeout(r, 50))
    const labels = [...el.querySelectorAll('text.tl-label')].map(t => t.textContent)
    expect(labels).to.include('Alpha')
    expect(labels).to.include('Beta')
    expect(labels).not.to.include('Tripoli')
  })
})
