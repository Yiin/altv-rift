import { registerItem } from "@shared/modules/items";
import { ItemFlags } from "../../item-flags";
import { Item } from "../../types";
import { makeItemKeys } from "../../lib/make-item-keys";
import { WeaponGroup } from "./weapon-groups";
import { getWeaponData } from "./weapon.items";

export const MeleeWeapon = makeItemKeys<MeleeWeaponItemKey>()({
  BAT: "bat",
  BATTLEAXE: "battleaxe",
  BOTTLE: "bottle",
  CROWBAR: "crowbar",
  DAGGER: "dagger",
  FLASHLIGHT: "flashlight",
  GOLFCLUB: "golfclub",
  HAMMER: "hammer",
  HATCHET: "hatchet",
  KNIFE: "knife",
  KNUCKLE: "knuckle",
  MACHETE: "machete",
  NIGHTSTICK: "nightstick",
  PIPEWRENCH: "pipewrench",
  POOLCUE: "poolcue",
  STONEHATCHET: "stonehatchet",
  SWITCHBLADE: "switchblade",
});

export type MeleeWeaponItemKey = Brand<string, "MeleeWeaponItemKey">;

export type MeleeWeaponItem = {
  key: MeleeWeaponItemKey;

  customName?: string | null;
  durability: number;
  tint: number;
  components: number[];
};

export type MeleeWeaponItemInfo = {
  key: MeleeWeaponItemKey;
  hash: number;
  name: string;
  description: string;
  flags: ItemFlags;
  group: typeof WeaponGroup.MELEE;
  price: number;
  stats: {
    damage: number;
    rate: number;
    range: number;
    overall: number;
  };
};

export const meleeWeapons: Record<MeleeWeaponItemKey, MeleeWeaponItemInfo> = {
  switchblade: {
    key: "switchblade",
    hash: 3756226112,
    name: getWeaponData(3756226112).Name,
    description: getWeaponData(3756226112).Description,
    flags: ItemFlags.IsEquippable,
    group: WeaponGroup.MELEE,
    price: 1950,
    stats: {
      damage: 76,
      rate: 20,
      range: 0,
      overall: 11.67,
    },
  },
  stonehatchet: {
    key: "stonehatchet",
    hash: 940833800,
    name: getWeaponData(940833800).Name,
    description: getWeaponData(940833800).Description,
    flags: ItemFlags.IsEquippable,
    group: WeaponGroup.MELEE,
    price: 25000,
    stats: {
      damage: 30,
      rate: 15,
      range: 0,
      overall: 15,
    },
  },
  poolcue: {
    key: "poolcue",
    hash: 2484171525,
    name: getWeaponData(2484171525).Name,
    description: getWeaponData(2484171525).Description,
    flags: ItemFlags.IsEquippable,
    group: WeaponGroup.MELEE,
    price: 6250,
    stats: {
      damage: 20,
      rate: 10,
      range: 0,
      overall: 10,
    },
  },
  pipewrench: {
    key: "pipewrench",
    hash: 419712736,
    name: getWeaponData(419712736).Name,
    description: getWeaponData(419712736).Description,
    flags: ItemFlags.IsEquippable,
    group: WeaponGroup.MELEE,
    price: 7150,
    stats: {
      damage: 10,
      rate: 15,
      range: 0,
      overall: 8.33,
    },
  },
  nightstick: {
    key: "nightstick",
    hash: 1737195953,
    name: getWeaponData(1737195953).Name,
    description: getWeaponData(1737195953).Description,
    flags: ItemFlags.IsEquippable,
    group: WeaponGroup.MELEE,
    price: 400,
    stats: {
      damage: 10,
      rate: 15,
      range: 1,
      overall: 8.67,
    },
  },
  knife: {
    key: "knife",
    hash: 2578778090,
    name: getWeaponData(2578778090).Name,
    description: getWeaponData(2578778090).Description,
    flags: ItemFlags.IsEquippable,
    group: WeaponGroup.MELEE,
    price: 400,
    stats: {
      damage: 76,
      rate: 20,
      range: 1,
      overall: 12,
    },
  },
  knuckle: {
    key: "knuckle",
    hash: 3638508604,
    name: getWeaponData(3638508604).Name,
    description: getWeaponData(3638508604).Description,
    flags: ItemFlags.IsEquippable,
    group: WeaponGroup.MELEE,
    price: 7500,
    stats: {
      damage: 10,
      rate: 20,
      range: 1,
      overall: 1,
    },
  },
  machete: {
    key: "machete",
    hash: 3713923289,
    name: getWeaponData(3713923289).Name,
    description: getWeaponData(3713923289).Description,
    flags: ItemFlags.IsEquippable,
    group: WeaponGroup.MELEE,
    price: 8900,
    stats: {
      damage: 76,
      rate: 15,
      range: 0,
      overall: 10,
    },
  },
  hammer: {
    key: "hammer",
    hash: 1317494643,
    name: getWeaponData(1317494643).Name,
    description: getWeaponData(1317494643).Description,
    flags: ItemFlags.IsEquippable,
    group: WeaponGroup.MELEE,
    price: 500,
    stats: {
      damage: 10,
      rate: 15,
      range: 1,
      overall: 8.67,
    },
  },
  hatchet: {
    key: "hatchet",
    hash: 4191993645,
    name: getWeaponData(4191993645).Name,
    description: getWeaponData(4191993645).Description,
    flags: ItemFlags.IsEquippable,
    group: WeaponGroup.MELEE,
    price: 750,
    stats: {
      damage: 76,
      rate: 15,
      range: 0,
      overall: 10,
    },
  },
  flashlight: {
    key: "flashlight",
    hash: 2343591895,
    name: getWeaponData(2343591895).Name,
    description: getWeaponData(2343591895).Description,
    flags: ItemFlags.IsEquippable,
    group: WeaponGroup.MELEE,
    price: 250,
    stats: {
      damage: 10,
      rate: 15,
      range: 0,
      overall: 8.33,
    },
  },
  golfclub: {
    key: "golfclub",
    hash: 1141786504,
    name: getWeaponData(1141786504).Name,
    description: getWeaponData(1141786504).Description,
    flags: ItemFlags.IsEquippable,
    group: WeaponGroup.MELEE,
    price: 125,
    stats: {
      damage: 20,
      rate: 10,
      range: 1,
      overall: 10.33,
    },
  },
  crowbar: {
    key: "crowbar",
    hash: 2227010557,
    name: getWeaponData(2227010557).Name,
    description: getWeaponData(2227010557).Description,
    flags: ItemFlags.IsEquippable,
    group: WeaponGroup.MELEE,
    price: 55,
    stats: {
      damage: 10,
      rate: 15,
      range: 1,
      overall: 8.67,
    },
  },
  dagger: {
    key: "dagger",
    hash: 2460120199,
    name: getWeaponData(2460120199).Name,
    description: getWeaponData(2460120199).Description,
    flags: ItemFlags.IsEquippable,
    group: WeaponGroup.MELEE,
    price: 2000,
    stats: {
      damage: 20,
      rate: 20,
      range: 2,
      overall: 14,
    },
  },
  bat: {
    key: "bat",
    hash: 2508868239,
    name: getWeaponData(2508868239).Name,
    description: getWeaponData(2508868239).Description,
    flags: ItemFlags.IsEquippable,
    group: WeaponGroup.MELEE,
    price: 100,
    stats: {
      damage: 20,
      rate: 10,
      range: 1,
      overall: 10.33,
    },
  },
  battleaxe: {
    key: "battleaxe",
    hash: 3441901897,
    name: getWeaponData(3441901897).Name,
    description: getWeaponData(3441901897).Description,
    flags: ItemFlags.IsEquippable,
    group: WeaponGroup.MELEE,
    price: 300,
    stats: {
      damage: 76,
      rate: 15,
      range: 0,
      overall: 10,
    },
  },
  bottle: {
    key: "bottle",
    hash: 4192643659,
    name: getWeaponData(4192643659).Name,
    description: getWeaponData(4192643659).Description,
    flags: ItemFlags.IsEquippable,
    group: WeaponGroup.MELEE,
    price: 8,
    stats: {
      damage: 20,
      rate: 15,
      range: 1,
      overall: 12,
    },
  },
} as Record<MeleeWeaponItemKey, MeleeWeaponItemInfo>;

/**
 * Register all melee weapons.
 */
for (const [key, info] of Object.entries(meleeWeapons)) {
  registerItem(key as MeleeWeaponItemKey, info);
}

/**
 * Type guards for melee weapons
 */
export function isItemKeyMeleeWeapon(key: string): key is MeleeWeaponItemKey {
  return key in meleeWeapons;
}

export function isItemMeleeWeapon(item: Item): item is MeleeWeaponItem {
  return isItemKeyMeleeWeapon(item.key);
}
