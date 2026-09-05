/**
 * Muted label colour — ZynaChart._muted()
 *
 * Real-world scenario: a dashboard on the Ops page (#09080F) draws candlestick
 * dates, density ticks and lollipop axes in the shared muted colour. Before this
 * guard the dark value was #5A5050 (2.6:1) and the light value #8A8478 (3.4:1),
 * both below the WCAG AA 4.5:1 minimum for small text. The colour must clear
 * 4.5:1 on every built-in genre page in its theme, and the charts must actually
 * paint their ticks with it.
 */
import { expect, fixture, fixtureCleanup } from '@open-wc/testing'
import '../../src/charts/lollipop.js'
import '../../src/charts/tension.js'
import '../../src/charts/candlestick.js'

// --z-surface-page per genre, from src/plugin/tokens.js and src/plugin/genres/*.js
const PAGES = {
  dark:  { ops: '#09080F', cyberpunk: '#09080F', phosphor: '#0A0700', military: '#131510' },
  light: { corporate: '#F5F4F0', blueprint: '#EDF2FA', washi: '#F7F0E6', laboratory: '#EDFAFC', atelier: '#F5EFDF' },
}

function luminance(hex) {
  const [r, g, b] = hex.slice(1).match(/../g)
    .map(h => parseInt(h, 16) / 255)
    .map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

describe('ZynaChart._muted()', () => {
  afterEach(() => fixtureCleanup())

  for (const theme of ['dark', 'light']) {
    it(`clears WCAG AA (4.5:1) on every ${theme} genre page`, async () => {
      const el = await fixture(`<zyna-lollipop theme="${theme}" data='[{"label":"A","value":1}]'></zyna-lollipop>`)
      for (const [genre, page] of Object.entries(PAGES[theme])) {
        expect(contrast(el._muted(), page), `${theme} muted colour on the ${genre} page`).to.be.at.least(4.5)
      }
    })
  }

  it('is the colour the charts paint their tick and muted labels with', async () => {
    const lp = await fixture(`<zyna-lollipop data='[{"label":"Tripoli","value":1040},{"label":"Sabha","value":51}]' style="width:420px;display:block"></zyna-lollipop>`)
    const lpFills = [...lp.querySelectorAll('text')].map(t => t.getAttribute('fill'))
    expect(lpFills).to.include(lp._muted())
    expect(lpFills).to.not.include('#5A5050')

    const tn = await fixture(`<zyna-tension data='[{"label":"Alpha","before":1,"after":1},{"label":"Bravo","before":2,"after":4},{"label":"Charlie","before":3,"after":2},{"label":"Delta","before":4,"after":3}]' style="width:420px;display:block"></zyna-tension>`)
    await new Promise(r => requestAnimationFrame(r))
    expect([...tn.querySelectorAll('text')].map(t => t.getAttribute('fill'))).to.include(tn._muted())

    const cs = await fixture(`<zyna-candlestick theme="light" data='[{"date":"2026-01-02","open":100,"high":108,"low":98,"close":106},{"date":"2026-01-03","open":106,"high":110,"low":101,"close":103},{"date":"2026-01-06","open":103,"high":107,"low":99,"close":105}]' style="width:420px;display:block"></zyna-candlestick>`)
    await new Promise(r => requestAnimationFrame(r))
    const csFills = [...cs.querySelectorAll('text')].map(t => t.getAttribute('fill'))
    expect(csFills).to.include(cs._muted())
    expect(csFills).to.not.include('#8A8478')
  })
})
