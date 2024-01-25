import { ServerCall } from "@shared/calls/server";
import { CombineType, createItem, getCombineType } from "@shared/modules/items";
import { ItemSourceOrigin, ItemSourceType } from "@shared/interfaces";
import { rpc } from "@/core/rpc";
import { needsToBeInGame } from "@/core/utility/assertions";
import { loadWeaponWithAmmo, unloadAmmoFromWeapon } from "../items/weapons/firearm_weapons";
import { removeBaitFromFishingRod, useFishBaitOnFishingRod } from "../items/fishing-rod";
import {
  canDropItem,
  canEquipItems,
  canInteractWithItemSource,
  findItem,
  useItemFromSource,
} from "./hooks";
import { dropItem, removeItem, swapItems } from "./utils";

/**
 * Player tries to use an item.
 */
rpc.registerWebview(ServerCall.FromWebview.USE_ITEM, (player, itemSource) => {
  needsToBeInGame(player);

  if (!canInteractWithItemSource.call(player, itemSource)) {
    return false;
  }

  if (itemSource.origin === ItemSourceOrigin.Character && itemSource.type === ItemSourceType.PlayerEquipment) {
    return false;
  }

  return useItemFromSource.call(player, itemSource) !== false;
});

/**
 * Player tries to buy an item.
 */
rpc.registerWebview(ServerCall.FromWebview.BUY_ITEM, (player, itemSource) => {
  needsToBeInGame(player);

  if (itemSource.origin !== ItemSourceOrigin.Shop) {
    return false;
  }

  if (!canInteractWithItemSource.call(player, itemSource)) {
    return false;
  }
  return false;

  // return player.buyItem(itemSource);
});

/**
 * Player tries to equip an item.
 */
rpc.registerWebview(ServerCall.FromWebview.EQUIP_ITEM, (player, itemSource) => {
  needsToBeInGame(player);

  if (itemSource.origin !== ItemSourceOrigin.Global && itemSource.type !== ItemSourceType.PlayerInventory) {
    return false;
  }

  const item = findItem.call(itemSource, player);

  if (!item) {
    return false;
  }

  if (!canInteractWithItemSource.call(player, itemSource)) {
    return false;
  }

  if (!canEquipItems.call(player)) {
    return false;
  }

  return player.equipItem(itemSource);
});

/**
 * Player tries to unequip an item.
 */
rpc.registerWebview(ServerCall.FromWebview.UNEQUIP_ITEM, (player, equipmentSlot) => {
  needsToBeInGame(player);

  return player.unequipItem(equipmentSlot);
});

rpc.registerWebview(ServerCall.FromWebview.COMBINE_ITEMS, (player, sourceA, sourceB) => {
  needsToBeInGame(player);

  if (sourceA.origin === ItemSourceOrigin.Global || sourceB.origin === ItemSourceOrigin.Global) {
    // can't use items on the ground for combinations
    return false;
  }

  if (!canInteractWithItemSource.call(player, sourceA) || !canInteractWithItemSource.call(player, sourceB)) {
    return false;
  }

  const itemA = findItem.call(sourceA, player);
  const itemB = findItem.call(sourceB, player);

  if (!itemA || !itemB) {
    return false;
  }

  const [combineType, reverse] = getCombineType(itemA.key, itemB.key);

  switch (combineType) {
    case CombineType.EquipAmmo: {
      const [weaponSource, ammoSource] = reverse ? [sourceB, sourceA] : [sourceA, sourceB];

      // Do not support equiping already equiped ammo
      // Player should first unload ammo from the weapon before loading it into another weapon
      if (ammoSource.type === ItemSourceType.PlayerEquipment) {
        return false;
      }

      return loadWeaponWithAmmo(weaponSource, ammoSource);
    }
    case CombineType.EquipFishBait: {
      const [fishingRodSource, baitSource] = reverse ? [sourceB, sourceA] : [sourceA, sourceB];

      if (baitSource.type === ItemSourceType.PlayerEquipment) {
        // Should never happen
        return false;
      }

      return useFishBaitOnFishingRod(fishingRodSource, baitSource);
    }
  }
  return false;
});

rpc.registerWebview(ServerCall.FromWebview.UNLOAD_AMMO, (player, itemSource) => {
  needsToBeInGame(player);

  if (!canInteractWithItemSource.call(player, itemSource)) {
    return false;
  }

  return unloadAmmoFromWeapon(itemSource);
});

rpc.registerWebview(ServerCall.FromWebview.REMOVE_BAIT, (player, itemSource) => {
  needsToBeInGame(player);

  if (!canInteractWithItemSource.call(player, itemSource)) {
    return false;
  }

  return removeBaitFromFishingRod(itemSource);
});

rpc.registerClient(ServerCall.FromClient.RELOAD_WEAPON, (player) => {
  needsToBeInGame(player);

  return player.reloadWeapon();
});

rpc.registerWebview(ServerCall.FromWebview.DROP_ITEM, (player, itemSource) => {
  needsToBeInGame(player);

  if (itemSource.origin === ItemSourceOrigin.Global) {
    // can't drop item that's already on the ground
    return false;
  }

  if (!canDropItem.call(player, itemSource)) {
    return false;
  }

  return dropItem(player, itemSource, player.pos);
});

rpc.registerWebview(ServerCall.FromWebview.MOVE_ITEM, (player, from, to, amount = 1) => {
  needsToBeInGame(player);

  if (!canInteractWithItemSource.call(player, from) || !canInteractWithItemSource.call(player, to)) {
    return false;
  }

  if (to.origin === ItemSourceOrigin.Global) {
    if (from.origin === ItemSourceOrigin.Global) {
      // can't drop item that's already on the ground
      return false;
    }

    return dropItem(player, from, player.pos);
  }

  /**
   * Pick up item from the ground
   */
  if (from.origin === ItemSourceOrigin.Global) {
    const item = findItem.call(from);

    if (!item) {
      return false;
    }

    /**
     * From ground to equipment
     */
    if (to.type === ItemSourceType.PlayerEquipment) {
      if (!canEquipItems.call(player)) {
        return false;
      }

      return player.equipItem(from);
    }

    /**
     * From ground to inventory
     */
    if (to.type === ItemSourceType.PlayerInventory) {
      const itemToAdd = createItem(item.key, { ...item, amount });

      if (player.addItem(itemToAdd, to.inventorySlot)) {
        removeItem(from, amount);

        return true;
      }
    }
    return false;
  }

  /**
   * Between equipment slots
   */
  if (from.type === ItemSourceType.PlayerEquipment && to.type === ItemSourceType.PlayerEquipment) {
    // There is no reason to move item between equipment slots
    return false;
  }

  /**
   * From inventory to equipment
   */
  if (from.type === ItemSourceType.PlayerInventory && to.type === ItemSourceType.PlayerEquipment) {
    if (!canEquipItems.call(player)) {
      return false;
    }

    return player.equipItem(from);
  }

  /**
   * From equipment to inventory
   */
  if (from.type === ItemSourceType.PlayerEquipment && to.type === ItemSourceType.PlayerInventory) {
    return player.unequipItem(from.equipmentSlot, to);
  }

  /**
   * Between inventory slots
   */
  if (from.type === ItemSourceType.PlayerInventory && to.type === ItemSourceType.PlayerInventory) {
    return swapItems(from, to);
  }

  // TS doesn't know that all cases are covered
  return false;
});
