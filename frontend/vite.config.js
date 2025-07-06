// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'



// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'  // 👈 Fixes the `global is not defined` error
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
      ],
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        rollupNodePolyFill()  // 👈 Adds polyfills for `crypto`, `buffer`, etc.
      ],
    },
  },
});
