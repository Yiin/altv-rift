import path from "path";
import process from "process";
import Bun from "bun";
import { Loader, Plugin } from "esbuild";

export const filelocPlugin = (options: { rootDir: string } = { rootDir: 'src' }) =>
  ({
    name: "fileloc",
    setup(build) {
      build.onLoad({ filter: /.\.(js|ts|jsx|tsx)$/, namespace: "file" }, async (args) => {
        // options.rootDir: /src
        // args.path: /source/src/client/main.ts
        // rootDir needs to be: /source/src
        const rootDir = args.path.substring(0, args.path.indexOf(options.rootDir) + options.rootDir.length);

        const isWindows = /^win/.test(process.platform);
        const esc = (p: string) => (isWindows ? p.replace(/\\/g, "/") : p);
        const variables = `
        const __fileloc = {
          filename: "${esc(args.path)}",
          dirname: "${path.dirname(esc(args.path))}",
          relativefilename: "/${path.relative(esc(rootDir), esc(args.path))}",
          relativedirname: "/${path.relative(esc(rootDir), esc(path.dirname(args.path)))}"
        };
        let __line = 0;
      `;
        const fileContent = new TextDecoder().decode(
          await (await Bun.file(args.path)).arrayBuffer(),
        );
        const lines = fileContent.split("\n");
        let fileWithCharsAndLines = "";
        for (let i = 0; i < lines.length; i++) {
          const hasLineNumber = !!lines[i].match(/__line/g);
          fileWithCharsAndLines += (hasLineNumber ? `__line=${i + 1};` : "") + lines[i] + "\n";
        }
        const globalsRegex = /__(?=(filename|dirname|relativefilename|relativedirname))/g;
        const contents =
          (fileWithCharsAndLines.match(globalsRegex) ? variables : "") +
          "\n" +
          fileWithCharsAndLines.replace(globalsRegex, "__fileloc.");

        const loader = args.path.split(".").pop() as Loader | undefined;
        return {
          contents,
          loader,
        };
      });
    },
  }) as Plugin;
