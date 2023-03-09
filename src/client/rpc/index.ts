import alt from "alt-client";
import { getWebview, waitForUserInterface } from "@/utility/user-interface";
import { createPayload } from "../../shared/rpc";
import { deserialize, serialize } from "./serialization";

const serverProcedures = new Map<string, (...args: any[]) => any>();
const serverHandlers = new Map<
  string,
  { resolve: (result: any) => void; reject: (err: any) => void }
>();
const browserProcedures = new Map<string, (...args: any[]) => any>();
const browserHandlers = new Map<
  string,
  { resolve: (result: any) => void; reject: (err: any) => void }
>();

// call server from client
const callServer = <T>(name: string, ...args: any[]) => {
  return new Promise<T>((resolve, reject) => {
    const payload = createPayload(name, serialize(args));

    alt.emitServerRaw("call:server", payload);
    serverHandlers.set(payload.id, { resolve, reject });
  });
};

// get response from server on client
alt.onServer("call:server:response", (response) => {
  const handler = serverHandlers.get(response.id);
  if (!handler) {
    return;
  }
  serverHandlers.delete(response.id);

  if (response.error) {
    handler.reject(response.error);
    return;
  }
  handler.resolve(deserialize(response.result));
});

// handle call from server on client
const registerServer = (name: string, handler: (...args: any[]) => any) => {
  if (serverProcedures.has(name)) {
    throw new Error(`registerServer: Procedure ${name} already exists`);
  }
  serverProcedures.set(name, handler);
};

const unregisterServer = (name: string) => {
  serverProcedures.delete(name);
};

// receive call from server on client
alt.onServer("call:client", async (payload) => {
  const { id, name, args } = payload;
  const callback = serverProcedures.get(name);

  try {
    if (!callback) {
      throw new Error(`call:client: Procedure ${name} does not exist`);
    }

    const result = await callback(...deserialize(args));

    alt.emitServer("call:client:response", {
      id,
      result: serialize(result),
    });
  } catch (error) {
    alt.emitServer("call:client:response", {
      id,
      error,
    });
  }
});

// call browser from client
const callUserInterface = async <T>(name: string, ...args: any[]) => {
  return new Promise<T>((resolve, reject) => {
    const payload = createPayload(name, serialize(args));

    getWebview().emit("call:browser", payload);
    browserHandlers.set(payload.id, { resolve, reject });
  });
};

// get response from browser on client
getWebview((webview) =>
  webview.on("call:browser:response", (response) => {
    const handler = browserHandlers.get(response.id);
    if (!handler) {
      return;
    }
    browserHandlers.delete(response.id);

    if (response.error) {
      handler.reject(response.error);
      return;
    }
    handler.resolve(deserialize(response.result));
  })
);

// receive from browser on client
const registerWebview = (name: string, handler: (...args: any[]) => any) => {
  if (browserProcedures.has(name)) {
    throw new Error(`registerBrowser: Procedure ${name} already exists`);
  }
  browserProcedures.set(name, handler);
};

const unregisterWebview = (name: string) => {
  browserProcedures.delete(name);
};

// handle call from browser on client
getWebview((webview) =>
  webview.on("call:client", async (payload) => {
    const { id, name, args } = payload;
    const callback = browserProcedures.get(name);

    try {
      if (!callback) {
        throw new Error(`call:client: Procedure ${name} does not exist`);
      }
      const result = await callback(...args);
      webview.emit("call:client:response", {
        id,
        result,
      });
    } catch (error) {
      webview.emit("call:client:response", {
        id,
        error,
      });
    }
  })
);

export const rpc = {
  callServer,
  registerServer,
  unregisterServer,
  callWebview: callUserInterface,
  registerWebview,
  unregisterWebview,
};
