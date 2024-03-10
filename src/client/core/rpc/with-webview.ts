import alt from "@altv/client";
import { z } from "zod";
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
import { deserialize } from "@shared/utility/serializer";
import { useWebview } from "@/core/user-interface/webview";

const webviewProcedures = new Map<string, any>();
const webviewHandlers = new Map<
  string,
  { name: string; resolve: (result: any) => void; reject: (err: any) => void }
>();

// call webview from client
export const callWebview = async <T extends keyof typeof WebviewCall.FromClient>(
  name: T,
  ...args: Shift<Parameters<CallFromClient[T]>>
) => {
  return new Promise<ReturnType<CallFromClient[T]>>((resolve, reject) => {
    const payload = createPayload(name, args);

    useWebview(webview => webview.emitRaw(CALL_WEBVIEW_FROM_CLIENT, payload));
    webviewHandlers.set(payload.id, { name, resolve, reject });
  });
};

// get response from webview on client
useWebview((webview) =>
  webview.on(CALL_WEBVIEW_FROM_CLIENT_RESPONSE, (response) => {
    response = deserialize(response);

    const handler = webviewHandlers.get(response.id);
    if (!handler) {
      return;
    }
    webviewHandlers.delete(response.id);

    if (response.error) {
      handler.reject(response);
      return;
    }

    if (handler.name in WebviewCall.FromClientValidation) {
      const schema = WebviewCall.FromClientValidation[handler.name as keyof typeof WebviewCall.FromClientValidation];

      if ('returns' in schema) {
        // @ts-expect-error remove this comment if needed
        const result = schema.returns.safeParse(response.result);

        if (!result.success) {
          alt.logError(`CALL_WEBVIEW_FROM_CLIENT_RESPONSE: Validation error in ${handler.name}:`, result.error);
          handler.reject(result.error);
        }
      }
    } else {
      alt.logWarning(`CALL_WEBVIEW_FROM_CLIENT_RESPONSE: No validation schema for ${handler.name}`);
    }

    handler.resolve(response.result);
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

export const unregisterWebview = <T extends keyof typeof ClientCall.FromWebview>(name: T) => {
  webviewProcedures.delete(name);
};

// handle call from webview on client
useWebview((webview) => {
  webview.on(CALL_CLIENT_FROM_WEBVIEW, async (payload) => {
    const { id, name, args } = deserialize(payload);
    const callback = webviewProcedures.get(name);

    try {
      if (!callback) {
        throw new Error(`CALL_CLIENT_FROM_WEBVIEW: Procedure ${name} does not exist`);
      }

      if (name in ClientCall.FromWebviewValidation) {
        const schema = ClientCall.FromWebviewValidation[name as keyof typeof ClientCall.FromWebviewValidation];

        if ('args' in schema) {
          // @ts-ignore
          z.tuple(schema).parse(args);
        }
      } else {
        alt.logWarning(`CALL_SERVER_FROM_WEBVIEW: No validation schema for ${name}`);
      }

      const result = await callback(...args);
      webview.emitRaw(CALL_CLIENT_FROM_WEBVIEW_RESPONSE, {
        id,
        result,
      });
    } catch (error) {
      webview.emitRaw(CALL_CLIENT_FROM_WEBVIEW_RESPONSE, {
        id,
        error,
      });
    }
  });
});
