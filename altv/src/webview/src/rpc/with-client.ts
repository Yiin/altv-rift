import { ClientCall } from "@shared/calls/client";
import { type CallFromWebview } from "@shared/calls/client/from-webview";
import {
  CALL_CLIENT_FROM_WEBVIEW,
  CALL_CLIENT_FROM_WEBVIEW_RESPONSE,
  CALL_WEBVIEW_FROM_CLIENT,
  CALL_WEBVIEW_FROM_CLIENT_RESPONSE,
} from "@shared/calls/constants";
import { WebviewCall } from "@shared/calls/webview";
import { type CallFromClient } from "@shared/calls/webview/from-client";
import { createPayload } from "@shared/utility/create-payload";

const clientProcedures = new Map<string, (args: any) => any>();
const clientHandlers = new Map<string, { name: string; resolve: Function; reject: Function }>();

// call client from browser
export const callClient = async <T extends keyof typeof ClientCall.FromWebview>(
  name: T,
  ...args: Parameters<CallFromWebview[T]>
) => {
  return new Promise<ReturnType<CallFromWebview[T]>>((resolve, reject) => {
    const payload = createPayload(name, args);

    alt.emitRaw(CALL_CLIENT_FROM_WEBVIEW, payload);
    clientHandlers.set(payload.id, { name, resolve, reject });
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

  if (handler.name in ClientCall.FromWebviewValidation) {
    const schema =
      ClientCall.FromWebviewValidation[
        handler.name as keyof typeof ClientCall.FromWebviewValidation
      ];

    if ("returns" in schema) {
      // @ts-expect-error remove this comment if needed
      const result = schema.returns.safeParse(response.result);

      if (!result.success) {
        console.warn(
          `CALL_CLIENT_FROM_WEBVIEW_RESPONSE: Validation error in ${handler.name}:`,
          result.error,
        );
        handler.reject(result.error);
      }
    }
  } else {
    console.warn(`CALL_CLIENT_FROM_WEBVIEW_RESPONSE: No validation schema for ${handler.name}`);
  }

  handler.resolve(response.result);
});

// receive from client on browser
export const registerClient = <T extends keyof typeof WebviewCall.FromClient>(
  name: T,
  callback: CallFromClient[T],
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

    if (name in WebviewCall.FromClientValidation) {
      const schema =
        WebviewCall.FromClientValidation[name as keyof typeof WebviewCall.FromClientValidation];

      if ("args" in schema) {
        // @ts-expect-error remove this comment if needed
        const result = schema.args.safeParse(args);

        if (!result.success) {
          console.warn(`CALL_WEBVIEW_FROM_CLIENT: Validation error in ${name}:`, result.error);
          throw result.error;
        }
      }
    } else {
      console.warn(`CALL_WEBVIEW_FROM_CLIENT: No validation schema for ${name}`);
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
