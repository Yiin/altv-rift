import * as alt from "@altv/client";
import game from "@altv/natives";
import { ClientEvents } from "@shared/events/client";

let timeoutId: alt.Timers.Timeout | undefined;

/**
 * Draw mission text on the bottom of screen
 */
export function drawMissionText(text: string, duration?: number) {
  if (timeoutId) {
    alt.setWatermarkPosition(0);
    timeoutId.destroy();
  }

  game.clearPrints();
  game.beginTextCommandPrint("STRING");
  game.addTextComponentSubstringPlayerName(text);
  if (typeof duration !== "number") {
    duration = text.length * 100;
  }

  game.endTextCommandPrint(duration, true);
  timeoutId = alt.Timers.setTimeout(() => {
    alt.setWatermarkPosition(4);
    timeoutId = undefined;
  }, duration);
}

alt.Events.onServer(ClientEvents.FromServer.PLAYER_EMIT_MISSION_TEXT, drawMissionText);
