import { ItemType } from "../item-type";
import { WeaponGroup } from "../weapons";

export const ammo = {
  handgunammo: {
    key: "handgunammo",
    itemType: ItemType.AMMO,
    name: "Handgun ammo",
    description: "Ammo for handguns",
    group: WeaponGroup.HANDGUN,
    damagemultipler: 1,
  },
  shotgunshells: {
    key: "shotgunshells",
    itemType: ItemType.AMMO,
    name: "Shotgun shells",
    description: "Ammo for shotguns",
    group: WeaponGroup.SHOTGUN,
    damagemultipler: 1,
  },
  riflerounds: {
    key: "riflerounds",
    itemType: ItemType.AMMO,
    name: "Rifle rounds",
    description: "Ammo for sniper rifles",
    group: WeaponGroup.SNIPER_RIFLE,
    damagemultipler: 1,
  },
  assaultrifleammo: {
    key: "assaultrifleammo",
    itemType: ItemType.AMMO,
    name: "Assault rifle ammo",
    description: "Ammo for assault rifles",
    group: WeaponGroup.ASSAULT_RIFLE,
    damagemultipler: 1,
  },
  machinegunammo: {
    key: "machinegunammo",
    itemType: ItemType.AMMO,
    name: "Machine gun ammo",
    description: "Ammo for machine guns",
    group: WeaponGroup.MACHINE_GUN,
    damagemultipler: 1,
  },
  heavyammo: {
    key: "heavyammo",
    itemType: ItemType.AMMO,
    name: "Heavy ammo",
    description: "Ammo for heavy weapons",
    group: WeaponGroup.HEAVY,
    damagemultipler: 1,
  },
  explosiveshells: {
    key: "explosiveammo",
    group: WeaponGroup.SHOTGUN,
    itemType: ItemType.AMMO,
    description:
      "Unleash a fiery blast with every shot using these explosive shotgun shells",
    name: "Explosive shells",
    damagemultipler: 2,
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
} as const;

export type AmmoItemKey = keyof typeof ammo;
