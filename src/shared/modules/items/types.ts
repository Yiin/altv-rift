import { Item } from "@shared/interfaces";
import { AmmoItem, AmmoItemKey } from "./ammo";
import { ClothingItem, ClothingItemKey } from "./clothing";
import { ConsumableItem, ConsumableItemKey } from "./consumables";
import { MaterialItem, MaterialItemKey } from "./materials";
import { WeaponItemKey } from "./weapons";
import { FirearmWeaponItem, FirearmWeaponItemKey } from "./weapons/firearms";
import { BasicItem, BasicItemKey } from "./basic";

export type ItemKey =
  | WeaponItemKey
  | AmmoItemKey
  | ClothingItemKey
  | ConsumableItemKey
  | MaterialItemKey
  | BasicItemKey;

export type ItemByKey<Key extends ItemKey> = Key extends FirearmWeaponItemKey
  ? FirearmWeaponItem
  : Key extends AmmoItemKey
  ? AmmoItem
  : Key extends ClothingItemKey
  ? ClothingItem
  : Key extends ConsumableItemKey
  ? ConsumableItem
  : Key extends MaterialItemKey
  ? MaterialItem
  : Key extends BasicItemKey
  ? BasicItem
  : never;

export type KeysByItem<T extends Item> = T extends FirearmWeaponItem
  ? FirearmWeaponItemKey
  : T extends AmmoItem
  ? AmmoItemKey
  : T extends ClothingItem
  ? ClothingItemKey
  : T extends ConsumableItem
  ? ConsumableItemKey
  : T extends MaterialItem
  ? MaterialItemKey
  : T extends BasicItem
  ? BasicItemKey
  : never;
