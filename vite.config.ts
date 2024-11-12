import { defineConfig } from 'vite';

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
  // Uncomment the following options if needed

  // css: {
  //   // Specifies the CSS preprocessor options
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `@import "@/styles/variables.scss";`
  //     }
  //   }
  // },
  // plugins: [
  //   // Specifies the plugins to use
  //   vue(),
  // ],
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
