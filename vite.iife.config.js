import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// IIFE build — bundles d3 inline so the file works as a standalone <script src>.
// For ESM / CJS builds (vite.config.js), d3 is externalized to avoid duplication
// in projects that already depend on d3.
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/charts/index.js'),
      name: 'ZynaCharts',
      formats: ['iife'],
      fileName: () => 'zyna-charts.iife.js',
    },
    outDir: 'dist',
    emptyOutDir: false,
  },
})
