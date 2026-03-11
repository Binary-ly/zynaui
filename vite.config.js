import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  build: {
    lib: {
      entry: {
        'zyna-plugin':          resolve(__dirname, 'src/plugin/index.js'),
        'zyna-charts':          resolve(__dirname, 'src/charts/index.js'),
        'charts/waffle':        resolve(__dirname, 'src/charts/waffle.js'),
        'charts/timeline':      resolve(__dirname, 'src/charts/timeline.js'),
        'charts/nightingale':   resolve(__dirname, 'src/charts/nightingale.js'),
        'charts/lollipop':      resolve(__dirname, 'src/charts/lollipop.js'),
        'charts/orbital':       resolve(__dirname, 'src/charts/orbital.js'),
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
