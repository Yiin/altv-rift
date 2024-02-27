import { registerItem } from "@shared/modules/items";
import { ItemTier, ItemGrade } from "../../enums";
import { Item } from "../../types";
import { makeKeys } from "../../../../utility/make-keys";
import { WeaponGroup } from "./weapon-groups";
import { getWeaponData } from "./weapon.items";

export const ThrowableWeapon = makeKeys<ThrowableWeaponItemKey>()({
  GRENADE: "grenade",
  STICKYBOMB: "stickybomb",
  SNOWBALL: "snowball",
  SMOKEGRENADE: "smokegrenade",
  JERRYCAN: "jerrycan",
  MOLOTOV: "molotov",
  HAZARDCAN: "hazardcan",
  BALL: "ball",
  BZGAS: "bzgas",
  FLARE: "flare",
  PROXMINE: "proxmine",
  PIPEBOMB: "pipebomb",
});

export type ThrowableWeaponItemKey = Brand<string, "ThrowableWeaponItemKey">;

export type ThrowableWeaponItem = {
  key: ThrowableWeaponItemKey;

  amount: number;
  grade: ItemGrade;
};

export type ThrowableWeaponItemInfo = {
  key: ThrowableWeaponItemKey;
  hash: number;
  name: string;
  description: string;
  group: typeof WeaponGroup.THROWABLE;
  price: number;
  tier: ItemTier;
  comparisonStats: {
    damage: number;
    rate: number;
    accuracy: number;
    range: number;
    overall: number;
  };
};

export const throwableWeapons: ThrowableWeaponItemInfo[] = [
  {
    key: ThrowableWeapon.PIPEBOMB,
    hash: 3125143736,
    name: getWeaponData(3125143736).Name,
    description: getWeaponData(3125143736).Description,
    group: WeaponGroup.THROWABLE,
    price: 50000,
    tier: ItemTier.C,
    comparisonStats: {
      damage: 85,
      rate: 10,
      accuracy: 35,
      range: 15,
      overall: 36.25,
    },
  },
  {
    key: ThrowableWeapon.PROXMINE,
    hash: 2874559379,
    name: getWeaponData(2874559379).Name,
    description: getWeaponData(2874559379).Description,
    group: WeaponGroup.THROWABLE,
    price: 1000,
    tier: ItemTier.B,
    comparisonStats: {
      damage: 90,
      rate: 10,
      accuracy: 30,
      range: 20,
      overall: 37.5,
    },
  },
  {
    key: ThrowableWeapon.GRENADE,
    hash: 2481070269,
    name: getWeaponData(2481070269).Name,
    description: getWeaponData(2481070269).Description,
    group: WeaponGroup.THROWABLE,
    price: 2500,
    tier: ItemTier.B,
    comparisonStats: {
      damage: 95,
      rate: 20,
      accuracy: 10,
      range: 15,
      overall: 35,
    },
  },
  {
    key: ThrowableWeapon.STICKYBOMB,
    hash: 741814745,
    name: getWeaponData(741814745).Name,
    description: getWeaponData(741814745).Description,
    group: WeaponGroup.THROWABLE,
    price: 60000,
    tier: ItemTier.A,
    comparisonStats: {
      damage: 95,
      rate: 10,
      accuracy: 30,
      range: 10,
      overall: 36.25,
    },
  },
  {
    key: ThrowableWeapon.SNOWBALL,
    hash: 126349499,
    name: getWeaponData(126349499).Name,
    description: getWeaponData(126349499).Description,
    group: WeaponGroup.THROWABLE,
    price: 5,
    tier: ItemTier.F,
    comparisonStats: {
      damage: 1,
      rate: 10,
      accuracy: 10,
      range: 0,
      overall: 5.25,
    },
  },
  {
    key: ThrowableWeapon.SMOKEGRENADE,
    hash: 4256991824,
    name: getWeaponData(4256991824).Name,
    description: getWeaponData(4256991824).Description,
    group: WeaponGroup.THROWABLE,
    price: 800,
    tier: ItemTier.F,
    comparisonStats: {
      damage: 10,
      rate: 10,
      accuracy: 10,
      range: 15,
      overall: 11,
    },
  },
  {
    key: ThrowableWeapon.JERRYCAN,
    hash: 883325847,
    name: getWeaponData(883325847).Name,
    description: getWeaponData(883325847).Description,
    group: WeaponGroup.THROWABLE,
    price: 100,
    tier: ItemTier.E,
    comparisonStats: {
      damage: 0,
      rate: 10,
      accuracy: 30,
      range: 1,
      overall: 24.2,
    },
  },
  {
    key: ThrowableWeapon.MOLOTOV,
    hash: 615608432,
    name: getWeaponData(615608432).Name,
    description: getWeaponData(615608432).Description,
    group: WeaponGroup.THROWABLE,
    price: 200,
    tier: ItemTier.E,
    comparisonStats: {
      damage: 50,
      rate: 20,
      accuracy: 20,
      range: 8,
      overall: 24.5,
    },
  },
  {
    key: ThrowableWeapon.HAZARDCAN,
    hash: 3126027122,
    name: getWeaponData(3126027122).Name,
    description: getWeaponData(3126027122).Description,
    group: WeaponGroup.THROWABLE,
    price: 100,
    tier: ItemTier.E,
    comparisonStats: {
      damage: 0,
      rate: 10,
      accuracy: 30,
      range: 1,
      overall: 24.2,
    },
  },
  {
    key: ThrowableWeapon.BALL,
    hash: 600439132,
    name: getWeaponData(600439132).Name,
    description: getWeaponData(600439132).Description,
    group: WeaponGroup.THROWABLE,
    price: 10,
    tier: ItemTier.F,
    comparisonStats: {
      damage: 0,
      rate: 10,
      accuracy: 10,
      range: 0,
      overall: 5,
    },
  },
  {
    key: ThrowableWeapon.BZGAS,
    hash: 2694266206,
    name: getWeaponData(2694266206).Name,
    description: getWeaponData(2694266206).Description,
    group: WeaponGroup.THROWABLE,
    price: 150,
    tier: ItemTier.E,
    comparisonStats: {
      damage: 10,
      rate: 20,
      accuracy: 10,
      range: 15,
      overall: 13.75,
    },
  },
  {
    key: ThrowableWeapon.FLARE,
    hash: 1233104067,
    name: getWeaponData(1233104067).Name,
    description: getWeaponData(1233104067).Description,
    group: WeaponGroup.THROWABLE,
    price: 50,
    tier: ItemTier.C,
    comparisonStats: {
      damage: 0,
      rate: 10,
      accuracy: 10,
      range: 25,
      overall: 11.25,
    },
  },
];

/**
 * Register throwable weapons
 */
for (const info of throwableWeapons) {
  registerItem(info);
}

/**
 * Type guards for throwable weapons
 */
export function isItemKeyThrowableWeapon(key: string): key is ThrowableWeaponItemKey {
  return throwableWeapons.some((throwableWeapon) => throwableWeapon.key === key);
}

export function isItemThrowableWeapon(item: Item): item is ThrowableWeaponItem {
  return isItemKeyThrowableWeapon(item.key);
}
