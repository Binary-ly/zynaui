import { existsSync, statSync } from 'fs'
import { resolve } from 'path'

export default function globalSetup() {
  const css = resolve('dist/zynaui.css')
  if (!existsSync(css)) {
    throw new Error('dist/zynaui.css not found — run: npm run build:css')
  }
  const ageMin = (Date.now() - statSync(css).mtimeMs) / 60000
  if (ageMin > 60) {
    console.warn(`⚠  dist/zynaui.css is ${Math.round(ageMin)}m old — consider npm run build:css`)
  }
}
