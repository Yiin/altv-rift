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
import {
  AmmoItem,
  FirearmWeaponItem,
  InventoryItemSource,
  Item,
  ItemSource,
} from "@shared/interfaces";
import { InGamePlayer, isInGame } from "@/utility/assertions";
import { findItem, findSourceInventory } from "../../api/hooks";
import { removeItem, addItemToInventory } from "../../api/utils";

alt.on(ServerEvents.FromServer.EQUIP_ITEM, (player, item) => {
  if (!isItemFirearmWeapon(item)) {
    return;
  }

  const itemInfo = getItemInfoByKey(item.key);
  const itemData = getItemData(item);

  if (player.currentWeapon === itemInfo.hash) {
    return;
  }

  if (itemData.ammo && itemData.ammo.clip.amount + itemData.ammo.rest.amount <= 0) {
    itemData.ammo = null;
  }

  player.giveWeapon(itemInfo.hash, 0, true);
});

alt.onClient(ServerEvents.FromClient.WEAPON_SHOOT, (player) => {
  if (!isInGame(player)) {
    return;
  }

  const equipedWeapon = player.character.equipment.weapon;

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

/**
 * Loads ammo from inventory into weapon.
 */
export function loadWeaponWithAmmo(
  weaponSource: ItemSource,
  ammoSource: InventoryItemSource
): boolean {
  const weapon = findItem.call(weaponSource);
  const ammo = findItem.call(ammoSource);
  const ammoInventory = findSourceInventory.call(ammoSource);

  if (!weapon || !ammo || !ammoInventory) {
    console.log({
      weapon: !!weapon,
      ammo: !!ammo,
      ammoInventory: !!ammoInventory,
    });
    return false;
  }

  if (!isItemFirearmWeapon(weapon) || !isItemAmmo(ammo)) {
    console.log("Not a firearm weapon or ammo", weapon, ammo);
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

/**
 * Unloads ammo from weapon to its inventory (or players inventory if equiped).
 */
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
      (player): player is InGamePlayer => player.character?.id === source.sourceId
    );

    if (!player) {
      return false;
    }

    const ammo = unloadWeaponItemAmmo(weapon);

    if (!ammo) {
      return false;
    }

    if (!addItemToInventory(player.character.inventory, ammo)) {
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

/**
 * Unloads ammo from weapon item and returns ammo item.
 */
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
