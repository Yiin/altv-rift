import alt from "@altv/server";
import { ServerCall } from "@shared/calls/server";
import {
  CombineType,
  createItem,
  getCombineType,
  getItemKeyEquipmentSlot,
  isItemEquipable,
  isItemUsable,
} from "@shared/modules/items";
import { EquipmentSlot, InventoryItemSource, ItemSourceOrigin } from "@shared/interfaces";
import { getInventoryItemInSlot, isEquipmentSlotQuickSlot } from "@shared/modules/inventory";
import { removeItemFromInventorySlot, addItemToInventory } from "@shared/modules/inventory";
import { ServerEvents } from "@shared/events/server";
import { rpc } from "@/core/rpc";
import { needsToBeInGame } from "@/core/utility/assertions";
import { emit } from "@/core/events/emit";
import { removeBaitFromFishingRod, useFishBaitOnFishingRod } from "./items/fishing-rod";
import { getStorageInventory, openStorage } from "./storage";
import { loadWeaponWithAmmo, unloadAmmoFromWeapon } from "./items";
import {
  canInteractWithItemSource,
  useItemFromSource,
  findItem,
  dropItem,
  removeItem,
  swapInventoryItems,
  canDropItem,
  canEquipItems,
} from "./api";

/**
 * Player tries to use an item.
 */
rpc.registerWebview(ServerCall.FromWebview.USE_ITEM, (player, itemSource): boolean => {
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
rpc.registerWebview(ServerCall.FromWebview.BUY_ITEM, (player, itemSource): boolean => {
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
rpc.registerWebview(ServerCall.FromWebview.EQUIP_ITEM, (player, itemSource): boolean => {
  needsToBeInGame(player);

  if (
    itemSource.origin !== ItemSourceOrigin.Ground &&
    itemSource.origin !== ItemSourceOrigin.PlayerInventory
  ) {
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
rpc.registerWebview(ServerCall.FromWebview.UNEQUIP_ITEM, (player, equipmentSlot): boolean => {
  needsToBeInGame(player);

  return player.unequipItem(equipmentSlot);
});

rpc.registerWebview(ServerCall.FromWebview.COMBINE_ITEMS, (player, sourceA, sourceB): boolean => {
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

rpc.registerWebview(ServerCall.FromWebview.UNLOAD_AMMO, (player, itemSource): boolean => {
  needsToBeInGame(player);

  if (!canInteractWithItemSource(player, itemSource)) {
    return false;
  }

  return unloadAmmoFromWeapon(itemSource);
});

rpc.registerWebview(ServerCall.FromWebview.REMOVE_BAIT, (player, itemSource): boolean => {
  needsToBeInGame(player);

  if (!canInteractWithItemSource(player, itemSource)) {
    return false;
  }

  return removeBaitFromFishingRod(itemSource);
});

rpc.registerClient(ServerCall.FromClient.RELOAD_WEAPON, (player): boolean => {
  needsToBeInGame(player);

  return player.reloadWeapon();
});

rpc.registerWebview(ServerCall.FromWebview.DROP_ITEM, (player, itemSource, amount): boolean => {
  needsToBeInGame(player);

  if (
    itemSource.origin !== ItemSourceOrigin.PlayerInventory &&
    itemSource.origin !== ItemSourceOrigin.PlayerEquipment
  ) {
    // we can only drop items that we have on the player
    return false;
  }

  if (!canDropItem.call(player, itemSource)) {
    return false;
  }

  return dropItem(player, itemSource, { amount });
});

rpc.registerWebview(ServerCall.FromWebview.MOVE_ITEM, (player, from, to, amount = 1): boolean => {
  needsToBeInGame(player);

  if (!canInteractWithItemSource(player, from) || !canInteractWithItemSource(player, to)) {
    console.log("can't interact with item source");
    return false;
  }

  if (to.origin === ItemSourceOrigin.Ground) {
    if (
      from.origin !== ItemSourceOrigin.PlayerInventory &&
      from.origin !== ItemSourceOrigin.PlayerEquipment
    ) {
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

      return player.equipItem(from, to.equipmentSlot);
    }

    /**
     * From ground to inventory
     */
    if (to.origin === ItemSourceOrigin.PlayerInventory) {
      const itemToAdd = createItem(item.key, { ...item, amount });

      if (addItemToInventory(player.character.inventory, itemToAdd, to.inventorySlot)) {
        removeItem(from, amount);

        return true;
      }
    }
    return false;
  }

  /**
   * From inventory to equipment
   */
  if (
    from.origin === ItemSourceOrigin.PlayerInventory &&
    to.origin === ItemSourceOrigin.PlayerEquipment
  ) {
    if (!canEquipItems.call(player)) {
      return false;
    }

    return player.equipItem(from, to.equipmentSlot);
  }

  /**
   * From equipment to inventory
   */
  if (
    from.origin === ItemSourceOrigin.PlayerEquipment &&
    to.origin === ItemSourceOrigin.PlayerInventory
  ) {
    return player.unequipItem(from.equipmentSlot, to);
  }

  /**
   * Between inventory slots
   */
  if (
    [ItemSourceOrigin.PlayerInventory, ItemSourceOrigin.Storage].includes(from.origin) &&
    [ItemSourceOrigin.PlayerInventory, ItemSourceOrigin.Storage].includes(to.origin)
  ) {
    return swapInventoryItems(from as InventoryItemSource, to as InventoryItemSource, amount);
  }

  if (
    from.origin === ItemSourceOrigin.PlayerEquipment &&
    to.origin === ItemSourceOrigin.PlayerEquipment
  ) {
    const fromSlot = from.equipmentSlot;
    const toSlot = to.equipmentSlot;

    const fromItem = player.character.equipment[fromSlot];
    const toItem = player.character.equipment[toSlot];

    const betweenQuickSlots =
      isEquipmentSlotQuickSlot(fromSlot) && isEquipmentSlotQuickSlot(toSlot);
    const betweenQuickSlotAndEquipment = [
      [fromSlot, toSlot],
      [toSlot, fromSlot],
    ].some(([a, b]) => isEquipmentSlotQuickSlot(a) && !isEquipmentSlotQuickSlot(b));

    if (betweenQuickSlots) {
      [player.character.equipment[fromSlot]!, player.character.equipment[toSlot]!] = [
        player.character.equipment[toSlot]!,
        player.character.equipment[fromSlot]!,
      ];
      return true;
    } else if (betweenQuickSlotAndEquipment) {
      if (!fromItem || !toItem) {
        if (!fromItem) {
          return false;
        } else if (!toItem) {
          // @ts-expect-error
          player.character.equipment[toSlot] = player.character.equipment[fromSlot];
          player.character.equipment[fromSlot] = undefined;
          emit(ServerEvents.FromServer.ITEM_UNEQUIP, player, fromSlot);
          emit(ServerEvents.FromServer.ITEM_EQUIP, player, fromItem);
          return true;
        }
        return false;
      }

      const equipmentSlotFrom = getItemKeyEquipmentSlot(fromItem.key);
      const equipmentSlotTo = getItemKeyEquipmentSlot(toItem.key);

      if (equipmentSlotFrom !== equipmentSlotTo) {
        return false;
      }

      // @ts-expect-error
      [player.character.equipment[fromSlot], player.character.equipment[toSlot]] = [
        toItem,
        fromItem,
      ];

      if (isEquipmentSlotQuickSlot(fromSlot)) {
        emit(ServerEvents.FromServer.ITEM_UNEQUIP, player, toSlot);
        emit(ServerEvents.FromServer.ITEM_EQUIP, player, fromItem);
      } else {
        emit(ServerEvents.FromServer.ITEM_UNEQUIP, player, fromSlot);
        emit(ServerEvents.FromServer.ITEM_EQUIP, player, toItem);
      }
      return true;
    }
  }

  console.log(`Can't move item from ${from.origin} to ${to.origin}`);
  return false;
});

/**
 * Check if player can open the storage
 */
rpc.registerClient(ServerCall.FromClient.OPEN_STORAGE, (player, storageId): boolean => {
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

rpc.registerWebview(ServerCall.FromWebview.TAKE_ITEM, (player, itemSource): void => {
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

rpc.registerWebview(ServerCall.FromWebview.TAKE_ALL_ITEMS, (player, storageSource): void => {
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

rpc.registerClient(ServerCall.FromClient.USE_QUICK_SLOT, (player, slot): boolean => {
  needsToBeInGame(player);

  console.log(
    "ServerCall.FromClient.USE_QUICK_SLOT",
    slot,
    JSON.stringify(player.character.equipment),
  );

  const isQuickSlot = [
    EquipmentSlot.QuickSlot1,
    EquipmentSlot.QuickSlot2,
    EquipmentSlot.QuickSlot3,
    EquipmentSlot.QuickSlot4,
  ].includes(slot);

  if (!isQuickSlot) {
    return false;
  }

  const item = player.getEquipedItemInSlot(slot);

  if (!item) {
    return false;
  }

  const source = {
    origin: ItemSourceOrigin.PlayerEquipment,
    originId: player.character.id,
    equipmentSlot: slot,
  } as const;

  if (isItemEquipable(item.key)) {
    return player.equipItem(source);
  }

  if (isItemUsable(item.key)) {
    return useItemFromSource(player, source);
  }

  return false;
});
