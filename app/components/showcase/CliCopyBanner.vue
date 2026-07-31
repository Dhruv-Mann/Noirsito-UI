<script setup lang="ts">
import { computed } from 'vue'
import { useCopy } from '~/composables/useCopy'

interface Props {
  componentName?: string
}

const props = withDefaults(defineProps<Props>(), {
  componentName: 'my-component'
})

const { copied, copyToClipboard } = useCopy()

const cliCommand = computed(() => {
  return `npx noirsito-ui add ${props.componentName}`
})

function handleCopy() {
  copyToClipboard(cliCommand.value)
}
</script>

<template>
  <div class="w-full font-mono select-none">
    <!-- Minimalist Apple-Craft CLI Terminal Command Bar -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 px-4 rounded-xl border border-ink-200/60 dark:border-paper-400/15 bg-paper-100/90 dark:bg-ink-900/90 backdrop-blur-sm transition-colors hover:border-rust/40">
      
      <!-- Terminal Prompt & Command Syntax Highlighting -->
      <div class="flex items-center gap-2.5 w-full sm:w-auto text-xs sm:text-sm font-mono overflow-x-auto">
        <span class="text-rust font-bold">$</span>
        
        <div class="flex items-center gap-1.5 whitespace-nowrap">
          <span class="text-mustard font-bold">npx</span>
          <span class="text-ink dark:text-paper font-semibold">noirsito-ui</span>
          <span class="text-teal-deep dark:text-mustard font-semibold">add</span>
          <span class="text-rust font-bold px-1.5 py-0.5 rounded bg-rust-soft/60 border border-rust/20">
            {{ props.componentName }}
          </span>
        </div>
      </div>

      <!-- Minimal Tactile Copy Button -->
      <button
        type="button"
        :class="[
          'inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all duration-150 outline-none btn-tactile w-full sm:w-auto flex-shrink-0 shadow-subtle-sm',
          copied
            ? 'bg-teal-deep text-paper'
            : 'bg-rust hover:bg-rust-hover text-paper'
        ]"
        @click="handleCopy"
      >
        <svg v-if="copied" class="w-3.5 h-3.5 text-paper" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else class="w-3.5 h-3.5 text-paper/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <span>{{ copied ? 'Copied' : 'Copy' }}</span>
      </button>

    </div>
  </div>
</template>
