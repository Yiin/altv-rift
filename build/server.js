import esbuild from "esbuild";
import { altvEsbuild } from "altv-esbuild";
import yamlPlugin from "./plugins/yaml-plugin";
import { altvEsbuildOptions, esbuildOptions } from "./shared";

esbuild.build({
  ...esbuildOptions,
  platform: "node",
  entryPoints: ["src/server/main.ts"],
  outfile: "resources/main/server.js",
  plugins: [
    yamlPlugin,
    altvEsbuild({
      ...altvEsbuildOptions,
      mode: "server",
    }),
  ],
});
