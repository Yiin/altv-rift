import alt from "alt-client";
import native from "natives";
import { ClientEvents } from "@shared/events/client";

const NotificationConst = {
  notification(text: string): void {
    native.beginTextCommandThefeedPost("STRING");
    native.addTextComponentSubstringPlayerName(text);
    native.endTextCommandThefeedPostTicker(false, true);
  },
};

export const Notification = {
  ...NotificationConst,
};

alt.onServer(
  ClientEvents.FromServer.PLAYER_EMIT_NOTIFICATION,
  NotificationConst.notification
);
