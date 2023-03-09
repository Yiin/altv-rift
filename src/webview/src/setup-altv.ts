import { deserialize } from "alpha-serializer";

if (!("alt" in globalThis)) {
  globalThis.alt = {
    emit() {},
    off() {},
    on() {},
    once() {},
    getEventListeners: () => [],
  };
  globalThis.altMock = true;
} else {
  const on = globalThis.alt.on;
  const once = globalThis.alt.once;
  const off = globalThis.alt.off;

  const handlers: any[] = [];

  globalThis.alt.on = function (name: string, cb: (...args: any[]) => void) {
    function handler(...args: any[]) {
      cb(...args.map((arg) => deserialize(arg)));
    }
    handlers.push([cb, handler]);
    on(name, handler);
  };

  globalThis.alt.once = function (name: string, cb: (...args: any[]) => void) {
    function handler(...args: any[]) {
      cb(...args.map((arg) => deserialize(arg)));
    }
    handlers.push([cb, handler]);
    once(name, handler);
  };

  globalThis.alt.off = function (name: string, cb: (...args: any[]) => void) {
    const handler = handlers.find(([cb2]) => cb2 === cb)?.[1];
    if (handler) {
      off(name, handler);
    }
  };
}

declare global {
  var altMock: boolean;
}

export {};
