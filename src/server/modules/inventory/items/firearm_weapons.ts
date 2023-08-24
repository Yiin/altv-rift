import alt from "alt-server";
import { ItemType } from "@prisma/client";
import { ServerEvents } from "@shared/events/server";
import {
  getItemInfoByKey,
  getItemData,
  toEquipedAmmo,
  createItem,
  getAmmoKeyForAmmoGroup,
} from "@shared/modules/items";
import { isItemFirearmWeapon } from "@shared/modules/items/weapons/firearms";
import { isInGame } from "@/utility/assertions";

alt.on(ServerEvents.FromServer.EQUIP_ITEM, (player, item) => {
  if (!isItemFirearmWeapon(item)) {
    return;
  }

  const itemInfo = getItemInfoByKey(item.key);
  const itemData = getItemData(item);

  const ammo = (() => {
    if (itemData.ammo) {
      return itemData.ammo;
    }

    // FOR DEBUG PURPOSES ONLY
    {
      const ammoKey = getAmmoKeyForAmmoGroup(itemInfo.ammoGroup);
      const ammoItem = createItem(ammoKey, { amount: 1000 });
      const inventoryItem = player.addItem(ammoItem);

      // no space in inventory, equip directly
      if (!inventoryItem) {
        return toEquipedAmmo(ammoItem);
      }

      player.equipItem(inventoryItem);
      return null;
    }
  })();

  if (ammo) {
    itemData.ammo = ammo;
  }

  player.giveWeapon(itemInfo.hash, ammo?.data.amount ?? 0, true);
});

alt.on(ServerEvents.FromServer.UNEQUIP_ITEM, (player, equipmentSlot) => {
  if (equipmentSlot !== "weapon") {
    return;
  }

  player.removeWeapon(player.currentWeapon);
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

alt.onClient(ServerEvents.FromClient.WEAPON_SHOOT, (player) => {
  if (!isInGame(player)) {
    return;
  }

  const equipedWeapon = player.store.character.equipment.weapon;

  if (!equipedWeapon) {
    console.log("No weapon equiped");
    return false;
  }

  const weaponInfo = getItemInfoByKey(equipedWeapon.key);

  if (weaponInfo.hash !== player.currentWeapon) {
    console.log("Weapon hashes don't match");
    return false;
  }

  if (equipedWeapon.type !== ItemType.FIREARM_WEAPON) {
    console.log("Equiped item is not a firearm");
    return false;
  }

  const weaponData = getItemData(equipedWeapon);

  if (!weaponData.ammo) {
    console.log("Weapon has no loaded ammo");
    return false;
  }

  if (weaponData.ammo.data.amount <= 0) {
    console.log("Weapon has no ammo");
    return false;
  }

  weaponData.ammo.data.amount -= 1;

  return true;
});
