import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import viteCompression from "vite-plugin-compression";

const webManifest = {
  name: "Topos",
  short_name: "Topos",
  description: "Live coding environment",
  theme_color: "#ffffff",
  icons: [
    {
      src: "favicon/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any maskable",
    },
    {
      src: "favicon/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any maskable",
    },
  ],
};

export default defineConfig(({ command, mode, ssrBuild }) => {
  if (command === "serve") {
    return {
      plugins: [
        viteCompression(),
        VitePWA({
          workbox: {
            sourcemap: true,
            cleanupOutdatedCaches: true,
            globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
          },
          includeAssets: [
            "favicon/favicon.icon",
            "favicon/apple-touch-icon.png",
            "mask-icon.svg",
          ],
          manifest: webManifest,
          registerType: "autoUpdate",
          injectRegister: "auto",
        }),
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
        viteCompression(),
        VitePWA({
          workbox: {
            sourcemap: true,
            cleanupOutdatedCaches: true,
            globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
          },
          includeAssets: [
            "favicon/favicon.icon",
            "favicon/apple-touch-icon.png",
            "mask-icon.svg",
          ],
          manifest: webManifest,
          registerType: "autoUpdate",
          injectRegister: "auto",
        }),
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
