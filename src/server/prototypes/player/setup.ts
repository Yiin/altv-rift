import { Player } from "alt-server";
import { createPinia } from "pinia";
import { minutesToMilliseconds } from "date-fns";
import { usePlayerStore } from "@shared/store/player.store";
import { subscribeToStore } from "@shared/store/utils";
import { ClientEvents } from "@shared/events/client";
import { Config } from "@/utility/config";
import { clearMessageHistory, show } from "@/modules/chat";
import { serverStore } from "@/store/server.store";

declare module "alt-server" {
  export interface Player {
    pinia: import("pinia").Pinia;
    store: ReturnType<typeof usePlayerStore>;
    setup: (this: Player) => void;
  }
}

Player.prototype.setup = function () {
  if (this.store) {
    return;
  }

  clearMessageHistory(this);

  show(this);

  // Player state
  this.pinia = createPinia();
  this.store = usePlayerStore(this.pinia);

  subscribeToStore(this.store, {
    onSetState: (state) => {
      this.emitRaw(ClientEvents.FromServer.SET_PLAYER_STATE, state);
    },
    onUpdateState: (payload) => {
      this.emitRaw(ClientEvents.FromServer.UPDATE_PLAYER_STATE, payload);
    },
  });

  // Server state
  subscribeToStore(serverStore, {
    onSetState: (state) => {
      this.emitRaw(ClientEvents.FromServer.SET_SERVER_STATE, state);
    },
    onUpdateState: (payload) => {
      this.emitRaw(ClientEvents.FromServer.UPDATE_SERVER_STATE, payload);
    },
  });

  // Track avg ping
  // const pings: number[] = [];
  // this.addInterval(() => {
  //   while (pings.length > 10) {
  //     pings.shift();
  //   }
  //   pings.push(this.ping);
  //   this.store.avgPing = pings.reduce((a, b) => a + b) / pings.length;
  // }, secondsToMilliseconds(1));

  // Periodically save character
  this.addInterval(() => {
    this.saveCharacter();
  }, minutesToMilliseconds(1));

  // Setup Webview
  if (Config.getVueDebugMode()) {
    this.emitRaw(ClientEvents.FromServer.SETUP_WEBVIEW, Config.getViteServer());
  } else {
    this.emitRaw(ClientEvents.FromServer.SETUP_WEBVIEW);
  }
};
