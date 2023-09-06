import alt from "alt-client";
import { KeyCode } from "altv-enums";
import { ClientEvents } from "@shared/events/client";
import { getWebview } from "../user-interface/webview";

const intervals: number[] = [];
const timeouts: number[] = [];
const ticks: number[] = [];
let inputFocused = false;
const registeredKeyDownKeys = new Set();

export function tick() {
  return new Promise((resolve) => {
    alt.nextTick(resolve);
  });
}

export function intervalWhile(condition: () => boolean, callback: () => void, intervalTime = 0) {
  const interval = alt.setInterval(() => {
    if (!condition()) {
      alt.clearInterval(interval);
      intervals.splice(intervals.indexOf(interval), 1);
      return;
    }

    callback();
  }, intervalTime);
  intervals.push(interval);
}

export function everyTickWhile(
  condition: () => boolean,
  callback: () => void,
  onEnd?: () => void,
  options: { skipFirstCheck?: boolean } = {}
) {
  const tick = alt.everyTick(() => {
    if (!options.skipFirstCheck && !condition()) {
      alt.clearEveryTick(tick);
      ticks.splice(ticks.indexOf(tick), 1);
      onEnd?.();
      return;
    }
    options.skipFirstCheck = false;

    callback();
  });
  ticks.push(tick);
}

export function waitNextTick() {
  return new Promise<void>((resolve) => {
    alt.nextTick(() => {
      resolve();
    });
  });
}

export function waitUntil(condition: () => boolean, timeoutMS = 10000) {
  return new Promise<void>((resolve) => {
    const timeout = alt.setTimeout(() => {
      timeouts.splice(timeouts.indexOf(timeout), 1);
      resolve();
    }, timeoutMS);

    const tick = alt.everyTick(() => {
      if (!condition()) {
        return;
      }
      try {
        alt.clearTimeout(timeout);
        alt.clearEveryTick(tick);
      } catch {}
      ticks.splice(ticks.indexOf(tick), 1);
      resolve();
    });
    timeouts.push(timeout);
    ticks.push(tick);
  });
}

export function everyTick(callback: () => void) {
  const tick = alt.everyTick(callback);
  ticks.push(tick);
}

export function onKeyDown(key: KeyCode, callback: () => void) {
  if (registeredKeyDownKeys?.has(key)) {
    throw new Error(`KeyDown ${key} is already registered.`);
  }
  registeredKeyDownKeys?.add(key);

  alt.on("keydown", (keyPressed: number) => {
    if (inputFocused) {
      return;
    }
    if (keyPressed === key) {
      callback();
    }
  });
}

alt.nextTick(() => {
getWebview((webview) => {
  webview.on(ClientEvents.FromWebview.INPUT_FOCUS, (isFocused: boolean) => {
    inputFocused = isFocused;
  });
});
});

// alt.on("disconnect", () => {
//   for (const interval of intervals) {
//     try {
//       alt.clearInterval(interval);
//     } catch {}
//   }
//   for (const timeout of timeouts) {
//     try {
//       alt.clearTimeout(timeout);
//     } catch {}
//   }
//   for (const tick of ticks) {
//     try {
//       alt.clearEveryTick(tick);
//     } catch {}
//   }

//   intervals.splice(0, intervals.length);
//   timeouts.splice(0, timeouts.length);
//   ticks.splice(0, ticks.length);
// });
