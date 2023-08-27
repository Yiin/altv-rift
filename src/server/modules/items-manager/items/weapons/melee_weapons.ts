import alt from "alt-server";
import { ServerEvents } from "@shared/events/server";
import { getWeaponHash } from "@shared/modules/items";
import { isItemMeleeWeapon } from "@shared/modules/items/weapons/melee";

alt.on(ServerEvents.FromServer.EQUIP_ITEM, (player, item) => {
  if (!isItemMeleeWeapon(item)) {
    return;
  }

  player.giveWeapon(getWeaponHash(item.key), 1, true);
});
