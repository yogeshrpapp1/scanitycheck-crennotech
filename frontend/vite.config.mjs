import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '^/(api|hangfire|swagger)': {
        target: 'http://api:8080', 
        changeOrigin: true,
        secure: false,
      }
    }
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.mjs',
  },

  resolve: {
    tsconfigPaths: true,
  },
});
