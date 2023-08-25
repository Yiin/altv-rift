import alt from "alt-server";
import { ItemType } from "@prisma/client";
import { ServerEvents } from "@shared/events/server";
import { getItemInfoByKey, getItemData } from "@shared/modules/items";
import { isInGame } from "@/utility/assertions";

alt.on(ServerEvents.FromServer.EQUIP_ITEM, (player, item, inventorySlot) => {
  if (item.type !== ItemType.THROWABLE_WEAPON) {
    console.log("not throwable weapon", item.type, ItemType.THROWABLE_WEAPON);
    return;
  }

  const itemInfo = getItemInfoByKey(item.key);
  const itemData = getItemData(item);

  if (itemData.amount <= 0) {
    if (typeof inventorySlot !== "undefined") {
      player.removeItemFromSlot(inventorySlot);
    } else {
      player.store.character.equipment.weapon = null;
    }
    return;
  }
  player.giveWeapon(itemInfo.hash, itemData.amount, true);
});

alt.on("startProjectile", (player, pos, dir, ammoHash, weaponHash) => {
  if (!isInGame(player)) {
    return false;
  }

  const equipedWeapon = player.store.character.equipment.weapon;

  if (!equipedWeapon) {
    console.log("No weapon equiped");
    return false;
  }

  const weaponInfo = getItemInfoByKey(equipedWeapon.key);

  if (weaponInfo.hash !== weaponHash) {
    console.log("Weapon hashes don't match");
    return false;
  }

  if (equipedWeapon.type !== ItemType.THROWABLE_WEAPON) {
    return;
  }

  const weaponData = getItemData(equipedWeapon);

  if (weaponData.amount <= 0) {
    player.removeWeapon(weaponHash);
    player.store.character.equipment.weapon = null;
    return false;
  }

  if ((weaponData.amount -= 1) <= 0) {
    player.removeWeapon(weaponHash);
    player.store.character.equipment.weapon = null;
  }

  return true;
});
