import { ItemSource } from "@shared/interfaces";
import { InGamePlayer } from "@/core/utility/assertions";
import { useItem } from "./hooks";
import { findItem } from "./find-item";
import { removeItem } from ".";

/**
 * Tries to use the item from the soruce. If none of the sources return true, it won't be used.
 */
export function useItemFromSource(player: InGamePlayer, itemSource: ItemSource) {
  const item = findItem(itemSource, player);

  if (!item) {
    return false;
  }

  const amount = useItem.call(player, item);

  if (amount !== false && amount > 0) {
    removeItem(itemSource, amount);
    return true;
  }
  return false;
}
