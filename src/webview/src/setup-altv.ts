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

  const handlers: {
    eventName: string;
    handler: (...args: any[]) => void;
    listener: (...args: any[]) => void;
  }[] = [];

  globalThis.alt.on = function (
    eventName: string,
    listener: (...args: any[]) => void
  ) {
    function handler(...args: any[]) {
      listener(...args.map((arg) => deserialize(arg)));
    }
    handlers.push({
      eventName,
      handler,
      listener,
    });
    on(eventName, handler);
  };

  globalThis.alt.once = function (
    eventName: string,
    listener: (...args: any[]) => void
  ) {
    function handler(...args: any[]) {
      handlers.splice(
        handlers.findIndex(
          (item) =>
            item.eventName === eventName &&
            item.listener === listener &&
            item.handler === handler
        ),
        1
      );
      listener(...args.map((arg) => deserialize(arg)));
    }
    handlers.push({
      eventName,
      handler,
      listener,
    });
    once(eventName, handler);
  };

  globalThis.alt.off = function (
    eventName: string,
    listener: (...args: any[]) => void
  ) {
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
}

export {};
