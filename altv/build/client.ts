import esbuild, { BuildOptions } from "esbuild";
import Watcher from "watcher";
import chokidar from "chokidar";
import path from "path";
import yamlPlugin from "./plugins/yaml-plugin";
import { esbuildOptions } from "./shared";
import { copy, copyFile } from "./copy";
import { filelocPlugin } from "./plugins/fileloc-plugin";
import { rcssPlugin } from "./plugins/rcss-plugin";
import { reloadResource } from "./reconnect";
import { isDev } from "./env";

export const ASSETS_PATHS = [
  "/source/src/resource.toml",
  "/source/src/client/**/*.rml",
  "/source/src/client/**/*.ttf",
  "/source/src/client/**/*.png",
  "/source/src/client/**/*.rcss",
];

if (isDev()) {
  const assetsWatcher = new Watcher(ASSETS_PATHS, {
    recursive: true,
    renameDetection: true,
  });

  assetsWatcher.on("change", async () => {
    for (const assetsPath of ASSETS_PATHS) {
      await copy(assetsPath, "resources/main");
    }
  });

  // // Watch .rml files for changes
  const watcher = chokidar.watch(ASSETS_PATHS);

  watcher.on("change", (filePath) => {
    const rootDir = "src";
    const absoluteRootDir = filePath.substring(0, filePath.indexOf(rootDir) + rootDir.length);
    const relativePath = path.relative(absoluteRootDir, filePath);
    const destPath = path.join("resources/main", relativePath);
    console.log("Assets changed, copying", { filePath, relativePath, destPath });
    copyFile(filePath, destPath);

    if (!filePath.endsWith("screen.rml")) {
      reloadResource();
    }
  });
}

for (const assetsPath of ASSETS_PATHS) {
  await copy(assetsPath, "resources/main");
}

const options: BuildOptions = {
  ...esbuildOptions,
  platform: "node",
  entryPoints: ["src/client/main.ts"],
  outfile: "resources/main/client.js",
  external: [
    "@altv/shared",
    "@altv/client",
    "@altv/natives",
    "alt-server",
    "alt-client",
    "natives",
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
        });
      },
    },
    {
      name: "auto-reconnect",
      setup(build) {
        build.onEnd(() => reloadResource());
      },
    },
  ],
  define: {
    process: JSON.stringify({
      env: {
        NODE_ENV: "development",
      },
    }),
  },
};

if (isDev()) {
  const context = await esbuild.context(options);
  await context.watch();
} else {
  await esbuild.build(options);
}

// await context.dispose();
