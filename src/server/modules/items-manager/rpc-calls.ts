import alt from "@altv/server";
import { ServerCall } from "@shared/calls/server";
import { CombineType, createItem, getCombineType } from "@shared/modules/items";
import { ItemSourceOrigin } from "@shared/interfaces";
import { getInventoryItemInSlot } from "@shared/modules/inventory";
import { rpc } from "@/core/rpc";
import { needsToBeInGame } from "@/core/utility/assertions";
import { removeBaitFromFishingRod, useFishBaitOnFishingRod } from "./items/fishing-rod";
import { canDropItem, canEquipItems } from "./api/hooks";
import { dropItem, removeItem, swapItems, canInteractWithItemSource, findItem, useItemFromSource, removeItemFromInventorySlot } from "./api";
import { getStorageInventory, openStorage } from "./storage";
import { loadWeaponWithAmmo, unloadAmmoFromWeapon } from "./items";

/**
 * Player tries to use an item.
 */
rpc.registerWebview(ServerCall.FromWebview.USE_ITEM, (player, itemSource) => {
  needsToBeInGame(player);

  if (!canInteractWithItemSource(player, itemSource)) {
    return false;
  }

  if (itemSource.origin === ItemSourceOrigin.PlayerEquipment) {
    return false;
  }

  return useItemFromSource(player, itemSource) !== false;
});

/**
 * Player tries to buy an item.
 */
rpc.registerWebview(ServerCall.FromWebview.BUY_ITEM, (player, itemSource) => {
  needsToBeInGame(player);

  if (itemSource.origin !== ItemSourceOrigin.Storage) {
    return false;
  }

  if (!canInteractWithItemSource(player, itemSource)) {
    return false;
  }

  // find source
  // check if shop

  return false;

  // return player.buyItem(itemSource);
});

/**
 * Player tries to equip an item.
 */
rpc.registerWebview(ServerCall.FromWebview.EQUIP_ITEM, (player, itemSource) => {
  needsToBeInGame(player);

  if (itemSource.origin !== ItemSourceOrigin.Ground && itemSource.origin !== ItemSourceOrigin.PlayerInventory) {
    return false;
  }

  const item = findItem(itemSource, player);

  if (!item) {
    return false;
  }

  if (!canInteractWithItemSource(player, itemSource)) {
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

  if (sourceA.origin === ItemSourceOrigin.Ground || sourceB.origin === ItemSourceOrigin.Ground) {
    // can't use items on the ground for combinations
    return false;
  }

  if (!canInteractWithItemSource(player, sourceA) || !canInteractWithItemSource(player, sourceB)) {
    return false;
  }

  const itemA = findItem(sourceA, player);
  const itemB = findItem(sourceB, player);

  if (!itemA || !itemB) {
    return false;
  }

  const [combineType, reverse] = getCombineType(itemA.key, itemB.key);

  switch (combineType) {
    case CombineType.EquipAmmo: {
      const [weaponSource, ammoSource] = reverse ? [sourceB, sourceA] : [sourceA, sourceB];

      // Do not support equiping already equiped ammo
      // Player should first unload ammo from the weapon before loading it into another weapon
      if (ammoSource.origin === ItemSourceOrigin.PlayerEquipment) {
        return false;
      }

      return loadWeaponWithAmmo(weaponSource, ammoSource);
    }
    case CombineType.EquipFishBait: {
      const [fishingRodSource, baitSource] = reverse ? [sourceB, sourceA] : [sourceA, sourceB];

      if (baitSource.origin === ItemSourceOrigin.PlayerEquipment) {
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

  if (!canInteractWithItemSource(player, itemSource)) {
    return false;
  }

  return unloadAmmoFromWeapon(itemSource);
});

rpc.registerWebview(ServerCall.FromWebview.REMOVE_BAIT, (player, itemSource) => {
  needsToBeInGame(player);

  if (!canInteractWithItemSource(player, itemSource)) {
    return false;
  }

  return removeBaitFromFishingRod(itemSource);
});

rpc.registerClient(ServerCall.FromClient.RELOAD_WEAPON, (player) => {
  needsToBeInGame(player);

  return player.reloadWeapon();
});

rpc.registerWebview(ServerCall.FromWebview.DROP_ITEM, (player, itemSource, amount) => {
  needsToBeInGame(player);

  if (itemSource.origin !== ItemSourceOrigin.PlayerInventory && itemSource.origin !== ItemSourceOrigin.PlayerEquipment) {
    // we can only drop items that we have on the player
    return false;
  }

  if (!canDropItem.call(player, itemSource)) {
    return false;
  }

  return dropItem(player, itemSource, { amount });
});

rpc.registerWebview(ServerCall.FromWebview.MOVE_ITEM, (player, from, to, amount = 1) => {
  needsToBeInGame(player);

  if (!canInteractWithItemSource(player, from) || !canInteractWithItemSource(player, to)) {
    return false;
  }

  if (to.origin === ItemSourceOrigin.Ground) {
    if (from.origin !== ItemSourceOrigin.PlayerInventory && from.origin !== ItemSourceOrigin.PlayerEquipment) {
      // can't drop item that's not on the player
      return false;
    }

    return dropItem(player, from, { amount });
  }

  /**
   * Pick up item from the ground
   */
  if (from.origin === ItemSourceOrigin.Ground) {
    const item = findItem(from);

    if (!item) {
      return false;
    }

    /**
     * From ground to equipment
     */
    if (to.origin === ItemSourceOrigin.PlayerEquipment) {
      if (!canEquipItems.call(player)) {
        return false;
      }

      return player.equipItem(from);
    }

    /**
     * From ground to inventory
     */
    if (to.origin === ItemSourceOrigin.PlayerInventory) {
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
  if (from.origin === ItemSourceOrigin.PlayerEquipment && to.origin === ItemSourceOrigin.PlayerEquipment) {
    // There is no reason to move item between equipment slots
    return false;
  }

  /**
   * From inventory to equipment
   */
  if (from.origin === ItemSourceOrigin.PlayerInventory && to.origin === ItemSourceOrigin.PlayerEquipment) {
    if (!canEquipItems.call(player)) {
      return false;
    }

    return player.equipItem(from);
  }

  /**
   * From equipment to inventory
   */
  if (from.origin === ItemSourceOrigin.PlayerEquipment && to.origin === ItemSourceOrigin.PlayerInventory) {
    return player.unequipItem(from.equipmentSlot, to);
  }

  /**
   * Between inventory slots
   */
  if (from.origin === ItemSourceOrigin.PlayerInventory && to.origin === ItemSourceOrigin.PlayerInventory) {
    return swapItems(from, to);
  }

  // TS doesn't know that all cases are covered
  return false;
});

/**
 * Check if player can open the storage
 */
rpc.registerClient(ServerCall.FromClient.OPEN_STORAGE, (player, storageId) => {
  needsToBeInGame(player);

  const ve = alt.VirtualEntity.getByID(storageId);

  if (!ve) {
    return false;
  }

  if (ve.pos.distanceTo(player.pos) > 5) {
    return false;
  }

  return openStorage(player, storageId);
});

rpc.registerWebview(ServerCall.FromWebview.TAKE_ITEM, (player, itemSource) => {
  needsToBeInGame(player);

  if (itemSource.origin !== ItemSourceOrigin.Storage) {
    return;
  }

  if (!canInteractWithItemSource(player, itemSource)) {
    return;
  }

  const storageInventory = getStorageInventory(itemSource.originId);

  if (!storageInventory) {
    return;
  }

  const item = getInventoryItemInSlot(storageInventory, itemSource.inventorySlot);

  if (!item) {
    return;
  }

  if (player.addItem(item.item)) {
    removeItemFromInventorySlot(storageInventory, itemSource.inventorySlot);
  }
});

rpc.registerWebview(ServerCall.FromWebview.TAKE_ALL_ITEMS, async (player, storageSource) => {
  needsToBeInGame(player);

  if (storageSource.origin !== ItemSourceOrigin.Storage) {
    return;
  }

  const storage = alt.VirtualEntity.getByID(storageSource.originId);

  if (!storage) {
    return;
  }

  if (storage.pos.distanceTo(player.pos) > 5) {
    return;
  }

  const storageInventory = getStorageInventory(storageSource.originId);

  if (!storageInventory) {
    return;
  }

  const items = [...storageInventory.items];

  for (const item of items) {
    if (player.addItem(item.item)) {
      removeItemFromInventorySlot(storageInventory, item.slot);
    }
  }
});
