import alt from "alt-server";
import { minutesToMilliseconds } from "date-fns";
import { ClientEvents } from "@shared/events/client";
import { Config } from "@/utility/config";
import { clearMessageHistory, show } from "@/modules/chat";
import { isInGame } from "@/utility/assertions";

declare module "alt-server" {
  export interface Player {
    setup: (this: Player) => void;
  }
}

alt.Player.prototype.setup = function () {
  if (this.pinia) {
    return;
  }

  clearMessageHistory(this);

  show(this);

  // Periodically save character
  this.addInterval(() => {
    if (isInGame(this)) {
      this.saveCharacter();
    }
  }, minutesToMilliseconds(1));

  // Setup Webview
  if (Config.getVueDebugMode()) {
    this.emitRaw(ClientEvents.FromServer.SETUP_WEBVIEW, Config.getViteServer());
  } else {
    this.emitRaw(ClientEvents.FromServer.SETUP_WEBVIEW);
  }
};
