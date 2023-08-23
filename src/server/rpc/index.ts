import alt from "alt-server";
import {
  CALL_CLIENT_FROM_SERVER,
  CALL_CLIENT_FROM_SERVER_RESPONSE,
  CALL_SERVER_FROM_CLIENT,
  CALL_SERVER_FROM_CLIENT_RESPONSE,
  CALL_SERVER_FROM_WEBVIEW,
  CALL_SERVER_FROM_WEBVIEW_RESPONSE,
  CALL_WEBVIEW_FROM_SERVER,
  CALL_WEBVIEW_FROM_SERVER_RESPONSE,
} from "@shared/calls/constants";
import { ServerCall } from "@shared/calls/server";
import { CallFromClient } from "@shared/calls/server/from-client";
import { CallFromWebview, FromWebview } from "@shared/calls/server/from-webview";
import { createPayload } from "@shared/utility/create-payload";

const clientProcedures = new Map<string, (player: alt.Player, ...args: any[]) => any>();
const clientHandlers = new Map<
  string,
  { resolve: (result: any) => void; reject: (err: any) => void }
>();
const webviewProcedures = new Map<string, (...args: any[]) => any>();
const webviewHandlers = new Map<
  string,
  { resolve: (result: any) => void; reject: (err: any) => void }
>();

// call client from server
const callClient = (player: alt.Player, name: string, ...args: any[]) => {
  return new Promise((resolve, reject) => {
    const payload = createPayload(name, args);

    player.emitRaw(CALL_CLIENT_FROM_SERVER, payload);
    clientHandlers.set(payload.id, { resolve, reject });
  });
};

alt.onClient(CALL_CLIENT_FROM_SERVER_RESPONSE, (_, response) => {
  const handler = clientHandlers.get(response.id);
  if (!handler) {
    return;
  }
  clientHandlers.delete(response.id);

  if (response.error) {
    handler.reject(response);
    return;
  }
  handler.resolve(response.result);
});

// receive from client on server
const registerClient = <T extends keyof typeof ServerCall.FromClient>(
  name: T,
  callback: Asyncify<CallFromClient>[T]
) => {
  if (clientProcedures.has(name)) {
    throw new Error(`registerClient: Procedure ${name} already exists`);
  }
  clientProcedures.set(name, callback);
};

const unregisterClient = (name: string) => {
  clientProcedures.delete(name);
};

alt.onClient(CALL_SERVER_FROM_CLIENT, async (player, payload) => {
  const { id, name, args } = payload;
  const callback = clientProcedures.get(name);

  try {
    if (!callback) {
      throw new Error(`CALL_SERVER_FROM_CLIENT: Procedure ${name} does not exist`);
    }

    const result = await callback(player, ...args);
    player.emitRaw(CALL_SERVER_FROM_CLIENT_RESPONSE, {
      id,
      result,
    });
  } catch (error) {
    console.log(error);
    player.emitRaw(CALL_SERVER_FROM_CLIENT_RESPONSE, {
      id,
      error,
    });
  }
});

// call webview from server
const callWebview = (player: alt.Player, name: string, ...args: any[]) => {
  return new Promise((resolve, reject) => {
    const payload = createPayload(name, args);

    player.emitRaw(CALL_WEBVIEW_FROM_SERVER, payload);
    webviewHandlers.set(payload.id, { resolve, reject });
  });
};

alt.onClient(CALL_WEBVIEW_FROM_SERVER_RESPONSE, (_, response) => {
  const handler = webviewHandlers.get(response.id);
  if (!handler) {
    return;
  }
  webviewHandlers.delete(response.id);

  if (response.error) {
    handler.reject(response);
    return;
  }
  handler.resolve(response.result);
});

// receive from webview on server
const registerWebview = <T extends keyof typeof FromWebview>(
  name: T,
  callback: Asyncify<CallFromWebview>[T]
) => {
  if (webviewProcedures.has(name)) {
    throw new Error(`registerWebview: Procedure ${name} already exists`);
  }
  webviewProcedures.set(name, callback);
};

const unregisterWebview = (name: string) => {
  webviewProcedures.delete(name);
};

alt.onClient(CALL_SERVER_FROM_WEBVIEW, async (player, payload) => {
  const { id, name, args } = payload;
  const callback = webviewProcedures.get(name);

  try {
    if (!callback) {
      throw new Error(`CALL_SERVER_FROM_WEBVIEW: Procedure ${name} does not exist`);
    }

    const result = await callback(player, ...args);
    player.emitRaw(CALL_SERVER_FROM_WEBVIEW_RESPONSE, {
      id,
      result,
    });
  } catch (error) {
    player.emitRaw(CALL_SERVER_FROM_WEBVIEW_RESPONSE, {
      id,
      error,
    });
  }
});

export const rpc = {
  callClient,
  registerClient,
  unregisterClient,
  callWebview,
  registerWebview,
  unregisterWebview,
};
