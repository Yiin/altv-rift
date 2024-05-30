import esbuild from "esbuild";
import yamlPlugin from "./plugins/yaml-plugin";
import { esbuildOptions } from "./shared";
import { filelocPlugin } from "./plugins/fileloc-plugin";
import { reloadResource } from "./reconnect";

const context = await esbuild.context({
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
    {
      name: "auto-reconnect",
      setup({ onEnd }) {
        onEnd(() => reloadResource("server"));
      },
    },
  ],
});

await context.watch();
// await context.dispose();
