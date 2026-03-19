// Added during Next.js integration testing (Phase 5 — Turbopack):
// Builds the React wrapper components (zynaui/react) as a separate pass
// AFTER vite.iife.config.js so dist/zyna-charts.iife.js exists for the ?raw import.
// React is externalized — users supply it via their own project.
// 'use client' banner ensures Next.js App Router treats this as a client module.

import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/react/index.js'),
      formats: ['es', 'cjs'],
      fileName: (format) => format === 'cjs' ? 'react.cjs' : 'react.js',
    },
    rollupOptions: {
      external: ['react'],
      output: {
        // 'use client' must be the very first line so Next.js App Router
        // recognises this as a client-only module boundary.
        banner: "'use client';",
      },
    },
    outDir: 'dist',
    emptyOutDir: false,
  },
})
