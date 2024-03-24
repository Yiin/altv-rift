import { ItemFlags } from "../enums";
import { getItemInfoByKey } from "../items-registry";
import {
  isItemKeyAmmo,
  isItemKeyConsumable,
  isItemKeyFishBait,
  isItemKeyMaterial,
  isItemKeyNote,
  isItemKeyThrowableWeapon,
  isItemKeyWeaponComponent,
} from "../registry";
import { Item, ItemKey, StackableItem } from "../types";
import { getItemKeyEquipmentSlot } from "./get-item-equipment-slot";

export function getItemFlagsByKey(key: ItemKey): ItemFlags {
  const info = getItemInfoByKey(key);

  if (!info) {
    return ItemFlags.None;
  }

  let flags = "flags" in info ? info.flags : ItemFlags.None;

  if (getItemKeyEquipmentSlot(key)) {
    flags |= ItemFlags.IsEquippable;
  }
  if (
    isItemKeyThrowableWeapon(key) ||
    isItemKeyAmmo(key) ||
    isItemKeyConsumable(key) ||
    isItemKeyMaterial(key) ||
    isItemKeyFishBait(key) ||
    isItemKeyWeaponComponent(key)
  ) {
    flags |= ItemFlags.IsStackable;
  }
  if (isItemKeyConsumable(key) || isItemKeyNote(key)) {
    flags |= ItemFlags.IsUsable;
  }

  return flags;
}

export function getItemFlags(item: Item) {
  return getItemFlagsByKey(item.key);
}

export function checkItemFlagsByKey(key: ItemKey, flags: ItemFlags) {
  return (getItemFlagsByKey(key) & flags) === flags;
}

export function checkItemFlags(item: Item, flags: ItemFlags) {
  return checkItemFlagsByKey(item.key, flags);
}

export function isItemEquipable(key: ItemKey) {
  return checkItemFlagsByKey(key, ItemFlags.IsEquippable);
}

export function isItemUsable(key: ItemKey) {
  return checkItemFlagsByKey(key, ItemFlags.IsUsable);
}

export function isItemKeyStackable(key: ItemKey): key is StackableItem["key"] {
  return checkItemFlagsByKey(key, ItemFlags.IsStackable);
}

export function isStackable(item?: Item): item is StackableItem {
  return !!(item && isItemKeyStackable(item.key));
}
