import { ref, computed } from 'vue'
import type { RegistryMeta, ComponentCategory, RegistryItem } from '~~/shared/types/registry'

const registryItems = ref<RegistryMeta[]>([
  {
    name: 'corner-stars',
    title: 'Corner Stars Canvas',
    category: 'animations',
    description: 'Interactive corner starfield canvas animation with constellation implosion particle dynamics.',
    tags: ['canvas', 'particles', 'stars', 'animation'],
    isNew: true
  },
  {
    name: 'dynamic-island',
    title: 'Dynamic Island Nav',
    category: 'navigation',
    description: 'Minimalist expandable top pill navigation bar with smooth tab state transitions.',
    tags: ['navigation', 'dynamic-island', 'tabs', 'header'],
    isNew: true
  },
  {
    name: 'floating-skills',
    title: 'Floating Skills Physics',
    category: 'animations',
    description: '2D physics canvas simulation rendering interactive floating skill bubbles.',
    tags: ['physics', 'canvas', 'skills', 'bubbles'],
    isNew: true
  },
  {
    name: 'fractal-tree',
    title: 'Fractal Tree Canvas',
    category: 'animations',
    description: 'Recursive mathematical fractal tree canvas rendering real-time wind motion.',
    tags: ['canvas', 'math', 'fractal', 'interactive'],
    isNew: true
  },
  {
    name: 'lissajous-orbit',
    title: 'Lissajous Orbit',
    category: 'animations',
    description: 'Harmonic Lissajous curve orbital canvas animation with smooth particle trails.',
    tags: ['canvas', 'lissajous', 'orbit', 'particles'],
    isNew: true
  },
  {
    name: 'page-transition-sheet',
    title: 'Page Transition Sheet',
    category: 'modals',
    description: 'Tactile page transition drawer sheet with backdrop blur and gesture dismissal.',
    tags: ['sheet', 'drawer', 'modal', 'transition'],
    isNew: true
  },
  {
    name: 'pixel-matrix',
    title: 'Pixel Matrix Canvas',
    category: 'animations',
    description: 'Interactive digital pixel matrix grid canvas with mouse proximity ripple effects.',
    tags: ['canvas', 'matrix', 'pixels', 'interactive'],
    isNew: true
  },
  {
    name: 'ribbon-cut',
    title: 'Ribbon Cut Canvas',
    category: 'animations',
    description: 'Interactive ribbon-cut particle canvas with mouse slicing motion effects.',
    tags: ['canvas', 'ribbon', 'particles', 'interactive'],
    isNew: true
  },
  {
    name: 'command-palette',
    title: 'App Command Palette',
    category: 'modals',
    description: 'Keyboard-first command palette modal container with search shortcuts.',
    tags: ['command', 'palette', 'modal', 'keyboard'],
    isNew: true
  },
  {
    name: 'app-grain',
    title: 'App Grain Noise Overlay',
    category: 'animations',
    description: 'Tactile noise texture grain overlay for modern paper & dark background aesthetics.',
    tags: ['grain', 'noise', 'texture', 'overlay'],
    isNew: true
  }
])

const fileMap: Record<string, string> = {
  'corner-stars': 'CornerStarsCanvas.vue',
  'dynamic-island': 'DynamicIslandNav.vue',
  'floating-skills': 'FloatingSkillsPhysics.vue',
  'fractal-tree': 'FractalTree.vue',
  'lissajous-orbit': 'LissajousOrbit.vue',
  'page-transition-sheet': 'PageTransitionSheet.vue',
  'pixel-matrix': 'PixelMatrixCanvas.vue',
  'ribbon-cut': 'RibbonCutCanvas.vue',
  'command-palette': 'AppCommandPalette.vue',
  'app-grain': 'AppGrain.vue'
}

const activeCategory = ref<ComponentCategory | 'all'>('all')
const searchQuery = ref('')

export function useRegistry() {
  const categories = computed(() => [
    { id: 'all', name: 'All Components', count: registryItems.value.length },
    { id: 'navigation', name: 'Navigation', count: registryItems.value.filter(i => i.category === 'navigation').length },
    { id: 'cards', name: 'Cards', count: registryItems.value.filter(i => i.category === 'cards').length },
    { id: 'modals', name: 'Modals & Sheets', count: registryItems.value.filter(i => i.category === 'modals').length },
    { id: 'animations', name: 'Animations & Canvas', count: registryItems.value.filter(i => i.category === 'animations').length }
  ])

  const filteredComponents = computed(() => {
    return registryItems.value.filter(item => {
      const matchesCategory = activeCategory.value === 'all' || item.category === activeCategory.value
      const query = searchQuery.value.toLowerCase().trim()
      const matchesSearch = !query || 
        item.title.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      return matchesCategory && matchesSearch
    })
  })

  function getComponentByName(name: string): RegistryMeta | undefined {
    return registryItems.value.find(item => item.name === name)
  }

  function getLocalRegistryItem(name: string): RegistryItem | undefined {
    const meta = getComponentByName(name)
    if (!meta) return undefined

    const fileName = fileMap[name]
    return {
      name: meta.name,
      title: meta.title,
      category: meta.category,
      description: meta.description,
      files: [
        {
          path: `components/ui/${fileName}`,
          type: 'registry:ui',
          content: ''
        }
      ]
    }
  }

  async function fetchComponentRegistryData(name: string): Promise<RegistryItem | null> {
    try {
      const data = await $fetch<RegistryItem>(`/api/registry/${name}`)
      return data || getLocalRegistryItem(name) || null
    } catch {
      return getLocalRegistryItem(name) || null
    }
  }

  function registerComponent(meta: RegistryMeta) {
    const existingIndex = registryItems.value.findIndex(item => item.name === meta.name)
    if (existingIndex >= 0) {
      registryItems.value[existingIndex] = meta
    } else {
      registryItems.value.push(meta)
    }
  }

  return {
    registryItems,
    categories,
    activeCategory,
    searchQuery,
    filteredComponents,
    getComponentByName,
    getLocalRegistryItem,
    fetchComponentRegistryData,
    registerComponent
  }
}
