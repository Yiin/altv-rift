import { createPayload } from "../../../shared/rpc";

const clientProcedures = new Map<string, (args: any) => any>();
const clientHandlers = new Map<
  string,
  { resolve: Function; reject: Function }
>();

// call client from browser
const callClient = async <T>(name: string, ...args: any[]) => {
  return new Promise<T>((resolve, reject) => {
    const payload = createPayload(name, args);

    alt.emit("call:client", payload);
    clientHandlers.set(payload.id, { resolve, reject });
  });
};

alt.on("call:client:response", (response) => {
  const handler = clientHandlers.get(response.id);
  if (!handler) {
    return;
  }
  clientHandlers.delete(response.id);

  if (response.error) {
    handler.reject(response.error);
    return;
  }
  handler.resolve(response.result);
});

// receive from client on browser
const registerClient = (name: string, callback: (args: any[]) => void) => {
  if (clientProcedures.has(name)) {
    throw new Error(`registerClient: Procedure ${name} already exists`);
  }
  clientProcedures.set(name, callback);
};

const unregisterClient = (name: string) => {
  clientProcedures.delete(name);
};

alt.on("call:webview", async (payload) => {
  const { id, name, args } = payload;
  const callback = clientProcedures.get(name);

  try {
    if (!callback) {
      throw new Error(`call:webview: Procedure ${name} does not exist`);
    }

    const result = await callback(args);

    alt.emit("call:webview:response", {
      id,
      result,
    });
  } catch (error) {
    alt.emit("call:webview:response", {
      id,
      error,
    });
  }
});

export const rpc = { callClient, registerClient, unregisterClient };
