<script setup lang="ts">
import { ref, computed } from 'vue'
import CodeViewer from './CodeViewer.vue'
import { useCopy } from '~/composables/useCopy'
import { cn } from '~/utils/cn'

interface Props {
  title?: string
  description?: string
  code: string
  componentName?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  componentName: ''
})

const activeTab = ref<'preview' | 'code'>('preview')
const viewportSize = ref<'desktop' | 'tablet' | 'mobile'>('desktop')
const previewTheme = ref<'dark' | 'paper'>('paper')
const resetKey = ref(0)

const { copied, copyToClipboard } = useCopy()

const viewportWidthClass = computed(() => {
  switch (viewportSize.value) {
    case 'mobile': return 'max-w-[375px]'
    case 'tablet': return 'max-w-[640px]'
    default: return 'w-full'
  }
})

function resetState() {
  resetKey.value++
}

function handleCopy() {
  copyToClipboard(props.code)
}
</script>

<template>
  <div class="flex flex-col gap-3 my-6 w-full">
    <!-- Component Title & Description Header -->
    <div v-if="title || description" class="flex flex-col gap-1">
      <h3 v-if="title" class="text-xl font-bold tracking-tight text-ink dark:text-paper flex items-center gap-2">
        {{ title }}
      </h3>
      <p v-if="description" class="text-xs text-ink/60 dark:text-paper/60">
        {{ description }}
      </p>
    </div>

    <!-- Interactive Component Preview Box Shell -->
    <div class="rounded-2xl border border-ink-200/60 dark:border-paper-400/15 bg-paper-100/80 dark:bg-ink-900/60 overflow-hidden shadow-subtle-md">
      <!-- Toolbar controls -->
      <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-paper-200/60 dark:bg-ink-950/80 border-b border-ink-200/50 dark:border-paper-400/10 select-none">
        <!-- Left: Preview vs Code Tab Switcher -->
        <div class="flex items-center gap-1 rounded-lg bg-paper-300/60 dark:bg-ink-800 p-1 border border-ink-200/40 dark:border-paper-400/15">
          <button
            type="button"
            :class="cn(
              'px-3 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 btn-tactile',
              activeTab === 'preview' ? 'bg-rust text-paper shadow-sm' : 'text-ink/60 dark:text-paper/60 hover:text-ink dark:hover:text-paper'
            )"
            @click="activeTab = 'preview'"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview
          </button>

          <button
            type="button"
            :class="cn(
              'px-3 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 btn-tactile',
              activeTab === 'code' ? 'bg-rust text-paper shadow-sm' : 'text-ink/60 dark:text-paper/60 hover:text-ink dark:hover:text-paper'
            )"
            @click="activeTab = 'code'"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Code
          </button>
        </div>

        <!-- Middle: Viewport Resizer (Only visible in Preview tab) -->
        <div v-if="activeTab === 'preview'" class="hidden sm:flex items-center gap-1 rounded-lg bg-paper-300/60 dark:bg-ink-800 p-1 border border-ink-200/40 dark:border-paper-400/15">
          <button
            type="button"
            title="Desktop View"
            :class="cn(
              'p-1 rounded-md transition-colors btn-tactile',
              viewportSize === 'desktop' ? 'bg-paper dark:bg-ink text-rust' : 'text-ink/50 dark:text-paper/50 hover:text-ink dark:hover:text-paper'
            )"
            @click="viewportSize = 'desktop'"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            type="button"
            title="Tablet View"
            :class="cn(
              'p-1 rounded-md transition-colors btn-tactile',
              viewportSize === 'tablet' ? 'bg-paper dark:bg-ink text-rust' : 'text-ink/50 dark:text-paper/50 hover:text-ink dark:hover:text-paper'
            )"
            @click="viewportSize = 'tablet'"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            type="button"
            title="Mobile View"
            :class="cn(
              'p-1 rounded-md transition-colors btn-tactile',
              viewportSize === 'mobile' ? 'bg-paper dark:bg-ink text-rust' : 'text-ink/50 dark:text-paper/50 hover:text-ink dark:hover:text-paper'
            )"
            @click="viewportSize = 'mobile'"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        <!-- Right Controls: Light/Dark canvas toggle, Reset State, Copy Code -->
        <div class="flex items-center gap-2">
          <!-- Canvas Theme Switcher -->
          <button
            v-if="activeTab === 'preview'"
            type="button"
            title="Toggle Paper / Dark Background"
            class="p-1.5 rounded-lg text-ink/60 dark:text-paper/60 hover:text-rust bg-paper-300/50 dark:bg-ink-800/50 transition-colors btn-tactile"
            @click="previewTheme = previewTheme === 'dark' ? 'paper' : 'dark'"
          >
            <svg v-if="previewTheme === 'dark'" class="w-3.5 h-3.5 text-mustard" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else class="w-3.5 h-3.5 text-teal-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <!-- Reset Canvas State -->
          <button
            v-if="activeTab === 'preview'"
            type="button"
            title="Reset State"
            class="p-1.5 rounded-lg text-ink/60 dark:text-paper/60 hover:text-rust bg-paper-300/50 dark:bg-ink-800/50 transition-colors btn-tactile"
            @click="resetState"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          <!-- Copy Component Code -->
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rust hover:bg-rust-hover text-paper shadow-sm transition-all outline-none btn-tactile"
            @click="handleCopy"
          >
            <svg v-if="copied" class="w-3.5 h-3.5 text-paper" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>{{ copied ? 'Copied' : 'Copy Code' }}</span>
          </button>
        </div>
      </div>

      <!-- Main Canvas / Code Tab Content -->
      <div class="relative min-h-[300px] flex items-center justify-center p-4 transition-all duration-200 overflow-hidden">
        <!-- Preview Tab -->
        <div
          v-if="activeTab === 'preview'"
          :key="resetKey"
          :class="cn(
            'w-full flex items-center justify-center p-4 rounded-xl min-h-[460px] h-[540px] max-h-[600px] transition-all duration-200 border relative overflow-hidden isolate transform-gpu',
            previewTheme === 'dark'
              ? 'bg-ink border-white/10 text-paper'
              : 'bg-paper border-ink-200/60 text-ink shadow-inner',
            viewportWidthClass
          )"
          style="contain: paint layout; overscroll-behavior: contain; transform: translateZ(0);"
        >
          <slot />
        </div>

        <!-- Code Viewer Tab -->
        <div v-else class="w-full">
          <CodeViewer :code="code" :filename="componentName ? `${componentName}.vue` : ''" />
        </div>
      </div>
    </div>
  </div>
</template>
