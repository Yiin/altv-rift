import * as alt from "@altv/server";
import { ServerEvents } from "@shared/events/server";
import {
  getItemInfoByKey,
  createItem,
  isItemAmmo,
  toEquipedAmmo,
  AmmoItem,
  Item,
} from "@shared/modules/items";
import {
  FirearmWeaponItem,
  isItemFirearmWeapon,
} from "@shared/modules/items/registry/weapons/firearm-weapon.items";
import { InventoryItemSource, ItemSource } from "@shared/interfaces";
import { InGamePlayer, isInGame } from "@/utility/assertions";
import { findItem, findSourceInventory } from "../../api/hooks";
import { removeItem, addItemToInventory } from "../../api/utils";

alt.Events.on(ServerEvents.FromServer.EQUIP_ITEM, (player, item) => {
  if (!isItemFirearmWeapon(item)) {
    return;
  }

  const itemInfo = getItemInfoByKey(item.key);

  if (player.currentWeapon === itemInfo.hash) {
    return;
  }

  if (item.ammo && item.ammo.clip + item.ammo.rest <= 0) {
    item.ammo = null;
  }

  player.giveWeapon(itemInfo.hash, 0, true);
});

alt.Events.onPlayer(ServerEvents.FromClient.WEAPON_SHOOT, (player) => {
  if (!isInGame(player)) {
    return;
  }

  const equipedWeapon = player.character.equipment.weapon;

  if (!equipedWeapon) {
    return;
  }

  const weaponInfo = getItemInfoByKey(equipedWeapon.key);

  if (weaponInfo.hash !== player.currentWeapon) {
    return;
  }

  if (!isItemFirearmWeapon(equipedWeapon)) {
    return;
  }

  if (!equipedWeapon.ammo) {
    return;
  }

  if (equipedWeapon.ammo.clip <= 0) {
    return;
  }

  equipedWeapon.ammo.clip--;

  if (equipedWeapon.ammo.clip + equipedWeapon.ammo.rest <= 0) {
    equipedWeapon.ammo = null;
  }
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
  const { clipSize } = getItemInfoByKey(weapon.key);

  if (!weapon.ammo) {
    weapon.ammo = toEquipedAmmo(ammo, clipSize);
  } else {
    const previousAmmo = weapon.ammo;

    if (previousAmmo.key !== ammo.key) {
      weapon.ammo = toEquipedAmmo(ammo, clipSize);

      return createItem(previousAmmo.key, {
        amount: previousAmmo.clip + previousAmmo.rest,
      });
    }

    weapon.ammo = toEquipedAmmo(ammo, clipSize, weapon.ammo);
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

  if (!item.ammo) {
    return null;
  }

  const ammo = item.ammo;

  item.ammo = null;

  return createItem(ammo.key, {
    amount: ammo.clip + ammo.rest,
  });
}
