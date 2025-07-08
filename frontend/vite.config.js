// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'



// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


// vite.config.js
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
// import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

// export default defineConfig({
//   plugins: [react()],
//   optimizeDeps: {
//     esbuildOptions: {
//       define: {
//         global: 'globalThis'  //  Fixes the `global is not defined` error
//       },
//       plugins: [
//         NodeGlobalsPolyfillPlugin({
//           buffer: true,
//           process: true,
//         }),
//       ],
//     },
//   },
//   build: {
//     rollupOptions: {
//       plugins: [
//         rollupNodePolyFill()  //  Adds polyfills for `crypto`, `buffer`, etc.
//       ],
//     },
//   },
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      util: 'rollup-plugin-node-polyfills/polyfills/util',
      events: 'rollup-plugin-node-polyfills/polyfills/events',
      stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
      process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis', // Fixes the `global is not defined` error
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
      ],
    },
    include: ['util', 'events', 'buffer', 'process'], //Added to prevent externalization errors
  },
  build: {
    rollupOptions: {
      plugins: [
        rollupNodePolyFill(), // Adds polyfills for `crypto`, `buffer`, etc.
      ],
    },
  },
});

