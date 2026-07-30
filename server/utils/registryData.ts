import type { RegistryItem } from '~~/shared/types/registry'

/**
 * Component Registry Data Source
 * Add your components here to expose them via the public API (/api/registry/[name].json)
 * and CLI tool (npx noirsito-ui add <name>).
 */
export const registryData: Record<string, RegistryItem> = {
  // Example component entry template:
  /*
  'my-component': {
    name: 'my-component',
    title: 'My Component',
    category: 'buttons',
    description: 'Description of your component',
    dependencies: ['clsx', 'tailwind-merge'],
    props: [
      { name: 'variant', type: 'string', default: "'default'", description: 'Variant theme' }
    ],
    files: [
      {
        path: 'components/ui/MyComponent.vue',
        type: 'registry:ui',
        content: `<script setup lang="ts">\n// Component code here\n<\/script>\n\n<template>\n  <div>My Component</div>\n</template>`
      }
    ]
  }
  */
}
