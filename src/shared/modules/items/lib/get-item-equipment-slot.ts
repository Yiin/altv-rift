import { EquipmentSlot } from "@shared/interfaces";
import {
  isItemKeyAmmo,
  isItemKeyClothing,
  isItemKeyFishingRod,
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
} from "../registry";
import { isItemKeyTool } from "../registry/tool.items";
import { Item, ItemKey } from "../types";
import { getItemInfoByKey } from "../items-registry";

/**
 * Determines the equipment slot suitable for the given item,
 */
export function getItemKeyEquipmentSlot(key: ItemKey): EquipmentSlot | undefined {
  if (isItemKeyAmmo(key)) {
    return "ammo";
  }
  if (isItemKeyWeapon(key)) {
    return "weapon";
  }
  if (isItemKeyClothing(key)) {
    if (isItemKeyAccessory(key)) {
      return "accessory";
    }
    if (isItemKeyArmor(key)) {
      return "armor";
    }
    if (isItemKeyEarrings(key)) {
      return "earrings";
    }
    if (isItemKeyGlasses(key)) {
      return "glasses";
    }
    if (isItemKeyGloves(key)) {
      return "gloves";
    }
    if (isItemKeyHeadwear(key)) {
      return "headwear";
    }
    if (isItemKeyLeftHand(key)) {
      return "lefthand";
    }
    if (isItemKeyMask(key)) {
      return "mask";
    }
    if (isItemKeyPants(key)) {
      return "pants";
    }
    if (isItemKeyRightHand(key)) {
      return "righthand";
    }
    if (isItemKeyShoes(key)) {
      return "shoes";
    }
    if (isItemKeyTop(key)) {
      return "top";
    }
  }
  if (isItemKeyTool(key) || isItemKeyFishingRod(key)) {
    return "tool";
  }
  return;
}

export function getItemEquipmentSlot(item: Item): EquipmentSlot | undefined {
  return getItemKeyEquipmentSlot(item.key);
}
