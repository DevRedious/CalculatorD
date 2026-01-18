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
      }
    },
    minify: 'esbuild',
    target: 'es2020'
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
