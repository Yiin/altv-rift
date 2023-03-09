import alt from "alt-client";
import native from "natives";
import { Events } from "@shared/constants/events";

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
  Events.Client.PLAYER_EMIT_NOTIFICATION,
  NotificationConst.notification
);
