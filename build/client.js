import path from "path";
import esbuild from "esbuild";
import chokidar from "chokidar";
import yamlPlugin from "./plugins/yaml-plugin.js";
import { esbuildOptions } from "./shared.js";
import { copy, copyFile } from "./copy.js";
import { filelocPlugin } from "./plugins/fileloc-plugin.js";
import { rcssPlugin } from "./plugins/rcss-plugin.js";
import { reloadResource } from "./reconnect.js";

export const ASSETS_PATHS = [
  "src/resource.toml",
  "src/client/**/*.rml",
  "src/client/**/*.ttf",
  "src/client/**/*.png",
  "src/client/**/*.rcss",
];

for (const assetsPath of ASSETS_PATHS) {
  await copy(assetsPath, "resources/main");
}

const context = await esbuild
  .context({
    ...esbuildOptions,
    platform: "node",
    entryPoints: ["src/client/main.ts"],
    outfile: "resources/main/client.js",
    external: [
      "@altv/shared",
      "@altv/client",
      "@altv/natives"
    ],
    plugins: [
      yamlPlugin,
      filelocPlugin({
        rootDir: "src",
      }),
      rcssPlugin(),
      {
        name: "copy-assets",
        setup(build) {
          build.onEnd(() => {
            // After esbuild finishes, copy .rml files
            for (const assetsPath of ASSETS_PATHS) {
              copy(assetsPath, "resources/main/");
            }
        
            // Watch .rml files for changes
            const watcher = chokidar.watch(ASSETS_PATHS);
        
            watcher.on("change", (filePath) => {
              const relativePath = path.relative("src", filePath);
              const destPath = path.join("resources/main", relativePath);
              copyFile(filePath, destPath);
            });
          });
        }
      },
      {
        name: "auto-reconnect",
        setup(build) {
          build.onEnd(() => reloadResource('client'));
        }
      }
    ],
    define: {
      process: JSON.stringify({
        env: {
          NODE_ENV: "development",
        },
      }),
    },
  });

await context.watch();
// await context.dispose();
