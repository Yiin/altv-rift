import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import externalGlobals from "rollup-plugin-external-globals";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";

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
    hmr: false,
  },
  rollupOptions: {
    output: {
      // Enable verbose output from Rollup
      sourcemap: true
    }
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
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "pinia",
        {
          lodash: ["_"],
        },
      ],
      dts: true,
      vueTemplate: true,
    }),
  ],
}));
