import * as alt from "@altv/server";
import { ServerEvents } from "@shared/events/server";
import { getWeaponHash } from "@shared/modules/items";
import { isItemMeleeWeapon } from "@shared/modules/items/registry/weapons/melee-weapon.items";

alt.Events.on(ServerEvents.FromServer.EQUIP_ITEM, (player, item) => {
  if (!isItemMeleeWeapon(item)) {
    return;
  }

  player.giveWeapon(getWeaponHash(item.key), 1, true);
});
