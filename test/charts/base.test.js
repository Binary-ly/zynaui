/**
 * ZynaChart base class unit tests — _fmt(), _uid, _json(), _attr()
 *
 * Real-world scenarios:
 *   1. A developer uses label-format="$,.0f" and expects large currency numbers
 *      like 1234567 to become "$1,234,567".
 *   2. An orbital chart uses _uid to create SVG gradient IDs. Two chart instances
 *      on the same page must never share an ID or gradients will cross-contaminate.
 *   3. A waffle chart falls back gracefully when the data attribute contains
 *      malformed JSON like "[{label: 'oops']" (no quotes around keys).
 *   4. _attr() with a missing attribute must return the fallback, not undefined.
 *   5. Mounting without a data attribute must not crash (absent attr → null → fallback).
 */
import { expect, fixture, fixtureCleanup } from '@open-wc/testing'
import '../../src/charts/waffle.js' // registers zyna-waffle which extends ZynaChart

// After the _json bug fix, absent attribute returns fallback (not null), so
// mounting without data='[]' is now safe — _render() gets [] and exits cleanly.
async function makeChart(html = `<zyna-waffle data-silent></zyna-waffle>`) {
  return fixture(html)
}

describe('ZynaChart._attr()', () => {
  afterEach(() => fixtureCleanup())

  it('returns attribute value when present', async () => {
    const el = await makeChart(`<zyna-waffle data-silent cols="8"></zyna-waffle>`)
    expect(el._attr('cols', '10')).to.equal('8')
  })

  it('returns fallback when attribute is absent', async () => {
    const el = await makeChart()
    expect(el._attr('cols', '10')).to.equal('10')
  })

  it('returns fallback when attribute is missing and fallback is a number', async () => {
    const el = await makeChart()
    expect(el._attr('gap', 3)).to.equal(3)
  })

  it('returns empty string when attribute is set to empty (not the fallback)', async () => {
    const el = await makeChart(`<zyna-waffle data-silent color=""></zyna-waffle>`)
    expect(el._attr('color', 'default')).to.equal('')
  })
})

describe('ZynaChart._json()', () => {
  afterEach(() => fixtureCleanup())

  it('parses a valid JSON array attribute', async () => {
    const data = JSON.stringify([{ label: 'A', value: 50 }])
    const el = await makeChart(`<zyna-waffle data='${data}' data-silent></zyna-waffle>`)
    expect(el._json('data', [])).to.deep.equal([{ label: 'A', value: 50 }])
  })

  it('returns fallback when attribute is absent (fixed: absent ≠ null JSON)', async () => {
    // This was the real bug: getAttribute returns null (absent) → old code ran
    // JSON.parse(null) = null (valid JSON!) → fallback was never returned → crash on null.length.
    // Fixed by checking v === null before parsing.
    const el = await makeChart()
    expect(el._json('data', [])).to.deep.equal([])
  })

  it('returns fallback for malformed JSON', async () => {
    const el = await makeChart()
    el.setAttribute('data', '{bad json[}')
    expect(el._json('data', ['fallback'])).to.deep.equal(['fallback'])
  })

  it('returns null when attribute is explicitly set to the string "null" (valid JSON)', async () => {
    // setAttribute('x', 'null') → JSON.parse('null') = null → returns null (not fallback).
    // This is correct: the attribute exists and its value is valid JSON null.
    const el = await makeChart()
    el.setAttribute('extra', 'null')
    expect(el._json('extra', [])).to.be.null
  })

  it('returns fallback for empty string attribute (JSON.parse("") throws)', async () => {
    const el = await makeChart()
    el.setAttribute('data', '')
    expect(el._json('data', ['fallback'])).to.deep.equal(['fallback'])
  })
})

describe('ZynaChart._uid', () => {
  afterEach(() => fixtureCleanup())

  it('returns a non-empty string', async () => {
    const el = await makeChart()
    expect(el._uid).to.be.a('string').and.not.empty
  })

  it('is stable across multiple accesses on the same instance', async () => {
    const el = await makeChart()
    expect(el._uid).to.equal(el._uid)
  })

  it('is unique across two different instances', async () => {
    const el1 = await makeChart()
    const el2 = await makeChart()
    expect(el1._uid).to.not.equal(el2._uid)
  })
})

describe('ZynaChart._fmt()', () => {
  afterEach(() => fixtureCleanup())

  it('returns value unchanged when no fmt string is given', async () => {
    const el = await makeChart()
    expect(el._fmt(1234, '')).to.equal(1234)
  })

  it('formats with comma thousands separator (,.0f)', async () => {
    const el = await makeChart()
    expect(el._fmt(1234567, ',.0f')).to.equal('1,234,567')
  })

  it('formats as currency with comma thousands ($,.0f)', async () => {
    const el = await makeChart()
    expect(el._fmt(1234567, '$,.0f')).to.equal('$1,234,567')
  })

  it('formats as percentage (.1%): 0.42 → "42.0%"', async () => {
    const el = await makeChart()
    expect(el._fmt(0.42, '.1%')).to.equal('42.0%')
  })

  it('formats as percentage (.0%): 0.42 → "42%"', async () => {
    const el = await makeChart()
    expect(el._fmt(0.42, '.0%')).to.equal('42%')
  })

  it('formats with decimal places (,.2f): 1234.5 → "1,234.50"', async () => {
    const el = await makeChart()
    expect(el._fmt(1234.5, ',.2f')).to.equal('1,234.50')
  })

  it('formats zero correctly (,.0f)', async () => {
    const el = await makeChart()
    expect(el._fmt(0, ',.0f')).to.equal('0')
  })

  it('returns non-numeric string unchanged', async () => {
    const el = await makeChart()
    expect(el._fmt('N/A', '$,.0f')).to.equal('N/A')
  })

  it('formats negative numbers ($,.0f)', async () => {
    const el = await makeChart()
    expect(el._fmt(-5000, '$,.0f')).to.equal('$-5,000')
  })

  it('formats decimal-only (.2f) without commas', async () => {
    const el = await makeChart()
    expect(el._fmt(3.14159, '.2f')).to.equal('3.14')
  })
})
