import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import viteCompression from "vite-plugin-compression";

const vitePWAconfiguration = {
  devOptions: {
    enabled: false,
    suppressWarnings: true,
  },
  workbox: {
    sourcemap: false,
    cleanupOutdatedCaches: false,
    globPatterns: [
      "**/*.{js,js.gz,css,html,gif,png,json,woff,woff2,json,ogg,wav,mp3,ico,png,svg}",
    ],
    runtimeCaching: [
      {
        urlPattern: ({ url }) =>
          [
            /^https:\/\/raw\.githubusercontent\.com\/.*/i,
            /^https:\/\/shabda\.ndre\.gr\/.*/i,
          ].some((regex) => regex.test(url)),
        handler: "CacheFirst",
        options: {
          cacheName: "external-samples",
          expiration: {
            maxEntries: 5000,
            maxAgeSeconds: 60 * 60 * 24 * 30, // <== 14 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
  includeAssets: [
    "favicon/favicon.icon",
    "favicon/apple-touch-icon.png",
    "mask-icon.svg",
  ],
  manifest: "manifest.webmanifest",
  registerType: "autoUpdate",
  injectRegister: "script-defer",
};

export default defineConfig(({ command, mode, ssrBuild }) => {
  if (command === "serve") {
    return {
      plugins: [viteCompression(), VitePWA(vitePWAconfiguration)],
      assetsInclude: ["**/*.md"],
      server: {
        port: 8000,
        strictPort: true,
      },
      build: {
        outDir: "dist",
        emptyOutDir: true,
        cssCodeSplit: true,
        cssMinify: true,
        minify: true,
        publicDir: "favicon",
      }
    };
  } else {
    return {
      plugins: [viteCompression(), VitePWA(vitePWAconfiguration)],
      chunkSizeWarningLimit: 1600 * 2,
      build: {
        outDir: "dist",
        emptyOutDir: true,
        cssCodeSplit: true,
        cssMinify: true,
        minify: true,
        publicDir: "favicon",
      },
    };
  }
});
