import { readFileSync, writeFileSync } from 'fs'

const { version } = JSON.parse(readFileSync('./package.json', 'utf8'))
writeFileSync('./docs/_version.js', `export const version = '${version}'\n`)
console.log(`[gen-version] docs/_version.js → v${version}`)
