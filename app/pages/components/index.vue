<script setup lang="ts">
import { useRegistry } from '~/composables/useRegistry'
import AppSidebar from '~/components/layout/AppSidebar.vue'

const { filteredComponents, searchQuery } = useRegistry()
</script>

<template>
  <div class="flex flex-col gap-8 py-6">
    <!-- Header -->
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink dark:text-paper">
        Component Catalog
      </h1>
      <p class="text-sm text-ink/70 dark:text-paper/70 max-w-2xl leading-relaxed">
        Browse your custom Vue 3 component registry. Select a component card to preview micro-interactions, view props specifications, and fetch CLI installation commands.
      </p>
    </div>

    <!-- Layout with Sidebar -->
    <div class="flex flex-col lg:flex-row gap-8">
      <AppSidebar />

      <div class="flex-1 flex flex-col gap-6">
        <!-- Search & Filter bar -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-ink-200/60 dark:border-paper-400/15 bg-paper-100/80 dark:bg-ink-900/60">
          <div class="relative w-full sm:w-96">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search components by keyword or tag..."
              class="w-full bg-paper dark:bg-ink border border-ink-200/60 dark:border-paper-400/20 text-xs text-ink dark:text-paper placeholder:text-ink/40 dark:placeholder:text-paper/40 rounded-xl px-4 py-2.5 outline-none focus:border-rust"
            />
          </div>
          <span class="text-xs font-mono text-ink/60 dark:text-paper/60">
            Total Available: <strong class="text-ink dark:text-paper">{{ filteredComponents.length }}</strong>
          </span>
        </div>

        <!-- Empty State -->
        <div v-if="filteredComponents.length === 0" class="p-12 rounded-2xl border border-dashed border-ink-200/80 dark:border-paper-400/20 bg-paper-100/40 dark:bg-ink-900/40 text-center flex flex-col items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-rust-soft border border-rust/30 flex items-center justify-center text-rust">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 01-2-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div class="flex flex-col gap-1">
            <h3 class="text-lg font-bold text-ink dark:text-paper">No Components Found</h3>
            <p class="text-xs text-ink/60 dark:text-paper/60 max-w-md mx-auto leading-relaxed">
              No components have been registered yet. Add component files into <code class="text-rust font-mono">app/components/ui/</code> and define them in <code class="text-rust font-mono">server/utils/registryData.ts</code>.
            </p>
          </div>
        </div>

        <!-- Component Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NuxtLink
            v-for="comp in filteredComponents"
            :key="comp.name"
            :to="`/components/${comp.name}`"
            class="group"
          >
            <div class="minimal-card h-full flex flex-col justify-between p-6 rounded-2xl">
              <div class="flex flex-col gap-2">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 text-[10px] font-mono uppercase font-bold text-teal-deep dark:text-mustard bg-teal-soft/60 rounded border border-teal-deep/20">
                    {{ comp.category }}
                  </span>
                  <span v-if="comp.isNew" class="px-2 py-0.5 text-[10px] font-bold text-rust bg-rust-soft rounded-full border border-rust/20">NEW</span>
                </div>
                <h3 class="text-base font-bold text-ink dark:text-paper group-hover:text-rust transition-colors flex items-center justify-between">
                  <span>{{ comp.title }}</span>
                  <svg class="w-4 h-4 text-ink/40 dark:text-paper/40 group-hover:text-rust group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </h3>
                <p class="text-xs text-ink/60 dark:text-paper/60 line-clamp-2 leading-relaxed">
                  {{ comp.description }}
                </p>
              </div>

              <div class="flex flex-wrap gap-1.5 pt-4">
                <span
                  v-for="tag in comp.tags"
                  :key="tag"
                  class="px-2 py-0.5 rounded text-[10px] font-mono text-ink/60 dark:text-paper/60 bg-paper-300/50 dark:bg-ink-800/50"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
