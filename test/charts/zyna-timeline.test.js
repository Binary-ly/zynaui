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

  // ── Edge cases ────────────────────────────────────────────────────────────────

  it('single data item renders without errors', async () => {
    // Regression: single item causes xStep = (W - padL - padR) / 0 = Infinity
    // The divisor has a Math.max(data.length - 1, 1) guard — verify it works
    const data = JSON.stringify([{ label: 'Solo', value: 100 }])
    const el = await fixture(`<zyna-timeline data='${data}'></zyna-timeline>`)
    const groups = el.querySelectorAll('g.tl-pt')
    expect(groups.length).to.equal(1)
    const labels = [...el.querySelectorAll('text.tl-label')].map(t => t.textContent)
    expect(labels).to.include('Solo')
  })

  it('highlight attribute fills the matching circle (solid) and leaves others hollow', async () => {
    // Timeline highlight changes fill: highlighted circle is solid (accent color),
    // non-highlighted circles are transparent with a stroke outline.
    // Circle RADIUS is determined by value (sqrt scale), NOT by highlight status.
    const data = JSON.stringify([
      { label: 'Tripoli',  value: 1040 },
      { label: 'Sabha',    value: 51 },
      { label: 'Benghazi', value: 45 },
    ])
    const el = await fixture(`<zyna-timeline data='${data}' highlight="Sabha"></zyna-timeline>`)
    const circles = [...el.querySelectorAll('circle.tl-circle')]
    // Sabha is index 1 — should be filled (non-transparent fill)
    const sabhaFill    = circles[1].getAttribute('fill')
    const tripoliFill  = circles[0].getAttribute('fill')
    expect(sabhaFill).to.not.equal('transparent')
    expect(tripoliFill).to.equal('transparent')
  })

  it('default highlight fills the highest-value item even when it is not the first item', async () => {
    // Without highlight attr, the source runs data.reduce((a,b) => b.value > a.value ? b : a).label
    // to find the highest value — NOT just data[0]. This test uses data where the highest
    // value is at index 1 (not 0) to prove the reduce logic runs, not just "first item wins".
    const data = JSON.stringify([
      { label: 'Small',  value: 100 },
      { label: 'Large',  value: 5000 },
    ])
    const el = await fixture(`<zyna-timeline data='${data}'></zyna-timeline>`)
    const circles = [...el.querySelectorAll('circle.tl-circle')]
    // Large is index 1 (highest value) → filled (non-transparent)
    expect(circles[1].getAttribute('fill')).to.not.equal('transparent')
    // Small is index 0 → hollow (transparent)
    expect(circles[0].getAttribute('fill')).to.equal('transparent')
  })

  it('show-values="false" hides value labels', async () => {
    const el = await fixture(`<zyna-timeline data='${sampleData}' show-values="false"></zyna-timeline>`)
    const values = [...el.querySelectorAll('text.tl-value')]
    // All value text elements should be hidden
    values.forEach(v => {
      expect(v.getAttribute('display')).to.equal('none')
    })
  })

  it('show-values defaults to visible (no attribute = values shown)', async () => {
    // Source: showVals = _attr('show-values','true') !== 'false'
    // When the attribute is absent, _attr returns 'true' → showVals = true → display=null (visible).
    const el = await fixture(`<zyna-timeline data='${sampleData}'></zyna-timeline>`)
    const values = [...el.querySelectorAll('text.tl-value')]
    expect(values.length).to.be.greaterThan(0)
    // At least one value must be visible (display attribute is null/absent, not "none")
    const visible = values.filter(v => v.getAttribute('display') !== 'none')
    expect(visible.length).to.be.greaterThan(0)
  })

  it('label-format formats displayed values with the format string', async () => {
    const data = JSON.stringify([
      { label: 'Tripoli',  value: 1234 },
      { label: 'Sabha',    value: 567 },
    ])
    const el = await fixture(`<zyna-timeline data='${data}' label-format=",.0f"></zyna-timeline>`)
    const values = [...el.querySelectorAll('text.tl-value')].map(t => t.textContent)
    expect(values).to.include('1,234')
    expect(values).to.include('567')
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
