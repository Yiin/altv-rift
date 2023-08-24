import { ItemType } from "@prisma/client";
import { AmmoItemKey } from "./ammo";
import { ClothingItemKey } from "./clothing";
import { ConsumableItemKey } from "./consumables";
import { MaterialItemKey } from "./materials";
import { WeaponItemKey } from "./weapons";
import { FirearmWeaponItemKey } from "./weapons/firearms";
import { MeleeWeaponItemKey } from "./weapons/melee";
import { ThrowableWeaponItemKey } from "./weapons/throwable";

export type ItemKey =
  | WeaponItemKey
  | AmmoItemKey
  | ClothingItemKey
  | ConsumableItemKey
  | MaterialItemKey;

export type ItemTypeByKey = {
  [K in FirearmWeaponItemKey]: typeof ItemType.FIREARM_WEAPON;
} & {
  [K in ThrowableWeaponItemKey]: typeof ItemType.THROWABLE_WEAPON;
} & {
  [K in MeleeWeaponItemKey]: typeof ItemType.MELEE_WEAPON;
} & {
  [K in AmmoItemKey]: typeof ItemType.AMMO;
} & {
  [K in ClothingItemKey]: typeof ItemType.CLOTHING;
} & {
  [K in ConsumableItemKey]: typeof ItemType.CONSUMABLE;
} & {
  [K in MaterialItemKey]: typeof ItemType.MATERIAL;
};

export type KeysByItemType = {
  [ItemType.FIREARM_WEAPON]: FirearmWeaponItemKey;
  [ItemType.THROWABLE_WEAPON]: ThrowableWeaponItemKey;
  [ItemType.MELEE_WEAPON]: MeleeWeaponItemKey;
  [ItemType.AMMO]: AmmoItemKey;
  [ItemType.CLOTHING]: ClothingItemKey;
  [ItemType.CONSUMABLE]: ConsumableItemKey;
  [ItemType.MATERIAL]: MaterialItemKey;
};
