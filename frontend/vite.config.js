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
          // Vite's dynamic-import preload helper is needed by the entry; pin it to the
          // shared vendor chunk so it never drags a lazy library chunk into first load.
          if (id.includes('vite/preload-helper') || id.includes('vite/modulepreload-polyfill')) {
            return 'vendor';
          }
          if (id.includes('node_modules')) {
            if (id.includes('three')) {
              return 'vendor-three';
            }
            // Separate chunks: pdf.js (parsing) and pdf-lib (slicing) load independently, on demand
            if (id.includes('pdfjs-dist')) {
              return 'vendor-pdfjs';
            }
            if (id.includes('pdf-lib') || id.includes('@pdf-lib')) {
              return 'vendor-pdflib';
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            return 'vendor';
          }
          // IELTS data is intentionally NOT forced into one chunk: each
          // Cambridge book / test is code-split and downloaded on demand.
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
