import { Item, ItemKey } from "../../types";
import { getItemInfoByKey } from "../../items-registry";
import WEAPON_DATA from "./weapons-data.json";
import {
  FirearmWeaponItem,
  FirearmWeaponItemInfo,
  FirearmWeaponItemKey,
  isItemKeyFirearmWeapon,
} from "./firearm-weapon.items";
import {
  ThrowableWeaponItem,
  ThrowableWeaponItemInfo,
  ThrowableWeaponItemKey,
  isItemKeyThrowableWeapon,
} from "./throwable-weapon.items";
import {
  MeleeWeaponItem,
  MeleeWeaponItemInfo,
  MeleeWeaponItemKey,
  isItemKeyMeleeWeapon,
} from "./melee-weapon.items";

export type WeaponItemKey = FirearmWeaponItemKey | ThrowableWeaponItemKey | MeleeWeaponItemKey;
export type WeaponItemInfo = FirearmWeaponItemInfo | ThrowableWeaponItemInfo | MeleeWeaponItemInfo;
export type WeaponItem = FirearmWeaponItem | ThrowableWeaponItem | MeleeWeaponItem;

export type WeaponHash = keyof typeof WEAPON_DATA;

export function getWeaponData(hash: string | number | WeaponHash) {
  return WEAPON_DATA[hash as WeaponHash];
}

export function getWeaponDataByItemKey(key: WeaponItemKey) {
  return WEAPON_DATA[getWeaponHash(key).toString() as WeaponHash];
}

export function getWeaponComponents(key: WeaponItemKey) {
  return getWeaponDataByItemKey(key)?.Components;
}

export function getWeaponTints(key: WeaponItemKey) {
  return getWeaponDataByItemKey(key)?.Tints;
}

export function getWeaponStats(key: WeaponItemKey) {
  return getWeaponDataByItemKey(key)?.Stats;
}

export function getWeaponHash(key: WeaponItemKey) {
  return getItemInfoByKey(key).hash;
}

export function getWeaponGroup(key: WeaponItemKey) {
  return getItemInfoByKey(key).group;
}
export function getWeaponAmmoGroup(key: FirearmWeaponItemKey) {
  return getItemInfoByKey(key).ammoGroup;
}

export function isItemKeyWeapon(key: ItemKey): key is WeaponItemKey {
  return isItemKeyFirearmWeapon(key) || isItemKeyThrowableWeapon(key) || isItemKeyMeleeWeapon(key);
}

export function isItemWeapon(item: Item): item is WeaponItem {
  return isItemKeyWeapon(item.key);
}
