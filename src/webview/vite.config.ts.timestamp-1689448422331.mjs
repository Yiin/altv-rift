// vite.config.ts
import { defineConfig } from "file:///C:/Users/stani/projects/yolo/src/webview/node_modules/vite/dist/node/index.js";
import vuetify from "file:///C:/Users/stani/projects/yolo/src/webview/node_modules/vite-plugin-vuetify/dist/index.js";
import externalGlobals from "file:///C:/Users/stani/projects/yolo/src/webview/node_modules/rollup-plugin-external-globals/index.js";
import vue from "file:///C:/Users/stani/projects/yolo/src/webview/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\stani\\projects\\yolo\\src\\webview";
var vite_config_default = defineConfig({
  base: "/client/webview/",
  build: {
    outDir: "../../resources/main/client/webview",
    emptyOutDir: true
  },
  server: {
    base: "/",
    fs: {
      strict: false
    }
  },
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__vite_injected_original_dirname, "./src") },
      { find: "@shared", replacement: path.resolve(__vite_injected_original_dirname, "../shared") },
      {
        find: "alt-shared",
        replacement: "alt"
      }
    ]
  },
  plugins: [
    externalGlobals({
      "alt-shared": "alt"
    }),
    vue(),
    vuetify({
      autoImport: true,
      styles: {
        configFile: "src/vuetify-config.scss"
      }
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxzdGFuaVxcXFxwcm9qZWN0c1xcXFx5b2xvXFxcXHNyY1xcXFx3ZWJ2aWV3XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxzdGFuaVxcXFxwcm9qZWN0c1xcXFx5b2xvXFxcXHNyY1xcXFx3ZWJ2aWV3XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9zdGFuaS9wcm9qZWN0cy95b2xvL3NyYy93ZWJ2aWV3L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB2dWV0aWZ5IGZyb20gXCJ2aXRlLXBsdWdpbi12dWV0aWZ5XCI7XG5pbXBvcnQgZXh0ZXJuYWxHbG9iYWxzIGZyb20gXCJyb2xsdXAtcGx1Z2luLWV4dGVybmFsLWdsb2JhbHNcIjtcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGJhc2U6IFwiL2NsaWVudC93ZWJ2aWV3L1wiLFxuICBidWlsZDoge1xuICAgIG91dERpcjogXCIuLi8uLi9yZXNvdXJjZXMvbWFpbi9jbGllbnQvd2Vidmlld1wiLFxuICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBiYXNlOiBcIi9cIixcbiAgICBmczoge1xuICAgICAgc3RyaWN0OiBmYWxzZSxcbiAgICB9LFxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IFtcbiAgICAgIHsgZmluZDogXCJAXCIsIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpIH0sXG4gICAgICB7IGZpbmQ6IFwiQHNoYXJlZFwiLCByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuLi9zaGFyZWRcIikgfSxcbiAgICAgIHtcbiAgICAgICAgZmluZDogXCJhbHQtc2hhcmVkXCIsXG4gICAgICAgIHJlcGxhY2VtZW50OiBcImFsdFwiLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgZXh0ZXJuYWxHbG9iYWxzKHtcbiAgICAgIFwiYWx0LXNoYXJlZFwiOiBcImFsdFwiLFxuICAgIH0pLFxuICAgIHZ1ZSgpLFxuICAgIHZ1ZXRpZnkoe1xuICAgICAgYXV0b0ltcG9ydDogdHJ1ZSxcbiAgICAgIHN0eWxlczoge1xuICAgICAgICBjb25maWdGaWxlOiBcInNyYy92dWV0aWZ5LWNvbmZpZy5zY3NzXCIsXG4gICAgICB9LFxuICAgIH0pLFxuICBdLFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXdULFNBQVMsb0JBQW9CO0FBQ3JWLE9BQU8sYUFBYTtBQUNwQixPQUFPLHFCQUFxQjtBQUM1QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBSmpCLElBQU0sbUNBQW1DO0FBT3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQU07QUFBQSxFQUNOLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLGFBQWE7QUFBQSxFQUNmO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixJQUFJO0FBQUEsTUFDRixRQUFRO0FBQUEsSUFDVjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEVBQUUsTUFBTSxLQUFLLGFBQWEsS0FBSyxRQUFRLGtDQUFXLE9BQU8sRUFBRTtBQUFBLE1BQzNELEVBQUUsTUFBTSxXQUFXLGFBQWEsS0FBSyxRQUFRLGtDQUFXLFdBQVcsRUFBRTtBQUFBLE1BQ3JFO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixhQUFhO0FBQUEsTUFDZjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxnQkFBZ0I7QUFBQSxNQUNkLGNBQWM7QUFBQSxJQUNoQixDQUFDO0FBQUEsSUFDRCxJQUFJO0FBQUEsSUFDSixRQUFRO0FBQUEsTUFDTixZQUFZO0FBQUEsTUFDWixRQUFRO0FBQUEsUUFDTixZQUFZO0FBQUEsTUFDZDtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
