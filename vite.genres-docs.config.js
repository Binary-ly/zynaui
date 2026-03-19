import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// Bundles the genres registry as a self-contained ESM file for use in the docs.
// docs/_genres.js and docs/genres/index.html import GENRES at runtime in the
// browser — they can't reach ../src/ on the deployed server, so this produces
// docs/dist/genres.js with all dependencies inlined.
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/plugin/genres/index.js'),
      formats: ['es'],
      fileName: () => 'genres.js',
    },
    outDir: 'docs/dist',
    emptyOutDir: false,
  },
})
