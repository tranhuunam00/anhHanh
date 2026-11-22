import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'oxc',
    cssMinify: true,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) {
              return 'vendor-three';
            }
            if (id.includes('pdfjs-dist') || id.includes('pdf-lib')) {
              return 'vendor-pdf';
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            return 'vendor';
          }
          if (id.includes('/data/ielts/')) {
            return 'data-ielts';
          }
        }
      }
    }
  },
  server: {
    port: 5101,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5100',
        changeOrigin: true,
      },
      '/audio': {
        target: 'http://127.0.0.1:5100',
        changeOrigin: true,
      }
    }
  }
})
