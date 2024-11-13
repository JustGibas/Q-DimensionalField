/**
 * This file contains the configuration options for the Vite build tool.
 * It includes server settings, build options, module resolution, and more.
 * Each configuration option is explained in detail to help students understand its purpose.
 */

import { defineConfig } from 'vite';
import wasm from "vite-plugin-wasm";

export default defineConfig({
  server: {
    // Specifies the port number for the development server
    port: 3000,
  },
  build: {
    // Specifies the output directory for the build files
    outDir: 'dist',
  },
  resolve: {
    alias: {
      // Specifies the alias for the source directory
      '@': '/src',
    },
  },
  // The following options are included for educational purposes
  // Uncomment them if needed

  // css: {
  //   // Specifies the CSS preprocessor options
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `@import "@/styles/variables.scss";`
  //     }
  //   }
  // },
    plugins: [
     // Specifies the plugins to use
      wasm()
    ],
  // optimizeDeps: {
  //   // Specifies the dependencies to pre-bundle
  //   include: ['vue', 'vue-router'],
  // },
  // esbuild: {
  //   // Specifies the ESBuild options
  //   jsxFactory: 'h',
  //   jsxFragment: 'Fragment',
  // },
  // json: {
  //   // Specifies the JSON options
  //   namedExports: true,
  //   stringify: true,
  // },
  // logLevel: 'info', // Specifies the log level
  // clearScreen: false, // Specifies whether to clear the screen on build
});
