<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRegistry } from '~/composables/useRegistry'

interface Props {
  open: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'close'): void }>()

const router = useRouter()
const { registryItems } = useRegistry()
const searchInput = ref('')

const filteredResults = computed(() => {
  const query = searchInput.value.toLowerCase().trim()
  if (!query) return registryItems.value
  return registryItems.value.filter(item => 
    item.title.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query) ||
    item.tags.some(tag => tag.toLowerCase().includes(query))
  )
})

function selectComponent(name: string) {
  emit('close')
  router.push(`/components/${name}`)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-obsidian-950/80 backdrop-blur-md"
        @click.self="emit('close')"
      >
        <div class="relative w-full max-w-xl rounded-2xl border border-white/10 bg-obsidian-900 shadow-2xl overflow-hidden flex flex-col">
          <!-- Search Header -->
          <div class="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
            <svg class="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchInput"
              type="text"
              placeholder="Type a component name, category, or tag..."
              class="w-full bg-transparent text-sm text-white placeholder-obsidian-400 outline-none"
              autofocus
            />
            <kbd class="px-2 py-0.5 text-[10px] font-mono text-obsidian-400 bg-white/5 rounded border border-white/10">ESC</kbd>
          </div>

          <!-- Results List -->
          <div class="max-h-[360px] overflow-y-auto p-2">
            <div v-if="filteredResults.length === 0" class="p-8 text-center text-sm text-obsidian-400">
              No components matching "{{ searchInput }}"
            </div>
            <button
              v-for="item in filteredResults"
              :key="item.name"
              type="button"
              class="w-full flex items-center justify-between p-3 rounded-xl hover:bg-indigo-600/15 hover:border-indigo-500/30 border border-transparent transition-all text-left group"
              @click="selectComponent(item.name)"
            >
              <div class="flex flex-col gap-0.5">
                <span class="text-sm font-semibold text-white group-hover:text-indigo-300">
                  {{ item.title }}
                </span>
                <span class="text-xs text-obsidian-400 line-clamp-1">
                  {{ item.description }}
                </span>
              </div>
              <span class="px-2 py-0.5 text-[10px] uppercase font-semibold text-indigo-400 bg-indigo-500/10 rounded-md border border-indigo-500/20">
                {{ item.category }}
              </span>
            </button>
          </div>

          <!-- Footer -->
          <div class="px-4 py-2.5 bg-obsidian-950/60 border-t border-white/5 text-[11px] text-obsidian-400 flex items-center justify-between select-none">
            <span>Press <kbd class="px-1 text-white bg-white/10 rounded">ESC</kbd> to exit</span>
            <span class="text-indigo-400 font-medium">Noirsito Registry</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
