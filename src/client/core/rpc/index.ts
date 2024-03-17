import { callServer, registerServer, unregisterServer } from "./with-server";
import { callWebview, registerWebview, unregisterWebview } from "./with-webview";
import "./server-webview-middleware";

export const rpc = {
  callServer,
  registerServer,
  unregisterServer,
  callWebview,
  registerWebview,
  unregisterWebview,
};
