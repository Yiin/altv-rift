import alt from "@altv/server";
import { ServerEvents } from "@shared/events/server";
import {
  AmmoItem,
  Item,
  createItem,
  getItemInfoByKey,
  getWeaponAmmoEquipmentSlot,
  isItemAmmo,
} from "@shared/modules/items";
import {
  FirearmWeaponItem,
  getWeaponClipSize,
  isItemFirearmWeapon,
  isWeaponWithClip,
} from "@shared/modules/items/registry/weapons/firearm-weapon.items";
import { ItemSource, ItemSourceOrigin } from "@shared/interfaces";
import { InGamePlayer, isInGame } from "@/core/utility/assertions";
import { on } from "@/core/events/emit";
import { findItem, findInventoryByItemSource, removeItem, addItemToInventory } from "../../api";
import { dropItemOnTheGround } from "../../dropped-items";

on(ServerEvents.FromServer.ITEM_EQUIP, (player, item) => {
  if (!isItemFirearmWeapon(item)) {
    return;
  }

  const itemInfo = getItemInfoByKey(item.key);

  if (player.currentWeapon === itemInfo.hash) {
    return;
  }

  player.giveWeapon(itemInfo.hash, 0, true);
});

/**
 * Handles weapon ammo consumption
 */
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

  // If weapon has a clip, use ammo in the clip
  if (isWeaponWithClip(equipedWeapon.key) && equipedWeapon.clip) {
    if (equipedWeapon.clip.amount > 0) {
      equipedWeapon.clip.amount--;

      if (equipedWeapon.clip.amount <= 0) {
        equipedWeapon.clip = null;
      }
    }
    return;
  }

  // Otherwise use equiped ammo reserves
  const ammoEquipmentSlot = getWeaponAmmoEquipmentSlot(equipedWeapon.key);

  const ammo = player.character.equipment[ammoEquipmentSlot];

  if (ammo) {
    ammo.amount--;

    if (ammo.amount <= 0) {
      player.removeEquipedItem(ammoEquipmentSlot);
    }
  }
});

/**
 * Loads ammo from inventory into weapon.
 */
export function loadWeaponWithAmmo(weaponSource: ItemSource, ammoSource: ItemSource): boolean {
  const weapon = findItem(weaponSource);
  const ammo = findItem(ammoSource);

  const hasInventory =
    ammoSource.origin === ItemSourceOrigin.PlayerInventory ||
    ammoSource.origin === ItemSourceOrigin.Storage;

  const ammoInventory = hasInventory ? findInventoryByItemSource(ammoSource) : null;

  if (!weapon || !ammo || (hasInventory && !ammoInventory)) {
    return false;
  }

  if (!isItemFirearmWeapon(weapon) || !isItemAmmo(ammo)) {
    return false;
  }

  const success = loadWeaponItemWithAmmoItem(weapon, ammo);

  if (!ammo.amount) {
    removeItem(ammoSource);
  }

  return success;
}

/**
 * Unloads ammo from weapon to its inventory (or players inventory if equiped).
 */
export function unloadAmmoFromWeapon(source: ItemSource): boolean {
  const weapon = findItem(source);

  if (!weapon) {
    return false;
  }

  if (!isItemFirearmWeapon(weapon)) {
    return false;
  }

  if (source.origin === ItemSourceOrigin.Ground) {
    const droppedItemVE = alt.VirtualEntity.getByID(source.originId);

    if (!droppedItemVE) {
      return false;
    }

    const ammo = unloadWeaponItemAmmo(weapon);

    if (!ammo) {
      return false;
    }

    droppedItemVE.streamSyncedMeta.item = weapon;

    dropItemOnTheGround(ammo, droppedItemVE.pos);

    return true;
  }

  // Weapon is equipped
  if (source.origin === ItemSourceOrigin.PlayerEquipment) {
    const player = alt.Player.all.find(
      (player): player is InGamePlayer => player.character?.id === source.originId,
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

  const inventory = findInventoryByItemSource(source);

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
export function loadWeaponItemWithAmmoItem(weapon: FirearmWeaponItem, ammo: AmmoItem): boolean {
  const clipSize = getWeaponClipSize(weapon.key);

  if (!weapon.clip) {
    const amount = Math.min(clipSize, ammo.amount);
    weapon.clip = createItem(ammo.key, { amount });
    ammo.amount -= amount;
    return true;
  } else if (weapon.clip.key === ammo.key) {
    const amount = Math.min(clipSize - weapon.clip.amount, ammo.amount);
    weapon.clip.amount += amount;
    ammo.amount -= amount;
    return true;
  }
  return false;
}

/**
 * Unloads ammo from weapon item and returns ammo item.
 */
export function unloadWeaponItemAmmo(item: Item): AmmoItem | null {
  if (!isItemFirearmWeapon(item)) {
    return null;
  }

  if (!item.clip) {
    return null;
  }

  const ammo = item.clip;

  item.clip = null;

  return ammo;
}
