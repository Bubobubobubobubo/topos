import { defineConfig } from "vite";
import { VitePWA } from 'vite-plugin-pwa';

// import * as mdPlugin from 'vite-plugin-markdown';

export default defineConfig(({ command, mode, ssrBuild }) => {
  if (command === "serve") {
    return {
      plugins: [
        VitePWA({ registerType: 'autoUpdate' })
      ],
      assetsInclude: ["**/*.md"],
      server: {
        port: 8000,
        strictPort: true,
      },
    };
  } else {
    return {
      plugins: [
        VitePWA({ registerType: 'autoUpdate' })
      ],
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
