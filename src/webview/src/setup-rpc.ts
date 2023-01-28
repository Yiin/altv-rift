if (!("alt" in globalThis)) {
  globalThis.alt = {
    emit() {},
    off() {},
    on() {},
    once() {},
    getEventListeners: () => [],
  };
}

import("altv-rpc").then((rpc) => rpc.init("webview"));

export {};
