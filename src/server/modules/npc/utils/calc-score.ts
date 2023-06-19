import alt from "alt-server";
import { distance2d } from "@shared/utility/vector";
import { Npc } from "@shared/modules/npc/npc";

export function calcScore(player: alt.Player, npc: Npc) {
  if (!player.store.isLoggedIn) {
    return Infinity;
  }
  return Math.sqrt(player.store.avgPing * distance2d(player.pos, npc.position));
}
