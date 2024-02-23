import { ItemByKey, ItemKey } from "../types";
import {
  FirearmWeaponItem,
  isItemKeyFirearmWeapon,
} from "../registry/weapons/firearm-weapon.items";
import {
  ThrowableWeaponItem,
  isItemKeyThrowableWeapon,
} from "../registry/weapons/throwable-weapon.items";
import { MeleeWeaponItem, isItemKeyMeleeWeapon } from "../registry/weapons/melee-weapon.items";
import { ClothingItem, isItemKeyClothing } from "../registry/clothing/clothing.items";
import { ConsumableItem, isItemKeyConsumable } from "../registry/consumables/consumable.items";
import { MaterialItem, isItemKeyMaterial } from "../registry/materials/material.items";
import { AmmoItem, isItemKeyAmmo } from "../registry/ammo/ammo.items";
import {
  FishBaitItem,
  isItemKeyFishBait,
} from "../registry";
import { ItemGrade } from "../enums";
import { isItemKeyStackable } from "./get-item-flags";

export function createItem<T extends ItemKey, D = ItemByKey<T>>(
  key: T,
  data?: Omit<Partial<D>, "key">
) {
  // Delete amount if item is not stackable
  if (!isItemKeyStackable(key) && data && "amount" in data) {
    delete data.amount;
  }

  return {
    ...getItemDefaultData(key),
    ...(data ?? {}),
    key,
  } as any as ItemByKey<T>;
}

export function getItemDefaultData(key: ItemKey) {
  if (isItemKeyFirearmWeapon(key)) {
    return {
      durability: 100,
      customName: null,
      ammo: null,
      components: [],
      tint: 0,
      grade: ItemGrade.BASE
    } satisfies Partial<FirearmWeaponItem>;
  } else if (isItemKeyThrowableWeapon(key)) {
    return {
      amount: 1,
      grade: ItemGrade.BASE
    } satisfies Partial<ThrowableWeaponItem>;
  } else if (isItemKeyMeleeWeapon(key)) {
    return {
      durability: 100,
      customName: null,
      components: [],
      tint: 0,
      grade: ItemGrade.BASE
    } satisfies Partial<MeleeWeaponItem>;
  } else if (isItemKeyAmmo(key)) {
    return {
      amount: 1,
    } satisfies Partial<AmmoItem>;
  } else if (isItemKeyClothing(key)) {
    return {
      customName: null,
    } satisfies Partial<ClothingItem>;
  } else if (isItemKeyConsumable(key)) {
    return {
      amount: 1,
    } satisfies Partial<ConsumableItem>;
  } else if (isItemKeyMaterial(key)) {
    return {
      amount: 1,
    } satisfies Partial<MaterialItem>;
  } else if (isItemKeyFishBait(key)) {
    return {
      amount: 1,
    } satisfies Partial<FishBaitItem>;
  }
  return {};
}
