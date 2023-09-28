import { deserialize, serialize } from "@shared/utility/serializer";

// @ts-ignore
globalThis.deserialize = deserialize;

if (!("alt" in globalThis)) {
  globalThis.alt = {
    emit() {},
    emitRaw() {},
    off() {},
    on() {},
    once() {},
    listeners: {},
    getVersion: () => "0.0.0",
    getBranch: () => "dev",
    getLocale: () => "en",
  };
  globalThis.altMock = true;
} else {
  const on = globalThis.alt.on;
  const once = globalThis.alt.once;
  const off = globalThis.alt.off;
  const emit = globalThis.alt.emit;

  globalThis.alt.emitRaw = function (eventName: string, ...args: any[]) {
    emit(eventName, serialize(args));
  };

  const handlers: {
    eventName: string;
    handler: (...args: any[]) => void;
    listener: (...args: any[]) => void;
  }[] = [];

  globalThis.alt.on = function (eventName: string, listener: (...args: any[]) => void) {
    function handler(...args: any[]) {
      try {
        const deserializedArgs = args.flatMap((arg) => deserialize(arg));
        listener(...deserializedArgs);
      } catch (e) {
        console.error("alt.on", typeof eventName, eventName);
        console.log("alt.on", JSON.stringify(args));
      }
    }
    handlers.push({
      eventName,
      handler,
      listener,
    });
    on(eventName, handler);
  };

  globalThis.alt.once = function (eventName: string, listener: (...args: any[]) => void) {
    function handler(...args: any[]) {
      handlers.splice(
        handlers.findIndex(
          (item) =>
            item.eventName === eventName && item.listener === listener && item.handler === handler
        ),
        1
      );
      try {
        listener(...args.flatMap((arg) => deserialize(arg)));
      } catch (e) {
        console.log("alt.once", args);
        console.error("alt.once", eventName, e);
      }
    }
    handlers.push({
      eventName,
      handler,
      listener,
    });
    once(eventName, handler);
  };

  globalThis.alt.off = function (eventName: string, listener: (...args: any[]) => void) {
    const index = handlers.findIndex(
      (item) => item.eventName === eventName && item.listener === listener
    );
    if (index > -1) {
      const { eventName, handler } = handlers[index];
      handlers.splice(index, 1);
      off(eventName, handler);
    }
  };
}

declare global {
  var altMock: boolean;

  interface Alt {
    emitRaw: Alt["emit"];
  }
}

export {};
