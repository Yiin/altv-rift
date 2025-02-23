import { EquipmentSlot } from "@shared/interfaces";
import { AmmoItem, AmmoItemInfo, AmmoItemKey } from "./registry/ammo/ammo.items";
import { ClothingItemKey } from "./registry/clothing/clothing.items";
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
  FirearmWeaponItem,
  FirearmWeaponItemInfo,
  FirearmWeaponItemKey,
  FishingBaitItem,
  FishingBaitItemInfo,
  FishingBaitItemKey,
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
  MeleeWeaponItem,
  MeleeWeaponItemInfo,
  MeleeWeaponItemKey,
  MetalItem,
  MetalItemInfo,
  MetalItemKey,
  NoteItem,
  NoteItemInfo,
  NoteItemKey,
  OreItem,
  OreItemInfo,
  OreItemKey,
  PantsItem,
  PantsItemInfo,
  PantsItemKey,
  RightHandItem,
  RightHandItemInfo,
  RightHandItemKey,
  SandItem,
  SandItemInfo,
  SandItemKey,
  ShoesItem,
  ShoesItemInfo,
  ShoesItemKey,
  ThrowableWeaponItem,
  ThrowableWeaponItemInfo,
  ThrowableWeaponItemKey,
  ToolItem,
  ToolItemKey,
  TopItem,
  TopItemInfo,
  TopItemKey,
  TreeLogItem,
  TreeLogItemInfo,
  TreeLogItemKey,
  WeaponComponentItem,
  WeaponComponentItemInfo,
  WeaponComponentItemKey,
  WeaponItemKey,
  WoodItem,
  WoodItemInfo,
  WoodItemKey,
  ToolItemInfo,
  ItemComponentsItem,
  ItemComponentsItemInfo,
  ItemComponentsItemKey,
} from "./registry";
import { LeatherItem, LeatherItemInfo, LeatherItemKey } from "./registry/materials/leather.items";
import { HideItemKey, HideItem, HideItemInfo } from "./registry/materials/hide.items";
import {
  UnlearnedBlueprintItemKey,
  UnlearnedBlueprintItem,
  UnlearnedBlueprintItemInfo,
} from "../production";

export type StackableItem = Extract<Item, { amount: number }>;

export type ItemKey =
  | WeaponItemKey
  | AmmoItemKey
  | WeaponComponentItemKey
  | ClothingItemKey
  | ConsumableItemKey
  | MaterialItemKey
  | FishingBaitItemKey
  | ToolItemKey
  | NoteItemKey
  | UnlearnedBlueprintItemKey;

/* eslint-disable prettier/prettier */
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
                                              : T extends HideItemKey
                                                ? [HideItem, HideItemInfo]
                                                : T extends LeatherItemKey
                                                  ? [LeatherItem, LeatherItemInfo]
                                                  : T extends SandItemKey
                                                    ? [SandItem, SandItemInfo]
                                                    : T extends FishingBaitItemKey
                                                      ? [FishingBaitItem, FishingBaitItemInfo]
                                                      : T extends ToolItemKey
                                                        ? [ToolItem, ToolItemInfo]
                                                        : T extends NoteItemKey
                                                          ? [NoteItem, NoteItemInfo]
                                                          : T extends UnlearnedBlueprintItemKey
                                                            ? [
                                                                UnlearnedBlueprintItem,
                                                                UnlearnedBlueprintItemInfo,
                                                              ]
                                                            : T extends ItemComponentsItemKey
                                                              ? [
                                                                  ItemComponentsItem,
                                                                  ItemComponentsItemInfo,
                                                                ]
                                                              : never;

type MappedItemKeys = { [K in ItemKey]: ItemMapping<K> extends never ? K : never };
type MissingKeys = MappedItemKeys[MappedItemKeys[keyof MappedItemKeys]];
type ExtractBrand<T> = T extends string & { [brand]: infer U } ? U : never;
type ExtractMissingKeys<T> = T extends any ? ExtractBrand<T> : never;
type ItemMappingValidation = MissingKeys extends never ? null : ExtractMissingKeys<MissingKeys>;

// Type 'null' in not assignable to type <MissingItemKeys>.
const MISSING_ITEM_KEYS: ItemMappingValidation = null;

export type Item = ItemMapping<ItemKey>[0];
export type PartialItem = Partial<Item>;
export type ItemInfo = ItemMapping<ItemKey>[1];

export type ItemByKey<Key extends ItemKey> = ItemMapping<Key>[0];
export type ItemInfoByKey<Key extends ItemKey> = ItemMapping<Key>[1];

export type Equipment = {
  [EquipmentSlot.Mask]?: MaskItem | null;
  [EquipmentSlot.Glasses]?: GlassesItem | null;
  [EquipmentSlot.Headwear]?: HeadwearItem | null;
  [EquipmentSlot.Earrings]?: EarringsItem | null;
  [EquipmentSlot.Top]?: TopItem | null;
  [EquipmentSlot.Armor]?: ArmorItem | null;
  [EquipmentSlot.Accessory]?: AccessoryItem | null;
  [EquipmentSlot.Weapon]?:
    | FirearmWeaponItem
    | ThrowableWeaponItem
    | MeleeWeaponItem
    | ToolItem
    | null;
  [EquipmentSlot.Gloves]?: GlovesItem | null;
  [EquipmentSlot.LeftHand]?: LeftHandItem | null;
  [EquipmentSlot.Pants]?: PantsItem | null;
  [EquipmentSlot.RightHand]?: RightHandItem | null;
  [EquipmentSlot.Backpack]?: null;
  [EquipmentSlot.Shoes]?: ShoesItem | null;
  [EquipmentSlot.Phone]?: null;
  [EquipmentSlot.QuickSlot1]?: Item | null;
  [EquipmentSlot.QuickSlot2]?: Item | null;
  [EquipmentSlot.QuickSlot3]?: Item | null;
  [EquipmentSlot.QuickSlot4]?: Item | null;
  [EquipmentSlot.QuickSlot5]?: Item | null;
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
