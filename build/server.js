import esbuild from "esbuild";
import { altvEsbuild } from "altv-esbuild";
import yamlPlugin from "./plugins/yaml-plugin.js";
import { altvEsbuildOptions, esbuildOptions } from "./shared.js";
import { filelocPlugin } from "./plugins/fileloc-plugin.js";

esbuild.build({
  ...esbuildOptions,
  bundle: false,
  platform: "node",
  entryPoints: ["src/server/main.ts"],
  outfile: "resources/main/server.js",
  plugins: [
    yamlPlugin,
    filelocPlugin({
      rootDir: "src",
    }),
  ],
});
