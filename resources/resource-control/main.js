import alt from "@altv/server";
import ipc from "node-ipc";

ipc.config.id = "altvServer";
ipc.config.retry = 1500;
ipc.config.silent = true;

ipc.serve(() => {
  ipc.server.on("kick-all", kickAll);
});

ipc.server.start();

function kickAll() {
  alt.Player.all.forEach((player) => {
    player.kick("Restarting Server");
  });
}

// alt.Events.onPlayer()

alt.Events.onPlayerDisconnect(({ reason }) => {
  if (reason === "timed out") {
    ipc.connectTo("watcher", () => {
      ipc.of.watcher.on("connect", () => {
        ipc.of.watcher?.emit("restart-server", "client");
        ipc.disconnect("watcher");
      });
    });
  }
});
