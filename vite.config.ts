import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        // Laisser Vite gérer automatiquement le code splitting
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Garder les console.log pour debug
        drop_debugger: true
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  optimizeDeps: {
    include: []
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});
