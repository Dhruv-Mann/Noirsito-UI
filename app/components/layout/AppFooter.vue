<template>
  <footer class="mt-20 border-t border-white/10 bg-obsidian-950/80 py-12 text-obsidian-400 text-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="flex flex-col gap-1 text-center md:text-left">
        <span class="font-bold text-white text-sm">
          Noirsito<span class="text-indigo-400">.UI</span> Component Registry
        </span>
        <p class="text-obsidian-400">
          Open-source developer showcase and CLI component registry built for Vue 3 & Nuxt.
        </p>
      </div>

      <div class="flex items-center gap-6 text-obsidian-400">
        <NuxtLink to="/components" class="hover:text-white transition-colors">Components</NuxtLink>
        <a href="https://github.com/Dhruv-Mann/noirsito-ui" target="_blank" class="hover:text-white transition-colors">GitHub</a>
        <a href="https://twitter.com" target="_blank" class="hover:text-white transition-colors">Twitter</a>
      </div>

      <div class="text-obsidian-500 font-mono text-[11px]">
        Released under MIT License.
      </div>
    </div>
  </footer>
</template>
