import { ref, computed } from 'vue'
import type { RegistryMeta, ComponentCategory, RegistryItem } from '~~/shared/types/registry'

/**
 * Global component registry state.
 * Add your component metadata entries here for search, sidebar filtering, and display.
 */
const registryItems = ref<RegistryMeta[]>([])

const activeCategory = ref<ComponentCategory | 'all'>('all')
const searchQuery = ref('')

export function useRegistry() {
  const categories = computed(() => [
    { id: 'all', name: 'All Components', count: registryItems.value.length },
    { id: 'buttons', name: 'Buttons', count: registryItems.value.filter(i => i.category === 'buttons').length },
    { id: 'cards', name: 'Cards', count: registryItems.value.filter(i => i.category === 'cards').length },
    { id: 'inputs', name: 'Inputs', count: registryItems.value.filter(i => i.category === 'inputs').length },
    { id: 'modals', name: 'Modals', count: registryItems.value.filter(i => i.category === 'modals').length },
    { id: 'badges', name: 'Badges', count: registryItems.value.filter(i => i.category === 'badges').length },
    { id: 'tabs', name: 'Tabs & Navigation', count: registryItems.value.filter(i => i.category === 'tabs').length },
    { id: 'animations', name: 'Animations & Text', count: registryItems.value.filter(i => i.category === 'animations').length }
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

  async function fetchComponentRegistryData(name: string): Promise<RegistryItem | null> {
    try {
      const data = await $fetch<RegistryItem>(`/api/registry/${name}`)
      return data
    } catch {
      return null
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
    fetchComponentRegistryData,
    registerComponent
  }
}
