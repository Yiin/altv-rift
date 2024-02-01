import { EquipmentSlot } from "@shared/interfaces";
import {
  isItemKeyAmmo,
  isItemKeyClothing,
  isItemKeyWeapon,
  isItemKeyAccessory,
  isItemKeyArmor,
  isItemKeyEarrings,
  isItemKeyGlasses,
  isItemKeyGloves,
  isItemKeyHeadwear,
  isItemKeyLeftHand,
  isItemKeyMask,
  isItemKeyPants,
  isItemKeyRightHand,
  isItemKeyShoes,
  isItemKeyTop,
  isItemKeyTool,
} from "../registry";
import { Item, ItemKey } from "../types";

/**
 * Determines the equipment slot suitable for the given item,
 */
export function getItemKeyEquipmentSlot(key: ItemKey): EquipmentSlot | undefined {
  if (isItemKeyAmmo(key)) {
    return EquipmentSlot.Ammo;
  }
  if (isItemKeyWeapon(key)) {
    return EquipmentSlot.Weapon;
  }
  if (isItemKeyClothing(key)) {
    if (isItemKeyAccessory(key)) {
      return EquipmentSlot.Accessory;
    }
    if (isItemKeyArmor(key)) {
      return EquipmentSlot.Armor;
    }
    if (isItemKeyEarrings(key)) {
      return EquipmentSlot.Earrings;
    }
    if (isItemKeyGlasses(key)) {
      return EquipmentSlot.Glasses;
    }
    if (isItemKeyGloves(key)) {
      return EquipmentSlot.Gloves;
    }
    if (isItemKeyHeadwear(key)) {
      return EquipmentSlot.Headwear;
    }
    if (isItemKeyLeftHand(key)) {
      return EquipmentSlot.LeftHand;
    }
    if (isItemKeyMask(key)) {
      return EquipmentSlot.Mask;
    }
    if (isItemKeyPants(key)) {
      return EquipmentSlot.Pants;
    }
    if (isItemKeyRightHand(key)) {
      return EquipmentSlot.RightHand;
    }
    if (isItemKeyShoes(key)) {
      return EquipmentSlot.Shoes;
    }
    if (isItemKeyTop(key)) {
      return EquipmentSlot.Top;
    }
  }
  if (isItemKeyTool(key)) {
    return EquipmentSlot.Tool;
  }
  return;
}

export function getItemEquipmentSlot(item: Item): EquipmentSlot | undefined {
  return getItemKeyEquipmentSlot(item.key);
}
