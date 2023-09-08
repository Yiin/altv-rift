import { isItemKeyConsumable } from "../registry/consumables/consumable.items";
import { ItemKey } from "../types";

export function isItemUsable(key: ItemKey) {
  return isItemKeyConsumable(key);
}
