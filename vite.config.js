import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// Added during Next.js integration testing (Phase 5 — Turbopack/SSR):
// Emits a no-op CJS stub for the ./charts export so that SSR runtimes (Next.js,
// Nuxt Nitro, Remix) resolve the "node" and "require" export conditions to a safe
// empty module instead of the real ESM bundle which references HTMLElement and
// crashes in Node. emptyOutDir:true wipes dist on each main build, so the stub
// must be emitted here rather than created manually.
const emitChartsStub = {
  name: 'emit-charts-stub',
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'zyna-charts-stub.cjs',
      source: [
        '"use strict";',
        '// No-op CJS stub for server/Node environments — zynaui charts are browser-only',
        '// custom elements. SSR runtimes resolve this via the "node"/"require" export',
        '// conditions; browsers get the real implementation via "browser"/"import".',
        'module.exports = {};',
      ].join('\n'),
    })
  },
}

export default defineConfig({
  plugins: [emitChartsStub],
  build: {
    lib: {
      entry: {
        'zyna-plugin':          resolve(__dirname, 'src/plugin/index.js'),
        // Added 2026-03-19 (DaisyUI gap audit): expose genres as a standalone entry
        // so users can import { defineGenre, registerGenre } from 'zynaui/genres'
        // as documented in define.js JSDoc examples.
        'genres':               resolve(__dirname, 'src/plugin/genres/index.js'),
        'zyna-charts':          resolve(__dirname, 'src/charts/index.js'),
        'charts/waffle':        resolve(__dirname, 'src/charts/waffle.js'),
        'charts/timeline':      resolve(__dirname, 'src/charts/timeline.js'),
        'charts/nightingale':   resolve(__dirname, 'src/charts/nightingale.js'),
        'charts/lollipop':      resolve(__dirname, 'src/charts/lollipop.js'),
        'charts/orbital':       resolve(__dirname, 'src/charts/orbital.js'),
        'charts/candlestick':   resolve(__dirname, 'src/charts/candlestick.js'),
        'charts/gauge':         resolve(__dirname, 'src/charts/gauge.js'),
        'charts/line':          resolve(__dirname, 'src/charts/line.js'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        if (format === 'cjs') return `${entryName}.cjs`
        return `${entryName}.js`
      },
    },
    rollupOptions: {
      // D3 submodules are externalized so bundler consumers don't bundle them twice.
      // The IIFE build (vite.iife.config.js) bundles them inline for CDN use.
      external: ['tailwindcss/plugin', 'd3-selection', 'd3-array', 'd3-shape', 'd3-scale'],
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
})
