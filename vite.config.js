import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core (cached separately)
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Firebase SDK (cached separately — largest chunk)
          firebase: [
            'firebase/app',
            'firebase/firestore',
          ],
        },
      },
    },
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
    chunkSizeWarningLimit: 400,
  },
})
