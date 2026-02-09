import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const API_PREFIXES = ["/api/characters", "/api/locations", "/api/spells", "/api/beasts"];

export default defineConfig({
    server: {
        proxy: { 
            "/api": {
                target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
            
    plugins:[
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["HP-HP.png", "HP-logo.png"],
            manifest: {
                name: "Wizardpedia",
                short_name: "Wizardpedia",
                description: "Wisardpedia PWA",
                theme_color: "#111111",
                background_color: "#111111",
                display: "standalone",
                start_url: "/",
                scope: "/",
                icons: [
                    { src: "/HP-logo.png", sizes: "192x192", type: "image/png" },
                    { src: "/HP-HP.png", sizes: "512x512", type: "image/png" },
                    { src: "/HP-HP.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
                ]
            },
            
            workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: "/index.html",

        runtimeCaching: [
            {
            urlPattern: ({ url }) =>
              API_PREFIXES.some((p) => url.pathname.startsWith(p)),

            handler: "NetworkFirst",

            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24, 
              },
            },
          },
        ],
      },
    }),
  ],
});