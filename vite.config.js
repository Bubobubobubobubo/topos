import { defineConfig } from "vite";
// import * as mdPlugin from 'vite-plugin-markdown';

export default defineConfig(({ command, mode, ssrBuild }) => {
  if (command === "serve") {
    return {
      assetsInclude: ["**/*.md"],
      server: {
        port: 8000,
        strictPort: true,
        https: true,
        open: true,
        cors: true,
      },
    };
  } else {
    return {
      chunkSizeWarningLimit: 1600 * 2,
      build: {
        outDir: "dist",
        emptyOutDir: true,
        cssCodeSplit: true,
        cssMinify: true,
        minify: true,
      },
    };
  }
});
