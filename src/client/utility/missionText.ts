import { RPC } from "@shared/constants/rpcs";
import alt from "alt-client";
import rpc from "altv-rpc";
import native from "natives";

let timeoutId: number | undefined;

/**
 * Draw mission text on the bottom of screen
 */
export function drawMissionText({
  text,
  duration,
}: {
  text: string;
  duration?: number;
}) {
  if (timeoutId) {
    alt.setWatermarkPosition(0);
    alt.clearTimeout(timeoutId);
  }

  native.clearPrints();
  native.beginTextCommandPrint("STRING");
  native.addTextComponentSubstringPlayerName(text);
  if (typeof duration !== "number") {
    duration = text.length * 100;
  }

  native.endTextCommandPrint(duration, true);
  timeoutId = alt.setTimeout(() => {
    alt.setWatermarkPosition(4);
    timeoutId = undefined;
  }, duration);
}

rpc.on(RPC.Client.PLAYER_EMIT_MISSION_TEXT, drawMissionText);
