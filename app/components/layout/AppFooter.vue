<template>
  <footer class="mt-20 border-t border-ink-200/50 dark:border-paper-400/10 bg-paper-100/60 dark:bg-ink-900/60 py-10 text-ink/60 dark:text-paper/60 text-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="flex flex-col gap-1 text-center md:text-left">
        <span class="font-bold text-ink dark:text-paper text-sm">
          Noirsito<span class="text-rust">.UI</span>
        </span>
        <p class="text-ink/60 dark:text-paper/60 text-xs">
          Open-source Vue 3 & Nuxt component distribution.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-6 font-medium text-ink/70 dark:text-paper/70">
        <NuxtLink to="/components" class="hover:text-rust dark:hover:text-mustard transition-colors">Components</NuxtLink>
        <a href="https://github.com/Dhruv-Mann/noirsito-ui" target="_blank" rel="noopener noreferrer" class="hover:text-rust dark:hover:text-mustard transition-colors">GitHub</a>
        <a href="https://x.com" target="_blank" rel="noopener noreferrer" class="hover:text-rust dark:hover:text-mustard transition-colors">Twitter</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="hover:text-rust dark:hover:text-mustard transition-colors">LinkedIn</a>
      </div>

      <div class="text-ink/40 dark:text-paper/40 font-mono text-[11px]">
        MIT Licensed. Paper & Ink Edition.
      </div>
    </div>
  </footer>
</template>
