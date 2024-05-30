import WebSocket from "ws";
import { debounce } from "lodash-es";

let ws: WebSocket | undefined;
let wasAlive = false;

function connect() {
  if (ws && ws.readyState !== ws.CLOSED) {
    ws.close();
  }
  ws = new WebSocket(`ws://server:5000`);

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

connect();

export const reloadResource = debounce(async (side) => {
  if (ws && ws.readyState === ws.OPEN) {
    ws.send("restart-server");
  } else {
    console.log("[build] Ws server not connected");
  }
});
