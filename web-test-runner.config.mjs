import { vitePlugin } from '@remcovaes/web-test-runner-vite-plugin'

export default {
  files: 'test/charts/**/*.test.js',
  plugins: [vitePlugin()],
  nodeResolve: true,
}
