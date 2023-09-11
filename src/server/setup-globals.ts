// Until prisma starts supporting ESM, this is the workaround
import { dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import alt from "@altv/server";

global["__filename"] = import.meta.url ? fileURLToPath(import.meta.url) : "";
global["__dirname"] = dirname(global["__filename"]);
global.require = createRequire(import.meta.url);
process.chdir = () => {};

alt.Events.rawEmitEnabled = true;

// alt.Events.onEvent = function (eventName, listener) {
//   alt.Events.on(eventName, ({ args }) => {
//     // @ts-expect-error
//     listener(...args);
//   });
// };

// alt.Events.onPlayerEvent = function (eventName, listener) {
//   alt.Events.onPlayer(eventName, ({ player, args }) => {
//     // @ts-expect-error
//     listener(player, ...args);
//   });
// };
