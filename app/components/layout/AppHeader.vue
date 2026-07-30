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
  <header class="sticky top-0 z-40 w-full apple-glass">
    <div class="max-w-7xl mx-auto flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8">
      <!-- Left Branding -->
      <NuxtLink to="/" class="flex items-center gap-2.5 group">
        <div class="flex items-center justify-center w-7 h-7 rounded-lg bg-rust text-paper font-mono text-sm font-extrabold tracking-tighter shadow-sm transition-transform duration-200 group-hover:scale-105">
          N
        </div>
        <div class="flex items-baseline gap-1.5">
          <span class="font-bold tracking-tight text-ink text-base group-hover:text-rust transition-colors">
            Noirsito
          </span>
          <span class="text-[10px] font-mono tracking-widest text-teal-deep font-semibold uppercase">
            Registry
          </span>
        </div>
      </NuxtLink>

      <!-- Center Search Command Palette Trigger -->
      <button
        type="button"
        class="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-ink-200/60 dark:border-paper-400/20 bg-paper-100/80 dark:bg-ink-800/60 text-ink/60 dark:text-paper/60 hover:text-ink dark:hover:text-paper hover:border-rust/40 transition-all text-xs w-60 select-none shadow-apple-sm"
        @click="isCommandPaletteOpen = true"
      >
        <svg class="w-3.5 h-3.5 text-teal-deep dark:text-mustard flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span class="flex-1 text-left font-sans">Search components...</span>
        <kbd class="px-1.5 py-0.5 text-[10px] font-mono font-medium text-ink/50 dark:text-paper/50 bg-paper-300/60 dark:bg-ink-700/60 rounded border border-ink-200/40 dark:border-paper-400/20">⌘K</kbd>
      </button>

      <!-- Right Navigation & Actions -->
      <div class="flex items-center gap-2">
        <NuxtLink
          to="/components"
          class="text-xs font-semibold text-ink/70 dark:text-paper/70 hover:text-rust dark:hover:text-mustard px-3 py-1.5 rounded-md transition-colors"
        >
          Components
        </NuxtLink>

        <!-- GitHub Social Button -->
        <a
          href="https://github.com/Dhruv-Mann/noirsito-ui"
          target="_blank"
          rel="noopener noreferrer"
          class="p-1.5 rounded-lg text-ink/70 dark:text-paper/70 hover:text-rust dark:hover:text-mustard hover:bg-paper-300/40 dark:hover:bg-ink-800/40 transition-colors"
          title="GitHub Repository"
        >
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>

        <!-- Dark/Light Theme Switcher -->
        <button
          type="button"
          class="p-1.5 rounded-lg text-ink/70 dark:text-paper/70 hover:text-rust dark:hover:text-mustard hover:bg-paper-300/40 dark:hover:bg-ink-800/40 transition-colors"
          title="Toggle Paper / Ink Theme"
          @click="toggleTheme"
        >
          <svg v-if="isDark" class="w-4 h-4 text-mustard" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else class="w-4 h-4 text-teal-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Global Command Palette Modal -->
    <CommandPalette :open="isCommandPaletteOpen" @close="isCommandPaletteOpen = false" />
  </header>
</template>
