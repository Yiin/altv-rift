import { ItemKey } from "../types";
import WEAPON_DATA from "./weapons-data.json";
import { firearmWeapons, isItemFirearmWeapon } from "./firearms";
import { throwableWeapons } from "./throwable";
import { meleeWeapons } from "./melee";

export type WeaponItemKey = keyof typeof weapons;
export type WeaponItemInfo = (typeof weapons)[WeaponItemKey];

export const weapons = {
  ...firearmWeapons,
  ...throwableWeapons,
  ...meleeWeapons,
} as const;

export type WeaponHash = keyof typeof WEAPON_DATA;

export function getWeaponItemByKey<T extends WeaponItemKey>(key: T) {
  return weapons[key];
}

export function getWeaponData(hash: string | number | WeaponHash) {
  return WEAPON_DATA[hash as WeaponHash];
}

export function getWeaponDataByItemKey(key: WeaponItemKey) {
  return WEAPON_DATA[weapons[key]?.hash.toString() as WeaponHash];
}

export function getWeaponComponents(key: WeaponItemKey) {
  return getWeaponDataByItemKey(key)?.Components;
}

export function getWeaponTints(key: WeaponItemKey) {
  return getWeaponDataByItemKey(key)?.Tints;
}

export function getWeaponHash(key: WeaponItemKey) {
  return weapons[key].hash;
}

export function getWeaponGroup(key: WeaponItemKey) {
  return weapons[key].group;
}
export function getWeaponAmmoGroup(key: WeaponItemKey) {
  if (!isItemFirearmWeapon(key)) {
    return null;
  }
  return weapons[key].ammoGroup;
}

export function isItemWeapon(key: ItemKey): key is WeaponItemKey {
  return key in weapons;
}
