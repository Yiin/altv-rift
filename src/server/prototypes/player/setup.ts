import { Player } from "alt-server";
import { createPinia } from "pinia";
import { Events } from "@shared/constants/events";
import { usePlayerStore } from "@shared/store/player.store";
import { subscribeToStore } from "@shared/store/utils";
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
      this.emitRaw(Events.Client.SET_STATE, state);
    },
    onUpdateState: (payload) => {
      this.emitRaw(Events.Client.UPDATE_STATE, payload);
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
    this.emitRaw(Events.Client.SETUP_WEBVIEW, Config.getViteServer(this.name));
  } else {
    this.emitRaw(Events.Client.SETUP_WEBVIEW);
  }
};
