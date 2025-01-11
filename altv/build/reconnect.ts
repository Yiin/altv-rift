import WebSocket from "ws";
import { isDev } from "./env";

let ws: WebSocket | undefined;
let wasAlive = false;

if (isDev()) {
  connect();
}

function connect() {
  if (ws && ws.readyState !== ws.CLOSED) {
    ws.close();
  }
  ws = new WebSocket(`ws://server:6000`);

  ws.on("open", () => {
    wasAlive = true;
    console.log("[build] Ws server connection opened");
  });

  ws.on("close", (e) => {
    if (wasAlive) {
      wasAlive = false;
      console.log("[build] Ws server connection closed");
    }
    setTimeout(connect, 1000);
  });
}

export function reloadResource() {
  if (!isDev()) {
    return;
  }
  if (ws && ws.readyState === ws.OPEN) {
    ws.send("restart-server");
  } else {
    console.log("[build] Ws server not connected");
  }
}
