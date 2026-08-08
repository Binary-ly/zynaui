import { expect, fixture, fixtureCleanup } from '@open-wc/testing'
import '../../src/charts/cascade.js'

// total 100 → Africa(50: Food30/Water20), Asia(40: Shelter25/Health15), Europe(10 leaf)
const DATA = JSON.stringify({
  label: 'Budget',
  children: [
    { label: 'Africa', children: [{ label: 'Food', value: 30 }, { label: 'Water', value: 20 }] },
    { label: 'Asia',   children: [{ label: 'Shelter', value: 25 }, { label: 'Health', value: 15 }] },
    { label: 'Europe', value: 10 },
  ],
})

describe('zyna-cascade', () => {
  afterEach(() => fixtureCleanup())

  it('registers as a custom element', () => {
    expect(customElements.get('zyna-cascade')).to.exist
  })

  it('renders an SVG when data is provided', async () => {
    const el = await fixture(`<zyna-cascade data='${DATA}'></zyna-cascade>`)
    expect(el.querySelector('svg')).to.exist
  })

  it('renders one block per node (root + all descendants)', async () => {
    const el = await fixture(`<zyna-cascade data='${DATA}'></zyna-cascade>`)
    expect(el.querySelectorAll('rect.cs-block').length).to.equal(8)
  })

  it('renders one ribbon per parent→child link', async () => {
    const el = await fixture(`<zyna-cascade data='${DATA}'></zyna-cascade>`)
    expect(el.querySelectorAll('path.cs-ribbon').length).to.equal(7)
  })

  it('renders a row label per level with custom level-labels', async () => {
    const el = await fixture(`<zyna-cascade data='${DATA}' level-labels='["Budget","Region","Sector"]'></zyna-cascade>`)
    const rows = [...el.querySelectorAll('text.cs-rowlabel')].map(t => t.textContent)
    expect(rows).to.deep.equal(['BUDGET', 'REGION', 'SECTOR'])
  })

  it('sums parent values from children when omitted', async () => {
    const el = await fixture(`<zyna-cascade data='${DATA}'></zyna-cascade>`)
    // total 100 → aria summary carries it
    expect(el.getAttribute('aria-label')).to.contain('Cascade of 100')
    expect(el.getAttribute('aria-label')).to.contain('split across 3 levels')
  })

  it('collapses sub-min-share splits into a single Other block', async () => {
    // three 2% slivers (< 3% default) collapse into one Other → depth-1 = Big + Other
    const data = JSON.stringify({ label: 'T', children: [
      { label: 'Big', value: 94 }, { label: 'T1', value: 2 }, { label: 'T2', value: 2 }, { label: 'T3', value: 2 },
    ] })
    const el = await fixture(`<zyna-cascade data='${data}'></zyna-cascade>`)
    // root + Big + Other = 3 blocks (would be 5 without collapse)
    expect(el.querySelectorAll('rect.cs-block').length).to.equal(3)
  })

  it('accepts a bare array of top-level splits', async () => {
    const el = await fixture(`<zyna-cascade data='${JSON.stringify([{ label: 'A', value: 60 }, { label: 'B', value: 40 }])}'></zyna-cascade>`)
    expect(el.querySelectorAll('rect.cs-block').length).to.equal(3) // synthetic root + A + B
    expect(el.querySelectorAll('path.cs-ribbon').length).to.equal(2)
  })

  it('caps nesting depth at 4 (5 levels including the total)', async () => {
    const deep = JSON.stringify({ label: 'A', value: 100, children: [{ label: 'B', value: 100, children: [{ label: 'C', value: 100, children: [{ label: 'D', value: 100, children: [{ label: 'E', value: 100, children: [{ label: 'F', value: 100 }] }] }] }] }] })
    const el = await fixture(`<zyna-cascade data='${deep}'></zyna-cascade>`)
    expect(el.querySelectorAll('text.cs-rowlabel').length).to.equal(5)
    expect(el.querySelectorAll('rect.cs-block').length).to.equal(5)
  })

  it('does not render SVG when data is empty', async () => {
    const el = await fixture(`<zyna-cascade data='{}' data-silent></zyna-cascade>`)
    expect(el.querySelector('svg')).to.be.null
  })

  it('re-renders when data changes', async () => {
    const el = await fixture(`<zyna-cascade data='${DATA}'></zyna-cascade>`)
    el.setAttribute('data', JSON.stringify({ label: 'X', children: [{ label: 'Y', value: 5 }] }))
    await new Promise(r => setTimeout(r, 50))
    expect(el.querySelectorAll('rect.cs-block').length).to.equal(2) // root + Y
  })

  it('rolls values up from below the depth cap instead of blanking out', async () => {
    // The only explicit value lives at depth 6 (below the depth-4 draw cap); it must
    // still reach the total, not collapse it to 0 and blank the chart.
    const deep = JSON.stringify({ label: 'A', children: [{ label: 'B', children: [{ label: 'C', children: [{ label: 'D', children: [{ label: 'E', children: [{ label: 'F', value: 100 }] }] }] }] }] })
    const el = await fixture(`<zyna-cascade data='${deep}'></zyna-cascade>`)
    expect(el.querySelector('svg')).to.exist
    expect(el.getAttribute('aria-label')).to.contain('Cascade of 100')
    expect(el.querySelectorAll('rect.cs-block').length).to.equal(5) // A..E drawn, F below the cap
  })

  it('sets role=img on the host', async () => {
    const el = await fixture(`<zyna-cascade data='${DATA}'></zyna-cascade>`)
    expect(el.getAttribute('role')).to.equal('img')
  })

  it('default variant draws flat ribbons and emits no defs or glow groups', async () => {
    const el = await fixture(`<zyna-cascade data='${DATA}'></zyna-cascade>`)
    expect(el.querySelectorAll('defs.cs-defs').length).to.equal(0)
    expect(el.querySelectorAll('g.cs-blocks').length).to.equal(0)
    expect(el.querySelector('path.cs-ribbon').getAttribute('fill')).to.not.match(/^url\(/)
    expect(el.querySelector('rect.cs-block').getAttribute('filter')).to.be.null
  })

  it('sankey variant keeps one block per node and one ribbon per link', async () => {
    const el = await fixture(`<zyna-cascade variant="sankey" data='${DATA}'></zyna-cascade>`)
    expect(el.querySelectorAll('rect.cs-block').length).to.equal(8)
    expect(el.querySelectorAll('path.cs-ribbon').length).to.equal(7)
  })

  it('sankey variant emits gradient/glow defs, gradient-fills ribbons, and glows bars via a per-colour group', async () => {
    const el = await fixture(`<zyna-cascade variant="sankey" data='${DATA}'></zyna-cascade>`)
    expect(el.querySelectorAll('defs.cs-defs linearGradient').length).to.be.greaterThan(0)
    expect(el.querySelectorAll('defs.cs-defs filter feDropShadow').length).to.be.greaterThan(0)
    expect(el.querySelector('path.cs-ribbon').getAttribute('fill')).to.match(/^url\(#cs-g-/)
    // The bloom lives on the grouping <g>, not on each bar (one blur per colour).
    const blk = el.querySelector('rect.cs-block')
    const grp = blk.closest('g.cs-blocks')
    expect(grp, 'block sits inside a cs-blocks group').to.exist
    expect(grp.getAttribute('filter')).to.match(/^url\(#cs-glow-/)
    expect(blk.getAttribute('filter')).to.be.null
  })

  it('groups bars by colour: fewer glow groups than bars', async () => {
    const el = await fixture(`<zyna-cascade variant="sankey" data='${DATA}'></zyna-cascade>`)
    const groups = el.querySelectorAll('g.cs-blocks').length
    const bars   = el.querySelectorAll('rect.cs-block').length
    expect(groups).to.be.greaterThan(0)
    expect(groups).to.be.lessThan(bars)
  })

  it('sankey variant renders in light theme too', async () => {
    const el = await fixture(`<zyna-cascade theme="light" variant="sankey" data='${DATA}'></zyna-cascade>`)
    expect(el.querySelectorAll('defs.cs-defs linearGradient').length).to.be.greaterThan(0)
    expect(el.querySelector('g.cs-blocks').getAttribute('filter')).to.match(/^url\(#cs-glow-/)
  })

  it('accepts the variant name case-insensitively', async () => {
    const el = await fixture(`<zyna-cascade variant="SANKEY" data='${DATA}'></zyna-cascade>`)
    expect(el.querySelectorAll('defs.cs-defs').length).to.equal(1)
  })

  it('treats an unknown variant value as the default waterfall', async () => {
    const el = await fixture(`<zyna-cascade variant="molten" data='${DATA}'></zyna-cascade>`)
    expect(el.querySelectorAll('defs.cs-defs').length).to.equal(0)
    expect(el.querySelectorAll('g.cs-blocks').length).to.equal(0)
    expect(el.querySelector('path.cs-ribbon').getAttribute('fill')).to.not.match(/^url\(/)
  })

  it('injects preference/forced-colors fallback styles exactly once', async () => {
    const el = await fixture(`<zyna-cascade variant="sankey" data='${DATA}'></zyna-cascade>`)
    const styles = el.querySelectorAll('svg style.cs-a11y-style')
    expect(styles.length).to.equal(1)
    expect(styles[0].textContent).to.contain('forced-colors')
    expect(styles[0].textContent).to.contain('prefers-reduced-transparency')
    el.setAttribute('variant', 'waterfall')
    await new Promise(r => setTimeout(r, 50))
    expect(el.querySelectorAll('svg style.cs-a11y-style').length).to.equal(1)
  })

  it('drops the sankey defs and glow groups when switching back to the default variant', async () => {
    const el = await fixture(`<zyna-cascade variant="sankey" data='${DATA}'></zyna-cascade>`)
    expect(el.querySelectorAll('defs.cs-defs').length).to.equal(1)
    expect(el.querySelectorAll('g.cs-blocks').length).to.be.greaterThan(0)
    el.setAttribute('variant', 'waterfall')
    await new Promise(r => setTimeout(r, 50))
    expect(el.querySelectorAll('defs.cs-defs').length).to.equal(0)
    expect(el.querySelectorAll('g.cs-blocks').length).to.equal(0)
    expect(el.querySelector('path.cs-ribbon').getAttribute('fill')).to.not.match(/^url\(/)
  })
})
