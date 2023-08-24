import alt from "alt-server";
import { ItemType } from "@prisma/client";
import { ServerEvents } from "@shared/events/server";
import { getItemInfoByKey } from "@shared/modules/items";

alt.on(ServerEvents.FromServer.EQUIP_ITEM, (player, item) => {
  if (item.data.type !== ItemType.MELEE_WEAPON) {
    return;
  }

  const itemInfo = getItemInfoByKey(item.data.key);
  player.giveWeapon(itemInfo.hash, 1, true);
});
