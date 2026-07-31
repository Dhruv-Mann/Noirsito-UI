import type { RegistryItem } from '~~/shared/types/registry'

// Native Vite raw glob import for all UI Vue files
const rawFiles = import.meta.glob('~/components/ui/*.vue', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

const metadata: Record<string, { title: string; category: any; description: string; file: string }> = {
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
  'projects-showcase': {
    title: 'Projects Showcase Deck',
    category: 'cards',
    description: 'Interactive project portfolio card deck with filter tags and status badges.',
    file: 'ProjectsShowcase.vue'
  },
  'ribbon-cut': {
    title: 'Ribbon Cut Canvas',
    category: 'animations',
    description: 'Interactive ribbon-cut particle canvas with mouse slicing motion effects.',
    file: 'RibbonCutCanvas.vue'
  },
  'tech-stack': {
    title: 'Tech Stack Showcase',
    category: 'cards',
    description: 'Interactive tech stack matrix grid with category filters and proficiency meters.',
    file: 'TechStackShowcase.vue'
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
  }
}

export function getRegistryItem(name: string): RegistryItem | null {
  const meta = metadata[name]
  if (!meta) return null

  const globKey = Object.keys(rawFiles).find(k => k.endsWith(meta.file))
  const content = globKey ? rawFiles[globKey] : ''

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

export const registryData: Record<string, RegistryItem> = new Proxy({}, {
  get(target, prop: string) {
    return getRegistryItem(prop) || undefined
  }
})
