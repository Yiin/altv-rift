import alt from "alt-client";
import { KeyCode } from "altv-enums";
import { Events } from "@shared/constants/events";
import { getWebview } from "./user-interface";

const intervals: number[] = [];
const timeouts: number[] = [];
const ticks: number[] = [];
let inputFocused = false;

export function tick() {
  return new Promise((resolve) => {
    alt.nextTick(resolve);
  });
}

export function intervalWhile(
  condition: () => boolean,
  callback: () => void,
  intervalTime = 0
) {
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

export function everyTickWhile(condition: () => boolean, callback: () => void) {
  const tick = alt.everyTick(() => {
    if (!condition()) {
      alt.clearEveryTick(tick);
      ticks.splice(ticks.indexOf(tick), 1);
      return;
    }

    callback();
  });
  ticks.push(tick);
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

      alt.clearTimeout(timeout);
      alt.clearEveryTick(tick);
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
  alt.on("keydown", (keyPressed: number) => {
    if (inputFocused) {
      return;
    }
    if (keyPressed === key) {
      callback();
    }
  });
}

getWebview((webview) => {
  webview.on(Events.Client.INPUT_FOCUS, (isFocused: boolean) => {
    inputFocused = isFocused;
  });
});

alt.on("disconnect", () => {
  intervals.forEach((interval) => {
    alt.clearInterval(interval);
  });
  intervals.splice(0, intervals.length);
});
