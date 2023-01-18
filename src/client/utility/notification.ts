import { RPC } from "@shared/constants/rpcs";
import rpc from "altv-rpc";
import native from "natives";

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

rpc.on(RPC.Client.PLAYER_EMIT_NOTIFICATION, NotificationConst.notification);
