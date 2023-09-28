import { ClientCall } from "@shared/calls/client";
import { CallFromWebview } from "@shared/calls/client/from-webview";
import {
  CALL_CLIENT_FROM_WEBVIEW,
  CALL_CLIENT_FROM_WEBVIEW_RESPONSE,
  CALL_WEBVIEW_FROM_CLIENT,
  CALL_WEBVIEW_FROM_CLIENT_RESPONSE,
} from "@shared/calls/constants";
import { WebviewCall } from "@shared/calls/webview";
import { CallFromClient } from "@shared/calls/webview/from-client";
import { createPayload } from "@shared/utility/create-payload";

const clientProcedures = new Map<string, (args: any) => any>();
const clientHandlers = new Map<string, { resolve: Function; reject: Function }>();

// call client from browser
export const callClient = async <T extends keyof typeof ClientCall.FromWebview>(
  name: T,
  ...args: Parameters<CallFromWebview[T]>
) => {
  return new Promise<ReturnType<CallFromWebview[T]>>((resolve, reject) => {
    const payload = createPayload(name, args);

    alt.emitRaw(CALL_CLIENT_FROM_WEBVIEW, payload);
    clientHandlers.set(payload.id, { resolve, reject });
  });
};

alt.on(CALL_CLIENT_FROM_WEBVIEW_RESPONSE, (response) => {
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

// receive from client on browser
export const registerClient = <T extends keyof typeof WebviewCall.FromClient>(
  name: T,
  callback: CallFromClient[T]
) => {
  if (clientProcedures.has(name)) {
    throw new Error(`registerClient: Procedure ${name} already exists`);
  }
  clientProcedures.set(name, callback);
};

export const unregisterClient = <T extends keyof typeof WebviewCall.FromClient>(name: T) => {
  clientProcedures.delete(name);
};

alt.on(CALL_WEBVIEW_FROM_CLIENT, async (payload) => {
  const { id, name, args } = payload;
  const callback = clientProcedures.get(name);

  try {
    if (!callback) {
      throw new Error(`CALL_WEBVIEW_FROM_CLIENT: Procedure ${name} does not exist`);
    }

    const result = await callback(args);

    alt.emitRaw(CALL_WEBVIEW_FROM_CLIENT_RESPONSE, {
      id,
      result,
    });
  } catch (error) {
    alt.emitRaw(CALL_WEBVIEW_FROM_CLIENT_RESPONSE, {
      id,
      error,
    });
  }
});
