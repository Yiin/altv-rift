import esbuild from "esbuild";
import yamlPlugin from "./plugins/yaml-plugin.js";
import { esbuildOptions } from "./shared.js";
import { filelocPlugin } from "./plugins/fileloc-plugin.js";
import { reloadResource } from "./reconnect.js";

const context = await esbuild.context({
  ...esbuildOptions,
  platform: "node",
  entryPoints: ["src/server/main.ts"],
  outfile: "resources/main/server.js",
  external: [
    "@altv/shared",
    "@altv/server",
    'alt-shared',
    'alt-server'
  ],
  plugins: [
    yamlPlugin,
    filelocPlugin({
      rootDir: "src",
    }),
    {
      name: "auto-reconnect",
      setup({ onEnd }) {
        onEnd(() => reloadResource('server'));
      }
    }
  ],
});

await context.watch();
// await context.dispose();
