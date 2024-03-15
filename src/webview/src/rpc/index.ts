import { callClient, registerClient, unregisterClient } from "./with-client";
import { callServer, registerServer, unregisterServer } from "./with-server";

export const rpc = {
  callClient,
  registerClient,
  unregisterClient,
  callServer,
  registerServer,
  unregisterServer,
};
