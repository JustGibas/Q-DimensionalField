import { defineConfig } from 'vite';
import wasm from "vite-plugin-wasm";

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': '/apps/frontend/src',
    },
  },
  plugins: [
    wasm()
  ],
});
