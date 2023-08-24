import alt from "alt-server";
import { ItemType } from "@prisma/client";
import { ServerEvents } from "@shared/events/server";
import { getItemInfoByKey, getItemData } from "@shared/modules/items";
import { isInGame } from "@/utility/assertions";

alt.on(ServerEvents.FromServer.EQUIP_ITEM, (player, item) => {
  if (item.type !== ItemType.THROWABLE_WEAPON) {
    return;
  }

  const itemInfo = getItemInfoByKey(item.key);
  const itemData = getItemData(item);
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
    console.log("Weapon has no ammo");
    return false;
  }

  console.log("throwing weapon");
  weaponData.amount -= 1;

  return true;
});
