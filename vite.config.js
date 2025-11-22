import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2015',
    cssTarget: 'chrome61'
  },
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
  },
})
