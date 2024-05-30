import { Item } from "../../types";
import { getItemInfoByKey } from "../../items-registry";
import { ItemGrade } from "../../enums";
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
import { AmmoGroup, WeaponGroup } from "./weapon-groups";

export type WeaponItemKey = FirearmWeaponItemKey | ThrowableWeaponItemKey | MeleeWeaponItemKey;
export type WeaponItemInfo = FirearmWeaponItemInfo | ThrowableWeaponItemInfo | MeleeWeaponItemInfo;
export type WeaponItem = FirearmWeaponItem | ThrowableWeaponItem | MeleeWeaponItem;

export type WeaponHash = keyof typeof WEAPON_DATA;

type WeaponData = {
  Name: string;
  Description: string;
  HashKey: string;
  ModelHashKey?: string;
  Components: Record<string, WeaponComponentData>;
  Tints: WeaponTintData[];
  Stats: WeaponStatsData;
};

type WeaponComponentData = {
  HashKey: string;
  NameGXT: string;
  DescriptionGXT: string;
  Name: string;
  Description: string;
  ModelHashKey: string;
  IsDefault: boolean;
};

type WeaponTintData = {
  NameGXT: string;
  Name: string;
};

type WeaponStatsData = {
  recoilShakeAmplitude: number;
  recoilAccuracyMax: number;
  recoilAccuracyToAllowHeadshotPlayer: number;
  recoilRecoveryRate: number;
  animReloadRate: number;
  vehicleReloadTime: number;
  lockOnRange: number;
  accuracySpread: number;
  range: number;
  damage: number;
  clipSize: number;
  timeBetweenShots: number;
  headshotDamageModifier: number;
  playerDamageModifier: number;
};

export function getWeaponData(hash: string | number | WeaponHash): WeaponData {
  if (!WEAPON_DATA[hash as WeaponHash]) {
    throw new Error(`No weapon data found for hash ${hash}`);
  }
  return WEAPON_DATA[hash as WeaponHash];
}

export function getWeaponDataByItemKey(key: WeaponItemKey): WeaponData {
  return WEAPON_DATA[getWeaponHash(key).toString() as WeaponHash];
}

export function getWeaponHashKey(key: WeaponItemKey): string {
  return getWeaponDataByItemKey(key)?.HashKey;
}

export function getWeaponComponents(key: WeaponItemKey): Record<string, WeaponComponentData> {
  return getWeaponDataByItemKey(key)?.Components;
}

export function getWeaponTints(key: WeaponItemKey): WeaponTintData[] {
  return getWeaponDataByItemKey(key)?.Tints;
}

export function getWeaponStats(key: WeaponItemKey): WeaponStatsData {
  return getWeaponDataByItemKey(key)?.Stats;
}

export function getWeaponModel(key: WeaponItemKey): string | undefined {
  const data = getWeaponDataByItemKey(key);

  if (!data) {
    return;
  }

  if (!("ModelHashKey" in data) || !data.ModelHashKey) {
    return;
  }

  return data.ModelHashKey;
}

export function getWeaponHash(key: WeaponItemKey): number {
  return getItemInfoByKey(key).hash;
}

export function getWeaponGroup(key: WeaponItemKey): WeaponGroup {
  return getItemInfoByKey(key).group;
}

export function getWeaponAmmoGroup(key: FirearmWeaponItemKey): AmmoGroup {
  return getItemInfoByKey(key).ammoGroup;
}

export function getWeaponDamageMultiplier(key: WeaponItemKey, grade: ItemGrade) {
  const damage = getWeaponStats(key).damage;

  // compute a multiples that would result in rounded damage
  switch (grade) {
    case ItemGrade.COMMON:
      return 1;
    case ItemGrade.UNCOMMON:
      return Math.ceil(damage * 2) / damage;
    case ItemGrade.RARE:
      return Math.ceil(damage * 4) / damage;
    case ItemGrade.EPIC:
      return Math.ceil(damage * 8) / damage;
    case ItemGrade.LEGENDARY:
      return Math.ceil(damage * 16) / damage;
    case ItemGrade.CONTRABAND:
      return Math.ceil(damage * 32) / damage;
    case ItemGrade.LIMITED:
      return Math.ceil(damage * 64) / damage;
  }
}

export function getWeaponDamage(key: WeaponItemKey, grade: ItemGrade): number {
  return getWeaponStats(key).damage * getWeaponDamageMultiplier(key, grade);
}

export function isItemKeyWeapon(key: string): key is WeaponItemKey {
  return isItemKeyFirearmWeapon(key) || isItemKeyThrowableWeapon(key) || isItemKeyMeleeWeapon(key);
}

export function isItemWeapon(item: Item): item is WeaponItem {
  return isItemKeyWeapon(item.key);
}
