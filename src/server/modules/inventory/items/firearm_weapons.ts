import alt from "alt-server";
import { ItemType } from "@prisma/client";
import { ServerEvents } from "@shared/events/server";
import { getItemInfoByKey, getItemData } from "@shared/modules/items";
import { isItemFirearmWeapon } from "@shared/modules/items/weapons/firearms";
import { isInGame } from "@/utility/assertions";

alt.on(ServerEvents.FromServer.EQUIP_ITEM, (player, _, inventorySlot) => {
  const item =
    typeof inventorySlot !== "undefined"
      ? player.getInventoryItemInSlot(inventorySlot)?.data
      : player.store.character.equipment.weapon;

  if (!item) {
    console.log("no item");
    return;
  }

  if (!isItemFirearmWeapon(item)) {
    return;
  }

  const itemInfo = getItemInfoByKey(item.key);
  const itemData = getItemData(item);

  if (itemData.ammo && itemData.ammo.clip.amount + itemData.ammo.rest.amount <= 0) {
    itemData.ammo = null;
  }

  player.giveWeapon(itemInfo.hash, 1, true);
});

alt.on(ServerEvents.FromServer.UNEQUIP_ITEM, (player, equipmentSlot) => {
  if (equipmentSlot !== "weapon") {
    return;
  }

  player.removeWeapon(player.currentWeapon);
});

alt.onClient(ServerEvents.FromClient.WEAPON_SHOOT, (player) => {
  if (!isInGame(player)) {
    return;
  }

  const equipedWeapon = player.store.character.equipment.weapon;

  if (!equipedWeapon) {
    return false;
  }

  const weaponInfo = getItemInfoByKey(equipedWeapon.key);

  if (weaponInfo.hash !== player.currentWeapon) {
    return false;
  }

  if (equipedWeapon.type !== ItemType.FIREARM_WEAPON) {
    return false;
  }

  const weaponData = getItemData(equipedWeapon);

  if (!weaponData.ammo) {
    return false;
  }

  if (weaponData.ammo.clip.amount <= 0) {
    return false;
  }

  weaponData.ammo.clip.amount -= 1;

  if (weaponData.ammo.clip.amount + weaponData.ammo.rest.amount <= 0) {
    weaponData.ammo = null;
  }

  return true;
});

// alt.on("startProjectile", (player, pos, dir, ammoHash, weaponHash) => {
//   if (!isInGame(player)) {
//     return false;
//   }

//   const equipedWeapon = player.store.character.equipment.weapon;

//   if (!equipedWeapon) {
//     console.log("No weapon equiped");
//     return false;
//   }

//   const weaponInfo = getItemInfoByKey(equipedWeapon.key);

//   if (weaponInfo.hash !== weaponHash) {
//     console.log("Weapon hashes don't match");
//     return false;
//   }

//   if (equipedWeapon.type !== ItemType.FIREARM_WEAPON) {
//     return;
//   }

//   const weaponData = getItemData(equipedWeapon);

//   if (!weaponData.ammo) {
//     console.log("Weapon has no loaded ammo");
//     return false;
//   }

//   if (weaponData.ammo.data.amount <= 0) {
//     console.log("Weapon has no ammo");
//     return false;
//   }

//   weaponData.ammo.data.amount -= 1;

//   return true;
// });
