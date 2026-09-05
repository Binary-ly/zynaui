import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './test/visual',
  snapshotDir: './test/visual/snapshots',
  snapshotPathTemplate: '{snapshotDir}/{testFileDir}/{arg}-{projectName}{ext}',
  // CI only: a macOS runner VM occasionally rasterises the 1px badge rims at
  // fractional box edges with different anti-aliasing coverage — same tree,
  // same runner image, only the rim pixels differ. Sampled on 12 VMs: about
  // 1 in 70 Phosphor screenshots before the font-settle wait in page-setup.js,
  // 1 in 1440 after it. A real regression fails every attempt, so two retries
  // keep the 64px budget honest without hiding genuine diffs. Locally the
  // render is deterministic and nothing is retried.
  retries: process.env.CI ? 2 : 0,
  workers: 4,
  globalSetup: './test/visual/helpers/global-setup.js',

  expect: {
    toHaveScreenshot: {
      // Baselines are CSS-pixel images: toHaveScreenshot captures at
      // `scale: 'css'` (one image pixel per CSS pixel) regardless of the
      // context's deviceScaleFactor, which is why the earlier
      // `deviceScaleFactor: 2` setting — itself overridden by the device
      // preset below — never changed a single baseline. Stated explicitly so
      // nobody tunes the budget for a scale that isn't in effect.
      scale: 'css',
      // Not 0: antialiasing on glow gradients and glyph edges drifts up to
      // ~30px between macOS releases (dev machine vs macos-latest runner) —
      // verified cosmetic by inspecting CI diffs. 64px still flags any real
      // visual change: a colour or geometry regression touches hundreds of pixels.
      maxDiffPixels: 64,
      threshold: 0,
      animations: 'disabled',
    },
  },

  use: {
    colorScheme: 'dark',
    reducedMotion: 'reduce',
    locale: 'en-US',
    timezoneId: 'UTC',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      // The device preset carries its own viewport (1280×720) and
      // deviceScaleFactor (1); project `use` wins over top-level `use`, so a
      // top-level viewport/scale setting is silently ignored — which is what
      // happened to an earlier 1200×900 / scale-2 setting here. Every baseline
      // was captured at the preset's 1280×720, and the genre page textures
      // (fixed body::before gradients) are phase-locked to the viewport size,
      // so changing the viewport invalidates every Military/Phosphor/Washi/
      // Atelier snapshot. Keep the preset as-is.
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
  ],
})
