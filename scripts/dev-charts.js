#!/usr/bin/env node
/**
 * dev:charts — watch src/charts/ and auto-copy the rebuilt IIFE into docs/dist/
 * so the dev:docs server picks it up without a manual rebuild step.
 *
 * Usage: npm run dev:charts
 * Run alongside npm run dev:docs in a second terminal.
 */

import { build } from 'vite'
import { copyFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const SRC  = resolve(root, 'dist/zyna-charts.iife.js')
const DEST = resolve(root, 'docs/dist/zyna-charts.iife.js')

let copyCount = 0

await build({
  configFile: resolve(root, 'vite.iife.config.js'),
  build: { watch: {} },
  plugins: [
    {
      name: 'copy-to-docs',
      closeBundle() {
        copyFileSync(SRC, DEST)
        copyCount++
        const ts = new Date().toLocaleTimeString('en-US', { hour12: false })
        console.log(`[${ts}] ✓ docs/dist/zyna-charts.iife.js updated (build #${copyCount}) — reload the browser`)
      },
    },
  ],
})
