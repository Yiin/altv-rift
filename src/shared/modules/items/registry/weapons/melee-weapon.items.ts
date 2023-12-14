import { registerItem } from "@shared/modules/items";
import { ItemFlags } from "../../enums";
import { Item } from "../../types";
import { makeKeys } from "../../../../utility/make-keys";
import { WeaponGroup } from "./weapon-groups";
import { getWeaponData } from "./weapon.items";

export const MeleeWeapon = makeKeys<MeleeWeaponItemKey>()({
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
  group: typeof WeaponGroup.MELEE;
  price: number;
  stats: {
    damage: number;
    rate: number;
    range: number;
    overall: number;
  };
};

export const meleeWeapons: MeleeWeaponItemInfo[] = [
  {
    key: MeleeWeapon.SWITCHBLADE,
    hash: 3756226112,
    name: getWeaponData(3756226112).Name,
    description: getWeaponData(3756226112).Description,
    group: WeaponGroup.MELEE,
    price: 1950,
    stats: {
      damage: 76,
      rate: 20,
      range: 0,
      overall: 11.67,
    },
  },
  {
    key: MeleeWeapon.STONEHATCHET,
    hash: 940833800,
    name: getWeaponData(940833800).Name,
    description: getWeaponData(940833800).Description,
    group: WeaponGroup.MELEE,
    price: 25000,
    stats: {
      damage: 30,
      rate: 15,
      range: 0,
      overall: 15,
    },
  },
  {
    key: MeleeWeapon.POOLCUE,
    hash: 2484171525,
    name: getWeaponData(2484171525).Name,
    description: getWeaponData(2484171525).Description,
    group: WeaponGroup.MELEE,
    price: 6250,
    stats: {
      damage: 20,
      rate: 10,
      range: 0,
      overall: 10,
    },
  },
  {
    key: MeleeWeapon.PIPEWRENCH,
    hash: 419712736,
    name: getWeaponData(419712736).Name,
    description: getWeaponData(419712736).Description,
    group: WeaponGroup.MELEE,
    price: 7150,
    stats: {
      damage: 10,
      rate: 15,
      range: 0,
      overall: 8.33,
    },
  },
  {
    key: MeleeWeapon.NIGHTSTICK,
    hash: 1737195953,
    name: getWeaponData(1737195953).Name,
    description: getWeaponData(1737195953).Description,
    group: WeaponGroup.MELEE,
    price: 400,
    stats: {
      damage: 10,
      rate: 15,
      range: 1,
      overall: 8.67,
    },
  },
  {
    key: MeleeWeapon.KNIFE,
    hash: 2578778090,
    name: getWeaponData(2578778090).Name,
    description: getWeaponData(2578778090).Description,
    group: WeaponGroup.MELEE,
    price: 400,
    stats: {
      damage: 76,
      rate: 20,
      range: 1,
      overall: 12,
    },
  },
  {
    key: MeleeWeapon.KNUCKLE,
    hash: 3638508604,
    name: getWeaponData(3638508604).Name,
    description: getWeaponData(3638508604).Description,
    group: WeaponGroup.MELEE,
    price: 7500,
    stats: {
      damage: 10,
      rate: 20,
      range: 1,
      overall: 1,
    },
  },
  {
    key: MeleeWeapon.MACHETE,
    hash: 3713923289,
    name: getWeaponData(3713923289).Name,
    description: getWeaponData(3713923289).Description,
    group: WeaponGroup.MELEE,
    price: 8900,
    stats: {
      damage: 76,
      rate: 15,
      range: 0,
      overall: 10,
    },
  },
  {
    key: MeleeWeapon.HAMMER,
    hash: 1317494643,
    name: getWeaponData(1317494643).Name,
    description: getWeaponData(1317494643).Description,
    group: WeaponGroup.MELEE,
    price: 500,
    stats: {
      damage: 10,
      rate: 15,
      range: 1,
      overall: 8.67,
    },
  },
  {
    key: MeleeWeapon.HATCHET,
    hash: 4191993645,
    name: getWeaponData(4191993645).Name,
    description: getWeaponData(4191993645).Description,
    group: WeaponGroup.MELEE,
    price: 750,
    stats: {
      damage: 76,
      rate: 15,
      range: 0,
      overall: 10,
    },
  },
  {
    key: MeleeWeapon.FLASHLIGHT,
    hash: 2343591895,
    name: getWeaponData(2343591895).Name,
    description: getWeaponData(2343591895).Description,
    group: WeaponGroup.MELEE,
    price: 250,
    stats: {
      damage: 10,
      rate: 15,
      range: 0,
      overall: 8.33,
    },
  },
  {
    key: MeleeWeapon.GOLFCLUB,
    hash: 1141786504,
    name: getWeaponData(1141786504).Name,
    description: getWeaponData(1141786504).Description,
    group: WeaponGroup.MELEE,
    price: 125,
    stats: {
      damage: 20,
      rate: 10,
      range: 1,
      overall: 10.33,
    },
  },
  {
    key: MeleeWeapon.CROWBAR,
    hash: 2227010557,
    name: getWeaponData(2227010557).Name,
    description: getWeaponData(2227010557).Description,
    group: WeaponGroup.MELEE,
    price: 55,
    stats: {
      damage: 10,
      rate: 15,
      range: 1,
      overall: 8.67,
    },
  },
  {
    key: MeleeWeapon.DAGGER,
    hash: 2460120199,
    name: getWeaponData(2460120199).Name,
    description: getWeaponData(2460120199).Description,
    group: WeaponGroup.MELEE,
    price: 2000,
    stats: {
      damage: 20,
      rate: 20,
      range: 2,
      overall: 14,
    },
  },
  {
    key: MeleeWeapon.BAT,
    hash: 2508868239,
    name: getWeaponData(2508868239).Name,
    description: getWeaponData(2508868239).Description,
    group: WeaponGroup.MELEE,
    price: 100,
    stats: {
      damage: 20,
      rate: 10,
      range: 1,
      overall: 10.33,
    },
  },
  {
    key: MeleeWeapon.BATTLEAXE,
    hash: 3441901897,
    name: getWeaponData(3441901897).Name,
    description: getWeaponData(3441901897).Description,
    group: WeaponGroup.MELEE,
    price: 300,
    stats: {
      damage: 76,
      rate: 15,
      range: 0,
      overall: 10,
    },
  },
  {
    key: MeleeWeapon.BOTTLE,
    hash: 4192643659,
    name: getWeaponData(4192643659).Name,
    description: getWeaponData(4192643659).Description,
    group: WeaponGroup.MELEE,
    price: 8,
    stats: {
      damage: 20,
      rate: 15,
      range: 1,
      overall: 12,
    },
  },
];

/**
 * Register all melee weapons.
 */
for (const info of meleeWeapons) {
  registerItem(info);
}

/**
 * Type guards for melee weapons
 */
export function isItemKeyMeleeWeapon(key: string): key is MeleeWeaponItemKey {
  return meleeWeapons.some((meleeWeapon) => meleeWeapon.key === key);
}

export function isItemMeleeWeapon(item: Item): item is MeleeWeaponItem {
  return isItemKeyMeleeWeapon(item.key);
}
