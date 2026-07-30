<script setup lang="ts">
import CliCopyBanner from '~/components/showcase/CliCopyBanner.vue'
import AppSidebar from '~/components/layout/AppSidebar.vue'
import { useRegistry } from '~/composables/useRegistry'

const { filteredComponents, searchQuery } = useRegistry()
</script>

<template>
  <div class="flex flex-col gap-16">
    <!-- Hero Section: Apple Editorial Aesthetic -->
    <section class="relative py-14 lg:py-24 flex flex-col items-center text-center gap-6 overflow-hidden">
      <!-- Minimal Subtle Background Glow Accent -->
      <div class="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-rust-soft opacity-60 rounded-full blur-[100px] pointer-events-none" />

      <!-- Top Status Pill -->
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-deep/30 bg-teal-soft text-xs font-semibold text-teal-deep dark:text-paper">
        <span class="relative flex h-2 w-2">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-deep dark:bg-mustard opacity-75" />
          <span class="relative inline-flex h-2 w-2 rounded-full bg-teal-deep dark:bg-mustard" />
        </span>
        <span>Component Registry Standard</span>
      </div>

      <!-- Main Headline (Apple minimal headline - no text animations) -->
      <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.08] text-ink dark:text-paper">
        Vue 3 components built with <span class="text-rust">Apple-grade craft.</span>
      </h1>

      <!-- Subtitle -->
      <p class="text-base sm:text-lg text-ink/70 dark:text-paper/70 max-w-2xl leading-relaxed font-normal">
        A developer-first component registry & showcase. Inspect live micro-interactions, copy source code directly, or inject via CLI.
      </p>

      <!-- CTA Buttons & Quick Install -->
      <div class="flex flex-col sm:flex-row items-center gap-3.5 mt-2 w-full max-w-md justify-center">
        <NuxtLink to="/components" class="w-full sm:w-auto">
          <button
            type="button"
            class="w-full px-6 py-3 rounded-xl text-sm font-semibold bg-rust hover:bg-rust-hover text-paper shadow-apple-sm transition-all flex items-center justify-center gap-2 outline-none active:scale-95"
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
            class="w-full px-6 py-3 rounded-xl text-sm font-semibold bg-paper-200 dark:bg-ink-800 text-ink dark:text-paper border border-ink-200/60 dark:border-paper-400/15 hover:border-rust transition-all flex items-center justify-center gap-2 outline-none active:scale-95"
          >
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub Repository</span>
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
      <div class="apple-card rounded-2xl p-6 flex flex-col gap-3">
        <div class="w-10 h-10 rounded-xl bg-rust-soft border border-rust/20 flex items-center justify-center text-rust">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-base font-bold text-ink dark:text-paper">100% Code Ownership</h3>
        <p class="text-xs text-ink/70 dark:text-paper/70 leading-relaxed">
          Components copy directly into local project paths (<code class="text-rust font-mono font-medium">@/components/ui/</code>) with zero third-party dependency locks.
        </p>
      </div>

      <div class="apple-card rounded-2xl p-6 flex flex-col gap-3">
        <div class="w-10 h-10 rounded-xl bg-teal-soft border border-teal-deep/20 flex items-center justify-center text-teal-deep dark:text-mustard">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 class="text-base font-bold text-ink dark:text-paper">Live Micro-Interactions</h3>
        <p class="text-xs text-ink/70 dark:text-paper/70 leading-relaxed">
          Showcase components live with Paper & Ink dark/light canvas testing, responsive viewports, and clean state controls.
        </p>
      </div>

      <div class="apple-card rounded-2xl p-6 flex flex-col gap-3">
        <div class="w-10 h-10 rounded-xl bg-mustard-soft border border-mustard/30 flex items-center justify-center text-mustard">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <h3 class="text-base font-bold text-ink dark:text-paper">Public Registry API</h3>
        <p class="text-xs text-ink/70 dark:text-paper/70 leading-relaxed">
          Nitro API server routes (<code class="text-teal-deep dark:text-mustard font-mono font-medium">/api/registry/[name].json</code>) serve raw file schemas for CLI tools.
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
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-ink-200/60 dark:border-paper-400/15 bg-paper-100/80 dark:bg-ink-900/60">
          <div class="relative w-full sm:w-80">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search components..."
              class="w-full bg-paper dark:bg-ink border border-ink-200/60 dark:border-paper-400/20 text-xs text-ink dark:text-paper placeholder:text-ink/40 dark:placeholder:text-paper/40 rounded-xl px-3.5 py-2.5 outline-none focus:border-rust"
            />
          </div>
          <div class="text-xs font-mono text-ink/60 dark:text-paper/60">
            Components: <strong class="text-ink dark:text-paper">{{ filteredComponents.length }}</strong>
          </div>
        </div>

        <!-- Empty State Prompt when user hasn't added components yet -->
        <div v-if="filteredComponents.length === 0" class="p-12 rounded-2xl border border-dashed border-ink-200/80 dark:border-paper-400/20 bg-paper-100/40 dark:bg-ink-900/40 text-center flex flex-col items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-rust-soft border border-rust/30 flex items-center justify-center text-rust">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div class="flex flex-col gap-1">
            <h3 class="text-lg font-bold text-ink dark:text-paper">Registry Ready for Components</h3>
            <p class="text-xs text-ink/60 dark:text-paper/60 max-w-md mx-auto leading-relaxed">
              Add your custom Vue 3 components into <code class="text-rust font-mono">app/components/ui/</code> and register metadata in <code class="text-rust font-mono">server/utils/registryData.ts</code>.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
