import { defineConfig } from "vite";
import { VitePWA } from 'vite-plugin-pwa';
// import * as mdPlugin from 'vite-plugin-markdown';

const webManifest = {
  name: "Topos",
  short_name: "Topos",
  description: "Live coding environment",
  theme_color: "#ffffff",
  icons: [
    {
      src: 'favicon/android-chrome-192x192.png',
      sizes: '192x192',
      type: 'image/png'
    },
    {
      src: 'favicon/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png'
    },
  ]
}

export default defineConfig(({ command, mode, ssrBuild }) => {
  if (command === "serve") {
    return {
      plugins: [
        VitePWA({
          includeAssets: [
            'favicon/favicon.icon',
            'favicon/apple-touch-icon.png',
            'mask-icon.svg'
          ],
          manifest: webManifest,
          registerType: 'autoUpdate'
        })
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
        VitePWA({
          includeAssets: [
            'favicon/favicon.icon',
            'favicon/apple-touch-icon.png',
            'mask-icon.svg'
          ],
          manifest: webManifest,
          registerType: 'autoUpdate'
        })
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
