import esbuild, { BuildOptions } from "esbuild";
import Watcher from "watcher";
import chokidar from "chokidar";
import yamlPlugin from "./plugins/yaml-plugin";
import { esbuildOptions } from "./shared";
import { copy, copyFile } from "./copy";
import { filelocPlugin } from "./plugins/fileloc-plugin";
import { rcssPlugin } from "./plugins/rcss-plugin";
import { reloadResource } from "./reconnect";
import { isDev } from "./env";

const sourceRoot = isDev() ? "/source" : "/altv";

export const ASSETS_PATHS = [
  // config
  `${sourceRoot}/src/resource.toml`,
  // rml
  `${sourceRoot}/src/client/**/*.rml`,
  `${sourceRoot}/src/client/**/*.rcss`,
  // fonts
  `${sourceRoot}/src/client/**/*.ttf`,
  // images
  `${sourceRoot}/src/client/**/*.png`,
  // audio
  `${sourceRoot}/src/client/**/*.mp3`,
  `${sourceRoot}/src/client/**/*.wav`,
];

if (isDev()) {
  const assetsWatcher = new Watcher(ASSETS_PATHS, {
    recursive: true,
    renameDetection: true,
  });

  assetsWatcher.on("change", async () => {
    for (const assetsPath of ASSETS_PATHS) {
      await copy(assetsPath, "resources/main/");
    }
  });

  // // Watch .rml files for changes
  const watcher = chokidar.watch(ASSETS_PATHS);

  watcher.on("change", (filePath) => {
    copyFile(filePath, "resources/main/");

    if (!filePath.endsWith("screen.rml")) {
      reloadResource();
    }
  });
}

for (const assetsPath of ASSETS_PATHS) {
  await copy(assetsPath, "resources/main/");
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
