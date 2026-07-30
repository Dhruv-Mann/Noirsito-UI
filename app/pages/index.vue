<script setup lang="ts">
import CliCopyBanner from '~/components/showcase/CliCopyBanner.vue'
import AppSidebar from '~/components/layout/AppSidebar.vue'
import { useRegistry } from '~/composables/useRegistry'

const { filteredComponents, activeCategory, searchQuery, registryItems } = useRegistry()
</script>

<template>
  <div class="flex flex-col gap-16">
    <!-- Hero Section -->
    <section class="relative py-12 lg:py-20 flex flex-col items-center text-center gap-6 overflow-hidden">
      <!-- Ambient Background Glow Spheres -->
      <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />

      <!-- Top Status Pill -->
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-semibold text-indigo-300">
        <span class="relative flex h-2 w-2">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span>Noirsito-UI Registry Ready</span>
      </div>

      <!-- Main Headline -->
      <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1] text-white">
        Your Custom Vue 3
        <span class="inline-block bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-[shineSweep_4s_linear_infinite]">
          Component Registry
        </span>
      </h1>

      <!-- Subtitle -->
      <p class="text-base sm:text-lg text-obsidian-400 max-w-2xl leading-relaxed">
        A developer-first component showcase platform built for Vue 3 & Nuxt 4. Publish, preview micro-interactions live, and let developers copy component code into their projects.
      </p>

      <!-- CTA Buttons & Quick Install -->
      <div class="flex flex-col sm:flex-row items-center gap-4 mt-2 w-full max-w-md justify-center">
        <NuxtLink to="/components" class="w-full sm:w-auto">
          <button
            type="button"
            class="w-full px-6 py-3 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-950/50 transition-all flex items-center justify-center gap-2 outline-none active:scale-95"
          >
            <span>Explore Components</span>
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </NuxtLink>

        <a href="https://github.com/Dhruv-Mann/noirsito-ui" target="_blank" class="w-full sm:w-auto">
          <button
            type="button"
            class="w-full px-6 py-3 rounded-xl text-sm font-semibold bg-obsidian-800/80 hover:bg-obsidian-700/80 text-obsidian-200 border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 outline-none active:scale-95"
          >
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>Star on GitHub</span>
          </button>
        </a>
      </div>

      <!-- Quick CLI Installation Banner -->
      <div class="w-full max-w-xl mt-4">
        <CliCopyBanner componentName="my-component" />
      </div>
    </section>

    <!-- Key Principles Grid -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="group relative overflow-hidden rounded-2xl border border-white/10 bg-obsidian-900/80 p-6 flex flex-col gap-3">
        <div class="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-white">100% Code Ownership</h3>
        <p class="text-xs text-obsidian-400 leading-relaxed">
          Components copy directly into local project paths (<code class="text-indigo-300">@/components/ui/</code>) with zero third-party lock-in.
        </p>
      </div>

      <div class="group relative overflow-hidden rounded-2xl border border-white/10 bg-obsidian-900/80 p-6 flex flex-col gap-3">
        <div class="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-white">Live Micro-Interactions</h3>
        <p class="text-xs text-obsidian-400 leading-relaxed">
          Showcase components live with dark & light theme background testing, responsive viewports, and interactive state triggers.
        </p>
      </div>

      <div class="group relative overflow-hidden rounded-2xl border border-white/10 bg-obsidian-900/80 p-6 flex flex-col gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-white">Public Registry API</h3>
        <p class="text-xs text-obsidian-400 leading-relaxed">
          Nitro API server routes (<code class="text-emerald-300">/api/registry/[name].json</code>) serve raw files for CLI injection.
        </p>
      </div>
    </section>

    <!-- Component Registry Section -->
    <section class="flex flex-col lg:flex-row gap-8">
      <!-- Sidebar Filter -->
      <AppSidebar />

      <!-- Main Showcase List -->
      <div class="flex-1 flex flex-col gap-8">
        <!-- Search bar -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-white/10 bg-obsidian-900/60">
          <div class="relative w-full sm:w-80">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search components..."
              class="w-full bg-obsidian-950 border border-white/10 text-xs text-white placeholder-obsidian-500 rounded-xl px-3.5 py-2.5 outline-none focus:border-indigo-500"
            />
          </div>
          <div class="text-xs font-mono text-obsidian-400">
            Components: <span class="text-white font-bold">{{ filteredComponents.length }}</span>
          </div>
        </div>

        <!-- Empty State Prompt when user hasn't added components yet -->
        <div v-if="filteredComponents.length === 0" class="p-12 rounded-2xl border border-dashed border-white/15 bg-obsidian-900/40 text-center flex flex-col items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div class="flex flex-col gap-1">
            <h3 class="text-lg font-bold text-white">Registry Ready for Your Components</h3>
            <p class="text-xs text-obsidian-400 max-w-md mx-auto leading-relaxed">
              You can now add your custom Vue 3 components into <code class="text-indigo-300">app/components/ui/</code> and register their metadata in <code class="text-indigo-300">server/utils/registryData.ts</code> and <code class="text-indigo-300">app/composables/useRegistry.ts</code>.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
