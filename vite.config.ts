import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    include: ['pdfjs-dist/legacy/build/pdf', 'react', 'react-dom']
  },
  build: {
    commonjsOptions: {
      include: [/pdfjs-dist/, /node_modules/]
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'pdf-vendor': ['pdfjs-dist/legacy/build/pdf']
        }
      }
    }
  }
});