import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['test/plugin/**/*.test.js', 'test/react/**/*.test.js'],
    environment: 'node',
    globals: true,
  },
})
