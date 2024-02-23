import { getItemInfoByKey } from "../../items-registry";
import { Item, ItemKey } from "../../types";
import {
  AccessoryItem,
  AccessoryItemInfo,
  AccessoryItemKey,
  isItemKeyAccessory,
} from "./accessory/accessory.items";
import { ArmorItem, ArmorItemInfo, ArmorItemKey, isItemKeyArmor } from "./armor/armor.items";
import {
  EarringsItem,
  EarringsItemInfo,
  EarringsItemKey,
  isItemKeyEarrings,
} from "./earrings/earrings.items";
import {
  GlassesItem,
  GlassesItemInfo,
  GlassesItemKey,
  isItemKeyGlasses,
} from "./glasses/glasses.items";
import { GlovesItem, GlovesItemInfo, GlovesItemKey, isItemKeyGloves } from "./gloves/gloves.items";
import {
  HeadwearItem,
  HeadwearItemInfo,
  HeadwearItemKey,
  isItemKeyHeadwear,
} from "./headwear/headwear.items";
import {
  LeftHandItem,
  LeftHandItemInfo,
  LeftHandItemKey,
  isItemKeyLeftHand,
} from "./lefthand/lefthand.items";
import { MaskItem, MaskItemInfo, MaskItemKey, isItemKeyMask } from "./masks/mask.items";
import { PantsItem, PantsItemInfo, PantsItemKey, isItemKeyPants } from "./pants/pants.items";
import {
  RightHandItem,
  RightHandItemInfo,
  RightHandItemKey,
  isItemKeyRightHand,
} from "./righthand/righthand.items";
import { ShoesItem, ShoesItemInfo, ShoesItemKey, isItemKeyShoes } from "./shoes/shoes.items";
import { TopItem, TopItemInfo, TopItemKey, isItemKeyTop } from "./top/top.items";

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

export function isUnisexClothing(key: ClothingItemKey) {
  const info = getItemInfoByKey(key);

  return [1, 5].includes(info.componentId);
}
