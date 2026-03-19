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

  // ── Edge cases ────────────────────────────────────────────────────────────────

  it('value=0 renders without crashing (arc has d attribute even if degenerate)', async () => {
    // value=0 → endAngle=0, produces a zero-length arc. arcGenerator() should not throw.
    const data = JSON.stringify([
      { label: 'Empty', value: 0, color: '#C9A84C' },
    ])
    const el = await fixture(`<zyna-orbital data='${data}'></zyna-orbital>`)
    const arcs = el.querySelectorAll('path.orb-arc')
    expect(arcs.length).to.equal(1)
    // The path may be degenerate but must have a d attribute
    expect(arcs[0].getAttribute('d')).to.not.be.null
  })

  it('value=1 renders a full circle without crashing', async () => {
    // value=1 → endAngle=2π, a complete ring
    const data = JSON.stringify([
      { label: 'Full', value: 1, color: '#C9A84C' },
    ])
    const el = await fixture(`<zyna-orbital data='${data}'></zyna-orbital>`)
    const arcs = el.querySelectorAll('path.orb-arc')
    expect(arcs.length).to.equal(1)
    expect(arcs[0].getAttribute('d')).to.not.be.empty
  })

  it('two instances have unique gradient IDs so they do not cross-contaminate', async () => {
    // Developer renders two orbital charts — their SVG gradients must have different IDs
    const el1 = await fixture(`<zyna-orbital data='${sampleData}'></zyna-orbital>`)
    const el2 = await fixture(`<zyna-orbital data='${sampleData}'></zyna-orbital>`)
    const id1 = el1.querySelector('defs radialGradient')?.getAttribute('id')
    const id2 = el2.querySelector('defs radialGradient')?.getAttribute('id')
    expect(id1).to.be.a('string').and.not.empty
    expect(id2).to.be.a('string').and.not.empty
    expect(id1).to.not.equal(id2)
  })

  it('each instance background circle fill URL references its own gradient ID', async () => {
    // Cross-contamination check: el1's orb-bg must point at id1, not id2.
    // If both fill="url(#zyna-bg-123)" they would share one gradient and
    // color changes on one chart would bleed into the other.
    const el1 = await fixture(`<zyna-orbital data='${sampleData}'></zyna-orbital>`)
    const el2 = await fixture(`<zyna-orbital data='${sampleData}'></zyna-orbital>`)
    const id1   = el1.querySelector('defs radialGradient').getAttribute('id')
    const id2   = el2.querySelector('defs radialGradient').getAttribute('id')
    const fill1 = el1.querySelector('circle.orb-bg').getAttribute('fill')
    const fill2 = el2.querySelector('circle.orb-bg').getAttribute('fill')
    expect(fill1).to.equal(`url(#${id1})`)
    expect(fill2).to.equal(`url(#${id2})`)
    expect(fill1).to.not.equal(fill2)
  })

  it('show-values="false" hides label and percentage text', async () => {
    const el = await fixture(`<zyna-orbital data='${sampleData}' show-values="false"></zyna-orbital>`)
    const labels = [...el.querySelectorAll('text.orb-label')]
    const pcts   = [...el.querySelectorAll('text.orb-pct')]
    labels.forEach(t => expect(t.getAttribute('display')).to.equal('none'))
    pcts.forEach(t   => expect(t.getAttribute('display')).to.equal('none'))
  })

  it('ring-thickness attribute changes arc width', async () => {
    // ringTW = outerR * rtAttr drives BOTH the orb-track stroke-width AND the
    // arc generator's innerRadius/outerRadius: r ± ringTW/2 (orbital.js:134).
    // A wider ringTW means a thicker track AND a thicker arc path.
    const narrow = await fixture(`<zyna-orbital data='${sampleData}' ring-thickness="0.05"></zyna-orbital>`)
    const wide   = await fixture(`<zyna-orbital data='${sampleData}' ring-thickness="0.25"></zyna-orbital>`)
    // 1. orb-track stroke-width reflects ringTW directly
    const narrowSW = parseFloat(narrow.querySelector('circle.orb-track').getAttribute('stroke-width'))
    const wideSW   = parseFloat(wide.querySelector('circle.orb-track').getAttribute('stroke-width'))
    expect(wideSW).to.be.greaterThan(narrowSW)
    // 2. arc path d attribute also changes because innerRadius/outerRadius change
    const narrowD = narrow.querySelector('path.orb-arc').getAttribute('d')
    const wideD   = wide.querySelector('path.orb-arc').getAttribute('d')
    expect(narrowD).to.not.equal(wideD)
  })
})
