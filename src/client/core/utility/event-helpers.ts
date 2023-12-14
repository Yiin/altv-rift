import * as alt from "@altv/client";
import { ClientEvents } from "@shared/events/client";
import { getWebview } from "../user-interface/webview";

const intervals: alt.Timers.Interval[] = [];
const timeouts: alt.Timers.Timeout[] = [];
const ticks: alt.Timers.EveryTick[] = [];
let inputFocused = false;
const registeredKeyDownKeys = new Set();

export function tick() {
  return new Promise((resolve) => {
    alt.Timers.nextTick(resolve);
  });
}

export function intervalWhile(condition: () => boolean, callback: () => void, intervalTime = 0) {
  const interval = alt.Timers.setInterval(() => {
    if (!condition()) {
      interval?.destroy();
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
  const tick = alt.Timers.everyTick(() => {
    if (!options.skipFirstCheck && !condition()) {
      tick.destroy();
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
    alt.Timers.nextTick(() => {
      resolve();
    });
  });
}

export function waitUntil(condition: () => boolean, timeoutMS = 10000) {
  return new Promise<void>((resolve) => {
    const timeout = alt.Timers.setTimeout(() => {
      timeouts.splice(timeouts.indexOf(timeout), 1);
      resolve();
    }, timeoutMS);

    const tick = alt.Timers.everyTick(() => {
      if (!condition()) {
        return;
      }
      try {
        timeout.destroy();
        tick.destroy();
      } catch {}
      ticks.splice(ticks.indexOf(tick), 1);
      resolve();
    });
    timeouts.push(timeout);
    ticks.push(tick);
  });
}

export function everyTick(callback: () => void) {
  const tick = alt.Timers.everyTick(callback);
  ticks.push(tick);
}

export function onKeyDown(key: alt.Enums.KeyCode, callback: () => void) {
  if (registeredKeyDownKeys?.has(key)) {
    throw new Error(`KeyDown ${key} is already registered.`);
  }
  registeredKeyDownKeys?.add(key);

  const handler = alt.Events.onKeyDown(({ key: keyPressed }) => {
    if (inputFocused) {
      return;
    }
    if (keyPressed === key) {
      callback();
    }
  });

  return {
    ...handler,
    destroy() {
      registeredKeyDownKeys?.delete(key);
      handler.destroy();
    },
  };
}

alt.Timers.nextTick(() => {
  getWebview((webview) => {
    webview.on(ClientEvents.FromWebview.INPUT_FOCUS, (isFocused: boolean) => {
      inputFocused = isFocused;
    });
  });
});

// alt.Events.onDisconnect(() => {
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
