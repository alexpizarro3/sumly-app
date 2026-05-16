import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['sumly_icon.png'],
      manifest: {
        name: 'Sumly',
        short_name: 'Sumly',
        description: 'Calculadora inteligente y gestor de gastos.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [
          {
            src: 'sumly_icon.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'sumly_icon.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
