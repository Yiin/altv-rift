import esbuild, { BuildOptions } from "esbuild";
import yamlPlugin from "./plugins/yaml-plugin";
import { esbuildOptions } from "./shared";
import { filelocPlugin } from "./plugins/fileloc-plugin";
import { reloadResource } from "./reconnect";
import { isDev } from "./env";

const options: BuildOptions = {
  ...esbuildOptions,
  platform: "node",
  entryPoints: ["src/server/main.ts"],
  outfile: "resources/main/server.js",
  external: ["@altv/shared", "@altv/server", "alt-shared", "alt-server"],
  plugins: [
    yamlPlugin,
    filelocPlugin({
      rootDir: "src",
    }),
    // eslint plugin to log current file that is being processed and added to the bundle
    {
      name: "bundled-file-logger",
      setup({ onEnd }) {
        onEnd((result) => {
          console.log('[@]', result.outputFiles?.[0]?.path);
        });
      },
    },
    {
      name: "auto-reconnect",
      setup({ onEnd }) {
        onEnd(() => reloadResource());
      },
    },
  ],
};

if (isDev()) {
  const context = await esbuild.context(options);
  await context.watch();
} else {
  await esbuild.build(options)
}

// await context.dispose();
