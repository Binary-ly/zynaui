import { expect, fixture, fixtureCleanup } from '@open-wc/testing'
import '../../src/charts/density.js'

const DATA = JSON.stringify([
  { label: 'Jan', values: [10, 11, 12, 12, 13, 11, 10, 12, 11, 13] },
  { label: 'Feb', values: [14, 15, 16, 15, 17, 16, 15, 14, 16, 15] },
  { label: 'Mar', values: [18, 20, 22, 19, 21, 20, 23, 19, 20, 21] },
])

describe('zyna-density', () => {
  afterEach(() => fixtureCleanup())

  it('registers as a custom element', () => {
    expect(customElements.get('zyna-density')).to.exist
  })

  it('renders an SVG when data is provided', async () => {
    const el = await fixture(`<zyna-density data='${DATA}'></zyna-density>`)
    expect(el.querySelector('svg')).to.exist
  })

  it('renders one silhouette per period', async () => {
    const el = await fixture(`<zyna-density data='${DATA}'></zyna-density>`)
    const shown = [...el.querySelectorAll('path.dn-violin')].filter(p => p.getAttribute('display') !== 'none')
    expect(shown.length).to.equal(3)
  })

  it('renders silhouettes with finite path data', async () => {
    const el = await fixture(`<zyna-density data='${DATA}'></zyna-density>`)
    el.querySelectorAll('path.dn-violin').forEach(p => {
      const d = p.getAttribute('d')
      if (d) expect(d).to.not.contain('NaN')
    })
  })

  it('renders a median dot per period and a spine through them', async () => {
    const el = await fixture(`<zyna-density data='${DATA}'></zyna-density>`)
    expect(el.querySelectorAll('circle.dn-median').length).to.equal(3)
    const pts = el.querySelector('polyline.dn-spine').getAttribute('points').trim().split(/\s+/)
    expect(pts.length).to.equal(3)
  })

  it('renders a period label per period', async () => {
    const el = await fixture(`<zyna-density data='${DATA}'></zyna-density>`)
    expect([...el.querySelectorAll('text.dn-xlabel')].map(t => t.textContent)).to.deep.equal(['Jan', 'Feb', 'Mar'])
  })

  it('hides period labels that would overlap a neighbour', async () => {
    // Eight month names in a 420px box were all drawn, so the axis read
    // "JanuaryFebruaryMarch…" as one run.
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August']
    const data = JSON.stringify(months.map((m, i) => ({ label: m, values: [1 + i, 2 + i, 3 + i, 4 + i, 5 + i] })))
    const el = await fixture(`<zyna-density data='${data}' style="display:block;width:420px;font-family:monospace"></zyna-density>`)
    await new Promise(r => requestAnimationFrame(r))
    const all   = [...el.querySelectorAll('text.dn-xlabel')]
    const shown = all.filter(t => t.getAttribute('display') !== 'none')
    expect(shown.length).to.be.below(all.length)
    expect(shown[0].textContent).to.equal('January')
    const boxes = shown.map(t => ({ t: t.textContent, b: t.getBBox() }))
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i].b, c = boxes[j].b
      expect(a.x < c.x + c.width && c.x < a.x + a.width, `${boxes[i].t} overlaps ${boxes[j].t}`).to.be.false
    }
  })

  it('handles a single-sample period without NaN', async () => {
    const el = await fixture(`<zyna-density data='${JSON.stringify([{ label: 'Solo', values: [5] }])}'></zyna-density>`)
    const d = el.querySelector('path.dn-violin').getAttribute('d')
    expect(d).to.not.contain('NaN')
    expect(el.querySelectorAll('circle.dn-median').length).to.equal(1)
  })

  it('hides silhouettes for periods with no samples', async () => {
    const mixed = JSON.stringify([
      { label: 'A', values: [1, 2, 3, 2, 1] },
      { label: 'B', values: [] },
    ])
    const el = await fixture(`<zyna-density data='${mixed}'></zyna-density>`)
    const shown = [...el.querySelectorAll('path.dn-violin')].filter(p => p.getAttribute('display') !== 'none')
    expect(shown.length).to.equal(1)
  })

  it('does not render SVG when data is empty', async () => {
    const el = await fixture(`<zyna-density data='[]' data-silent></zyna-density>`)
    expect(el.querySelector('svg')).to.be.null
  })

  it('respects an explicit bandwidth without erroring', async () => {
    const el = await fixture(`<zyna-density data='${DATA}' bandwidth="2"></zyna-density>`)
    expect(el.querySelectorAll('path.dn-violin').length).to.equal(3)
  })

  it('re-renders when data changes', async () => {
    const el = await fixture(`<zyna-density data='${DATA}'></zyna-density>`)
    el.setAttribute('data', JSON.stringify([{ label: 'Only', values: [1, 2, 3, 4, 5] }]))
    await new Promise(r => setTimeout(r, 50))
    expect(el.querySelectorAll('text.dn-xlabel').length).to.equal(1)
  })

  it('sets an aria-label summary', async () => {
    const el = await fixture(`<zyna-density data='${DATA}'></zyna-density>`)
    expect(el.getAttribute('role')).to.equal('img')
    expect(el.getAttribute('aria-label')).to.contain('Flow density across')
  })
})
