<script setup lang="ts">
import { computed } from 'vue'
import { useCopy } from '~/composables/useCopy'

interface Props {
  componentName?: string
}

const props = withDefaults(defineProps<Props>(), {
  componentName: 'glowing-button'
})

const { copied, copyToClipboard } = useCopy()

const cliCommand = computed(() => {
  return `npx noir-ui add ${props.componentName}`
})

function handleCopy() {
  copyToClipboard(cliCommand.value)
}
</script>

<template>
  <div class="relative group flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 px-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 backdrop-blur-md shadow-lg shadow-indigo-950/20">
    <div class="flex items-center gap-3 w-full sm:w-auto">
      <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 font-mono text-sm font-bold flex-shrink-0">
        &gt;_
      </div>
      <div class="flex flex-col">
        <span class="text-[11px] font-semibold uppercase tracking-wider text-indigo-300">Quick CLI Install</span>
        <code class="font-mono text-xs text-white tracking-wide">
          {{ cliCommand }}
        </code>
      </div>
    </div>

    <button
      type="button"
      class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow transition-all outline-none active:scale-95 w-full sm:w-auto flex-shrink-0"
      @click="handleCopy"
    >
      <svg v-if="copied" class="w-3.5 h-3.5 text-emerald-300 animate-scale-in" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      <span>{{ copied ? 'Command Copied!' : 'Copy Command' }}</span>
    </button>
  </div>
</template>
