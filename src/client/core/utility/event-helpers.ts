import alt from "@altv/client";
import { ClientEvents } from "@shared/events/client";
import { isWindowOpen, useWebview } from "../user-interface/webview";

const intervals: alt.Timers.Interval[] = [];
const timeouts: alt.Timers.Timeout[] = [];
const ticks: alt.Timers.EveryTick[] = [];
let inputFocusedTimes = 0;
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
  options: { skipFirstCheck?: boolean } = {},
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

  return tick;
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

export function onKeyDown<T extends alt.Enums.KeyCode>(key: T, callback: (key: T) => void) {
  if (registeredKeyDownKeys?.has(key)) {
    throw new Error(`KeyDown ${key} is already registered.`);
  }
  registeredKeyDownKeys?.add(key);

  const handler = alt.Events.onKeyDown(({ key: keyPressed }) => {
    if (inputFocusedTimes > 0) {
      return;
    }
    if (alt.isConsoleOpen()) {
      return;
    }
    if (isWindowOpen()) {
      return;
    }
    if (keyPressed === key) {
      callback(key);
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

export function onKeyUp<T extends alt.Enums.KeyCode>(key: T, callback: (key: T) => void) {
  const handler = alt.Events.onKeyUp(({ key: keyPressed }) => {
    if (inputFocusedTimes > 0) {
      return;
    }
    if (alt.isConsoleOpen()) {
      return;
    }
    if (keyPressed === key) {
      callback(key);
    }
  });

  return {
    ...handler,
    destroy() {
      handler.destroy();
    },
  };
}

alt.Timers.nextTick(() => {
  useWebview((webview) => {
    webview.on(ClientEvents.FromWebview.INPUT_FOCUS, (isFocused: boolean) => {
      inputFocusedTimes += isFocused ? 1 : -1;
    });
  });

  alt.Events.on("qa-tools:codeEditor", (isFocused: boolean) => {
    inputFocusedTimes += isFocused ? 1 : -1;
  });

  alt.Events.on("vchat:focus", (isFocused: boolean) => {
    inputFocusedTimes += isFocused ? 1 : -1;
  });
});
