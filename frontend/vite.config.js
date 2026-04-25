import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This only applies during 'npm run dev'
      '/api': {
        target: 'http://api:8080', 
        changeOrigin: true,
        secure: false,
      }
    }
  }
})