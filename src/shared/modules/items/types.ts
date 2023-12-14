import { AmmoItem, AmmoItemInfo, AmmoItemKey } from "./registry/ammo/ammo.items";
import { ClothingItem, ClothingItemKey } from "./registry/clothing/clothing.items";
import {
  ConsumableItem,
  ConsumableItemInfo,
  ConsumableItemKey,
} from "./registry/consumables/consumable.items";
import {
  AccessoryItem,
  AccessoryItemInfo,
  AccessoryItemKey,
  ArmorItem,
  ArmorItemInfo,
  ArmorItemKey,
  EarringsItem,
  EarringsItemInfo,
  EarringsItemKey,
  FishingRodItem,
  FishingRodItemInfo,
  FishingRodItemKey,
  FoodIngredientItem,
  FoodIngredientItemInfo,
  FoodIngredientItemKey,
  GlassesItem,
  GlassesItemInfo,
  GlassesItemKey,
  GlovesItem,
  GlovesItemInfo,
  GlovesItemKey,
  HeadwearItem,
  HeadwearItemInfo,
  HeadwearItemKey,
  LeftHandItem,
  LeftHandItemInfo,
  LeftHandItemKey,
  MaskItem,
  MaskItemInfo,
  MaskItemKey,
  MaterialItemKey,
  PantsItem,
  PantsItemInfo,
  PantsItemKey,
  RightHandItem,
  RightHandItemInfo,
  RightHandItemKey,
  ShoesItem,
  ShoesItemInfo,
  ShoesItemKey,
  TopItem,
  TopItemInfo,
  TopItemKey,
  TreeLogItem,
  TreeLogItemInfo,
  TreeLogItemKey,
} from "./registry";
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
import { ToolItem, ToolItemInfo, ToolItemKey } from "./registry/tools/tool.items";
import { WoodItemKey, WoodItem, WoodItemInfo } from "./registry/materials/wood.items";
import { MetalItemKey, MetalItem, MetalItemInfo } from "./registry/materials/metal.items";
import { NoteItemKey, NoteItem, NoteItemInfo } from "./registry/note.items";
import { SandItem, SandItemInfo, SandItemKey } from "./registry/materials/sand.items";

export type StackableItem = Extract<Item, { amount: number }>;

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
  | FishingRodItemKey
  | NoteItemKey;

export type NarrowedItemKey<T extends ItemKey> = T extends FirearmWeaponItemKey
  ? FirearmWeaponItemKey
  : T extends ThrowableWeaponItemKey
  ? ThrowableWeaponItemKey
  : T extends MeleeWeaponItemKey
  ? MeleeWeaponItemKey
  : T extends AmmoItemKey
  ? AmmoItemKey
  : T extends ClothingItemKey
  ? ClothingItemKey
  : T extends ConsumableItemKey
  ? ConsumableItemKey
  : T extends MaterialItemKey
  ? MaterialItemKey
  : T extends FishBaitItemKey
  ? FishBaitItemKey
  : T extends ToolItemKey
  ? ToolItemKey
  : T extends FishingRodItemKey
  ? FishingRodItemKey
  : T extends NoteItemKey
  ? NoteItemKey
  : never;

type ItemMapping<T> = T extends FirearmWeaponItemKey
  ? [FirearmWeaponItem, FirearmWeaponItemInfo]
  : T extends ThrowableWeaponItemKey
  ? [ThrowableWeaponItem, ThrowableWeaponItemInfo]
  : T extends MeleeWeaponItemKey
  ? [MeleeWeaponItem, MeleeWeaponItemInfo]
  : T extends AmmoItemKey
  ? [AmmoItem, AmmoItemInfo]
  : T extends AccessoryItemKey
  ? [AccessoryItem, AccessoryItemInfo]
  : T extends ArmorItemKey
  ? [ArmorItem, ArmorItemInfo]
  : T extends EarringsItemKey
  ? [EarringsItem, EarringsItemInfo]
  : T extends GlassesItemKey
  ? [GlassesItem, GlassesItemInfo]
  : T extends GlovesItemKey
  ? [GlovesItem, GlovesItemInfo]
  : T extends HeadwearItemKey
  ? [HeadwearItem, HeadwearItemInfo]
  : T extends LeftHandItemKey
  ? [LeftHandItem, LeftHandItemInfo]
  : T extends MaskItemKey
  ? [MaskItem, MaskItemInfo]
  : T extends PantsItemKey
  ? [PantsItem, PantsItemInfo]
  : T extends RightHandItemKey
  ? [RightHandItem, RightHandItemInfo]
  : T extends ShoesItemKey
  ? [ShoesItem, ShoesItemInfo]
  : T extends TopItemKey
  ? [TopItem, TopItemInfo]
  : T extends ConsumableItemKey
  ? [ConsumableItem, ConsumableItemInfo]
  : T extends FoodIngredientItemKey
  ? [FoodIngredientItem, FoodIngredientItemInfo]
  : T extends TreeLogItemKey
  ? [TreeLogItem, TreeLogItemInfo]
  : T extends WoodItemKey
  ? [WoodItem, WoodItemInfo]
  : T extends MetalItemKey
  ? [MetalItem, MetalItemInfo]
  : T extends SandItemKey
  ? [SandItem, SandItemInfo]
  : T extends FishBaitItemKey
  ? [FishBaitItem, FishBaitItemInfo]
  : T extends ToolItemKey
  ? [ToolItem, ToolItemInfo]
  : T extends FishingRodItemKey
  ? [FishingRodItem, FishingRodItemInfo]
  : T extends NoteItemKey
  ? [NoteItem, NoteItemInfo]
  : never;

type MappedItemKeys = { [K in ItemKey]: ItemMapping<K> extends never ? K : never };
type MissingKeys = MappedItemKeys[MappedItemKeys[keyof MappedItemKeys]];
type ExtractBrand<T> = T extends string & { [brand]: infer U } ? U : never;
type ExtractMissingKeys<T> = T extends any ? ExtractBrand<T> : never;
type ItemMappingValidation = MissingKeys extends never ? null : ExtractMissingKeys<MissingKeys>;

const MISSING_ITEM_KEYS: ItemMappingValidation = null;

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
