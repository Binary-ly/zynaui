import { expect, fixture, fixtureCleanup } from '@open-wc/testing'
import '../../src/charts/tension.js'

// rank mode: before/after are ranks (1 = top)
const DATA = JSON.stringify([
  { label: 'Alpha',   before: 1, after: 1 }, // held  → delta 0
  { label: 'Bravo',   before: 2, after: 4 }, // fell  → delta −2
  { label: 'Charlie', before: 3, after: 2 }, // rose  → delta +1
  { label: 'Delta',   before: 4, after: 3 }, // rose  → delta +1
])

describe('zyna-tension', () => {
  afterEach(() => fixtureCleanup())

  it('registers as a custom element', () => {
    expect(customElements.get('zyna-tension')).to.exist
  })

  it('renders an SVG when data is provided', async () => {
    const el = await fixture(`<zyna-tension data='${DATA}'></zyna-tension>`)
    expect(el.querySelector('svg')).to.exist
  })

  it('renders one connector per item and two nodes per item', async () => {
    const el = await fixture(`<zyna-tension data='${DATA}'></zyna-tension>`)
    expect(el.querySelectorAll('path.tn-link').length).to.equal(4)
    expect(el.querySelectorAll('g.tn-node').length).to.equal(8)
  })

  it('renders both rank badges per item with the right numbers', async () => {
    const el = await fixture(`<zyna-tension data='${DATA}'></zyna-tension>`)
    const ranks = [...el.querySelectorAll('text.tn-rank')].map(t => t.textContent)
    expect(ranks).to.deep.equal(['1', '1', '2', '4', '3', '2', '4', '3'])
  })

  it('colours risers, fallers and held ranks distinctly', async () => {
    const el    = await fixture(`<zyna-tension data='${DATA}'></zyna-tension>`)
    const links = [...el.querySelectorAll('path.tn-link')]
    expect(links[0].getAttribute('stroke')).to.equal('#8A8478') // Alpha held (muted)
    expect(links[1].getAttribute('stroke')).to.equal('#FF3366') // Bravo fell (danger)
    expect(links[2].getAttribute('stroke')).to.equal('#00FFB2') // Charlie rose (success)
  })

  it('scales connector stroke width with |Δrank|', async () => {
    const el    = await fixture(`<zyna-tension data='${DATA}'></zyna-tension>`)
    const links = [...el.querySelectorAll('path.tn-link')]
    const held  = parseFloat(links[0].getAttribute('stroke-width')) // Δ0
    const fell  = parseFloat(links[1].getAttribute('stroke-width')) // Δ2
    expect(fell).to.be.greaterThan(held)
  })

  it('dims non-highlighted connectors and glows the highlighted one', async () => {
    const el    = await fixture(`<zyna-tension data='${DATA}' highlight="Charlie"></zyna-tension>`)
    const links = [...el.querySelectorAll('path.tn-link')]
    const dimmed = links.filter(l => l.getAttribute('opacity') === '0.18')
    expect(dimmed.length).to.equal(3)
    const charlie = links[2]
    expect(charlie.getAttribute('opacity')).to.not.equal('0.18')
    expect(charlie.getAttribute('filter')).to.contain('tn-glow')
  })

  it('computes ranks from raw values when rank-by="value"', async () => {
    // A: before 10 (rank 2), after 30 (rank 1) → rose; B: before 30 (1), after 10 (2) → fell
    const el = await fixture(`<zyna-tension rank-by="value" data='${JSON.stringify([{ label: 'A', before: 10, after: 30 }, { label: 'B', before: 30, after: 10 }])}'></zyna-tension>`)
    const links = [...el.querySelectorAll('path.tn-link')]
    expect(links[0].getAttribute('stroke')).to.equal('#00FFB2') // A rose
    expect(links[1].getAttribute('stroke')).to.equal('#FF3366') // B fell
  })

  it('does not render SVG when data is empty', async () => {
    const el = await fixture(`<zyna-tension data='[]' data-silent></zyna-tension>`)
    expect(el.querySelector('svg')).to.be.null
  })

  it('re-renders when data changes', async () => {
    const el = await fixture(`<zyna-tension data='${DATA}'></zyna-tension>`)
    el.setAttribute('data', JSON.stringify([{ label: 'Solo', before: 1, after: 1 }]))
    await new Promise(r => setTimeout(r, 50))
    expect(el.querySelectorAll('path.tn-link').length).to.equal(1)
  })

  it('treats a highlight that matches no item as a no-op (no full-chart dim)', async () => {
    const el    = await fixture(`<zyna-tension data='${DATA}' highlight="DOESNOTEXIST"></zyna-tension>`)
    const links = [...el.querySelectorAll('path.tn-link')]
    expect(links.filter(l => l.getAttribute('opacity') === '0.18').length).to.equal(0)
    links.forEach(l => expect(l.getAttribute('filter') || '').to.not.contain('tn-glow'))
  })

  it('sets an aria-label summary', async () => {
    const el = await fixture(`<zyna-tension data='${DATA}'></zyna-tension>`)
    expect(el.getAttribute('role')).to.equal('img')
    expect(el.getAttribute('aria-label')).to.contain('Ranked before/after comparison')
  })
})
