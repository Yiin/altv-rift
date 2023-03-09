import alt from "alt-server";
import { createPayload } from "../../shared/rpc";

const handlers = new Map<
  string,
  { resolve: (result: any) => void; reject: (err: any) => void }
>();

const clientProcedures = new Map<
  string,
  (player: alt.Player, ...args: any[]) => any
>();

// call client from server
const callClient = (player: alt.Player, name: string, ...args: any[]) => {
  return new Promise((resolve, reject) => {
    const payload = createPayload(name, args);

    player.emitRaw("call:client", payload);
    handlers.set(payload.id, { resolve, reject });
  });
};

alt.onClient("call:client:response", (_, response) => {
  const handler = handlers.get(response.id);
  if (!handler) {
    return;
  }
  handlers.delete(response.id);

  if (response.error) {
    handler.reject(response.error);
    return;
  }
  handler.resolve(response.result);
});

// receive from client on server
const registerClient = (
  name: string,
  callback: (player: alt.Player, ...args: any[]) => void
) => {
  if (clientProcedures.has(name)) {
    throw new Error(`registerClient: Procedure ${name} already exists`);
  }
  clientProcedures.set(name, callback);
};

const unregisterClient = (name: string) => {
  clientProcedures.delete(name);
};

alt.onClient("call:server", async (player, payload) => {
  const { id, name, args } = payload;
  const callback = clientProcedures.get(name);

  try {
    if (!callback) {
      throw new Error(`call:server: Procedure ${name} does not exist`);
    }

    const result = await callback(player, ...args);
    player.emitRaw("call:server:response", {
      id,
      result,
    });
  } catch (error) {
    player.emitRaw("call:server:response", {
      id,
      error,
    });
  }
});

export const rpc = {
  callClient,
  registerClient,
  unregisterClient,
};
