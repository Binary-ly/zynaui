import { expect, fixture, fixtureCleanup } from '@open-wc/testing'
import '../../src/charts/gauge.js'

const ZONES = JSON.stringify([
  { from: 0,  to: 20, color: '#8b1a1f', label: 'Bad' },
  { from: 20, to: 40, color: '#e74c3c', label: 'Poor' },
  { from: 40, to: 60, color: '#f1c40f', label: 'Neutral' },
  { from: 60, to: 80, color: '#2ecc71', label: 'Good' },
  { from: 80, to: 100, color: '#11864f', label: 'Great' },
])

describe('zyna-gauge', () => {
  afterEach(() => fixtureCleanup())

  it('registers as a custom element', () => {
    expect(customElements.get('zyna-gauge')).to.exist
  })

  it('renders an SVG element when value + zones are provided', async () => {
    const el  = await fixture(`<zyna-gauge value="42" zones='${ZONES}'></zyna-gauge>`)
    const svg = el.querySelector('svg')
    expect(svg).to.exist
    expect(svg.namespaceURI).to.equal('http://www.w3.org/2000/svg')
  })

  it('renders one segment path per zone', async () => {
    const el = await fixture(`<zyna-gauge value="50" zones='${ZONES}'></zyna-gauge>`)
    const segs = el.querySelectorAll('path.gauge-segment')
    expect(segs.length).to.equal(5)
    segs.forEach(s => expect(s.getAttribute('d')).to.not.be.empty)
  })

  it('renders a circular marker at the value position', async () => {
    const el = await fixture(`<zyna-gauge value="50" zones='${ZONES}'></zyna-gauge>`)
    const marker = el.querySelector('circle.gauge-marker')
    expect(marker).to.exist
    expect(parseFloat(marker.getAttribute('r'))).to.be.greaterThan(0)
  })

  it('renders the numeric value in the centre', async () => {
    const el   = await fixture(`<zyna-gauge value="75" zones='${ZONES}'></zyna-gauge>`)
    const text = el.querySelector('text.gauge-value')
    expect(text).to.exist
    expect(text.textContent).to.equal('75')
  })

  it('applies label-format to the centre value', async () => {
    const el = await fixture(`<zyna-gauge value="0.42" min="0" max="1" label-format=".1%" zones='${ZONES}'></zyna-gauge>`)
    const text = el.querySelector('text.gauge-value')
    expect(text.textContent).to.equal('42.0%')
  })

  it('uses the active zone label as the sub-caption', async () => {
    const el  = await fixture(`<zyna-gauge value="50" zones='${ZONES}'></zyna-gauge>`)
    const lbl = el.querySelector('text.gauge-label')
    expect(lbl.textContent).to.equal('Neutral')
    expect(lbl.getAttribute('display')).to.not.equal('none')
  })

  it('label attribute overrides the active zone label', async () => {
    const el  = await fixture(`<zyna-gauge value="50" label="Mood Index" zones='${ZONES}'></zyna-gauge>`)
    const lbl = el.querySelector('text.gauge-label')
    expect(lbl.textContent).to.equal('Mood Index')
  })

  it('hides the sub-caption when no label is available', async () => {
    const noLabelZones = JSON.stringify([{ from: 0, to: 100, color: '#888' }])
    const el  = await fixture(`<zyna-gauge value="50" zones='${noLabelZones}'></zyna-gauge>`)
    const lbl = el.querySelector('text.gauge-label')
    expect(lbl.getAttribute('display')).to.equal('none')
  })

  it('renders start-label and end-label when provided', async () => {
    const el = await fixture(`<zyna-gauge value="50" start-label="Low" end-label="High" zones='${ZONES}'></zyna-gauge>`)
    const ends = el.querySelectorAll('text.gauge-end-label')
    expect(ends.length).to.equal(2)
    const texts = [...ends].map(e => e.textContent)
    expect(texts).to.include.members(['Low', 'High'])
  })

  it('omits end labels when attributes are not provided', async () => {
    const el = await fixture(`<zyna-gauge value="50" zones='${ZONES}'></zyna-gauge>`)
    expect(el.querySelectorAll('text.gauge-end-label').length).to.equal(0)
  })

  it('dims segments past the marker position', async () => {
    const el = await fixture(`<zyna-gauge value="50" zones='${ZONES}' dim-opacity="0.3"></zyna-gauge>`)
    const segs = el.querySelectorAll('path.gauge-segment')
    // Zones 0-20 and 20-40 are before the marker at 50 → opacity 1.
    // Zone 40-60 is the active (contains 50) → opacity 1.
    // Zones 60-80 and 80-100 are past → opacity 0.3.
    expect(segs[0].getAttribute('opacity')).to.equal('1')
    expect(segs[1].getAttribute('opacity')).to.equal('1')
    expect(segs[2].getAttribute('opacity')).to.equal('1')
    expect(segs[3].getAttribute('opacity')).to.equal('0.3')
    expect(segs[4].getAttribute('opacity')).to.equal('0.3')
  })

  it('does not render SVG when value is missing', async () => {
    const el  = await fixture(`<zyna-gauge zones='${ZONES}' data-silent></zyna-gauge>`)
    expect(el.querySelector('svg')).to.be.null
  })

  it('does not render SVG when zones are missing', async () => {
    const el  = await fixture(`<zyna-gauge value="50" data-silent></zyna-gauge>`)
    expect(el.querySelector('svg')).to.be.null
  })

  it('silently suppresses render when value is not numeric', async () => {
    const el = await fixture(`<zyna-gauge value="not-a-number" zones='${ZONES}' data-silent></zyna-gauge>`)
    expect(el.querySelector('svg')).to.be.null
  })

  it('re-renders when value changes', async () => {
    const el = await fixture(`<zyna-gauge value="30" zones='${ZONES}'></zyna-gauge>`)
    el.setAttribute('value', '77')
    await new Promise(r => setTimeout(r, 50))
    expect(el.querySelector('text.gauge-value').textContent).to.equal('77')
    expect(el.querySelector('text.gauge-label').textContent).to.equal('Good')
  })

  // ── Edge cases ────────────────────────────────────────────────────────────

  it('clamps values above max without crashing', async () => {
    const el = await fixture(`<zyna-gauge value="150" min="0" max="100" zones='${ZONES}'></zyna-gauge>`)
    const marker = el.querySelector('circle.gauge-marker')
    expect(marker.getAttribute('cx')).to.not.be.empty
    // Centre text still shows the raw value.
    expect(el.querySelector('text.gauge-value').textContent).to.equal('150')
    // Active zone uses clamped value (100) → last zone "Great" should show.
    expect(el.querySelector('text.gauge-label').textContent).to.equal('Great')
  })

  it('out-of-range value still shows the nearest zone label', async () => {
    // value=-10 clamps to 0 → falls in first zone "Bad"
    const el = await fixture(`<zyna-gauge value="-10" min="0" max="100" zones='${ZONES}'></zyna-gauge>`)
    expect(el.querySelector('text.gauge-label').textContent).to.equal('Bad')
  })

  it('clamps values below min without crashing', async () => {
    const el = await fixture(`<zyna-gauge value="-50" min="0" max="100" zones='${ZONES}'></zyna-gauge>`)
    expect(el.querySelector('circle.gauge-marker')).to.exist
  })

  it('handles min === max without NaN', async () => {
    const el = await fixture(`<zyna-gauge value="5" min="5" max="5" zones='${ZONES}'></zyna-gauge>`)
    const marker = el.querySelector('circle.gauge-marker')
    expect(marker.getAttribute('cx')).to.match(/^-?\d/)
    expect(marker.getAttribute('cy')).to.match(/^-?\d/)
  })

  it('arc-degrees="210" still renders all segments', async () => {
    const el = await fixture(`<zyna-gauge value="50" arc-degrees="210" zones='${ZONES}'></zyna-gauge>`)
    expect(el.querySelectorAll('path.gauge-segment').length).to.equal(5)
  })
})
