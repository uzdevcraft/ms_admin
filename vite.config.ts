import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    // host: true,
    allowedHosts: true,
    // Browser → same-origin /api (avoids CORS). Vite forwards to the real API.
    // Needed because api.magic-store.uz allows http://localhost:3000 but not https://localhost:3000.
    proxy: {
      "/api": {
        target: "https://api.magic-store.uz",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        // API CORS allowlist rejects https://localhost — drop Origin so the
        // server-side proxy request is treated as non-browser.
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.removeHeader("origin");
          });
        },
      },
    },
  },
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@common": path.resolve(__dirname, "./src/common"),
      "@modules": path.resolve(__dirname, "./src/modules"),
      "@pages": path.resolve(__dirname, "./src/pages"),
    },
  },
});
