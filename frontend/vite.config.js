import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  
  define: {
    global: 'globalThis',
  },

  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },

  server: {
    port: 3000,
    open: true,
    host: true
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor'
            }
            if (id.includes('lucide-react')) {
              return 'ui-vendor'
            }
            if (id.includes('@react-pdf/renderer')) {
              return 'pdf-vendor'
            }
          }
        }
      }
    }
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react', 'buffer', 'qrcode'],
  }
})