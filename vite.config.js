import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  build: {
    outDir: "dist"
  },

  base: "/Harry_Potter_GBG2/",
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/remote-api": {
        target: "https://hp-api.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/remote-api/, "/api"),
      }
    },
  },

  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      devOptions: { enabled: true },
      includeAssets: ["HP-HP.png", "HP-logo.png"],
      manifest: {
        id: "Harry_Potter_GBG2/",
        name: "Wizardpedia",
        short_name: "Wizardpedia",
        description: "Wizardpedia PWA",
        theme_color: "#111111",
        background_color: "#111111",
        display: "standalone",
        start_url: "/Harry_Potter_GBG2/",
        scope: "/Harry_Potter_GBG2/",
        icons: [
          { src: "/Harry_Potter_GBG2/HP-logo.png", sizes: "192x192", type: "image/png" },
          { src: "/Harry_Potter_GBG2/HP-HP.png", sizes: "512x512", type: "image/png" },
          { src: "/Harry_Potter_GBG2/HP-HP.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      },

      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ["**/*.{js,css,html,png,jpg,svg,ico,cur}"],
        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024,
        navigateFallback: "/Harry_Potter_GBG2/index.html",
        navigateFallbackDenylist: [/^\/(api|remote-api)/],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/api/") || url.pathname.startsWith("/remote-api/"),
            handler: "NetworkFirst",
            options: {
              cacheName: "hp-api-cache",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24,
              },
            },
          },
          {
            urlPattern: ({ url }) => url.origin === "https://hp-api.onrender.com",
            handler: "NetworkFirst",
            options: {
              cacheName: "hp-api-cache",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24,
              },
            },
          },
          {
            urlPattern: ({ url }) => url.origin === "http://localhost:3001",
            handler: "NetworkFirst",
            options: {
              cacheName: "local-api-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24,
              },
            },
          },
        ],
      },
    }),
  ],
});