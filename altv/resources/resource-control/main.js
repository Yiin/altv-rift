import alt from "@altv/server";
import WebSocket from "ws";

let ws;
let wasAlive = false;

function connect() {
  if (ws && ws.readyState !== ws.CLOSED) {
    ws.close();
  }
  ws = new WebSocket(`ws://localhost:5000`);

  ws.on("open", () => {
    wasAlive = true;
    console.log("[resource-control] Connected");
  });

  ws.on("message", (message) => {
    message = message.toString();

    alt.log('received message', message);

    if (message === "kick-all") {
      console.log("[resource-control] Kicking all players");
      kickAll();
    }
  });

  ws.on("close", () => {
    if (wasAlive) {
      wasAlive = false;
      console.log("[resource-control] Disconnected");
    }
    setTimeout(connect, 1000);
  });
}

connect();

function kickAll() {
  alt.Player.all.forEach((player) => {
    player.kick("Restarting Server");
  });
}
