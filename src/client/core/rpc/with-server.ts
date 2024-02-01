import * as alt from "@altv/client";
import { z } from "zod";
import {
  CALL_SERVER_FROM_CLIENT,
  CALL_SERVER_FROM_CLIENT_RESPONSE,
  CALL_CLIENT_FROM_SERVER,
  CALL_CLIENT_FROM_SERVER_RESPONSE,
} from "@shared/calls/constants";
import { ClientCall } from "@shared/calls/client";
import { CallFromServer } from "@shared/calls/client/from-server";
import { ServerCall } from "@shared/calls/server";
import { CallFromClient } from "@shared/calls/server/from-client";
import { createPayload } from "@shared/utility/create-payload";

const serverProcedures = new Map<string, (...args: any[]) => any>();
const serverHandlers = new Map<
  string,
  { name: string, resolve: (result: any) => void; reject: (err: any) => void }
>();

// call server from client
export const callServer = <T extends keyof typeof ServerCall.FromClient>(
  name: T,
  ...args: Shift<Parameters<CallFromClient[T]>>
) => {
  return new Promise<ReturnType<CallFromClient[T]>>((resolve, reject) => {
    const payload = createPayload(name, args);

    alt.Events.emitServerRaw(CALL_SERVER_FROM_CLIENT, payload);
    serverHandlers.set(payload.id, { name, resolve, reject });
  });
};

// get response from server on client
alt.Events.onServer(CALL_SERVER_FROM_CLIENT_RESPONSE, (response) => {
  const handler = serverHandlers.get(response.id);
  if (!handler) {
    return;
  }
  serverHandlers.delete(response.id);

  if (response.error) {
    handler.reject(response);
    return;
  }

  if (handler.name in ServerCall.FromClientValidation) {
    const schema = ServerCall.FromClientValidation[handler.name as keyof typeof ServerCall.FromClientValidation];

    if ('returns' in schema) {
      const result = schema.returns.safeParse(response.result);

      if (!result.success) {
        alt.logError(`CALL_SERVER_FROM_CLIENT_RESPONSE: Validation error in ${handler.name}:`, result.error);
        handler.reject(result.error);
      }
    }
  } else {
    alt.logWarning(`CALL_SERVER_FROM_CLIENT_RESPONSE: No validation schema for ${handler.name}`);
  }

  handler.resolve(response.result);
});

// handle call from server on client
export const registerServer = <T extends keyof typeof ClientCall.FromServer>(
  name: T,
  handler: CallFromServer[T]
) => {
  if (serverProcedures.has(name)) {
    throw new Error(`registerServer: Procedure ${name} already exists`);
  }
  serverProcedures.set(name, handler);
};

export const unregisterServer = <T extends keyof typeof ClientCall.FromServer>(name: T) => {
  serverProcedures.delete(name);
};

// receive call from server on client
alt.Events.onServer(CALL_CLIENT_FROM_SERVER, async (payload) => {
  const { id, name, args } = payload;
  const callback = serverProcedures.get(name);

  try {
    if (!callback) {
      throw new Error(`CALL_CLIENT_FROM_SERVER: Procedure ${name} does not exist`);
    }

    if (name in ClientCall.FromServerValidation) {
      const schema = ClientCall.FromServerValidation[name as keyof typeof ClientCall.FromServerValidation];

      if ('args' in schema) {
        z.tuple(schema.args).parse(args);
      }
    } else {
      alt.logWarning(`CALL_CLIENT_FROM_SERVER: No validation schema for ${name}`);
    }

    const result = await callback(...args);

    alt.Events.emitServerRaw(CALL_CLIENT_FROM_SERVER_RESPONSE, {
      id,
      result,
    });
  } catch (error) {
    alt.Events.emitServerRaw(CALL_CLIENT_FROM_SERVER_RESPONSE, {
      id,
      error,
    });
  }
});
