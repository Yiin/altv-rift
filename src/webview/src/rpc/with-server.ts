import {
  CALL_SERVER_FROM_WEBVIEW,
  CALL_SERVER_FROM_WEBVIEW_RESPONSE,
  CALL_WEBVIEW_FROM_SERVER,
  CALL_WEBVIEW_FROM_SERVER_RESPONSE,
} from "@shared/calls/constants";
import { ServerCall } from "@shared/calls/server";
import { CallFromWebview } from "@shared/calls/server/from-webview";
import { WebviewCall } from "@shared/calls/webview";
import { CallFromServer } from "@shared/calls/webview/from-server";
import { createPayload } from "@shared/utility/create-payload";

const serverProcedures = new Map<string, (args: any) => any>();
const serverHandlers = new Map<
  string,
  { resolve: Function; reject: Function }
>();

export const callServer = async <T extends keyof typeof ServerCall.FromWebview>(
  name: T,
  ...args: Shift<Parameters<CallFromWebview[T]>>
) => {
  return new Promise<T>((resolve, reject) => {
    const payload = createPayload(name, args);

    alt.emit(CALL_SERVER_FROM_WEBVIEW, payload);
    serverHandlers.set(payload.id, { resolve, reject });
  });
};

alt.on(CALL_SERVER_FROM_WEBVIEW_RESPONSE, (response) => {
  const handler = serverHandlers.get(response.id);
  if (!handler) {
    return;
  }
  serverHandlers.delete(response.id);

  if (response.error) {
    handler.reject(response);
    return;
  }
  handler.resolve(response.result);
});

export const registerServer = <T extends keyof typeof WebviewCall.FromServer>(
  name: T,
  callback: CallFromServer[T]
) => {
  if (serverProcedures.has(name)) {
    throw new Error(`registerServer: Procedure ${name} already exists`);
  }
  serverProcedures.set(name, callback);
};

export const unregisterServer = <T extends keyof typeof WebviewCall.FromServer>(
  name: T
) => {
  serverProcedures.delete(name);
};

alt.on(CALL_WEBVIEW_FROM_SERVER, async (payload) => {
  const { id, name, args } = payload;
  const callback = serverProcedures.get(name);

  try {
    if (!callback) {
      throw new Error(
        `CALL_WEBVIEW_FROM_SERVER: Procedure ${name} does not exist`
      );
    }

    const result = await callback(args);

    alt.emit(CALL_WEBVIEW_FROM_SERVER_RESPONSE, {
      id,
      result,
    });
  } catch (error) {
    alt.emit(CALL_WEBVIEW_FROM_SERVER_RESPONSE, {
      id,
      error,
    });
  }
});
