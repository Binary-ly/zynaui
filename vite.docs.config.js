import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  root: 'docs',
  plugins: [
    tailwindcss(),
  ],
  server: {
    open: '/index.html'
  },
  preview: {
    open: '/index.html'
  }
})
