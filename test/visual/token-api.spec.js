import { test, expect } from '@playwright/test'
import { setupPage } from './helpers/page-setup.js'
import { GENRES } from './helpers/genre.js'

// Use ops genre (canonical) for token mutation tests
const OPS = GENRES[0]

// Set token on both root and the element directly — covers both inherits:true and inherits:false @property tokens
async function assertTokenMutation(page, genre, html, cssSelector, token, mutatedValue, snapshotName) {
  const el = await setupPage(page, genre, html)
  const before = await el.screenshot()

  await page.evaluate(({ sel, t, v }) => {
    document.documentElement.style.setProperty(t, v)
    const target = document.querySelector(sel)
    if (target) target.style.setProperty(t, v)
  }, { sel: cssSelector, t: token, v: mutatedValue })

  const after = await el.screenshot()
  expect(Buffer.compare(before, after)).not.toBe(0)  // token must produce a visible change
  await expect(el).toHaveScreenshot(`${snapshotName}.png`)
}

test.describe('token-api / btn tokens', () => {
  test('--btn-bg mutation changes fill', async ({ page }) => {
    await assertTokenMutation(
      page, OPS,
      `<button class="btn btn-primary" type="button">Button</button>`,
      '.btn', '--btn-bg', '#ff00ff',
      'token-btn-bg-mutated'
    )
  })

  test('--btn-color mutation changes text', async ({ page }) => {
    await assertTokenMutation(
      page, OPS,
      `<button class="btn btn-primary" type="button">Button</button>`,
      '.btn', '--btn-color', '#00ffff',
      'token-btn-color-mutated'
    )
  })

  test('--btn-corner mutation changes shape', async ({ page }) => {
    await assertTokenMutation(
      page, OPS,
      `<button class="btn btn-primary" type="button">Button</button>`,
      '.btn', '--btn-corner', '20px',
      'token-btn-corner-mutated'
    )
  })

  test('--btn-scan-color mutation changes sweep', async ({ page }) => {
    await assertTokenMutation(
      page, OPS,
      `<button class="btn btn-primary" type="button">Button</button>`,
      '.btn', '--btn-scan-color', 'rgba(255,0,0,0.5)',
      'token-btn-scan-color-mutated'
    )
  })
})

test.describe('token-api / badge tokens', () => {
  test('--badge-bg mutation changes fill', async ({ page }) => {
    await assertTokenMutation(
      page, OPS,
      `<span class="badge badge-primary">Badge</span>`,
      '.badge', '--badge-bg', '#ff00ff',
      'token-badge-bg-mutated'
    )
  })

  test('--badge-color mutation changes text', async ({ page }) => {
    await assertTokenMutation(
      page, OPS,
      `<span class="badge badge-primary">Badge</span>`,
      '.badge', '--badge-color', '#00ffff',
      'token-badge-color-mutated'
    )
  })

  test('--badge-offset mutation changes slant depth', async ({ page }) => {
    await assertTokenMutation(
      page, OPS,
      `<span class="badge badge-primary">Badge</span>`,
      '.badge', '--badge-offset', '20px',
      'token-badge-offset-mutated'
    )
  })
})

test.describe('token-api / card tokens', () => {
  test('--card-bracket-color mutation changes bracket', async ({ page }) => {
    await assertTokenMutation(
      page, OPS,
      `<div class="card" style="width:280px"><div class="card-body"><p>Card</p></div></div>`,
      '.card', '--card-bracket-color', '#ff0000',
      'token-card-bracket-color-mutated'
    )
  })

  test('--card-bracket-size mutation changes bracket size', async ({ page }) => {
    await assertTokenMutation(
      page, OPS,
      `<div class="card" style="width:280px"><div class="card-body"><p>Card</p></div></div>`,
      '.card', '--card-bracket-size', '40px',
      'token-card-bracket-size-mutated'
    )
  })

  test('--card-bar-shadow mutation changes power bar glow', async ({ page }) => {
    await assertTokenMutation(
      page, OPS,
      `<div class="card" style="width:280px"><div class="card-body"><p>Card</p></div></div>`,
      '.card', '--card-bar-shadow', '0 0 20px #ff0000',
      'token-card-bar-shadow-mutated'
    )
  })
})

test.describe('token-api / alert tokens', () => {
  test('--alert-shadow mutation changes box-shadow glow', async ({ page }) => {
    await assertTokenMutation(
      page, OPS,
      `<div class="alert alert-info" style="width:320px"><span class="alert-title">Alert</span> Message.</div>`,
      '.alert', '--alert-shadow', '0 0 30px #ff0000, 0 0 60px #ff0000',
      'token-alert-shadow-mutated'
    )
  })

  test('--alert-bg mutation changes background', async ({ page }) => {
    await assertTokenMutation(
      page, OPS,
      `<div class="alert alert-info" style="width:320px"><span class="alert-title">Alert</span> Message.</div>`,
      '.alert', '--alert-bg', 'rgba(255,0,0,0.3)',
      'token-alert-bg-mutated'
    )
  })

  test('--alert-color mutation changes text', async ({ page }) => {
    await assertTokenMutation(
      page, OPS,
      `<div class="alert alert-info" style="width:320px"><span class="alert-title">Alert</span> Message.</div>`,
      '.alert', '--alert-color', '#ff00ff',
      'token-alert-color-mutated'
    )
  })
})
