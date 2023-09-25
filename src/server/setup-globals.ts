// Until prisma starts supporting ESM, this is the workaround
import { dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import * as alt from "@altv/server";

global["__filename"] = import.meta.url ? fileURLToPath(import.meta.url) : "";
global["__dirname"] = dirname(global["__filename"]);
global.require = createRequire(import.meta.url);
process.chdir = () => {};

// let timeoutId = 0;
// const timeouts = new Map<number, any>();

// // @ts-ignore
// global.setTimeout = (callback, ms, ...args) => {
//   timeoutId++;

//   const timeout = alt.Timers.setTimeout(() => {
//     timeouts.delete(timeoutId);
//     callback(...args);
//   }, ms);
//   timeouts.set(timeoutId, timeout);

//   return timeoutId;
// };

// global.clearTimeout = (id) => {
//   const timeout = timeouts.get(id as number);
//   if (timeout) {
//     timeout.destroy();
//     timeouts.delete(id as number);
//   }
// };

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
