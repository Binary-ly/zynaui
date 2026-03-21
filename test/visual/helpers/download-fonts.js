// Run once: npm run test:visual:setup
import { writeFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const DIR = resolve(fileURLToPath(new URL('../__fonts__', import.meta.url)))
mkdirSync(DIR, { recursive: true })

const FONTS = [
  { file: 'vt323.woff2',           url: 'https://fonts.gstatic.com/s/vt323/v17/pxiKyp0ihIEF2hsYHpT2dkNE.woff2' },
  { file: 'share-tech-mono.woff2', url: 'https://fonts.gstatic.com/s/sharetechmono/v15/J7aHnp1uDWRBEqV98dVQztYldFcLowEF.woff2' },
  { file: 'dm-mono.woff2',         url: 'https://fonts.gstatic.com/s/dmmono/v14/aFTU7PB1QTsUX8KYvumzVUa3.woff2' },
]

for (const { file, url } of FONTS) {
  const res = await fetch(url)
  writeFileSync(resolve(DIR, file), Buffer.from(await res.arrayBuffer()))
  console.log(`✓ ${file}`)
}
