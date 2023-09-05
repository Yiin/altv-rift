import { ServerCall } from "@shared/calls/server";
import { rpc } from "@/rpc";
import { needsToBeInGame } from "@/utility/assertions";
import { loadWeaponWithAmmo, unloadAmmoFromWeapon } from "../items/weapons/firearm_weapons";
import {
  canDropItem,
  canEquipItem,
  canInteractWithItem,
  findItem,
  useItemFromSource,
} from "./hooks";
import { dropItemOnTheGround, removeItem, swapItems } from "./utils";

/**
 * Player tries to use an item.
 */
rpc.registerWebview(ServerCall.FromWebview.USE_ITEM, (player, itemSource) => {
  needsToBeInGame(player);

  if (!canInteractWithItem.call(player, itemSource)) {
    return false;
  }

  return useItemFromSource.call(player, itemSource);
});

/**
 * Player tries to equip an item.
 */
rpc.registerWebview(ServerCall.FromWebview.EQUIP_ITEM, (player, itemSource) => {
  needsToBeInGame(player);

  if (itemSource.type === "equipment") {
    return false;
  }

  const item = findItem.call(itemSource, player);

  if (!item) {
    return false;
  }

  if (!canInteractWithItem.call(player, itemSource)) {
    return false;
  }

  if (!canEquipItem.call(player, itemSource)) {
    return false;
  }

  return player.equipItem(itemSource);
});

/**
 * Player tries to unequip an item.
 */
rpc.registerWebview(ServerCall.FromWebview.UNEQUIP_ITEM, (player, equipmentSlot) => {
  needsToBeInGame(player);

  return player.unequipItem(equipmentSlot) !== null;
});

rpc.registerWebview(ServerCall.FromWebview.LOAD_AMMO, (player, weaponSource, ammoSource) => {
  needsToBeInGame(player);

  if (
    !canInteractWithItem.call(player, weaponSource) ||
    !canInteractWithItem.call(player, ammoSource)
  ) {
    return false;
  }

  // Do not support equiping already equiped ammo
  // Player should first unload ammo from the weapon before loading it into another weapon
  if (ammoSource.type === "equipment") {
    return false;
  }

  return loadWeaponWithAmmo(weaponSource, ammoSource);
});

rpc.registerWebview(ServerCall.FromWebview.UNLOAD_AMMO, (player, itemSource) => {
  needsToBeInGame(player);

  if (!canInteractWithItem.call(player, itemSource)) {
    return false;
  }

  return unloadAmmoFromWeapon(itemSource);
});

rpc.registerClient(ServerCall.FromClient.RELOAD_WEAPON, (player) => {
  needsToBeInGame(player);

  return player.reloadWeapon();
});

rpc.registerWebview(ServerCall.FromWebview.DROP_ITEM, (player, itemSource) => {
  needsToBeInGame(player);

  if (!canDropItem.call(player, itemSource)) {
    return false;
  }

  if (itemSource.type === "equipment") {
    const item = findItem.call(itemSource, player);

    if (!item) {
      return false;
    }

    player.unequipItem(itemSource.equipmentSlot);

    dropItemOnTheGround(item, player.pos);
    return true;
  }

  const item = removeItem(itemSource);

  if (!item) {
    return false;
  }

  dropItemOnTheGround(item, player.pos);

  return true;
});

rpc.registerWebview(ServerCall.FromWebview.MOVE_ITEM, (player, from, to) => {
  needsToBeInGame(player);

  if (!canInteractWithItem.call(player, from) || !canInteractWithItem.call(player, to)) {
    return false;
  }

  if (from.type === "equipment" && to.type === "equipment") {
    // There is no reason to move item between equipment slots
    return false;
  }
  if (from.type === "inventory" && to.type === "equipment") {
    if (!canEquipItem.call(player, from)) {
      return false;
    }

    return player.equipItem(from);
  }
  if (from.type === "equipment" && to.type === "inventory") {
    return player.unequipItem(from.equipmentSlot);
  }
  if (from.type === "inventory" && to.type === "inventory") {
    return swapItems(from, to);
  }

  // TS doesn't know that all cases are covered
  return false;
});
