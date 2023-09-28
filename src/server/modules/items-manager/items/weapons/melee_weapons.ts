import { ServerEvents } from "@shared/events/server";
import { getWeaponHash } from "@shared/modules/items";
import { isItemMeleeWeapon } from "@shared/modules/items/registry/weapons/melee-weapon.items";
import { on } from "@/core/events/emit";

on(ServerEvents.FromServer.ITEM_EQUIP, (player, item) => {
  if (!isItemMeleeWeapon(item)) {
    return;
  }

  player.giveWeapon(getWeaponHash(item.key), 1, true);
});
