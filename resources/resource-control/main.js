import alt from "@altv/server"
import ipc from 'node-ipc';

ipc.config.id = 'altvServer';
ipc.config.retry = 1500;
ipc.config.silent = true;

ipc.serve(() => {
  ipc.server.on('kick-all', kickAll);
});

ipc.server.start();

function kickAll() {
  alt.Player.all.forEach((player) => {
    player.kick("Restarting Server");
  });
}
