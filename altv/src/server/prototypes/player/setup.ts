import alt from "@altv/server";
import { minutesToMilliseconds } from "date-fns";
import { ClientEvents } from "@shared/events/client";
import { getVueDebugMode, getViteServer } from "@/core/utility/webview";
import { clearMessageHistory, show } from "@/modules/chat";
import { isInGame } from "@/core/utility/assertions";

declare module "@altv/server" {
  export interface Player {
    setup: (this: Player) => Promise<void>;
  }
}

alt.Player.prototype.setup = async function () {
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
  if (getVueDebugMode()) {
    this.emitRaw(ClientEvents.FromServer.SETUP_WEBVIEW, await getViteServer());
  } else {
    this.emitRaw(ClientEvents.FromServer.SETUP_WEBVIEW);
  }
};
