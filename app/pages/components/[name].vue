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
    <div class="flex items-center gap-2 text-xs text-ink/60 dark:text-paper/60 font-mono">
      <NuxtLink to="/" class="hover:text-rust transition-colors">Home</NuxtLink>
      <span>/</span>
      <NuxtLink to="/components" class="hover:text-rust transition-colors">Components</NuxtLink>
      <span>/</span>
      <span class="text-rust font-semibold">{{ componentName }}</span>
    </div>

    <!-- Error State using Brick (#8C2F1D) -->
    <div v-if="error || !registryItem" class="p-8 rounded-2xl border border-brick/40 bg-brick-soft text-center flex flex-col items-center gap-4">
      <h2 class="text-xl font-bold text-brick">Component Not Found</h2>
      <p class="text-xs text-ink/70 dark:text-paper/70">
        The requested component "{{ componentName }}" has not been registered in server/utils/registryData.ts yet.
      </p>
      <NuxtLink to="/components">
        <button type="button" class="px-4 py-2 rounded-xl text-xs font-semibold bg-rust hover:bg-rust-hover text-paper shadow-sm">
          Back to Component Catalog
        </button>
      </NuxtLink>
    </div>

    <!-- Main Component Detail View -->
    <div v-else-if="registryItem" class="flex flex-col gap-8">
      <!-- Title Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ink-200/50 dark:border-paper-400/10 pb-6">
        <div class="flex flex-col gap-1.5">
          <div class="flex items-center gap-2">
            <h1 class="text-3xl font-extrabold tracking-tight text-ink dark:text-paper">
              {{ registryItem.title }}
            </h1>
            <span class="px-2.5 py-0.5 text-xs font-mono uppercase font-bold text-teal-deep dark:text-mustard bg-teal-soft/60 rounded-full border border-teal-deep/20">
              {{ registryItem.category }}
            </span>
          </div>
          <p class="text-sm text-ink/70 dark:text-paper/70 max-w-2xl leading-relaxed">
            {{ registryItem.description }}
          </p>
        </div>

        <NuxtLink to="/components">
          <button type="button" class="px-4 py-2 rounded-xl text-xs font-semibold bg-paper-200 dark:bg-ink-800 text-ink dark:text-paper border border-ink-200/60 dark:border-paper-400/15 hover:border-rust transition-colors">
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
        <div class="text-center text-xs text-ink/60 dark:text-paper/60 py-8">
          Component preview for <strong class="text-ink dark:text-paper">{{ registryItem.title }}</strong>
        </div>
      </ComponentPreview>

      <!-- Props Table -->
      <div v-if="registryItem.props && registryItem.props.length > 0" class="flex flex-col gap-3">
        <h3 class="text-lg font-bold text-ink dark:text-paper">Props & Specifications</h3>
        <div class="rounded-xl border border-ink-200/60 dark:border-paper-400/15 overflow-hidden bg-paper-100/80 dark:bg-ink-900/60">
          <table class="w-full text-left text-xs">
            <thead class="bg-paper-200/80 dark:bg-ink-950/80 border-b border-ink-200/50 dark:border-paper-400/10 text-ink/60 dark:text-paper/60 font-mono">
              <tr>
                <th class="p-3">Prop</th>
                <th class="p-3">Type</th>
                <th class="p-3">Default</th>
                <th class="p-3">Description</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-ink-200/40 dark:divide-paper-400/10 text-ink dark:text-paper">
              <tr v-for="prop in registryItem.props" :key="prop.name" class="hover:bg-paper-200/40 dark:hover:bg-ink-800/40">
                <td class="p-3 font-mono font-bold text-rust">{{ prop.name }}</td>
                <td class="p-3 font-mono text-teal-deep dark:text-mustard">{{ prop.type }}</td>
                <td class="p-3 font-mono text-ink/50 dark:text-paper/50">{{ prop.default || '-' }}</td>
                <td class="p-3 text-ink/80 dark:text-paper/80">{{ prop.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Dependencies -->
      <div v-if="registryItem.dependencies && registryItem.dependencies.length > 0" class="flex flex-col gap-2 p-4 rounded-xl border border-ink-200/50 dark:border-paper-400/10 bg-paper-100/40 dark:bg-ink-900/40">
        <span class="text-xs font-semibold text-ink dark:text-paper">Required Dependencies</span>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="dep in registryItem.dependencies"
            :key="dep"
            class="px-2.5 py-1 rounded-md text-xs font-mono bg-paper-300/50 dark:bg-ink-800/50 text-teal-deep dark:text-mustard border border-ink-200/40 dark:border-paper-400/10"
          >
            {{ dep }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
