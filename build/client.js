import path from "path";
import esbuild from "esbuild";
import { altvEsbuild } from "altv-esbuild";
import chokidar from "chokidar";
import { altvEsbuildOptions, esbuildOptions } from "./shared.js";
import { copy, copyFile } from "./copy.js";
import { filelocPlugin } from "./plugins/fileloc-plugin.js";

esbuild
  .build({
    ...esbuildOptions,
    platform: "node",
    entryPoints: ["src/client/main.ts"],
    outfile: "resources/main/client.js",
    plugins: [
      filelocPlugin({
        rootDir: "src",
      }),
      altvEsbuild({
        ...altvEsbuildOptions,
        mode: "client",
      }),
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
    copy("src/client/**/*.rml", "resources/main/");
    copy("src/client/**/*.ttf", "resources/main/");
    copy("src/client/**/*.png", "resources/main/");

    // Watch .rml files for changes
    const watcher = chokidar.watch("src/client/**/*.rml");

    watcher.on("change", (filePath) => {
      const relativePath = path.relative("src", filePath);
      const destPath = path.join("resources/main", relativePath);
      copyFile(filePath, destPath);
    });
  });
