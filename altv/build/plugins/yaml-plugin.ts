import fs from "fs";
import { Plugin } from "esbuild";
import yaml from "js-yaml";

const yamlPlugin: Plugin = {
  name: "yaml-loader",
  setup(build) {
    build.onLoad({ filter: /\.yaml$/ }, async (args) => {
      const contents = await fs.promises.readFile(args.path, "utf8");
      const parsedYaml = yaml.load(contents);
      return {
        contents: `export default ${JSON.stringify(parsedYaml)}`,
        loader: "js",
      };
    });
  },
};

export default yamlPlugin;
