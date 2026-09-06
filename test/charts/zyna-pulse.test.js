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

  it('hides x-axis labels that would overlap a neighbour', async () => {
    // Twenty-four "00:00"-style timestamps in a 420px box were all drawn, so
    // the axis read as one unbroken run of digits.
    const values = Array.from({ length: 24 }, (_, j) => (j % 5) - 2)
    const data   = JSON.stringify([{ label: 'CPU', values }, { label: 'MEM', values }])
    const labels = JSON.stringify(values.map((_, j) => `${String(j).padStart(2, '0')}:00`))
    const el = await fixture(`<zyna-pulse data='${data}' x-labels='${labels}' style="display:block;width:420px;font-family:monospace"></zyna-pulse>`)
    await new Promise(r => requestAnimationFrame(r))
    const all   = [...el.querySelectorAll('text.pl-xlabel')]
    const shown = all.filter(t => t.getAttribute('display') !== 'none')
    expect(shown.length).to.be.below(all.length)
    expect(shown[0].textContent).to.equal('00:00')
    const boxes = shown.map(t => ({ t: t.textContent, b: t.getBBox() }))
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i].b, c = boxes[j].b
      expect(a.x < c.x + c.width && c.x < a.x + a.width, `${boxes[i].t} overlaps ${boxes[j].t}`).to.be.false
    }
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

  it('keeps a marker caption in its own band above the first track', async () => {
    // The caption used to sit at m.top + fSm, inside the first track, where the
    // trace's upper swing ran through it. With a caption the tracks start lower
    // and the caption baseline is above every point of the first trace.
    const el = await fixture(`<zyna-pulse data='${DATA}' marker='${JSON.stringify([{ x: 1, label: 'deploy' }])}' style="display:block;width:600px"></zyna-pulse>`)
    const caption = el.querySelector('text.pl-marker-label')
    const capY    = parseFloat(caption.getAttribute('y'))
    const traceTop = Math.min(...el.querySelector('polyline.pl-trace').getAttribute('points').split(' ').map(p => parseFloat(p.split(',')[1])))
    expect(capY).to.be.lessThan(traceTop)
    expect(parseFloat(el.querySelector('line.pl-marker-line').getAttribute('y1'))).to.be.greaterThan(capY)

    const plain = await fixture(`<zyna-pulse data='${DATA}' marker='${JSON.stringify([{ x: 1 }])}' style="display:block;width:600px"></zyna-pulse>`)
    await new Promise(r => requestAnimationFrame(r))
    const firstBase = el => parseFloat(el.querySelector('line.pl-base').getAttribute('y1'))
    expect(firstBase(el)).to.be.greaterThan(firstBase(plain))
  })

  it('flips a caption near the right edge to the left of its rule', async () => {
    const el = await fixture(`<zyna-pulse data='${DATA}' marker='${JSON.stringify([{ x: 6, label: 'rollback started' }])}' style="display:block;width:320px"></zyna-pulse>`)
    const caption = el.querySelector('text.pl-marker-label')
    const box = caption.getBBox()
    expect(caption.getAttribute('text-anchor')).to.equal('end')
    expect(box.x + box.width).to.be.at.most(320)
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
