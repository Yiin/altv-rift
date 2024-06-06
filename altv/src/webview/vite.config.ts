import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vuetify from "vite-plugin-vuetify";
import externalGlobals from "rollup-plugin-external-globals";
import vue from "@vitejs/plugin-vue";

console.log("CDN_URL from vite:", process.env.VITE_CDN_URL);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === "production" ? process.env.VITE_CDN_URL : "/client/webview/",
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
