import path from "path";
import esbuild from "esbuild";
import { altvEsbuild } from "altv-esbuild";
import chokidar from "chokidar";
import yamlPlugin from "./plugins/yaml-plugin.js";
import { altvEsbuildOptions, esbuildOptions } from "./shared.js";
import { copy, copyFile } from "./copy.js";
import { filelocPlugin } from "./plugins/fileloc-plugin.js";
import { rcssPlugin } from "./plugins/rcss-plugin.js";

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

esbuild
  .build({
    ...esbuildOptions,
    platform: "node",
    entryPoints: ["src/client/main.ts"],
    outfile: "resources/main/client.js",
    plugins: [
      yamlPlugin,
      filelocPlugin({
        rootDir: "src",
      }),
      altvEsbuild({
        ...altvEsbuildOptions,
        mode: "client",
      }),
      rcssPlugin(),
    ],
    define: {
      process: JSON.stringify({
        env: {
          NODE_ENV: "development",
        },
      }),
    },
  })
  .then(() => {
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
