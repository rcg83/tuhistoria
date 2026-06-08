import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'src': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    fs: {
      deny: ['Dockerfile'],
    },
    watch: {
      usePolling: true,
      interval: 100,
    },
    allowedHosts: [
      "tuhistoria.facespedes.com"
    ]
  },
})