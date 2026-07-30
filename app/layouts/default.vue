<script setup lang="ts">
import AppHeader from '~/components/layout/AppHeader.vue'
import AppFooter from '~/components/layout/AppFooter.vue'
</script>

<template>
  <div class="min-h-screen bg-obsidian-950 text-obsidian-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
    <AppHeader />
    <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
