import { EquipmentSlot } from "@shared/interfaces";
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
  WeaponItemKey,
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
import { WeaponComponentItem, WeaponComponentItemInfo, WeaponComponentItemKey } from "./registry/weapon-components/weapon-component.items";
import { OreItemKey, OreItem, OreItemInfo } from "./registry/materials/ore.items";
import { ScrapItemKey, ScrapItem, ScrapItemInfo } from "./registry/materials/scrap.items";

export type StackableItem = Extract<Item, { amount: number }>;

export type ItemKey =
  | WeaponItemKey
  | AmmoItemKey
  | WeaponComponentItemKey
  | ClothingItemKey
  | ConsumableItemKey
  | MaterialItemKey
  | FishBaitItemKey
  | ToolItemKey
  | NoteItemKey;

type ItemMapping<T> = T extends FirearmWeaponItemKey
  ? [FirearmWeaponItem, FirearmWeaponItemInfo]
  : T extends ThrowableWeaponItemKey
  ? [ThrowableWeaponItem, ThrowableWeaponItemInfo]
  : T extends MeleeWeaponItemKey
  ? [MeleeWeaponItem, MeleeWeaponItemInfo]
  : T extends AmmoItemKey
  ? [AmmoItem, AmmoItemInfo]
  : T extends WeaponComponentItemKey
  ? [WeaponComponentItem, WeaponComponentItemInfo]
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
  : T extends OreItemKey
  ? [OreItem, OreItemInfo]
  : T extends MetalItemKey
  ? [MetalItem, MetalItemInfo]
  : T extends SandItemKey
  ? [SandItem, SandItemInfo]
  : T extends ScrapItemKey
  ? [ScrapItem, ScrapItemInfo]
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
  [EquipmentSlot.Mask]?: ClothingItem | null;
  [EquipmentSlot.Glasses]?: ClothingItem | null;
  [EquipmentSlot.Headwear]?: ClothingItem | null;
  [EquipmentSlot.Earrings]?: ClothingItem | null;
  [EquipmentSlot.Top]?: ClothingItem | null;
  [EquipmentSlot.Armor]?: ClothingItem | null;
  [EquipmentSlot.Accessory]?: ClothingItem | null;
  [EquipmentSlot.Weapon]?: FirearmWeaponItem | ThrowableWeaponItem | MeleeWeaponItem | null;
  [EquipmentSlot.Gloves]?: ClothingItem | null;
  [EquipmentSlot.LeftHand]?: ClothingItem | null;
  [EquipmentSlot.Pants]?: ClothingItem | null;
  [EquipmentSlot.RightHand]?: ClothingItem | null;
  [EquipmentSlot.Backpack]?: null;
  [EquipmentSlot.Shoes]?: ClothingItem | null;
  [EquipmentSlot.Phone]?: null;
  [EquipmentSlot.Tool]?: ToolItem | FishingRodItem | null;
  [EquipmentSlot.QuickSlot1]?: ConsumableItem | null;
  [EquipmentSlot.QuickSlot2]?: ConsumableItem | null;
  [EquipmentSlot.QuickSlot3]?: ConsumableItem | null;
  [EquipmentSlot.QuickSlot4]?: ConsumableItem | null;
  [EquipmentSlot.AssaultRifleAmmo]?: AmmoItem | null;
  [EquipmentSlot.HandgunAmmo]?: AmmoItem | null;
  [EquipmentSlot.MachineGunAmmo]?: AmmoItem | null;
  [EquipmentSlot.ShotgunAmmo]?: AmmoItem | null;
  [EquipmentSlot.SniperRifleAmmo]?: AmmoItem | null;
  [EquipmentSlot.RocketLauncherAmmo]?: AmmoItem | null;
  [EquipmentSlot.FireworkAmmo]?: AmmoItem | null;
  [EquipmentSlot.GrenadeLauncherAmmo]?: AmmoItem | null;
  [EquipmentSlot.PlasmaRaysAmmo]?: AmmoItem | null;
  [EquipmentSlot.FireExtinguisherAmmo]?: AmmoItem | null;
  [EquipmentSlot.SmokeGranadesAmmo]?: AmmoItem | null;
};
