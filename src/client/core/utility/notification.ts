import * as alt from "@altv/client";
import * as game from "@altv/natives";
import { ClientEvents } from "@shared/events/client";

const NotificationConst = {
  notification(text: string): void {
    game.beginTextCommandThefeedPost("STRING");
    game.addTextComponentSubstringPlayerName(text);
    game.endTextCommandThefeedPostTicker(false, true);
  },
};

export const Notification = {
  ...NotificationConst,
};

alt.Events.onServer(
  ClientEvents.FromServer.PLAYER_EMIT_NOTIFICATION,
  NotificationConst.notification
);
