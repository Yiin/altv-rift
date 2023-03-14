import { Player } from "alt-server";
import { createPinia } from "pinia";
import { usePlayerStore } from "@shared/store/player.store";
import { subscribeToStore } from "@shared/store/utils";
import { ClientEvents } from "@shared/events/client";
import { Config } from "@/utility/config";
import { clearMessageHistory } from "@/modules/chat";

declare module "alt-server" {
  export interface Player {
    setup: (this: Player) => void;
  }
}

Player.prototype.setup = function () {
  if (this.store) {
    return;
  }

  clearMessageHistory(this);

  this.pinia = createPinia();
  this.store = usePlayerStore(this.pinia);

  subscribeToStore(this.store, {
    onSetState: (state) => {
      this.emitRaw(ClientEvents.FromServer.SET_STATE, state);
    },
    onUpdateState: (payload) => {
      this.emitRaw(ClientEvents.FromServer.UPDATE_STATE, payload);
    },
  });

  const pings: number[] = [];

  this.addInterval(() => {
    if (pings.length > 10) {
      pings.shift();
    }
    pings.push(this.ping);
    this.store.avgPing = pings.reduce((a, b) => a + b) / pings.length;
  }, 1000);

  // Setup Webview
  if (Config.getVueDebugMode()) {
    this.emitRaw(
      ClientEvents.FromServer.SETUP_WEBVIEW,
      Config.getViteServer(this.name)
    );
  } else {
    this.emitRaw(ClientEvents.FromServer.SETUP_WEBVIEW);
  }
};
