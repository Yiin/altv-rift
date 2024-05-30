import fs from "fs/promises";
import { Plugin } from "esbuild";
import glob from "glob";
import * as xml2js from "xml-js";

async function updateRml() {
  const rcssFiles = await glob("src/client/core/rmlui/**/*.rcss", {
    platform: "linux",
  });
  rcssFiles.sort();

  const screenRmlPath = "src/client/core/rmlui/screen.rml";

  if (!(await fs.exists(screenRmlPath))) {
    return;
  }

  const rmlFile = await fs.readFile(screenRmlPath, "utf-8");
  const rmlJson = xml2js.xml2js(rmlFile, { compact: true }) as any;

  if (!rmlJson.rml.head.link) {
    rmlJson.rml.head.link = [];
  } else if (!Array.isArray(rmlJson.rml.head.link)) {
    rmlJson.rml.head.link = [rmlJson.rml.head.link];
  }

  // Clear all previous links
  rmlJson.rml.head.link = rmlJson.rml.head.link.filter(
    (link: any) => link._attributes.type !== "text/rcss",
  );

  // Add new links
  for (const rcssFile of rcssFiles) {
    const relativePath = rcssFile.replace(/^src\//, "");
    rmlJson.rml.head.link.push({
      _attributes: {
        type: "text/rcss",
        href: `/${relativePath}`,
      },
    });
  }

  // Add empty text node to prevent the body tag from being self-closing
  if (rmlJson.rml.body._text === undefined) {
    rmlJson.rml.body._text = "";
  }

  const newRml = xml2js.js2xml(rmlJson, { compact: true, spaces: 2 });
  await fs.writeFile(screenRmlPath, newRml, "utf-8");
}

export function rcssPlugin() {
  return {
    name: "rcss-plugin",
    setup(build) {
      build.onEnd(updateRml);
    },
  } as Plugin;
}
