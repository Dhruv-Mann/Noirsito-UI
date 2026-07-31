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
        class="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-ink/70 dark:bg-ink-950/80 backdrop-blur-md"
        @click.self="emit('close')"
      >
        <div class="relative w-full max-w-xl rounded-2xl border border-ink-200/80 dark:border-paper-400/20 bg-paper-100 dark:bg-ink-900 shadow-subtle-md overflow-hidden flex flex-col">
          <!-- Search Header -->
          <div class="flex items-center gap-3 px-4 py-3.5 border-b border-ink-200/50 dark:border-paper-400/10">
            <svg class="w-4 h-4 text-rust flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchInput"
              type="text"
              placeholder="Search components by name or tag..."
              class="w-full bg-transparent text-sm text-ink dark:text-paper placeholder:text-ink/40 dark:placeholder:text-paper/40 outline-none font-sans"
              autofocus
            />
            <kbd class="px-2 py-0.5 text-[10px] font-mono text-ink/50 dark:text-paper/50 bg-paper-300/60 dark:bg-ink-800/60 rounded border border-ink-200/40 dark:border-paper-400/20">ESC</kbd>
          </div>

          <!-- Results List -->
          <div class="max-h-[360px] overflow-y-auto p-2">
            <div v-if="filteredResults.length === 0" class="p-8 text-center text-xs text-ink/50 dark:text-paper/50">
              No components matching "{{ searchInput }}"
            </div>
            <button
              v-for="item in filteredResults"
              :key="item.name"
              type="button"
              class="w-full flex items-center justify-between p-3 rounded-xl hover:bg-rust-soft/40 dark:hover:bg-rust-soft/20 border border-transparent hover:border-rust/30 transition-all text-left group"
              @click="selectComponent(item.name)"
            >
              <div class="flex flex-col gap-0.5">
                <span class="text-sm font-semibold text-ink dark:text-paper group-hover:text-rust">
                  {{ item.title }}
                </span>
                <span class="text-xs text-ink/60 dark:text-paper/60 line-clamp-1">
                  {{ item.description }}
                </span>
              </div>
              <span class="px-2 py-0.5 text-[10px] uppercase font-semibold text-rust dark:text-mustard bg-rust-soft/80 dark:bg-ink-800 rounded-md border border-rust/30 dark:border-mustard/30">
                {{ item.category }}
              </span>
            </button>
          </div>

          <!-- Footer -->
          <div class="px-4 py-2.5 bg-paper-200/60 dark:bg-ink-950/60 border-t border-ink-200/40 dark:border-paper-400/10 text-[11px] text-ink/50 dark:text-paper/50 flex items-center justify-between select-none font-mono">
            <span>Press <kbd class="px-1 text-ink dark:text-paper bg-paper-300 dark:bg-ink-800 rounded">ESC</kbd> to exit</span>
            <span class="text-rust font-semibold">Noirsito UI</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
