import { findItem, useItem, useItemFromSource } from "../api/hooks";

/**
 * Can player use item from the inventory?
 */
useItemFromSource.hook((player, itemSource) => {
  if (itemSource.type !== "inventory") {
    return;
  }

  const item = findItem.call(itemSource, player);

  if (!item) {
    return false;
  }

  return useItem.call(player, item);
});
