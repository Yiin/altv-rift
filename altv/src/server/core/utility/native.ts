import alt from "@altv/server";
import game from "@altv/natives";
import { ClientEvents } from "@shared/events/client";

export function invoke<T extends keyof typeof game>(
  player: alt.Player,
  nativeName: T,
  ...args: Parameters<(typeof game)[T]>
) {
  if (!player || !player.valid) {
    return;
  }

  player.emit(ClientEvents.FromServer.INVOKE_NATIVE, nativeName, ...args);
}
