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
      title: 'Noirsito UI - Minimalist Vue 3 Component Registry',
      meta: [
        { name: 'description', content: 'Minimalist Vue 3 & Nuxt component registry built with Golden Ratio typography and direct local injection.' },
        { name: 'theme-color', content: '#14110F' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap' }
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
