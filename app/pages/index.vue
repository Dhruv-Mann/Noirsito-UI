<script setup lang="ts">
import CliCopyBanner from '~/components/showcase/CliCopyBanner.vue'
</script>

<template>
  <div class="flex flex-col gap-20 py-12 lg:py-20 max-w-4xl mx-auto">
    <!-- Main Landing Hero (Athelas + Moara Golden Ratio Typography) -->
    <section class="flex flex-col items-center text-center gap-8">
      <!-- Minimalist Category Tag -->
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-deep/20 bg-teal-soft text-xs font-semibold text-teal-deep dark:text-mustard">
        <span class="w-1.5 h-1.5 rounded-full bg-teal-deep dark:bg-mustard" />
        <span>Open Source Vue 3 & Nuxt Component Registry</span>
      </div>

      <!-- Main Display Headline (Athelas Serif, Golden Ratio Scaled) -->
      <h1 class="text-golden-display font-serif font-semibold text-ink dark:text-paper max-w-3xl leading-tight">
        Minimalist components crafted with <span class="text-rust italic font-normal">mathematical precision.</span>
      </h1>

      <!-- Subtitle Description (Moara Sans Body, Golden Line Height 1.618) -->
      <p class="text-base sm:text-lg text-ink/75 dark:text-paper/75 max-w-2xl font-sans leading-golden">
        Noirsito is an open-source component registry designed for Vue 3 and Nuxt. Copy source code directly into your project or inject via CLI with zero technical debt and 100% code ownership.
      </p>

      <!-- Primary Action: Explore components button routing to /components -->
      <div class="flex flex-col sm:flex-row items-center gap-4 mt-2">
        <NuxtLink to="/components">
          <button
            type="button"
            class="px-8 py-3.5 rounded-xl text-sm font-semibold bg-rust hover:bg-rust-hover text-paper btn-tactile shadow-subtle-md flex items-center gap-2.5 outline-none"
          >
            <span>Explore components</span>
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </NuxtLink>

        <a
          href="https://github.com/Dhruv-Mann/noirsito-ui"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            type="button"
            class="px-7 py-3.5 rounded-xl text-sm font-semibold bg-paper-200 dark:bg-ink-800 text-ink dark:text-paper border border-ink-200/60 dark:border-paper-400/15 hover:border-rust btn-tactile flex items-center gap-2 outline-none"
          >
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub Repository</span>
          </button>
        </a>
      </div>

      <!-- Quick Terminal Command Banner -->
      <div class="w-full max-w-lg mt-2">
        <CliCopyBanner componentName="my-component" />
      </div>
    </section>

    <!-- Editorial Architecture Overview (Athelas Headings + Moara Body) -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-ink-200/50 dark:border-paper-400/10">
      <div class="minimal-card rounded-2xl p-6 flex flex-col gap-3">
        <div class="w-9 h-9 rounded-lg bg-rust-soft border border-rust/20 flex items-center justify-center text-rust">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-golden-h3 font-serif text-ink dark:text-paper font-semibold">100% Code Ownership</h3>
        <p class="text-xs text-ink/70 dark:text-paper/70 font-sans leading-golden">
          Components copy directly into your local directory (<code class="text-rust font-mono">@/components/ui/</code>) with zero third-party dependency locks.
        </p>
      </div>

      <div class="minimal-card rounded-2xl p-6 flex flex-col gap-3">
        <div class="w-9 h-9 rounded-lg bg-teal-soft border border-teal-deep/20 flex items-center justify-center text-teal-deep dark:text-mustard">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 class="text-golden-h3 font-serif text-ink dark:text-paper font-semibold">Subtle Micro-Interactions</h3>
        <p class="text-xs text-ink/70 dark:text-paper/70 font-sans leading-golden">
          Inspect tactile states, viewports, and light/dark theme backgrounds live on the main components showcase page.
        </p>
      </div>

      <div class="minimal-card rounded-2xl p-6 flex flex-col gap-3">
        <div class="w-9 h-9 rounded-lg bg-mustard-soft border border-mustard/30 flex items-center justify-center text-mustard">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <h3 class="text-golden-h3 font-serif text-ink dark:text-paper font-semibold">Public Registry API</h3>
        <p class="text-xs text-ink/70 dark:text-paper/70 font-sans leading-golden">
          Nitro API routes (<code class="text-teal-deep dark:text-mustard font-mono">/api/registry/[name].json</code>) serve raw file schemas for automated CLI injection.
        </p>
      </div>
    </section>

    <!-- Bottom Navigation Section -->
    <section class="flex flex-col items-center text-center p-8 rounded-2xl border border-ink-200/60 dark:border-paper-400/15 bg-paper-100/60 dark:bg-ink-900/40 gap-4">
      <h2 class="text-golden-h2 font-serif font-semibold text-ink dark:text-paper">
        Ready to explore the component catalog?
      </h2>
      <p class="text-xs text-ink/70 dark:text-paper/70 max-w-md font-sans">
        Browse categories, test interactive previews, and copy component source code directly.
      </p>
      <NuxtLink to="/components">
        <button
          type="button"
          class="px-7 py-3 rounded-xl text-xs font-semibold bg-rust hover:bg-rust-hover text-paper btn-tactile shadow-subtle-sm flex items-center gap-2 outline-none"
        >
          <span>Explore components</span>
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </NuxtLink>
    </section>
  </div>
</template>
