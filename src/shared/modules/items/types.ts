import { AmmoItem, AmmoItemInfo, AmmoItemKey } from "./registry/ammo/ammo.items";
import {
  ClothingItem,
  ClothingItemInfo,
  ClothingItemKey,
} from "./registry/clothing/clothing.items";
import {
  ConsumableItem,
  ConsumableItemInfo,
  ConsumableItemKey,
} from "./registry/consumables/consumable.items";
import {
  MaterialItem,
  MaterialItemInfo,
  MaterialItemKey,
} from "./registry/materials/material.items";
import { FishingRodItem, FishingRodItemInfo, FishingRodItemKey } from "./registry";
import {
  FirearmWeaponItemKey,
  FirearmWeaponItem,
  FirearmWeaponItemInfo,
} from "./registry/weapons/firearm-weapon.items";
import {
  MeleeWeaponItemKey,
  MeleeWeaponItem,
  MeleeWeaponItemInfo,
} from "./registry/weapons/melee-weapon.items";
import {
  ThrowableWeaponItemKey,
  ThrowableWeaponItem,
  ThrowableWeaponItemInfo,
} from "./registry/weapons/throwable-weapon.items";
import { FishBaitItem, FishBaitItemInfo, FishBaitItemKey } from "./registry/fish-bait.items";
import { ToolItem, ToolItemInfo, ToolItemKey } from "./registry/tool.items";

export type ItemKey =
  | FirearmWeaponItemKey
  | ThrowableWeaponItemKey
  | MeleeWeaponItemKey
  | AmmoItemKey
  | ClothingItemKey
  | ConsumableItemKey
  | MaterialItemKey
  | FishBaitItemKey
  | ToolItemKey
  | FishingRodItemKey;

type ItemMapping<T> = T extends FirearmWeaponItemKey
  ? [FirearmWeaponItem, FirearmWeaponItemInfo]
  : T extends ThrowableWeaponItemKey
  ? [ThrowableWeaponItem, ThrowableWeaponItemInfo]
  : T extends MeleeWeaponItemKey
  ? [MeleeWeaponItem, MeleeWeaponItemInfo]
  : T extends AmmoItemKey
  ? [AmmoItem, AmmoItemInfo]
  : T extends ClothingItemKey
  ? [ClothingItem, ClothingItemInfo]
  : T extends ConsumableItemKey
  ? [ConsumableItem, ConsumableItemInfo]
  : T extends MaterialItemKey
  ? [MaterialItem, MaterialItemInfo]
  : T extends FishBaitItemKey
  ? [FishBaitItem, FishBaitItemInfo]
  : T extends ToolItemKey
  ? [ToolItem, ToolItemInfo]
  : T extends FishingRodItemKey
  ? [FishingRodItem, FishingRodItemInfo]
  : never;

type MappedItemKeys = { [K in ItemKey]: ItemMapping<K> extends never ? K : never };
type MissingKeys = MappedItemKeys[MappedItemKeys[keyof MappedItemKeys]];
type ItemMappingValidation = MissingKeys extends never ? unknown : MissingKeys;

const ITEM_MAPPING_VALIDATION: ItemMappingValidation = {};

export type Item = ItemMapping<ItemKey>[0];
export type ItemInfo = ItemMapping<ItemKey>[1];

export type ItemByKey<Key extends ItemKey> = ItemMapping<Key>[0];
export type ItemInfoByKey<Key extends ItemKey> = ItemMapping<Key>[1];

export type Equipment = {
  mask?: ClothingItem | null;
  glasses?: ClothingItem | null;
  headwear?: ClothingItem | null;
  earrings?: ClothingItem | null;
  top?: ClothingItem | null;
  shirt?: ClothingItem | null;
  armor?: ClothingItem | null;
  accessory?: ClothingItem | null;
  weapon?: FirearmWeaponItem | ThrowableWeaponItem | MeleeWeaponItem | null;
  gloves?: ClothingItem | null;
  lefthand?: ClothingItem | null;
  pants?: ClothingItem | null;
  righthand?: ClothingItem | null;
  backpack?: null;
  shoes?: ClothingItem | null;
  phone?: null;
  tool?: ToolItem | FishingRodItem | null;
};
