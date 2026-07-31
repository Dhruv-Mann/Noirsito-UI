<script setup lang="ts">
import { ref } from 'vue'
import CliCopyBanner from '~/components/showcase/CliCopyBanner.vue'

const interactiveActive = ref(false)
const interactiveCount = ref(0)

function handleTeaserClick() {
  interactiveActive.value = !interactiveActive.value
  interactiveCount.value++
}
</script>

<template>
  <div class="flex flex-col gap-20 py-12 lg:py-20 max-w-4xl mx-auto">
    <!-- Main Landing Hero (Athelas + Moara Golden Ratio Typography) -->
    <section class="flex flex-col items-center text-center gap-8">
      <!-- Minimalist Category Tag -->
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rust/30 dark:border-mustard/30 bg-rust-soft/80 dark:bg-ink-800 text-xs font-semibold text-rust dark:text-mustard">
        <span class="w-1.5 h-1.5 rounded-full bg-rust dark:bg-mustard" />
        <span>Vue 3 Primitives</span>
      </div>

      <!-- Main Display Headline (Athelas Serif, Golden Ratio Scaled) -->
      <h1 class="text-golden-display font-serif font-semibold text-ink dark:text-paper max-w-3xl leading-tight">
        Minimalist components crafted with <span class="text-rust italic font-normal">mathematical precision.</span>
      </h1>

      <!-- Subtitle Description (Moara Sans Body, Golden Line Height 1.618) -->
      <p class="text-base sm:text-lg text-ink/75 dark:text-paper/75 max-w-2xl font-sans leading-golden">
        <strong class="font-bold text-ink dark:text-paper">Noirsito.UI</strong> is an <span class="text-ink dark:text-paper font-medium">open-source component collection</span> designed for <span class="text-rust font-semibold">Vue 3 &amp; Nuxt</span>. Copy source code directly into your project or inject via <code class="text-rust dark:text-mustard font-mono font-medium px-1.5 py-0.5 rounded bg-rust-soft/80 dark:bg-ink-800 border border-rust/20 dark:border-mustard/20">CLI</code> with <span class="text-ink dark:text-paper font-semibold">zero technical debt</span> and <span class="text-rust font-semibold">100% code ownership</span>.
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

      <!-- Live Interactive Micro-Preview Teaser Widget -->
      <div class="w-full max-w-lg mt-2 p-4 rounded-xl border border-ink-200/50 dark:border-paper-400/10 bg-paper-100/40 dark:bg-ink-900/40 backdrop-blur-sm flex flex-col items-center gap-3">
        <div class="flex items-center justify-between w-full text-[11px] font-mono text-ink/60 dark:text-paper/60">
          <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-teal-deep dark:bg-mustard animate-pulse" />
            Interactive Micro-Teaser
          </span>
          <span class="text-rust">Click counter: {{ interactiveCount }}</span>
        </div>

        <button
          type="button"
          class="w-full py-2.5 px-4 rounded-lg text-xs font-semibold btn-tactile flex items-center justify-between transition-all select-none"
          :class="interactiveActive ? 'bg-teal-deep text-paper shadow-sm' : 'bg-paper-200 dark:bg-ink-800 text-ink dark:text-paper border border-ink-200/60 dark:border-paper-400/15'"
          @click="handleTeaserClick"
        >
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-rust" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <span>{{ interactiveActive ? 'Tactile State Active' : 'Test Micro-Interaction Feedback' }}</span>
          </div>
          <span class="px-2 py-0.5 text-[10px] font-mono rounded bg-paper/20 text-current font-bold">
            {{ interactiveActive ? 'ACTIVE' : 'IDLE' }}
          </span>
        </button>
      </div>
    </section>

    <!-- Editorial Cardless Breakdown Section (Golden Ratio Numbering & Athelas Typography) -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-10 py-10 border-y border-ink-200/60 dark:border-paper-400/15">
      <div class="flex flex-col gap-2.5">
        <span class="font-mono text-xs font-semibold text-rust tracking-wider">01 / OWNERSHIP</span>
        <h3 class="text-golden-h3 font-serif text-ink dark:text-paper font-semibold">100% Code Ownership</h3>
        <p class="text-xs text-ink/75 dark:text-paper/75 font-sans leading-golden">
          Components copy directly into your local directory (<code class="text-rust font-mono font-medium">@/components/ui/</code>) with zero third-party dependency locks or breaking npm updates.
        </p>
      </div>

      <div class="flex flex-col gap-2.5">
        <span class="font-mono text-xs font-semibold text-teal-deep dark:text-mustard tracking-wider">02 / INTERACTION</span>
        <h3 class="text-golden-h3 font-serif text-ink dark:text-paper font-semibold">Subtle Micro-Interactions</h3>
        <p class="text-xs text-ink/75 dark:text-paper/75 font-sans leading-golden">
          Inspect tactile states, viewports, and light/dark theme backgrounds live on the main components page.
        </p>
      </div>

      <div class="flex flex-col gap-2.5">
        <span class="font-mono text-xs font-semibold text-mustard dark:text-rust tracking-wider">03 / INJECTION</span>
        <h3 class="text-golden-h3 font-serif text-ink dark:text-paper font-semibold">Public API & CLI</h3>
        <p class="text-xs text-ink/75 dark:text-paper/75 font-sans leading-golden">
          Nitro API routes (<code class="text-teal-deep dark:text-mustard font-mono font-medium">/api/registry/[name].json</code>) serve raw file schemas for automated CLI injection.
        </p>
      </div>
    </section>

    <!-- Bottom Navigation Section -->
    <section class="flex flex-col items-center text-center p-8 rounded-2xl border border-ink-200/60 dark:border-paper-400/15 bg-paper-100/60 dark:bg-ink-900/40 gap-4">
      <h2 class="text-golden-h2 font-serif font-semibold text-ink dark:text-paper">
        Ready to explore components?
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
