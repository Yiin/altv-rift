import { Item, ItemInfoByKey, ItemKey } from "../../types";
import WEAPON_DATA from "./weapons-data.json";
import {
  FirearmWeaponItem,
  FirearmWeaponItemInfo,
  FirearmWeaponItemKey,
  firearmWeapons,
  isItemKeyFirearmWeapon,
} from "./firearm-weapon.items";
import {
  ThrowableWeaponItem,
  ThrowableWeaponItemInfo,
  ThrowableWeaponItemKey,
  isItemKeyThrowableWeapon,
  throwableWeapons,
} from "./throwable-weapon.items";
import {
  MeleeWeaponItem,
  MeleeWeaponItemInfo,
  MeleeWeaponItemKey,
  isItemKeyMeleeWeapon,
  meleeWeapons,
} from "./melee-weapon.items";

export type WeaponItemKey = FirearmWeaponItemKey | ThrowableWeaponItemKey | MeleeWeaponItemKey;
export type WeaponItemInfo = FirearmWeaponItemInfo | ThrowableWeaponItemInfo | MeleeWeaponItemInfo;
export type WeaponItem = FirearmWeaponItem | ThrowableWeaponItem | MeleeWeaponItem;

export type WeaponHash = keyof typeof WEAPON_DATA;

export function getWeaponItemInfoByKey<T extends WeaponItemKey>(key: T): ItemInfoByKey<T> {
  if (isItemKeyFirearmWeapon(key)) {
    return firearmWeapons[key];
  } else if (isItemKeyThrowableWeapon(key)) {
    return throwableWeapons[key];
  } else {
    return meleeWeapons[key as MeleeWeaponItemKey];
  }
}

export function getWeaponData(hash: string | number | WeaponHash) {
  return WEAPON_DATA[hash as WeaponHash];
}

export function getWeaponDataByItemKey(key: WeaponItemKey) {
  return WEAPON_DATA[getWeaponItemInfoByKey(key)?.hash.toString() as WeaponHash];
}

export function getWeaponComponents(key: WeaponItemKey) {
  return getWeaponDataByItemKey(key)?.Components;
}

export function getWeaponTints(key: WeaponItemKey) {
  return getWeaponDataByItemKey(key)?.Tints;
}

export function getWeaponHash(key: WeaponItemKey) {
  return getWeaponItemInfoByKey(key).hash;
}

export function getWeaponGroup(key: WeaponItemKey) {
  return getWeaponItemInfoByKey(key).group;
}
export function getWeaponAmmoGroup(key: WeaponItemKey) {
  if (!isItemKeyFirearmWeapon(key)) {
    return null;
  }
  return getWeaponItemInfoByKey(key).ammoGroup;
}

export function isItemKeyWeapon(key: ItemKey): key is WeaponItemKey {
  return isItemKeyFirearmWeapon(key) || isItemKeyThrowableWeapon(key) || isItemKeyMeleeWeapon(key);
}

export function isItemWeapon(item: Item): item is WeaponItem {
  return isItemKeyWeapon(item.key);
}
