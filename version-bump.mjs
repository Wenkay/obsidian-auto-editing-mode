import { readFileSync, writeFileSync } from 'fs'

const pkg = JSON.parse(readFileSync('./package.json'))
const manifest = JSON.parse(readFileSync('./manifest.json'))

manifest.version = pkg.version

writeFileSync('./manifest.json', JSON.stringify(manifest, null, 2))

// Also update versions.json
let versions = {}
try {
  versions = JSON.parse(readFileSync('./versions.json'))
} catch (e) {
  // Ignore error if file doesn't exist
}

versions[pkg.version] = manifest.minAppVersion || '0.16.0'

writeFileSync('./versions.json', JSON.stringify(versions, null, 2))