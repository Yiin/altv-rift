import { rpc } from "@/core/rpc";
import { needsToBeInGame } from "@/core/utility/assertions";
import { ServerCall } from "@shared/calls/server";
import { ItemSourceOrigin } from "@shared/interfaces";
import { canInteractWithItemSource, findInventoryByItemSource } from "../items-manager";
import { getInventoryItemInSlot } from "@shared/modules/inventory";
import { createItem } from "@shared/modules/items";

/**
 * Player tries to buy an item.
 */
rpc.registerWebview(ServerCall.FromWebview.BUY_ITEM, (player, itemSource, amount): boolean => {
  needsToBeInGame(player);

  if (itemSource.origin !== ItemSourceOrigin.Storage) {
    return false;
  }

  if (!canInteractWithItemSource(player, itemSource)) {
    return false;
  }

  if (amount <= 0) {
    return false;
  }

  const inventory = findInventoryByItemSource(itemSource);
  if (!inventory) {
    return false;
  }

  const inventoryItem = getInventoryItemInSlot(inventory, itemSource.inventorySlot);
  if (!inventoryItem) {
    return false;
  }

  if (typeof inventoryItem.price !== 'number') {
    return false;
  }

  // check price
  const price = amount * inventoryItem.price;

  if (price > player.character.money) {
    return false;
  }

  const item = createItem(inventoryItem.item.key, {
    ...inventoryItem.item,
    amount,
  });

  if (!player.addItem(item)) {
    return false;
  }

  player.character.money -= price;

  return true;
});
