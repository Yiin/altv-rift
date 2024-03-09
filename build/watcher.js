import { spawn } from 'child_process';
import ipc from 'node-ipc';
import Watcher from 'watcher';
import fkill from 'fkill'
import { debounce } from 'lodash-es';

const altvProcessName = process.platform === "win32" ? './altv-server.exe' : './altv-server'

ipc.config.id = 'watcher';
ipc.config.retry = 1500;
ipc.config.silent = true;

ipc.serve(() => {
  ipc.server.on('restart-server', restartServer);
});
ipc.server.start();

const serverWatcher = new Watcher(['./src/server/**/*.ts', './src/shared/**/*.ts'], { recursive: true, renameDetection: true });
const clientWatcher = new Watcher(['./src/client/**/*.ts', './src/shared/**/*.ts'], { recursive: true, renameDetection: true });
const assetsWatcher = new Watcher(['./src/client/**/*.rcss'], { recursive: true, renameDetection: true });

const building = new Set();

serverWatcher.on('change', () => {
  building.add('server');
});

clientWatcher.on('change', () => {
  building.add('client');
});

assetsWatcher.on('change', () => {
  restartServer('client');
});

const DEBUG_PORT = 9223;

let childProcess = undefined

const disconnectFromAltvServerIpc = debounce(() => {
  ipc.disconnect('altvServer');
}, 3000);

function kickAllPlayers() {
  return new Promise(resolve => {
    setTimeout(resolve, 5000);

    ipc.connectTo('altvServer', () => {
      ipc.of.altvServer.on('connect', () => {
        if (ipc.of.altvServer) {
          ipc.of.altvServer.emit('kick-all');
          disconnectFromAltvServerIpc();
        }
        resolve();
      });
    });
  })
}

async function restartServer() {
  if (childProcess) {
    await kickAllPlayers();
    await wait(500);

    try {
      await fkill(':8888');
    } catch { }

    if (!childProcess.killed) {
      try {
        childProcess.kill();
      } catch { }
    }
  }

  childProcess = spawn(altvProcessName, ['--convert-config-format'], { stdio: 'inherit' });

  await wait(3000);

  await tryToReconnect();
}

restartServer();

async function getLocalClientStatus() {
  try {
    const response = await fetch(`http://127.0.0.1:${DEBUG_PORT}/status`);
    return response.text();
  } catch {
    return null;
  }
}

export async function tryToReconnect() {
  const status = await getLocalClientStatus();

  if (status !== "IN_GAME" && status !== "MAIN_MENU") return;

  try {
    await fetch(`http://127.0.0.1:${DEBUG_PORT}/reconnect`, {
      method: "POST",
      // body: "serverPassword", // only needed when a password is set in the server.toml
    });
  } catch (error) {
    console.log(error);
  }
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

process.on('exit', exitHandler);
process.on('beforeExit', exitHandler);
process.on('SIGINT', exitHandler);
process.on('SIGTERM', exitHandler);
process.on('SIGUSR2', exitHandler);

async function exitHandler() {
  childProcess.kill();
  process.exit();
}
