import { test, expect } from '@playwright/test'
import { setupPage } from './helpers/page-setup.js'
import { GENRES } from './helpers/genre.js'

// A full-component overview snapshot per genre.
// Each test uses setupPage() which sets data-genre on <html>, so genre CSS
// selectors (html[data-genre="..."]) activate correctly.
const OVERVIEW_HTML = `
  <div style="display:flex;flex-direction:column;gap:20px;width:420px">
    <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
      <button class="btn btn-primary btn-sm" type="button">Primary</button>
      <button class="btn btn-secondary btn-sm" type="button">Secondary</button>
      <button class="btn btn-ghost btn-sm" type="button">Ghost</button>
      <button class="btn btn-danger btn-sm" type="button">Danger</button>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
      <span class="badge badge-primary">Primary</span>
      <span class="badge badge-success">Success</span>
      <span class="badge badge-danger">Danger</span>
      <span class="badge badge-warning">Warning</span>
      <span class="badge badge-info">Info</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px">
      <div class="alert alert-success"><span class="alert-title">Success</span> Operation completed.</div>
      <div class="alert alert-danger"><span class="alert-title">Error</span> Critical fault detected.</div>
      <div class="alert alert-info"><span class="alert-title">Info</span> System status nominal.</div>
    </div>
    <div class="card">
      <div class="card-header">
        <span class="card-title">System Status</span>
        <span class="badge badge-success badge-sm">Online</span>
      </div>
      <div class="card-body">
        <p class="card-subtitle">All systems operational</p>
        <p>Node uptime: 99.98% — Latency: 12ms</p>
      </div>
      <div class="card-footer">
        <button class="btn btn-primary btn-sm" type="button">View Details</button>
      </div>
    </div>
  </div>`

for (const genre of GENRES) {
  test(`genre overview / ${genre.id}`, async ({ page }) => {
    const el = await setupPage(page, genre, OVERVIEW_HTML)
    await expect(el).toHaveScreenshot(`genre-overview-${genre.id}.png`)
  })
}
