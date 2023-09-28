import { ServerEvents } from "@shared/events/server";
import { on } from "@/core/events/emit";

// @index('./*', f => `export * from "${f.path}";`)
export * from "./firearm_weapons";
export * from "./melee_weapons";
export * from "./throwable_weapons";
// @endindex

on(ServerEvents.FromServer.ITEM_UNEQUIP, (player, equipmentSlot) => {
  if (equipmentSlot !== "weapon") {
    return;
  }

  player.removeAllWeapons();
});
