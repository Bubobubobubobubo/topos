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
      src: "./favicon/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any maskable",
    },
    {
      src: "./favicon/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any maskable",
    },
  ],
};

const vitePWAconfiguration = {
  devOptions: {
    enabled: true,
  },
  workbox: {
    sourcemap: false,
    cleanupOutdatedCaches: true,
    globPatterns: [
      "**/*.{js,css,html,gif,png,json,woff,json,ogg,wav,mp3,ico,png,svg}",
    ],
    // Thanks Froos :)
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
  manifest: webManifest,
  registerType: "autoUpdate",
  injectRegister: "auto",
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
      },
    };
  }
});
