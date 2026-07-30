<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '~/composables/useTheme'
import CommandPalette from '~/components/showcase/CommandPalette.vue'

const { isDark, toggleTheme, initTheme } = useTheme()
const isCommandPaletteOpen = ref(false)

function handleKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    isCommandPaletteOpen.value = !isCommandPaletteOpen.value
  }
}

onMounted(() => {
  initTheme()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <header class="sticky top-0 z-40 w-full glass-panel border-b border-white/10">
    <div class="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
      <!-- Left Branding -->
      <NuxtLink to="/" class="flex items-center gap-3 group">
        <div class="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 shadow-md shadow-indigo-950/50 group-hover:scale-105 transition-transform duration-300">
          <span class="font-mono text-lg font-extrabold text-white">N</span>
          <span class="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div class="flex flex-col">
          <span class="font-bold tracking-tight text-white text-lg group-hover:text-indigo-400 transition-colors">
            Noirsito<span class="text-indigo-400">.UI</span>
          </span>
          <span class="text-[10px] font-mono tracking-wider text-obsidian-400 uppercase leading-none">Component Registry</span>
        </div>
      </NuxtLink>

      <!-- Center Search Command Palette Trigger -->
      <button
        type="button"
        class="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-xl border border-white/10 bg-obsidian-900/80 hover:bg-obsidian-800/80 text-obsidian-400 hover:text-obsidian-200 transition-all text-xs w-64 select-none"
        @click="isCommandPaletteOpen = true"
      >
        <svg class="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span class="flex-1 text-left">Search components...</span>
        <kbd class="px-1.5 py-0.5 text-[10px] font-mono text-obsidian-400 bg-white/5 rounded border border-white/10">⌘K</kbd>
      </button>

      <!-- Right Navigation & Actions -->
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/components"
          class="hidden sm:inline-flex text-xs font-semibold text-obsidian-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          Components
        </NuxtLink>

        <!-- GitHub Social Button -->
        <a
          href="https://github.com/Dhruv-Mann/noirsito-ui"
          target="_blank"
          rel="noopener noreferrer"
          class="p-2 rounded-xl text-obsidian-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          title="GitHub Repository"
        >
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>

        <!-- Dark/Light Theme Switcher -->
        <button
          type="button"
          class="p-2 rounded-xl text-obsidian-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          title="Toggle Dark / Light Theme"
          @click="toggleTheme"
        >
          <svg v-if="isDark" class="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else class="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Global Command Palette Modal -->
    <CommandPalette :open="isCommandPaletteOpen" @close="isCommandPaletteOpen = false" />
  </header>
</template>
