// Until prisma starts supporting ESM, this is the workaround
import { dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

// need to be in ["__filename", "__dirname"],
// as .__filename and .__dirname are being replaced by the bundler
global["__filename"] = import.meta.url ? fileURLToPath(import.meta.url) : "";
global["__dirname"] = dirname(global["__filename"]);
global.require = createRequire(import.meta.url);
process.chdir = () => {};
