<script setup lang="ts">
import { computed } from 'vue'
import { useCopy } from '~/composables/useCopy'

interface Props {
  code: string
  language?: string
  filename?: string
}

const props = withDefaults(defineProps<Props>(), {
  language: 'vue',
  filename: ''
})

const { copied, copyToClipboard } = useCopy()

const lines = computed(() => {
  return props.code.trim().split('\n')
})

function handleCopy() {
  copyToClipboard(props.code)
}
</script>

<template>
  <div class="relative group rounded-xl border border-white/10 bg-obsidian-950 overflow-hidden font-mono text-xs text-obsidian-200">
    <!-- Code Header Bar -->
    <div class="flex items-center justify-between px-4 py-2.5 bg-obsidian-900/90 border-b border-white/5 select-none">
      <div class="flex items-center gap-2">
        <span class="inline-block w-2.5 h-2.5 rounded-full bg-rose-500/80" />
        <span class="inline-block w-2.5 h-2.5 rounded-full bg-amber-500/80" />
        <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        <span v-if="filename" class="ml-2 text-obsidian-400 text-xs font-sans font-medium">
          {{ filename }}
        </span>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-sans font-medium bg-white/5 hover:bg-white/10 text-obsidian-300 hover:text-white transition-all outline-none"
        @click="handleCopy"
      >
        <svg v-if="copied" class="w-3.5 h-3.5 text-emerald-400 animate-scale-in" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <span>{{ copied ? 'Copied!' : 'Copy Code' }}</span>
      </button>
    </div>

    <!-- Code Block Body with Line Numbers -->
    <div class="overflow-x-auto p-4 max-h-[500px] leading-relaxed">
      <table class="w-full border-collapse">
        <tbody>
          <tr v-for="(line, idx) in lines" :key="idx" class="hover:bg-white/[0.02]">
            <td class="pr-4 text-right select-none text-obsidian-600 w-8 font-mono text-[11px] align-top">
              {{ idx + 1 }}
            </td>
            <td class="whitespace-pre font-mono text-[13px] text-obsidian-200">
              {{ line }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
