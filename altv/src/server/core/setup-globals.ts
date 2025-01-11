// Until prisma starts supporting ESM, this is the workaround
import { pathToFileURL } from "url";
import { createRequire } from "module";

global.require = createRequire(pathToFileURL(__filename));
process.chdir = () => {};
