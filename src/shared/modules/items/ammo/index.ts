import { ItemType } from "@prisma/client";
import { AmmoItem, EquipedAmmo } from "@shared/interfaces";
import { AmmoGroup } from "../weapons/weapon-groups";
import { getItemData } from "../lib/get-item-data";
import { ItemKey } from "../types";

export const Ammo = {
  HANDGUN_AMMO: "handgunammo",
  SHOTGUN_AMMO: "shotgunshells",
  SNIPER_RIFLE_AMMO: "riflerounds",
  ASSAULT_RIFLE_AMMO: "assaultrifleammo",
  MACHINE_GUN_AMMO: "machinegunammo",
  HEAVY_AMMO: "heavyammo",
  EXPLOSIVE_SHOTGUN_AMMO: "explosiveshells",
  EXPLOSIVE_ASSAULT_RIFLE_AMMO: "explosiveassaultrifleammo",
  ROCKETS: "rockets",
  FIREWORKS: "fireworks",
  GRENADES: "grenades",
  PLASMA_RAYS: "plasmarays",
  FIRE_EXTINGUISHER_POWDER: "fireextinguisherpowder",
  SMOKE_GRENADES: "smokegrenades",
} as const;

export type AmmoItemKey = (typeof Ammo)[keyof typeof Ammo];

export type AmmoItemInfo = {
  key: AmmoItemKey;
  itemType: typeof ItemType.AMMO;
  name: string;
  description: string;
  group: AmmoGroup;
  damagemultiplier: number;
};

export const ammo: Record<AmmoItemKey, AmmoItemInfo> = {
  handgunammo: {
    key: "handgunammo",
    itemType: ItemType.AMMO,
    name: "Handgun ammo",
    description: "Ammo for handguns",
    group: AmmoGroup.HANDGUN,
    damagemultiplier: 1,
  },
  shotgunshells: {
    key: "shotgunshells",
    itemType: ItemType.AMMO,
    name: "Shotgun shells",
    description: "Ammo for shotguns",
    group: AmmoGroup.SHOTGUN,
    damagemultiplier: 1,
  },
  riflerounds: {
    key: "riflerounds",
    itemType: ItemType.AMMO,
    name: "Rifle rounds",
    description: "Ammo for sniper rifles",
    group: AmmoGroup.SNIPER_RIFLE,
    damagemultiplier: 1,
  },
  assaultrifleammo: {
    key: "assaultrifleammo",
    itemType: ItemType.AMMO,
    name: "Assault rifle ammo",
    description: "Ammo for assault rifles",
    group: AmmoGroup.ASSAULT_RIFLE,
    damagemultiplier: 1,
  },
  machinegunammo: {
    key: "machinegunammo",
    itemType: ItemType.AMMO,
    name: "Machine gun ammo",
    description: "Ammo for machine guns",
    group: AmmoGroup.MACHINE_GUN,
    damagemultiplier: 1,
  },
  heavyammo: {
    key: "heavyammo",
    itemType: ItemType.AMMO,
    name: "Heavy ammo",
    description: "Ammo for heavy weapons",
    group: AmmoGroup.HEAVY,
    damagemultiplier: 1,
  },
  explosiveshells: {
    key: "explosiveshells",
    group: AmmoGroup.SHOTGUN,
    itemType: ItemType.AMMO,
    description: "Unleash a fiery blast with every shot using these explosive shotgun shells",
    name: "Explosive shells",
    damagemultiplier: 2,
  },
  explosiveassaultrifleammo: {
    key: "explosiveassaultrifleammo",
    group: AmmoGroup.ASSAULT_RIFLE,
    itemType: ItemType.AMMO,
    description:
      "Take down enemies with explosive force using these specially designed assault rifle rounds.",
    name: "Explosive assault rifle ammo",
    damagemultiplier: 2,
  },
  rockets: {
    key: "rockets",
    group: AmmoGroup.ROCKET_LAUNCHER,
    itemType: ItemType.AMMO,
    description: "Ammo for rocket launchers",
    name: "Rockets",
    damagemultiplier: 10,
  },
  fireworks: {
    key: "fireworks",
    group: AmmoGroup.FIREWORK,
    itemType: ItemType.AMMO,
    description: "Ammo for firework launcher",
    name: "Firework",
    damagemultiplier: 0,
  },
  grenades: {
    key: "grenades",
    group: AmmoGroup.GRENADE_LAUNCHER,
    itemType: ItemType.AMMO,
    description: "Grenades for grenade launcher",
    name: "Grenades",
    damagemultiplier: 0,
  },
  plasmarays: {
    key: "plasmarays",
    group: AmmoGroup.PLASMA_RAYS,
    itemType: ItemType.AMMO,
    description: "Ammo for rayguns",
    name: "Plasma rays",
    damagemultiplier: 3,
  },
  fireextinguisherpowder: {
    key: "fireextinguisherpowder",
    group: AmmoGroup.FIRE_EXTINGUISHER,
    itemType: ItemType.AMMO,
    description: "Powder for fire extinguisher",
    name: "Fire extinguisher powder",
    damagemultiplier: 0,
  },
  smokegrenades: {
    key: "smokegrenades",
    group: AmmoGroup.SMOKE_GRANADES,
    itemType: ItemType.AMMO,
    description: "Smoke grenades for smoke grenade launcher",
    name: "Smoke grenades",
    damagemultiplier: 0,
  },
};

export function isItemAmmo(key: ItemKey): key is AmmoItemKey {
  return key in ammo;
}

export function getAmmoKeyForAmmoGroup(group: AmmoGroup) {
  return (Object.keys(ammo) as AmmoItemKey[]).find((key) => ammo[key].group === group)!;
}

export function toEquipedAmmo(ammo: AmmoItem): EquipedAmmo {
  return {
    key: ammo.key,
    data: {
      amount: getItemData(ammo).amount,
    },
  };
}
