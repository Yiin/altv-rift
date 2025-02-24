import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import externalGlobals from "rollup-plugin-external-globals";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import svgLoader from "vite-svg-loader";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === "production" ? process.env.VITE_CDN_URL : "/client/webview/",
  build: {
    // outDir: "../../resources/main/client/webview",
    emptyOutDir: true,
    target: "es2022",
    assetsInlineLimit: 0, // Ensure SVGs are processed as assets
    minify: false, // Disable minification
    sourcemap: true, // Ensure source maps are generated
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("index.html", import.meta.url)),
      },
      output: {
        assetFileNames: (assetInfo) => {
          const fullPath = assetInfo.originalFileNames?.[0];

          if (fullPath?.startsWith("src/assets/")) {
            const pathWithoutSrc = fullPath.replace(/^src\//, "");
            const finalPath = pathWithoutSrc.replace(/^assets\//, "assets/icons/");
            return finalPath;
          }

          return `assets/[name]-[hash][extname]`;
        },
      },
    },
  },
  optimizeDeps: {
    include: ["@shared/**/*"],
    exclude: [],
    esbuildOptions: {
      preserveSymlinks: true,
    },
  },
  server: {
    host: "0.0.0.0",
    // host: true,
    strictPort: true,
    fs: {
      strict: false,
    },
    hmr: true,
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
    svgLoader({
      defaultImport: "raw", // This ensures SVGs are imported as raw strings
      svgoConfig: {
        multipass: true,
        plugins: [
          {
            name: "preset-default",
            params: {
              overrides: {
                removeViewBox: false,
              },
            },
          },
        ],
      },
    }),
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
