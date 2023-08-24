import { ItemType } from "@prisma/client";
import {
  ItemDataByKey,
  Override,
  ItemByKey,
  FirearmWeaponItemData,
  ThrowableWeaponItemData,
  MeleeWeaponItemData,
  AmmoItemData,
  ClothingItemData,
  ConsumableItemData,
  MaterialItemData,
} from "@shared/interfaces";
import { ItemKey, ItemTypeByKey } from "../types";
import { getItemType } from "../registry";

export function createItem<T extends ItemKey, D = ItemDataByKey<T>>(
  key: T,
  data?: Override<D, (typeof ITEM_DATA_DEFAULTS)[ItemTypeByKey[T]]>
) {
  const type = getItemType(key);

  return {
    key,
    type,
    [type]: {
      ...ITEM_DATA_DEFAULTS[type],
      ...(data ?? {}),
    },
  } as any as ItemByKey<T>;
}

export const ITEM_DATA_DEFAULTS = {
  [ItemType.FIREARM_WEAPON]: {
    durability: 100,
    customName: null,
    ammo: null,
    components: [],
    tint: 0,
  } satisfies Partial<FirearmWeaponItemData>,
  [ItemType.THROWABLE_WEAPON]: {} satisfies Partial<ThrowableWeaponItemData>,
  [ItemType.MELEE_WEAPON]: {
    durability: 100,
    customName: null,
    components: [],
    tint: 0,
  } satisfies Partial<MeleeWeaponItemData>,
  [ItemType.AMMO]: {} satisfies Partial<AmmoItemData>,
  [ItemType.CLOTHING]: {
    durability: 100,
    customName: null,
    texture: 0,
  } satisfies Partial<ClothingItemData>,
  [ItemType.CONSUMABLE]: {} satisfies Partial<ConsumableItemData>,
  [ItemType.MATERIAL]: {} satisfies Partial<MaterialItemData>,
} as const;
