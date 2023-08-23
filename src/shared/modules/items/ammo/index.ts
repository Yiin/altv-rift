import { ItemType } from "@prisma/client";
import { AmmoItem } from "@shared/interfaces";
import { WeaponGroup } from "../weapons";
import { getItemData } from "../registry";

export const Ammo = {
  HANDGUN_AMMO: "handgunammo",
  SHOTGUN_AMMO: "shotgunshells",
  SNIPER_RIFLE_AMMO: "riflerounds",
  ASSAULT_RIFLE_AMMO: "assaultrifleammo",
  MACHINE_GUN_AMMO: "machinegunammo",
  HEAVY_AMMO: "heavyammo",
  EXPLOSIVE_SHOTGUN_AMMO: "explosiveshells",
  EXPLOSIVE_ASSAULT_RIFLE_AMMO: "explosiveassaultrifleammo",
} as const;

export type AmmoItemKey = (typeof Ammo)[keyof typeof Ammo];

export type AmmoItemInfo = {
  key: AmmoItemKey;
  itemType: typeof ItemType.AMMO;
  name: string;
  description: string;
  group: WeaponGroup;
  damagemultiplier: number;
};

export const ammo: Record<AmmoItemKey, AmmoItemInfo> = {
  handgunammo: {
    key: "handgunammo",
    itemType: ItemType.AMMO,
    name: "Handgun ammo",
    description: "Ammo for handguns",
    group: WeaponGroup.HANDGUN,
    damagemultiplier: 1,
  },
  shotgunshells: {
    key: "shotgunshells",
    itemType: ItemType.AMMO,
    name: "Shotgun shells",
    description: "Ammo for shotguns",
    group: WeaponGroup.SHOTGUN,
    damagemultiplier: 1,
  },
  riflerounds: {
    key: "riflerounds",
    itemType: ItemType.AMMO,
    name: "Rifle rounds",
    description: "Ammo for sniper rifles",
    group: WeaponGroup.SNIPER_RIFLE,
    damagemultiplier: 1,
  },
  assaultrifleammo: {
    key: "assaultrifleammo",
    itemType: ItemType.AMMO,
    name: "Assault rifle ammo",
    description: "Ammo for assault rifles",
    group: WeaponGroup.ASSAULT_RIFLE,
    damagemultiplier: 1,
  },
  machinegunammo: {
    key: "machinegunammo",
    itemType: ItemType.AMMO,
    name: "Machine gun ammo",
    description: "Ammo for machine guns",
    group: WeaponGroup.MACHINE_GUN,
    damagemultiplier: 1,
  },
  heavyammo: {
    key: "heavyammo",
    itemType: ItemType.AMMO,
    name: "Heavy ammo",
    description: "Ammo for heavy weapons",
    group: WeaponGroup.HEAVY,
    damagemultiplier: 1,
  },
  explosiveshells: {
    key: "explosiveshells",
    group: WeaponGroup.SHOTGUN,
    itemType: ItemType.AMMO,
    description: "Unleash a fiery blast with every shot using these explosive shotgun shells",
    name: "Explosive shells",
    damagemultiplier: 2,
  },
  explosiveassaultrifleammo: {
    key: "explosiveassaultrifleammo",
    group: WeaponGroup.ASSAULT_RIFLE,
    itemType: ItemType.AMMO,
    description:
      "Take down enemies with explosive force using these specially designed assault rifle rounds.",
    name: "Explosive assault rifle ammo",
    damagemultiplier: 2,
  },
};

export function getAmmoKeyForWeaponGroup(group: WeaponGroup) {
  return (Object.keys(ammo) as AmmoItemKey[]).find((key) => ammo[key].group === group)!;
}

export function toEquipedAmmo(ammo?: AmmoItem) {
  return ammo
    ? {
        key: ammo.key,
        data: {
          amount: getItemData(ammo)!.amount,
        },
      }
    : null;
}
