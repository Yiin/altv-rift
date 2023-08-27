import alt from "alt-server";
import { ServerEvents } from "@shared/events/server";
import {
  getItemInfoByKey,
  getItemData,
  createItem,
  isItemAmmo,
  toEquipedAmmo,
} from "@shared/modules/items";
import { isItemFirearmWeapon } from "@shared/modules/items/weapons/firearms";
import { AmmoItem, FirearmWeaponItem, Item, ItemSource } from "@shared/interfaces";
import { InGamePlayer, isInGame } from "@/utility/assertions";
import { findItem, findSourceInventory } from "../../api/hooks";
import { removeItem, addItemToInventory } from "../../api/utils";

alt.on(ServerEvents.FromServer.EQUIP_ITEM, (player, item) => {
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

  if (!isItemFirearmWeapon(equipedWeapon)) {
    return false;
  }

  const weaponData = getItemData(equipedWeapon);

  if (!weaponData.ammo) {
    return false;
  }

  if (weaponData.ammo.clip.amount <= 0) {
    return false;
  }

  weaponData.ammo.clip.amount--;

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

export function loadWeaponWithAmmo(weaponSource: ItemSource, ammoSource: ItemSource): boolean {
  // Do not support equiping ammo from equipment
  // Player should first unload ammo from the weapon before loading it into another weapon
  if (ammoSource.type === "equipment") {
    return false;
  }

  const weapon = findItem.call(weaponSource);
  const ammo = findItem.call(ammoSource);
  const ammoInventory = findSourceInventory.call(ammoSource);

  if (!weapon || !ammo || !ammoInventory) {
    return false;
  }

  if (!isItemFirearmWeapon(weapon) || !isItemAmmo(ammo)) {
    return false;
  }

  // remove ammo from inventory
  removeItem(ammoSource);

  const previousAmmo = loadWeaponItemWithAmmoItem(weapon, ammo);

  if (previousAmmo) {
    addItemToInventory(ammoInventory, previousAmmo);
  }
  return true;
}

export function unloadAmmoFromWeapon(source: ItemSource) {
  const weapon = findItem.call(source);

  if (!weapon) {
    return false;
  }

  if (!isItemFirearmWeapon(weapon)) {
    return false;
  }

  // Weapon is equipped
  if (source.type === "equipment") {
    const player = alt.Player.all.find(
      (player): player is InGamePlayer => player.store.character?.id === source.sourceId
    );

    if (!player) {
      return false;
    }

    const ammo = unloadWeaponItemAmmo(weapon);

    if (!ammo) {
      return false;
    }

    if (!addItemToInventory(player.store.character.inventory, ammo)) {
      // If player inventory is full, load ammo back into the weapon
      loadWeaponItemWithAmmoItem(weapon, ammo);
      return false;
    }

    return true;
  }
  // Weapon is in some inventory
  const ammo = unloadWeaponItemAmmo(weapon);

  if (!ammo) {
    return false;
  }

  const inventory = findSourceInventory.call(source);

  if (!inventory) {
    return false;
  }

  if (!addItemToInventory(inventory, ammo)) {
    // If inventory is full, load ammo back into the weapon
    loadWeaponItemWithAmmoItem(weapon, ammo);
    return false;
  }
  return true;
}

/**
 * Loads weapon item with ammo item and returns previous ammo item if any.
 */
export function loadWeaponItemWithAmmoItem(
  weapon: FirearmWeaponItem,
  ammo: AmmoItem
): AmmoItem | null {
  const weaponData = getItemData(weapon);

  const { clipSize } = getItemInfoByKey(weapon.key);

  if (!weaponData.ammo) {
    weaponData.ammo = toEquipedAmmo(ammo, clipSize);
  } else {
    const previousAmmo = weaponData.ammo;

    if (previousAmmo.key !== ammo.key) {
      weaponData.ammo = toEquipedAmmo(ammo, clipSize);

      return createItem(previousAmmo.key, {
        amount: previousAmmo.clip.amount + previousAmmo.rest.amount,
      });
    }

    weaponData.ammo = toEquipedAmmo(ammo, clipSize, weaponData.ammo);
  }
  return null;
}

export function unloadWeaponItemAmmo(item: Item) {
  if (!isItemFirearmWeapon(item)) {
    return null;
  }

  const itemData = getItemData(item);

  if (!itemData.ammo) {
    return null;
  }

  const ammo = itemData.ammo;

  itemData.ammo = null;

  return createItem(ammo.key, {
    amount: ammo.clip.amount + ammo.rest.amount,
  });
}
