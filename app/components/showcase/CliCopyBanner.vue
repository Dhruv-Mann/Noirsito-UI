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
  <div class="relative group flex flex-col sm:flex-row items-center justify-between gap-3 p-3 px-4 rounded-xl border border-rust/30 bg-rust-soft/50 dark:bg-rust-soft/20 backdrop-blur-md shadow-subtle-sm">
    <div class="flex items-center gap-3 w-full sm:w-auto">
      <div class="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-deep text-paper font-mono text-xs font-bold flex-shrink-0 shadow-sm">
        &gt;_
      </div>
      <div class="flex flex-col">
        <span class="text-[10px] font-bold uppercase tracking-wider text-teal-deep dark:text-mustard">CLI Command</span>
        <code class="font-mono text-xs text-ink dark:text-paper font-medium tracking-wide">
          {{ cliCommand }}
        </code>
      </div>
    </div>

    <button
      type="button"
      class="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rust hover:bg-rust-hover text-paper shadow-sm transition-all outline-none active:scale-95 w-full sm:w-auto flex-shrink-0"
      @click="handleCopy"
    >
      <svg v-if="copied" class="w-3.5 h-3.5 text-paper" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      <span>{{ copied ? 'Command Copied' : 'Copy Command' }}</span>
    </button>
  </div>
</template>
