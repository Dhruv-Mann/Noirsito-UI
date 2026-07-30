<script setup lang="ts">
import { useRegistry } from '~/composables/useRegistry'
import { cn } from '~/utils/cn'

const { categories, activeCategory } = useRegistry()
</script>

<template>
  <aside class="w-64 flex-shrink-0 hidden lg:block">
    <div class="sticky top-20 flex flex-col gap-6 p-4 rounded-xl border border-ink-200/60 dark:border-paper-400/20 bg-paper-100/70 dark:bg-ink-800/40 backdrop-blur-md shadow-subtle-sm">
      <div class="flex items-center justify-between px-1">
        <span class="text-[11px] font-bold tracking-wider text-ink/50 dark:text-paper/50 uppercase">Categories</span>
        <span class="px-2 py-0.5 text-[10px] font-mono font-semibold text-rust bg-rust-soft rounded-md border border-rust/20">
          CLI v1.0
        </span>
      </div>

      <!-- Categories List -->
      <nav class="flex flex-col gap-1">
        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          :class="cn(
            'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all outline-none text-left group',
            activeCategory === cat.id
              ? 'bg-rust text-paper shadow-sm'
              : 'text-ink/80 dark:text-paper/80 hover:text-ink dark:hover:text-paper hover:bg-paper-300/40 dark:hover:bg-ink-700/40'
          )"
          @click="activeCategory = cat.id as any"
        >
          <span>
            {{ cat.name }}
          </span>
          <span
            :class="cn(
              'px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold transition-colors',
              activeCategory === cat.id 
                ? 'bg-paper/20 text-paper' 
                : 'bg-paper-300/60 dark:bg-ink-700/60 text-ink/60 dark:text-paper/60'
            )"
          >
            {{ cat.count }}
          </span>
        </button>
      </nav>

      <!-- Registry Information Callout -->
      <div class="p-3.5 rounded-lg border border-ink-200/50 dark:border-paper-400/15 bg-paper-200/60 dark:bg-ink-900/60 flex flex-col gap-1.5">
        <span class="text-xs font-semibold text-ink dark:text-paper">
          Direct Local Injection
        </span>
        <p class="text-[11px] text-ink/60 dark:text-paper/60 leading-relaxed">
          Zero heavy node_modules payload. Copy raw source directly into <code class="text-rust font-mono font-medium">@/components/ui/</code>.
        </p>
      </div>
    </div>
  </aside>
</template>
