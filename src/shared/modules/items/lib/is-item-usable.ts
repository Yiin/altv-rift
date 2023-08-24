import { isItemConsumable } from "../consumables";
import { ItemKey } from "../types";

export function isItemUsable(key: ItemKey) {
  return isItemConsumable(key);
}
