import alt from "@altv/server";
import { z } from "zod";
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
import { ClientCall } from "@shared/calls/client";
import { WebviewCall } from "@shared/calls/webview";

const clientProcedures = new Map<string, (player: alt.Player, ...args: any[]) => any>();
const clientHandlers = new Map<
  string,
  { name: string; resolve: (result: any) => void; reject: (err: any) => void }
>();
const webviewProcedures = new Map<string, (...args: any[]) => any>();
const webviewHandlers = new Map<
  string,
  { name: string; resolve: (result: any) => void; reject: (err: any) => void }
>();

// call client from server
const callClient = (player: alt.Player, name: string, ...args: any[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    const payload = createPayload(name, args);

    player.emitRaw(CALL_CLIENT_FROM_SERVER, payload);
    clientHandlers.set(payload.id, { name, resolve, reject });
  });
};

alt.Events.onPlayer(CALL_CLIENT_FROM_SERVER_RESPONSE, (_, response) => {
  const handler = clientHandlers.get(response.id);
  if (!handler) {
    return;
  }
  clientHandlers.delete(response.id);

  if (response.error) {
    handler.reject(response);
    return;
  }

  if (handler.name in ClientCall.FromServerValidation) {
    const schema =
      ClientCall.FromServerValidation[handler.name as keyof typeof ClientCall.FromServerValidation];

    if ("returns" in schema) {
      const result = schema.returns.safeParse(response.result);

      if (!result.success) {
        alt.logError(
          `CALL_CLIENT_FROM_SERVER_RESPONSE: Validation error in ${handler.name}:`,
          result.error,
        );
        handler.reject(result.error);
      }
    }
  } else {
    alt.logWarning(`CALL_CLIENT_FROM_SERVER_RESPONSE: No validation schema for ${handler.name}`);
  }

  handler.resolve(response.result);
});

// receive from client on server
const registerClient = <
  T extends keyof typeof ServerCall.FromClient,
  R extends ReturnType<CallFromClient[T]>,
>(
  name: T,
  callback: (player: alt.Player, ...args: Parameters<CallFromClient[T]>) => R | Promise<R>,
): void => {
  if (clientProcedures.has(name)) {
    throw new Error(`registerClient: Procedure ${name} already exists`);
  }
  clientProcedures.set(name, callback);
};

const unregisterClient = (name: string): void => {
  clientProcedures.delete(name);
};

alt.Events.onPlayer(CALL_SERVER_FROM_CLIENT, async (player, payload) => {
  const { id, name, args } = payload;
  const callback = clientProcedures.get(name);

  try {
    if (!callback) {
      throw new Error(`CALL_SERVER_FROM_CLIENT: Procedure ${name} does not exist`);
    }

    if (name in ServerCall.FromClientValidation) {
      const schema =
        ServerCall.FromClientValidation[name as keyof typeof ServerCall.FromClientValidation];

      if ("args" in schema) {
        z.tuple(schema.args).parse(args);
      }
    } else {
      alt.logWarning(`CALL_SERVER_FROM_WEBVIEW: No validation schema for ${name}`);
    }

    const result = await callback(player, ...args);
    player.emitRaw(CALL_SERVER_FROM_CLIENT_RESPONSE, {
      id,
      result,
    });
  } catch (error) {
    alt.logError(error);
    player.emitRaw(CALL_SERVER_FROM_CLIENT_RESPONSE, {
      id,
      error,
    });
  }
});

// call webview from server
const callWebview = (player: alt.Player, name: string, ...args: any[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    const payload = createPayload(name, args);

    player.emitRaw(CALL_WEBVIEW_FROM_SERVER, payload);
    webviewHandlers.set(payload.id, { name, resolve, reject });
  });
};

alt.Events.onPlayer(CALL_WEBVIEW_FROM_SERVER_RESPONSE, (_, response) => {
  const handler = webviewHandlers.get(response.id);
  if (!handler) {
    return;
  }
  webviewHandlers.delete(response.id);

  if (response.error) {
    handler.reject(response);
    return;
  }

  if (handler.name in WebviewCall.FromServerValidation) {
    const schema =
      WebviewCall.FromServerValidation[
      handler.name as keyof typeof WebviewCall.FromServerValidation
      ];

    if ("returns" in schema) {
      // @ts-expect-error remove this comment if needed
      const result = schema.returns.safeParse(response.result);

      if (!result.success) {
        alt.logError(
          `CALL_WEBVIEW_FROM_SERVER_RESPONSE: Validation error in ${handler.name}:`,
          result.error,
        );
        handler.reject(result.error);
      }
    }
  } else {
    alt.logWarning(`CALL_WEBVIEW_FROM_SERVER_RESPONSE: No validation schema for ${handler.name}`);
  }

  handler.resolve(response.result);
});

type FromWebviewKey = keyof typeof FromWebview;

// receive from webview on server
const registerWebview = <T extends FromWebviewKey, R extends ReturnType<CallFromWebview[T]>>(
  name: T,
  callback: (player: alt.Player, ...args: Parameters<CallFromWebview[T]>) => R | Promise<R>,
): void => {
  if (webviewProcedures.has(name)) {
    throw new Error(`registerWebview: Procedure ${name} already exists`);
  }
  webviewProcedures.set(name, callback);
};

const unregisterWebview = (name: string): void => {
  webviewProcedures.delete(name);
};

alt.Events.onPlayer(CALL_SERVER_FROM_WEBVIEW, async (player, payload) => {
  const { id, name, args } = payload;
  const callback = webviewProcedures.get(name);

  try {
    if (!callback) {
      throw new Error(`CALL_SERVER_FROM_WEBVIEW: Procedure ${name} does not exist`);
    }

    if (name in ServerCall.FromWebviewValidation) {
      const schema =
        ServerCall.FromWebviewValidation[name as keyof typeof ServerCall.FromWebviewValidation];

      if ("args" in schema) {
        z.tuple(schema.args).parse(args);
      }
    } else {
      alt.logWarning(`CALL_SERVER_FROM_WEBVIEW: No validation schema for ${name}`);
    }

    const result = await callback(player, ...args);
    player.emitRaw(CALL_SERVER_FROM_WEBVIEW_RESPONSE, {
      id,
      result,
    });
  } catch (error) {
    console.log(`Error in CALL_SERVER_FROM_WEBVIEW`, error);
    player.emitRaw(CALL_SERVER_FROM_WEBVIEW_RESPONSE, {
      id,
      error: error instanceof z.ZodError ? error.issues.map((issue) => issue.message) : error,
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
