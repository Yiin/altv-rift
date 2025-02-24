import alt from "@altv/server";
import { InGamePlayer } from "@/core/utility/assertions";
import { NotificationType } from "@shared/interfaces";
import { ClientEvents } from "@shared/events/client";

declare module "@altv/server" {
  export interface Player {
    notify(
      this: InGamePlayer,
      type: NotificationType,
      message: string,
      options?: { title?: string },
    ): void;
  }
}

alt.Player.prototype.notify = function (type, message, options) {
  this.emitRaw(ClientEvents.FromServer.SHOW_NOTIFICATION, type, message, options);
};
