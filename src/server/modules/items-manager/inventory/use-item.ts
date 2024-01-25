import { findItem, useItem, useItemFromSource } from "../api/hooks";

/**
 * We probably can move this hook to normal function
 */
useItemFromSource.hook((player, itemSource) => {
  const item = findItem.call(itemSource, player);

  if (!item) {
    return false;
  }

  return useItem.call(player, item);
});
