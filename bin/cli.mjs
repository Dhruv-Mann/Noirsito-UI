#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import http from 'node:http'
import https from 'node:https'

const args = process.argv.slice(2)
const command = args[0]
const componentName = args[1]

const BASE_URL = process.env.NOIRSITO_REGISTRY_URL || 'https://noirsito-ui.vercel.app'

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    client.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`))
      }
      let data = ''
      res.on('data', chunk => { data += chunk })
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch (e) {
          reject(e)
        }
      })
    }).on('error', reject)
  })
}

const REGISTRY_MAP = {
  'corner-stars': { title: 'Corner Stars Canvas', file: 'CornerStarsCanvas.vue' },
  'dynamic-island': { title: 'Dynamic Island Nav', file: 'DynamicIslandNav.vue' },
  'floating-skills': { title: 'Floating Skills Physics', file: 'FloatingSkillsPhysics.vue' },
  'fractal-tree': { title: 'Fractal Tree Canvas', file: 'FractalTree.vue' },
  'lissajous-orbit': { title: 'Lissajous Orbit', file: 'LissajousOrbit.vue' },
  'page-transition-sheet': { title: 'Page Transition Sheet', file: 'PageTransitionSheet.vue' },
  'pixel-matrix': { title: 'Pixel Matrix Canvas', file: 'PixelMatrixCanvas.vue' },
  'ribbon-cut': { title: 'Ribbon Cut Canvas', file: 'RibbonCutCanvas.vue' },
  'command-palette': { title: 'App Command Palette', file: 'AppCommandPalette.vue' },
  'app-grain': { title: 'App Grain Noise Overlay', file: 'AppGrain.vue' },
  'target-cursor': { title: 'Target Cursor', file: 'TargetCursor.vue' }
}

async function main() {
  console.log('\n\x1b[38;2;193;80;46m  Noirsito UI CLI\x1b[0m — Minimalist Vue 3 Primitives\n')

  if (!command || command !== 'add' || !componentName) {
    console.log('\x1b[33mUsage:\x1b[0m npx noirsito-ui add <component-name>')
    console.log('\x1b[36mAvailable components:\x1b[0m')
    Object.keys(REGISTRY_MAP).forEach(name => {
      console.log(`  - \x1b[1m${name}\x1b[0m (${REGISTRY_MAP[name].file})`)
    })
    console.log('')
    process.exit(0)
  }

  const meta = REGISTRY_MAP[componentName]
  if (!meta) {
    console.error(`\x1b[31m[Error]\x1b[0m Component "\x1b[1m${componentName}\x1b[0m" not found in Noirsito UI registry.`)
    console.log('\x1b[36mValid options:\x1b[0m ' + Object.keys(REGISTRY_MAP).join(', '))
    process.exit(1)
  }

  let codeContent = ''
  let targetFileName = meta.file

  // 1. Try local project source file if running inside Noirsito UI repo
  const localSourcePath = path.resolve(process.cwd(), 'app/components/ui', meta.file)
  if (fs.existsSync(localSourcePath)) {
    codeContent = fs.readFileSync(localSourcePath, 'utf8')
  } else {
    // 2. Try fetching from remote Vercel API
    try {
      const payload = await fetchJson(`${BASE_URL}/api/registry/${componentName}`)
      if (payload && payload.files && payload.files[0] && payload.files[0].content) {
        codeContent = payload.files[0].content
      }
    } catch (err) {
      // Ignore network fallback
    }
  }

  if (!codeContent) {
    console.error(`\x1b[31m[Error]\x1b[0m Unable to retrieve source code for \x1b[1m${componentName}\x1b[0m.`)
    process.exit(1)
  }

  // Determine output directory: ./components/ui/
  const targetDir = path.resolve(process.cwd(), 'components/ui')
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
  }

  const targetPath = path.join(targetDir, targetFileName)
  fs.writeFileSync(targetPath, codeContent, 'utf8')

  console.log(`\x1b[32m✔ Success!\x1b[0m Component \x1b[1m${meta.title}\x1b[0m installed into \x1b[36m./components/ui/${targetFileName}\x1b[0m`)
  console.log(`\x1b[90m  You can now import and use <${targetFileName.replace('.vue', '')} /> in your Vue 3 / Nuxt application.\x1b[0m\n`)
}

main().catch(err => {
  console.error('\x1b[31m[Error]\x1b[0m', err)
  process.exit(1)
})
