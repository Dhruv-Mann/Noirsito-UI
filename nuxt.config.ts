// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-07-28',
  future: {
    compatibilityVersion: 4
  },
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  css: [
    '~/assets/css/main.css'
  ],

  app: {
    head: {
      title: 'Noirsito UI - Modern Vue 3 Component Registry & Showcase',
      meta: [
        { name: 'description', content: 'Sleek, high-craft Vue 3 & Tailwind CSS component registry with micro-interactions and instant CLI code copying.' },
        { name: 'theme-color', content: '#09090b' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap' }
      ]
    }
  },

  tailwindcss: {
    exposeConfig: true,
    viewer: false
  },

  typescript: {
    strict: true
  }
})
