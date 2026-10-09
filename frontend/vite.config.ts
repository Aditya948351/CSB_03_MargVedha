import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://csb-03-margvedha.onrender.com',
        changeOrigin: true,
      }
    }
  }
})
