import { defineConfig } from "vite";
import vuetify from "vite-plugin-vuetify";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/client/webview/",
  build: {
    outDir: "../../resources/main/client/webview",
    emptyOutDir: true,
  },
  server: {
    base: "/",
    fs: {
      strict: false,
    },
  },
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "./src") },
      { find: "@shared", replacement: path.resolve(__dirname, "../shared") },
    ],
  },
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
      styles: {
        configFile: "src/vuetify-config.scss",
      },
    }),
  ],
});
