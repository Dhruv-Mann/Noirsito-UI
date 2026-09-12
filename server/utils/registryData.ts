import fs from 'node:fs'
import path from 'node:path'
import type { RegistryItem } from '~~/shared/types/registry'
import bundledSources from './registry-sources.generated.mjs'

export const registryMetadata: Record<string, { title: string; category: any; description: string; file: string }> = {
  'corner-stars': {
    title: 'Corner Stars Canvas',
    category: 'animations',
    description: 'Interactive corner starfield canvas animation with constellation implosion particle dynamics.',
    file: 'CornerStarsCanvas.vue'
  },
  'dynamic-island': {
    title: 'Dynamic Island Nav',
    category: 'navigation',
    description: 'Minimalist expandable top pill navigation bar with smooth tab state transitions.',
    file: 'DynamicIslandNav.vue'
  },
  'floating-skills': {
    title: 'Floating Skills Physics',
    category: 'animations',
    description: '2D physics canvas simulation rendering interactive floating skill bubbles.',
    file: 'FloatingSkillsPhysics.vue'
  },
  'fractal-tree': {
    title: 'Fractal Tree Canvas',
    category: 'animations',
    description: 'Recursive mathematical fractal tree canvas rendering real-time wind motion.',
    file: 'FractalTree.vue'
  },
  'lissajous-orbit': {
    title: 'Lissajous Orbit',
    category: 'animations',
    description: 'Harmonic Lissajous curve orbital canvas animation with smooth particle trails.',
    file: 'LissajousOrbit.vue'
  },
  'page-transition-sheet': {
    title: 'Page Transition Sheet',
    category: 'modals',
    description: 'Tactile page transition drawer sheet with backdrop blur and gesture dismissal.',
    file: 'PageTransitionSheet.vue'
  },
  'pixel-matrix': {
    title: 'Pixel Matrix Canvas',
    category: 'animations',
    description: 'Interactive digital pixel matrix grid canvas with mouse proximity ripple effects.',
    file: 'PixelMatrixCanvas.vue'
  },
  'ribbon-cut': {
    title: 'Ribbon Cut Canvas',
    category: 'animations',
    description: 'Interactive ribbon-cut particle canvas with mouse slicing motion effects.',
    file: 'RibbonCutCanvas.vue'
  },
  'command-palette': {
    title: 'App Command Palette',
    category: 'modals',
    description: 'Keyboard-first command palette modal container with search shortcuts.',
    file: 'AppCommandPalette.vue'
  },
  'app-grain': {
    title: 'App Grain Noise Overlay',
    category: 'animations',
    description: 'Tactile noise texture grain overlay for modern paper & dark background aesthetics.',
    file: 'AppGrain.vue'
  },
  'target-cursor': {
    title: 'Target Cursor',
    category: 'animations',
    description: 'Interactive target lock-on custom cursor with corner brackets, rotation spin dynamics, and I-beam text mode.',
    file: 'TargetCursor.vue'
  }
}

function asSourceString(value: unknown): string {
  if (typeof value === 'string') return value
  return ''
}

function readComponentSource(fileName: string): string {
  // Local/dev: read the file on disk so the code viewer tracks edits without a rebuild.
  if (process.env.NODE_ENV !== 'production') {
    try {
      const diskPath = path.resolve(process.cwd(), 'app/components/ui', fileName)
      if (fs.existsSync(diskPath)) {
        const fromDisk = fs.readFileSync(diskPath, 'utf8')
        if (fromDisk.trim()) return fromDisk
      }
    } catch (err) {
      console.error(`[Registry] Dev disk read failed for ${fileName}:`, err)
    }
  }

  const bundled = asSourceString((bundledSources as Record<string, string>)[fileName])
  if (bundled.trim()) return bundled

  return ''
}

export async function getRegistryItem(name: string): Promise<RegistryItem | null> {
  const meta = registryMetadata[name]
  if (!meta) return null

  const content = readComponentSource(meta.file)
  if (!content.trim()) {
    console.error(`[Registry] Missing bundled source for ${meta.file}`)
  }

  return {
    name,
    title: meta.title,
    category: meta.category,
    description: meta.description,
    files: [
      {
        path: `components/ui/${meta.file}`,
        type: 'registry:ui',
        content
      }
    ]
  }
}
