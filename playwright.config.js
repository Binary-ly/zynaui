import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './test/visual',
  snapshotDir: './test/visual/snapshots',
  snapshotPathTemplate: '{snapshotDir}/{testFileDir}/{arg}-{projectName}{ext}',
  retries: 0,
  workers: 4,
  globalSetup: './test/visual/helpers/global-setup.js',

  expect: {
    toHaveScreenshot: {
      // Not 0: antialiasing on glow gradients and glyph edges drifts up to
      // ~30px between macOS releases (dev machine vs macos-latest runner) —
      // verified cosmetic by inspecting CI diffs. 64px at a DPR-2 viewport
      // still flags any real visual change: a color or geometry regression
      // touches hundreds of pixels.
      maxDiffPixels: 64,
      threshold: 0,
      animations: 'disabled',
    },
  },

  use: {
    deviceScaleFactor: 2,
    colorScheme: 'dark',
    reducedMotion: 'reduce',
    viewport: { width: 1200, height: 900 },
    locale: 'en-US',
    timezoneId: 'UTC',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
  ],
})
