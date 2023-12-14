import { AmmoGroup } from "../weapons/weapon-groups";
import { Item, ItemKey } from "../../types";
import { EquipedAmmo } from "../weapons/firearm-weapon.items";
import { registerItem } from "../../items-registry";
import { makeKeys } from "../../../../utility/make-keys";
import { ItemFlags } from "../../enums";

export const Ammo = makeKeys<AmmoItemKey>()({
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
});

export type AmmoItemKey = Brand<string, "AmmoItemKey">;

export type AmmoItem = {
  key: AmmoItemKey;
  amount: number;
};

export type AmmoItemInfo = {
  key: AmmoItemKey;
  name: string;
  description: string;
  group: AmmoGroup;
  damagemultiplier: number;
};

export const ammo: AmmoItemInfo[] = [
  {
    key: Ammo.HANDGUN_AMMO,
    name: "Handgun ammo",
    description: "Ammo for handguns",
    group: AmmoGroup.HANDGUN,
    damagemultiplier: 1,
  },
  {
    key: Ammo.SHOTGUN_AMMO,
    name: "Shotgun shells",
    description: "Ammo for shotguns",
    group: AmmoGroup.SHOTGUN,
    damagemultiplier: 1,
  },
  {
    key: Ammo.SNIPER_RIFLE_AMMO,
    name: "Sniper rifle rounds",
    description: "Ammo for sniper rifles",
    group: AmmoGroup.SNIPER_RIFLE,
    damagemultiplier: 1,
  },
  {
    key: Ammo.ASSAULT_RIFLE_AMMO,
    name: "Assault rifle ammo",
    description: "Ammo for assault rifles",
    group: AmmoGroup.ASSAULT_RIFLE,
    damagemultiplier: 1,
  },
  {
    key: Ammo.MACHINE_GUN_AMMO,
    name: "Machine gun ammo",
    description: "Ammo for machine guns",
    group: AmmoGroup.MACHINE_GUN,
    damagemultiplier: 1,
  },
  {
    key: Ammo.HEAVY_AMMO,
    name: "Heavy ammo",
    description: "Ammo for heavy weapons",
    group: AmmoGroup.HEAVY,
    damagemultiplier: 1,
  },
  {
    key: Ammo.EXPLOSIVE_SHOTGUN_AMMO,
    group: AmmoGroup.SHOTGUN,
    description: "Unleash a fiery blast with every shot using these explosive shotgun shells",
    name: "Explosive shells",
    damagemultiplier: 2,
  },
  {
    key: Ammo.EXPLOSIVE_ASSAULT_RIFLE_AMMO,
    group: AmmoGroup.ASSAULT_RIFLE,
    description:
      "Take down enemies with explosive force using these specially designed assault rifle rounds.",
    name: "Explosive assault rifle ammo",
    damagemultiplier: 2,
  },
  {
    key: Ammo.ROCKETS,
    group: AmmoGroup.ROCKET_LAUNCHER,
    description: "Ammo for rocket launchers",
    name: "Rockets",
    damagemultiplier: 10,
  },
  {
    key: Ammo.FIREWORKS,
    group: AmmoGroup.FIREWORK,
    description: "Ammo for firework launcher",
    name: "Firework",
    damagemultiplier: 0,
  },
  {
    key: Ammo.GRENADES,
    group: AmmoGroup.GRENADE_LAUNCHER,
    description: "Grenades for grenade launcher",
    name: "Grenades",
    damagemultiplier: 0,
  },
  {
    key: Ammo.PLASMA_RAYS,
    group: AmmoGroup.PLASMA_RAYS,
    description: "Ammo for rayguns",
    name: "Plasma rays",
    damagemultiplier: 3,
  },
  {
    key: Ammo.FIRE_EXTINGUISHER_POWDER,
    group: AmmoGroup.FIRE_EXTINGUISHER,
    description: "Powder for fire extinguisher",
    name: "Fire extinguisher powder",
    damagemultiplier: 0,
  },
  {
    key: Ammo.SMOKE_GRENADES,
    group: AmmoGroup.SMOKE_GRANADES,
    description: "Smoke grenades for smoke grenade launcher",
    name: "Smoke grenades",
    damagemultiplier: 0,
  },
];

/**
 * Register all ammo items.
 */
for (const info of ammo) {
  registerItem(info);
}

export function isItemKeyAmmo(key: ItemKey): key is AmmoItemKey {
  return ammo.some((item) => item.key === key);
}

export function isItemAmmo(item: Item): item is AmmoItem {
  return isItemKeyAmmo(item.key);
}

export function getAmmoKeyForAmmoGroup(ammoGroup: AmmoGroup) {
  return ammo.find(({ group }) => group === ammoGroup)?.key!;
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
