import alt from "alt-client";
import game from "natives";
import { ClientEvents } from "@shared/events/client";

let timeoutId: number | undefined;

/**
 * Draw mission text on the bottom of screen
 */
export function drawMissionText(text: string, duration?: number) {
  if (timeoutId) {
    alt.setWatermarkPosition(0);
    alt.clearTimeout(timeoutId);
  }

  game.clearPrints();
  game.beginTextCommandPrint("STRING");
  game.addTextComponentSubstringPlayerName(text);
  if (typeof duration !== "number") {
    duration = text.length * 100;
  }

  game.endTextCommandPrint(duration, true);
  timeoutId = alt.setTimeout(() => {
    alt.setWatermarkPosition(4);
    timeoutId = undefined;
  }, duration);
}

alt.onServer(ClientEvents.FromServer.PLAYER_EMIT_MISSION_TEXT, drawMissionText);
