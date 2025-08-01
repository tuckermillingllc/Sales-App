// https://nuxt.com/docs/api/configuration/nuxt-config
// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-08-01',
  modules: [
    '@nuxt/ui',
    '@vite-pwa/nuxt'
  ],
  devtools: { enabled: true },
  fonts: {
    providers: {
      fontsource: false,
      fontshare: false
    }
  },
  ui: {
    icons: ['heroicons']
  },
  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    client: {
      installPrompt: true
    },
    manifest: {
      name: 'Tucker Milling Sales Portal',
      short_name: 'Tucker Sales',
      description: 'Sales analytics and customer management for Tucker Milling',
      theme_color: '#3b82f6',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: 'icon-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'icon-512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  },
  css: ['~/assets/css/main.css']
})