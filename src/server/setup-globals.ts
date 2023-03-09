// Until prisma starts supporting ESM, this is the workaround
import { dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

global.__filename = import.meta.url ? fileURLToPath(import.meta.url) : "";
global.__dirname = dirname(global.__filename);
global.require = createRequire(import.meta.url);
process.chdir = () => {};
