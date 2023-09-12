import * as alt from "@altv/server";
import { ServerEvents } from "@shared/events/server";

// @index('./*', f => `export * from "${f.path}";`)
export * from "./firearm_weapons";
export * from "./melee_weapons";
export * from "./throwable_weapons";
// @endindex

alt.Events.on(ServerEvents.FromServer.UNEQUIP_ITEM, (player, equipmentSlot) => {
  if (equipmentSlot !== "weapon") {
    return;
  }

  player.removeAllWeapons();
});
