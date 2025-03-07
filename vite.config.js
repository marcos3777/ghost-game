import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    open: true,
    port: 3000
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three']
        }
      }
    }
  }
}); 