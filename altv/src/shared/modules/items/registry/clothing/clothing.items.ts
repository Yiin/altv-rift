import { getItemInfoByKey } from "../../items-registry";
import { getItemKeyEquipmentSlot } from "../../lib";
import { Item } from "../../types";
import {
  AccessoryItem,
  AccessoryItemInfo,
  isItemKeyAccessory,
} from "./accessory/accessory.items";
import { AccessoryItemKey } from "./accessory/accessory.keys";
import { ArmorItem, ArmorItemInfo, isItemKeyArmor } from "./armor/armor.items";
import { ArmorItemKey } from "./armor/armor.keys";
import {
  EarringsItem,
  EarringsItemInfo,
  isItemKeyEarrings,
} from "./earrings/earrings.items";
import { EarringsItemKey } from "./earrings/earrings.keys";
import {
  GlassesItem,
  GlassesItemInfo,
  isItemKeyGlasses,
} from "./glasses/glasses.items";
import { GlassesItemKey } from "./glasses/glasses.keys";
import { GlovesItem, GlovesItemInfo, isItemKeyGloves } from "./gloves/gloves.items";
import { GlovesItemKey } from "./gloves/gloves.keys";
import {
  HeadwearItem,
  HeadwearItemInfo,
  isItemKeyHeadwear,
} from "./headwear/headwear.items";
import { HeadwearItemKey } from "./headwear/headwear.keys";
import {
  LeftHandItem,
  LeftHandItemInfo,
  isItemKeyLeftHand,
} from "./lefthand/lefthand.items";
import { LeftHandItemKey } from "./lefthand/lefthand.keys";
import { MaskItem, MaskItemInfo, isItemKeyMask } from "./mask/mask.items";
import { MaskItemKey } from "./mask/mask.keys";
import { PantsItem, PantsItemInfo, isItemKeyPants } from "./pants/pants.items";
import { PantsItemKey } from "./pants/pants.keys";
import {
  RightHandItem,
  RightHandItemInfo,
  isItemKeyRightHand,
} from "./righthand/righthand.items";
import { RightHandItemKey } from "./righthand/righthand.keys";
import { ShoesItem, ShoesItemInfo, isItemKeyShoes } from "./shoes/shoes.items";
import { ShoesItemKey } from "./shoes/shoes.keys";
import { TopItem, TopItemInfo, isItemKeyTop } from "./top/top.items";
import { TopItemKey } from "./top/top.keys";

export type ClothingItemKey =
  | AccessoryItemKey
  | ArmorItemKey
  | EarringsItemKey
  | GlassesItemKey
  | GlovesItemKey
  | HeadwearItemKey
  | LeftHandItemKey
  | MaskItemKey
  | PantsItemKey
  | RightHandItemKey
  | ShoesItemKey
  | TopItemKey;

export type ClothingItem =
  | AccessoryItem
  | ArmorItem
  | EarringsItem
  | GlassesItem
  | GlovesItem
  | HeadwearItem
  | LeftHandItem
  | MaskItem
  | PantsItem
  | RightHandItem
  | ShoesItem
  | TopItem;

export type ClothingItemInfo =
  | AccessoryItemInfo
  | ArmorItemInfo
  | EarringsItemInfo
  | GlassesItemInfo
  | GlovesItemInfo
  | HeadwearItemInfo
  | LeftHandItemInfo
  | MaskItemInfo
  | PantsItemInfo
  | RightHandItemInfo
  | ShoesItemInfo
  | TopItemInfo;

export function isItemKeyClothing(key: string): key is ClothingItemKey {
  return (
    isItemKeyAccessory(key) ||
    isItemKeyArmor(key) ||
    isItemKeyEarrings(key) ||
    isItemKeyGlasses(key) ||
    isItemKeyGloves(key) ||
    isItemKeyHeadwear(key) ||
    isItemKeyLeftHand(key) ||
    isItemKeyMask(key) ||
    isItemKeyPants(key) ||
    isItemKeyRightHand(key) ||
    isItemKeyShoes(key) ||
    isItemKeyTop(key)
  );
}

export function isItemClothing(item: Item): item is ClothingItem {
  return isItemKeyClothing(item.key);
}

export function isFemaleClothing(key: ClothingItemKey): boolean {
  const info = getItemInfoByKey(key);

  return info.ped === "mp_f_freemode_01";
}

export function isMaleClothing(key: ClothingItemKey): boolean {
  const info = getItemInfoByKey(key);

  return info.ped === "mp_m_freemode_01";
}

export function isUnisexClothing(key: ClothingItemKey): boolean {
  const info = getItemInfoByKey(key);

  const slot = getItemKeyEquipmentSlot(key);

  return !!slot && isComponentVariation(slot) && [1, 5].includes(info.componentId);
}

export function isComponentVariation(equipmentSlot: string): boolean {
  return [
    "mask",
    "top",
    "armor",
    "accessory",
    "gloves",
    "pants",
    "backpack",
    "shoes",
    "phone",
    "tool",
  ].includes(equipmentSlot);
}
