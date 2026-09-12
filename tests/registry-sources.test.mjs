import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import test from 'node:test'
import { generateRegistrySources } from '../scripts/generate-registry-sources.mjs'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function expectedRegistryFiles() {
  const registryData = fs.readFileSync(
    path.join(rootDir, 'server', 'utils', 'registryData.ts'),
    'utf8'
  )
  const files = [...registryData.matchAll(/file:\s*'([^']+\.vue)'/g)].map(match => match[1])
  assert.ok(files.length > 0, 'registryData.ts must declare component files')
  return [...new Set(files)]
}

test('generated registry sources include non-empty source for every registered component', () => {
  const { sources, files } = generateRegistrySources()
  const expected = expectedRegistryFiles()

  for (const fileName of expected) {
    const content = sources[fileName]
    assert.equal(typeof content, 'string', `${fileName} must be a string in the generated map`)
    assert.ok(content.trim().length > 20, `${fileName} must have real source, not empty content`)
    assert.ok(content.includes('<'), `${fileName} should look like a Vue SFC`)
  }

  assert.ok(
    files.length >= expected.length,
    `expected at least ${expected.length} generated files, got ${files.length}`
  )
})

test('generated module does not embed raw Vue tags that break the Nitro bundler', () => {
  const { outFile } = generateRegistrySources()
  const generated = fs.readFileSync(outFile, 'utf8')
  assert.equal(generated.includes('<script'), false)
  assert.equal(generated.includes('<template'), false)
  assert.ok(generated.includes('decodeRegistrySources'))
})

test('generated module on disk matches in-memory sources and is importable', async () => {
  const { outFile } = generateRegistrySources()
  assert.equal(fs.existsSync(outFile), true)

  const moduleUrl = pathToFileURL(outFile).href + `?t=${Date.now()}`
  const imported = await import(moduleUrl)
  const parsed = imported.default || imported.registrySources
  const expected = expectedRegistryFiles()
  for (const fileName of expected) {
    assert.ok(parsed[fileName] && parsed[fileName].trim().length > 20, `${fileName} missing from generated module`)
  }
})

test('component page does not prefer empty API payloads over local source', () => {
  const page = fs.readFileSync(
    path.join(rootDir, 'app', 'pages', 'components', '[name].vue'),
    'utf8'
  )
  assert.equal(
    /if \(remoteData\.value\) return remoteData\.value/.test(page),
    false,
    'empty API content must not win over the local raw-source fallback'
  )
  assert.ok(
    page.includes('resolveRegistryItem'),
    'component page must merge remote and local registry payloads'
  )
})

test('server registry no longer reads source from Nitro serverAssets at runtime', () => {
  const registryData = fs.readFileSync(
    path.join(rootDir, 'server', 'utils', 'registryData.ts'),
    'utf8'
  )
  assert.equal(
    registryData.includes("useStorage('assets:server:ui')"),
    false,
    'runtime serverAssets lookups go empty on Vercel and must not be used'
  )
  assert.ok(
    registryData.includes('registry-sources.generated.mjs'),
    'registry must statically import build-time bundled sources'
  )
})
