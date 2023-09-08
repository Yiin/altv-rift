import { registerItem } from "@shared/modules/items";
import { ItemFlags } from "../../item-flags";
import { Item } from "../../types";
import { WeaponGroup } from "./weapon-groups";
import { getWeaponData } from "./weapon.items";

export const ThrowableWeapon = {
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
} as const;

export type ThrowableWeaponItemKey = (typeof ThrowableWeapon)[keyof typeof ThrowableWeapon];

export type ThrowableWeaponItem = {
  key: ThrowableWeaponItemKey;

  amount: number;
};

export type ThrowableWeaponItemInfo = {
  key: ThrowableWeaponItemKey;
  hash: number;
  name: string;
  description: string;
  flags: ItemFlags;
  group: typeof WeaponGroup.THROWABLE;
  price: number;
  stats: {
    damage: number;
    rate: number;
    accuracy: number;
    range: number;
    overall: number;
  };
};

export const throwableWeapons: Record<ThrowableWeaponItemKey, ThrowableWeaponItemInfo> = {
  pipebomb: {
    key: "pipebomb",
    hash: 3125143736,
    name: getWeaponData(3125143736).Name,
    description: getWeaponData(3125143736).Description,
    flags: ItemFlags.IsEquippable,
    group: WeaponGroup.THROWABLE,
    price: 50000,
    stats: {
      damage: 85,
      rate: 10,
      accuracy: 35,
      range: 15,
      overall: 36.25,
    },
  },
  proxmine: {
    key: "proxmine",
    hash: 2874559379,
    name: getWeaponData(2874559379).Name,
    description: getWeaponData(2874559379).Description,
    flags: ItemFlags.IsEquippable,
    group: WeaponGroup.THROWABLE,
    price: 1000,
    stats: {
      damage: 90,
      rate: 10,
      accuracy: 30,
      range: 20,
      overall: 37.5,
    },
  },
  grenade: {
    key: "grenade",
    hash: 2481070269,
    name: getWeaponData(2481070269).Name,
    description: getWeaponData(2481070269).Description,
    flags: ItemFlags.IsEquippable,
    group: WeaponGroup.THROWABLE,
    price: 2500,
    stats: {
      damage: 95,
      rate: 20,
      accuracy: 10,
      range: 15,
      overall: 35,
    },
  },
  stickybomb: {
    key: "stickybomb",
    hash: 741814745,
    name: getWeaponData(741814745).Name,
    description: getWeaponData(741814745).Description,
    flags: ItemFlags.IsEquippable,
    group: WeaponGroup.THROWABLE,
    price: 60000,
    stats: {
      damage: 95,
      rate: 10,
      accuracy: 30,
      range: 10,
      overall: 36.25,
    },
  },
  snowball: {
    key: "snowball",
    hash: 126349499,
    name: getWeaponData(126349499).Name,
    description: getWeaponData(126349499).Description,
    flags: ItemFlags.IsEquippable,
    group: WeaponGroup.THROWABLE,
    price: 5,
    stats: {
      damage: 1,
      rate: 10,
      accuracy: 10,
      range: 0,
      overall: 5.25,
    },
  },
  smokegrenade: {
    key: "smokegrenade",
    hash: 4256991824,
    name: getWeaponData(4256991824).Name,
    description: getWeaponData(4256991824).Description,
    flags: ItemFlags.IsEquippable,
    group: WeaponGroup.THROWABLE,
    price: 800,
    stats: {
      damage: 10,
      rate: 10,
      accuracy: 10,
      range: 15,
      overall: 11,
    },
  },
  jerrycan: {
    key: "jerrycan",
    hash: 883325847,
    name: getWeaponData(883325847).Name,
    description: getWeaponData(883325847).Description,
    flags: ItemFlags.IsEquippable,
    group: WeaponGroup.THROWABLE,
    price: 100,
    stats: {
      damage: 0,
      rate: 10,
      accuracy: 30,
      range: 1,
      overall: 24.2,
    },
  },
  molotov: {
    key: "molotov",
    hash: 615608432,
    name: getWeaponData(615608432).Name,
    description: getWeaponData(615608432).Description,
    flags: ItemFlags.IsEquippable,
    group: WeaponGroup.THROWABLE,
    price: 200,
    stats: {
      damage: 50,
      rate: 20,
      accuracy: 20,
      range: 8,
      overall: 24.5,
    },
  },
  hazardcan: {
    key: "hazardcan",
    hash: 3126027122,
    name: getWeaponData(3126027122).Name,
    description: getWeaponData(3126027122).Description,
    flags: ItemFlags.IsEquippable,
    group: WeaponGroup.THROWABLE,
    price: 100,
    stats: {
      damage: 0,
      rate: 10,
      accuracy: 30,
      range: 1,
      overall: 24.2,
    },
  },
  ball: {
    key: "ball",
    hash: 600439132,
    name: getWeaponData(600439132).Name,
    description: getWeaponData(600439132).Description,
    flags: ItemFlags.IsEquippable,
    group: WeaponGroup.THROWABLE,
    price: 10,
    stats: {
      damage: 0,
      rate: 10,
      accuracy: 10,
      range: 0,
      overall: 5,
    },
  },
  bzgas: {
    key: "bzgas",
    hash: 2694266206,
    name: getWeaponData(2694266206).Name,
    description: getWeaponData(2694266206).Description,
    flags: ItemFlags.IsEquippable,
    group: WeaponGroup.THROWABLE,
    price: 150,
    stats: {
      damage: 10,
      rate: 20,
      accuracy: 10,
      range: 15,
      overall: 13.75,
    },
  },
  flare: {
    key: "flare",
    hash: 1233104067,
    name: getWeaponData(1233104067).Name,
    description: getWeaponData(1233104067).Description,
    flags: ItemFlags.IsEquippable,
    group: WeaponGroup.THROWABLE,
    price: 50,
    stats: {
      damage: 0,
      rate: 10,
      accuracy: 10,
      range: 25,
      overall: 11.25,
    },
  },
};

/**
 * Register throwable weapons
 */
for (const [key, info] of Object.entries(throwableWeapons)) {
  registerItem(key as ThrowableWeaponItemKey, info);
}

/**
 * Type guards for throwable weapons
 */
export function isItemKeyThrowableWeapon(key: string): key is ThrowableWeaponItemKey {
  return key in throwableWeapons;
}

export function isItemThrowableWeapon(item: Item): item is ThrowableWeaponItem {
  return isItemKeyThrowableWeapon(item.key);
}
