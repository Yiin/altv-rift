import {
  CALL_CLIENT_FROM_WEBVIEW,
  CALL_CLIENT_FROM_WEBVIEW_RESPONSE,
  CALL_WEBVIEW_FROM_CLIENT,
  CALL_WEBVIEW_FROM_CLIENT_RESPONSE,
} from "@shared/calls/constants";
import { ClientCall } from "@shared/calls/client";
import { CallFromWebview } from "@shared/calls/client/from-webview";
import { WebviewCall } from "@shared/calls/webview";
import { CallFromClient } from "@shared/calls/webview/from-client";
import { createPayload } from "@shared/utility/create-payload";
import { getWebview } from "@/utility/user-interface";
import { deserialize, serialize } from "./serialization";

const webviewProcedures = new Map<string, any>();
const webviewHandlers = new Map<
  string,
  { resolve: (result: any) => void; reject: (err: any) => void }
>();

// call webview from client
export const callWebview = async <
  T extends keyof typeof WebviewCall.FromClient
>(
  name: T,
  ...args: Shift<Parameters<CallFromClient[T]>>
) => {
  return new Promise<ReturnType<CallFromClient[T]>>((resolve, reject) => {
    const payload = createPayload(name, serialize(args));

    getWebview().emit(CALL_WEBVIEW_FROM_CLIENT, payload);
    webviewHandlers.set(payload.id, { resolve, reject });
  });
};

// get response from webview on client
getWebview((webview) =>
  webview.on(CALL_WEBVIEW_FROM_CLIENT_RESPONSE, (response) => {
    const handler = webviewHandlers.get(response.id);
    if (!handler) {
      return;
    }
    webviewHandlers.delete(response.id);

    if (response.error) {
      handler.reject(response);
      return;
    }
    handler.resolve(deserialize(response.result));
  })
);

// receive from webview on client
export const registerWebview = <T extends keyof typeof ClientCall.FromWebview>(
  name: T,
  handler: Asyncify<CallFromWebview>[T]
) => {
  if (webviewProcedures.has(name)) {
    throw new Error(`registerWebview: Procedure ${name} already exists`);
  }
  webviewProcedures.set(name, handler);
};

export const unregisterWebview = <
  T extends keyof typeof ClientCall.FromWebview
>(
  name: T
) => {
  webviewProcedures.delete(name);
};

// handle call from webview on client
getWebview((webview) => {
  webview.on(CALL_CLIENT_FROM_WEBVIEW, async (payload) => {
    const { id, name, args } = payload;
    const callback = webviewProcedures.get(name);

    try {
      if (!callback) {
        throw new Error(
          `CALL_CLIENT_FROM_WEBVIEW: Procedure ${name} does not exist`
        );
      }
      const result = await callback(...args);
      webview.emit(CALL_CLIENT_FROM_WEBVIEW_RESPONSE, {
        id,
        result,
      });
    } catch (error: any) {
      webview.emit(CALL_CLIENT_FROM_WEBVIEW_RESPONSE, {
        id,
        error: error.error,
      });
    }
  });
});
