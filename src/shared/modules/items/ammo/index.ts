import { Item } from "@shared/interfaces";
import { AmmoGroup } from "../weapons/weapon-groups";
import { ItemKey } from "../types";
import { EquipedAmmo } from "../weapons/firearms";

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

export interface AmmoItem extends Item {
  key: AmmoItemKey;
  amount: number;
}

export type AmmoItemInfo = {
  key: AmmoItemKey;
  name: string;
  description: string;
  group: AmmoGroup;
  damagemultiplier: number;
};

export const ammo: Record<AmmoItemKey, AmmoItemInfo> = {
  handgunammo: {
    key: "handgunammo",
    name: "Handgun ammo",
    description: "Ammo for handguns",
    group: AmmoGroup.HANDGUN,
    damagemultiplier: 1,
  },
  shotgunshells: {
    key: "shotgunshells",
    name: "Shotgun shells",
    description: "Ammo for shotguns",
    group: AmmoGroup.SHOTGUN,
    damagemultiplier: 1,
  },
  riflerounds: {
    key: "riflerounds",
    name: "Rifle rounds",
    description: "Ammo for sniper rifles",
    group: AmmoGroup.SNIPER_RIFLE,
    damagemultiplier: 1,
  },
  assaultrifleammo: {
    key: "assaultrifleammo",
    name: "Assault rifle ammo",
    description: "Ammo for assault rifles",
    group: AmmoGroup.ASSAULT_RIFLE,
    damagemultiplier: 1,
  },
  machinegunammo: {
    key: "machinegunammo",
    name: "Machine gun ammo",
    description: "Ammo for machine guns",
    group: AmmoGroup.MACHINE_GUN,
    damagemultiplier: 1,
  },
  heavyammo: {
    key: "heavyammo",
    name: "Heavy ammo",
    description: "Ammo for heavy weapons",
    group: AmmoGroup.HEAVY,
    damagemultiplier: 1,
  },
  explosiveshells: {
    key: "explosiveshells",
    group: AmmoGroup.SHOTGUN,
    description: "Unleash a fiery blast with every shot using these explosive shotgun shells",
    name: "Explosive shells",
    damagemultiplier: 2,
  },
  explosiveassaultrifleammo: {
    key: "explosiveassaultrifleammo",
    group: AmmoGroup.ASSAULT_RIFLE,
    description:
      "Take down enemies with explosive force using these specially designed assault rifle rounds.",
    name: "Explosive assault rifle ammo",
    damagemultiplier: 2,
  },
  rockets: {
    key: "rockets",
    group: AmmoGroup.ROCKET_LAUNCHER,
    description: "Ammo for rocket launchers",
    name: "Rockets",
    damagemultiplier: 10,
  },
  fireworks: {
    key: "fireworks",
    group: AmmoGroup.FIREWORK,
    description: "Ammo for firework launcher",
    name: "Firework",
    damagemultiplier: 0,
  },
  grenades: {
    key: "grenades",
    group: AmmoGroup.GRENADE_LAUNCHER,
    description: "Grenades for grenade launcher",
    name: "Grenades",
    damagemultiplier: 0,
  },
  plasmarays: {
    key: "plasmarays",
    group: AmmoGroup.PLASMA_RAYS,
    description: "Ammo for rayguns",
    name: "Plasma rays",
    damagemultiplier: 3,
  },
  fireextinguisherpowder: {
    key: "fireextinguisherpowder",
    group: AmmoGroup.FIRE_EXTINGUISHER,
    description: "Powder for fire extinguisher",
    name: "Fire extinguisher powder",
    damagemultiplier: 0,
  },
  smokegrenades: {
    key: "smokegrenades",
    group: AmmoGroup.SMOKE_GRANADES,
    description: "Smoke grenades for smoke grenade launcher",
    name: "Smoke grenades",
    damagemultiplier: 0,
  },
};

export function isItemKeyAmmo(key: ItemKey): key is AmmoItemKey {
  return key in ammo;
}

export function isItemAmmo(item: Item): item is AmmoItem {
  return isItemKeyAmmo(item.key);
}

export function getAmmoKeyForAmmoGroup(group: AmmoGroup) {
  return (Object.keys(ammo) as AmmoItemKey[]).find((key) => ammo[key].group === group)!;
}

export function toEquipedAmmo(
  ammo: AmmoItem,
  clipSize: number,
  currentEquipedAmmo?: EquipedAmmo
): EquipedAmmo {
  const total = ammo.amount + (currentEquipedAmmo?.clip ?? 0) + (currentEquipedAmmo?.rest ?? 0);

  const clip = Math.min(total, clipSize || Number.MAX_SAFE_INTEGER);
  const rest = total - clip;

  return {
    key: ammo.key,
    clip,
    rest,
  };
}
