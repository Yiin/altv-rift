import * as alt from "@altv/server"
import ipc from 'node-ipc';

// file change -> mark restart
// build done -> notify restart
// restart -> <kick players>, kill server, start server, reconnect

ipc.config.id = 'altvServer';
ipc.config.retry = 1500;
ipc.config.silent = true;

ipc.serve(() => {
  ipc.server.on('kick-all', kickAll);
});

ipc.server.start();

async function kickAll() {
  alt.Player.all.forEach((player) => {
    player.kick("Restarting Server");
  });
}
