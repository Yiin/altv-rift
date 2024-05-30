import { WebSocketServer } from "ws";
import { Subprocess, spawn, $ } from "bun";
import Watcher from "watcher";
import { debounce } from "lodash";
import fkill from "fkill";

const altvProcessName = process.platform === "win32" ? "./altv-server.exe" : "./altv-server";

console.log(`Current path: ${process.cwd()}`, __dirname, __filename);

const ws = new WebSocketServer({ port: 5000 });

const DEBUG_PORT = 9223;

let childProcess: Subprocess | null = null;

function kickAllPlayers() {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 5000);

    for (const client of ws.clients) {
      client.send("kick-all");
    }
  });
}

ws.on("connection", (client) => {
  client.on("message", (message) => {
    if (message.toString() === "restart-server") {
      restartServer();
    }
  });
});

ws.on("error", (error) => {
  console.error(error);
});

let restarting = false;

async function restartServer() {
  if (restarting) {
    return;
  }

  restarting = true;

  await kickAllPlayers();

  if (childProcess) {
    await childProcess.kill(9);
  }

  // just in case
  await $`kill -9 $(lsof -t -i:7788)`.then(() => {
    console.log("Just in case was needed");
  }).catch(() => { });

  childProcess = spawn([altvProcessName, "--convert-config-format"], {
    stdio: ["ignore", "inherit", "inherit"],
    stdout: "inherit",
  });

  // give some time for the server to initialize
  await Bun.sleep(1000);

  restarting = false;
}

const serverWatcher = new Watcher(["./src/server/**/*.ts", "./src/shared/**/*.ts"], {
  recursive: true,
  renameDetection: true,
});
const clientWatcher = new Watcher(["./src/client/**/*.ts", "./src/shared/**/*.ts"], {
  recursive: true,
  renameDetection: true,
});
const assetsWatcher = new Watcher(["./src/client/**/*.rcss"], {
  recursive: true,
  renameDetection: true,
});

const building = new Set();

serverWatcher.on("change", () => {
  building.add("server");
});

clientWatcher.on("change", () => {
  building.add("client");
});

assetsWatcher.on("change", () => {
  restartServer();
});

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
      // body: "serverPassword",
    });
  } catch (error) {
    console.log(error);
  }
}

process.on("exit", exitHandler);
process.on("beforeExit", exitHandler);
process.on("SIGINT", exitHandler);
process.on("SIGTERM", exitHandler);
process.on("SIGUSR2", exitHandler);

async function exitHandler() {
  if (childProcess) {
    await $`npx fkill-cli -f ${childProcess.pid}`;
  }
  process.exit();
}
