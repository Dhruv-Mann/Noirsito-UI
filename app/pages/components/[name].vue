<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ComponentPreview from '~/components/showcase/ComponentPreview.vue'
import CliCopyBanner from '~/components/showcase/CliCopyBanner.vue'
import { useRegistry } from '~/composables/useRegistry'
import type { RegistryItem } from '~~/shared/types/registry'

const route = useRoute()
const componentName = computed(() => route.params.name as string)

const { getComponentByName } = useRegistry()

const meta = computed(() => getComponentByName(componentName.value))

// Fetch detailed payload from Nitro Server API
const { data: registryItem, pending, error } = await useFetch<RegistryItem>(`/api/registry/${componentName.value}`)
</script>

<template>
  <div class="flex flex-col gap-8 py-6">
    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 text-xs text-obsidian-400 font-mono">
      <NuxtLink to="/" class="hover:text-white transition-colors">Home</NuxtLink>
      <span>/</span>
      <NuxtLink to="/components" class="hover:text-white transition-colors">Components</NuxtLink>
      <span>/</span>
      <span class="text-indigo-400 font-semibold">{{ componentName }}</span>
    </div>

    <!-- Error State -->
    <div v-if="error || !registryItem" class="p-8 rounded-2xl border border-rose-500/30 bg-rose-950/20 text-center flex flex-col items-center gap-4">
      <h2 class="text-xl font-bold text-rose-300">Component Not Found</h2>
      <p class="text-xs text-obsidian-400">
        The requested component "{{ componentName }}" has not been registered in server/utils/registryData.ts yet.
      </p>
      <NuxtLink to="/components">
        <button type="button" class="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow">
          Back to Component Catalog
        </button>
      </NuxtLink>
    </div>

    <!-- Main Component Detail View -->
    <div v-else-if="registryItem" class="flex flex-col gap-8">
      <!-- Title Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div class="flex flex-col gap-1.5">
          <div class="flex items-center gap-2">
            <h1 class="text-3xl font-extrabold tracking-tight text-white">
              {{ registryItem.title }}
            </h1>
            <span class="px-2.5 py-0.5 text-xs font-mono uppercase font-bold text-indigo-400 bg-indigo-500/10 rounded-full border border-indigo-500/20">
              {{ registryItem.category }}
            </span>
          </div>
          <p class="text-sm text-obsidian-400 max-w-2xl leading-relaxed">
            {{ registryItem.description }}
          </p>
        </div>

        <NuxtLink to="/components">
          <button type="button" class="px-4 py-2 rounded-xl text-xs font-semibold bg-obsidian-800 text-obsidian-200 border border-white/10 hover:border-white/20">
            All Components
          </button>
        </NuxtLink>
      </div>

      <!-- CLI Install Command Banner -->
      <CliCopyBanner :componentName="registryItem.name" />

      <!-- Interactive Component Live Demo Preview -->
      <ComponentPreview
        :title="`${registryItem.title} Code & Source`"
        description="Interactive render canvas and raw code viewer."
        :code="registryItem.files[0]?.content || ''"
        :componentName="registryItem.name"
      >
        <div class="text-center text-xs text-obsidian-400 py-8">
          Component preview for <strong class="text-white">{{ registryItem.title }}</strong>
        </div>
      </ComponentPreview>

      <!-- Props Table -->
      <div v-if="registryItem.props && registryItem.props.length > 0" class="flex flex-col gap-3">
        <h3 class="text-lg font-bold text-white">Props & Specifications</h3>
        <div class="rounded-xl border border-white/10 overflow-hidden bg-obsidian-900/60">
          <table class="w-full text-left text-xs">
            <thead class="bg-obsidian-950/80 border-b border-white/10 text-obsidian-400 font-mono">
              <tr>
                <th class="p-3">Prop</th>
                <th class="p-3">Type</th>
                <th class="p-3">Default</th>
                <th class="p-3">Description</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 text-obsidian-200">
              <tr v-for="prop in registryItem.props" :key="prop.name" class="hover:bg-white/[0.02]">
                <td class="p-3 font-mono font-bold text-indigo-400">{{ prop.name }}</td>
                <td class="p-3 font-mono text-cyan-300">{{ prop.type }}</td>
                <td class="p-3 font-mono text-obsidian-400">{{ prop.default || '-' }}</td>
                <td class="p-3 text-obsidian-300">{{ prop.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Dependencies -->
      <div v-if="registryItem.dependencies && registryItem.dependencies.length > 0" class="flex flex-col gap-2 p-4 rounded-xl border border-white/5 bg-obsidian-900/40">
        <span class="text-xs font-semibold text-white">Required Dependencies</span>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="dep in registryItem.dependencies"
            :key="dep"
            class="px-2.5 py-1 rounded-md text-xs font-mono bg-white/5 text-indigo-300 border border-white/10"
          >
            {{ dep }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
