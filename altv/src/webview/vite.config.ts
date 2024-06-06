import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vuetify from "vite-plugin-vuetify";
import externalGlobals from "rollup-plugin-external-globals";
import vue from "@vitejs/plugin-vue";

const CDN_URL = "https://altv-rift.fra1.digitaloceanspaces.com/webview-assets/";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === "production" ? CDN_URL : "/client/webview/",
  build: {
    // outDir: "../../resources/main/client/webview",
    emptyOutDir: true,
    target: "es2022",
  },
  server: {
    host: "0.0.0.0",
    // host: true,
    strictPort: true,
    fs: {
      strict: false,
    },
  },
  resolve: {
    alias: [
      { find: "@", replacement: fileURLToPath(new URL("./src", import.meta.url)) },
      { find: "@shared", replacement: fileURLToPath(new URL("../shared", import.meta.url)) },
      {
        find: "@altv/shared",
        replacement: "alt",
      },
    ],
    preserveSymlinks: true,
  },
  define: {
    CDN_URL: JSON.stringify(CDN_URL),
  },
  plugins: [
    externalGlobals({
      "@altv/shared": "alt",
    }),
    vue(),
    vuetify({
      autoImport: true,
      styles: {
        configFile: "src/vuetify-config.scss",
      },
    }),
  ],
}));
