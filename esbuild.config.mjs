import { build } from 'esbuild'
import builtinModules from 'builtin-modules'
import { readFile } from 'fs/promises'

const pkg = JSON.parse(await readFile('./package.json'))

const external = [
  'obsidian',
  'electron',
  ...builtinModules,
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.devDependencies || {})
]

build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  external,
  format: 'cjs',
  outfile: 'main.js',
  sourcemap: 'inline',
  treeShaking: true,
  platform: 'node',
  logLevel: 'info',
  minify: process.argv.includes('production')
}).catch(err => {
  console.error(err)
  process.exit(1)
})