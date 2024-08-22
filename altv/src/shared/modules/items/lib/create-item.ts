import { Item, ItemByKey, ItemKey } from "../types";
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
import { AmmoItem, isItemKeyAmmo } from "../registry/ammo/ammo.items";
import { ItemComponents, ItemComponentsItem, MaterialItem, isItemKeyItemComponents, isItemKeyMaterial } from "../registry";
import { ItemGrade } from "../enums";
import { isItemKeyStackable } from "./get-item-flags";

export function createItem<T extends ItemKey, D = ItemByKey<T>>(
  key: T,
  data?: Omit<Partial<D>, "key">,
): ItemByKey<T> {
  // Delete amount if item is not stackable
  if (!isItemKeyStackable(key) && data && "amount" in data) {
    delete data.amount;
  }

  return {
    ...getItemDefaultData(key),
    ...(data ?? {}),
    ...(isItemKeyItemComponents(key) ? {
      grade: {
        [ItemComponents.COMMON_ITEM_COMPONENTS]: ItemGrade.COMMON,
        [ItemComponents.UNCOMMON_ITEM_COMPONENTS]: ItemGrade.UNCOMMON,
        [ItemComponents.RARE_ITEM_COMPONENTS]: ItemGrade.RARE,
        [ItemComponents.EPIC_ITEM_COMPONENTS]: ItemGrade.EPIC,
        [ItemComponents.LEGENDARY_ITEM_COMPONENTS]: ItemGrade.LEGENDARY,
      }[key]
    } : {}),
    key,
  } as any;
}

export function getItemDefaultData(key: ItemKey): Partial<Item> {
  if (isItemKeyFirearmWeapon(key)) {
    return {
      durability: 100,
      customName: null,
      components: [],
      tint: 0,
      grade: ItemGrade.COMMON,
    } satisfies Partial<FirearmWeaponItem>;
  } else if (isItemKeyThrowableWeapon(key)) {
    return {
      amount: 1,
      grade: ItemGrade.COMMON,
    } satisfies Partial<ThrowableWeaponItem>;
  } else if (isItemKeyMeleeWeapon(key)) {
    return {
      durability: 100,
      customName: null,
      components: [],
      tint: 0,
      grade: ItemGrade.COMMON,
    } satisfies Partial<MeleeWeaponItem>;
  } else if (isItemKeyAmmo(key)) {
    return {
      amount: 1,
      grade: ItemGrade.COMMON,
    } satisfies Partial<AmmoItem>;
  } else if (isItemKeyClothing(key)) {
    return {
      customName: null,
    } satisfies Partial<ClothingItem>;
  } else if (isItemKeyMaterial(key)) {
    return {
      amount: 1,
      grade: ItemGrade.COMMON,
    } satisfies Partial<MaterialItem>;
  } else if (isItemKeyItemComponents(key)) {
    return {
      amount: 1,
    } satisfies Partial<ItemComponentsItem>;
  } else if (isItemKeyStackable(key)) {
    return {
      amount: 1,
    };
  }
  return {};
}
