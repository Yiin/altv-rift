import {
  CALL_SERVER_FROM_WEBVIEW,
  CALL_SERVER_FROM_WEBVIEW_RESPONSE,
  CALL_WEBVIEW_FROM_SERVER,
  CALL_WEBVIEW_FROM_SERVER_RESPONSE,
} from "@shared/calls/constants";
import { ServerCall } from "@shared/calls/server";
import { type CallFromWebview } from "@shared/calls/server/from-webview";
import { WebviewCall } from "@shared/calls/webview";
import { type CallFromServer } from "@shared/calls/webview/from-server";
import { createPayload } from "@shared/utility/create-payload";
import { deserialize } from "@shared/utility/serializer";

const serverProcedures = new Map<string, (args: any) => any>();
const serverHandlers = new Map<string, { name: string; resolve: Function; reject: Function }>();

export const callServer = async <T extends keyof typeof ServerCall.FromWebview>(
  name: T,
  ...args: Parameters<CallFromWebview[T]>
) => {
  return new Promise<ReturnType<CallFromWebview[T]>>((resolve, reject) => {
    const payload = createPayload(name, args);

    alt.emitRaw(CALL_SERVER_FROM_WEBVIEW, payload);
    serverHandlers.set(payload.id, { name, resolve, reject });
  });
};

alt.on(CALL_SERVER_FROM_WEBVIEW_RESPONSE, (response) => {
  const handler = serverHandlers.get(response.id);
  if (!handler) {
    return;
  }
  serverHandlers.delete(response.id);

  if (response.error) {
    console.log(`CALL_SERVER_FROM_WEBVIEW_RESPONSE: Error in ${handler.name}:`, response.error);
    handler.reject(deserialize(response.error));
    return;
  }

  if (handler.name in ServerCall.FromWebviewValidation) {
    const schema =
      ServerCall.FromWebviewValidation[
        handler.name as keyof typeof ServerCall.FromWebviewValidation
      ];

    if ("returns" in schema) {
      const result = schema.returns.safeParse(response.result);

      if (!result.success) {
        console.warn(
          `CALL_SERVER_FROM_WEBVIEW_RESPONSE: Validation error in ${handler.name}:`,
          result.error,
        );
        handler.reject(result.error);
      }
    }
  } else {
    console.warn(`CALL_SERVER_FROM_WEBVIEW_RESPONSE: No validation schema for ${handler.name}`);
  }

  handler.resolve(response.result && deserialize(response.result));
});

export const registerServer = <T extends keyof typeof WebviewCall.FromServer>(
  name: T,
  callback: CallFromServer[T],
) => {
  if (serverProcedures.has(name)) {
    throw new Error(`registerServer: Procedure ${name} already exists`);
  }
  serverProcedures.set(name, callback);
};

export const unregisterServer = <T extends keyof typeof WebviewCall.FromServer>(name: T) => {
  serverProcedures.delete(name);
};

alt.on(CALL_WEBVIEW_FROM_SERVER, async (payload) => {
  const { id, name, args } = payload;
  const callback = serverProcedures.get(name);

  try {
    if (!callback) {
      throw new Error(`CALL_WEBVIEW_FROM_SERVER: Procedure ${name} does not exist`);
    }

    if (name in WebviewCall.FromServerValidation) {
      const schema =
        WebviewCall.FromServerValidation[name as keyof typeof WebviewCall.FromServerValidation];

      if ("args" in schema) {
        // @ts-expect-error remove this comment if needed
        schema.args.safeParse(args);
      }
    } else {
      console.warn(`CALL_WEBVIEW_FROM_SERVER: No validation schema for ${name}`);
    }

    const result = await callback(args);

    alt.emitRaw(CALL_WEBVIEW_FROM_SERVER_RESPONSE, {
      id,
      result,
    });
  } catch (error) {
    alt.emitRaw(CALL_WEBVIEW_FROM_SERVER_RESPONSE, {
      id,
      error,
    });
  }
});
