import { isItemKeyAmmo, isItemKeyConsumable, isItemKeyMaterial } from "../registry";
import { isItemKeyFishBait } from "../registry/fish-bait.items";
import { isItemKeyThrowableWeapon } from "../registry/weapons/throwable-weapon.items";
import { Item, ItemKey } from "../types";

type ItemWithAmount = Extract<Item, { amount: number }>;

export function isItemKeyStackable(key: ItemKey) {
  if (
    isItemKeyThrowableWeapon(key) ||
    isItemKeyAmmo(key) ||
    isItemKeyConsumable(key) ||
    isItemKeyMaterial(key) ||
    isItemKeyFishBait(key)
  ) {
    // If it shows an error it means we missed
    // a key check in the above if statement for
    // item keys that are stackable.
    const EXHAUSTIVE_ITEM_KEY_CHECK: typeof key = {} as ItemWithAmount["key"];
    return true;
  }
  return false;
}

export function isStackable(item?: Item): item is ItemWithAmount {
  return !!(item && isItemKeyStackable(item.key));
}
