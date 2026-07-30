<script setup lang="ts">
import { useRegistry } from '~/composables/useRegistry'
import { cn } from '~/utils/cn'

const { categories, activeCategory } = useRegistry()
</script>

<template>
  <aside class="w-64 flex-shrink-0 hidden lg:block">
    <div class="sticky top-20 flex flex-col gap-6 p-4 rounded-2xl border border-white/10 bg-obsidian-900/60 backdrop-blur-md">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold tracking-wider text-obsidian-400 uppercase">Categories</span>
        <span class="px-2 py-0.5 text-[10px] font-mono text-indigo-400 bg-indigo-500/10 rounded-full border border-indigo-500/20">
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
            'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all outline-none text-left group',
            activeCategory === cat.id
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
              : 'text-obsidian-400 hover:text-white hover:bg-white/5 border border-transparent'
          )"
          @click="activeCategory = cat.id as any"
        >
          <span class="group-hover:translate-x-0.5 transition-transform duration-200">
            {{ cat.name }}
          </span>
          <span
            :class="cn(
              'px-2 py-0.5 rounded-full text-[10px] font-mono font-bold',
              activeCategory === cat.id ? 'bg-indigo-500/30 text-indigo-200' : 'bg-obsidian-800 text-obsidian-400'
            )"
          >
            {{ cat.count }}
          </span>
        </button>
      </nav>

      <!-- Registry Information Callout -->
      <div class="p-3.5 rounded-xl border border-white/5 bg-obsidian-950/80 flex flex-col gap-2">
        <span class="text-xs font-semibold text-white flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Direct Injection
        </span>
        <p class="text-[11px] text-obsidian-400 leading-relaxed">
          No heavy node_modules payload. Components copy directly into your local <code class="text-indigo-300 font-mono">@/components/ui/</code> directory.
        </p>
      </div>
    </div>
  </aside>
</template>
