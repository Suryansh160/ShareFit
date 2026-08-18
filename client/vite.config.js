import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src')
    }
  },

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://sharefit.onrender.com',
        changeOrigin: true
      },
      '/socket.io': {
        target: 'https://sharefit.onrender.com',
        ws: true
      }
    }
  }
})
