import { AmmoGroup } from "../weapons/weapon-groups";
import { Item, ItemKey } from "../../types";
import { registerItems } from "../../items-registry";
import { makeKeys } from "../../../../utility/make-keys";
import { ItemTier } from "../../enums";

export const Ammo = makeKeys<AmmoItemKey>()({
  HANDGUN_AMMO: "handgunammo",
  SHOTGUN_AMMO: "shotgunshells",
  SNIPER_RIFLE_AMMO: "riflerounds",
  ASSAULT_RIFLE_AMMO: "assaultrifleammo",
  MACHINE_GUN_AMMO: "machinegunammo",
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
  tier: ItemTier;
  damagemultiplier: number;
};

export const ammo = registerItems<AmmoItemInfo>([
  {
    key: Ammo.HANDGUN_AMMO,
    name: "Handgun ammo",
    description: "Ammo for handguns",
    group: AmmoGroup.HANDGUN,
    tier: ItemTier.E,
    damagemultiplier: 1,
  },
  {
    key: Ammo.SHOTGUN_AMMO,
    name: "Shotgun shells",
    description: "Ammo for shotguns",
    group: AmmoGroup.SHOTGUN,
    tier: ItemTier.E,
    damagemultiplier: 1,
  },
  {
    key: Ammo.SNIPER_RIFLE_AMMO,
    name: "Sniper rifle rounds",
    description: "Ammo for sniper rifles",
    group: AmmoGroup.SNIPER_RIFLE,
    tier: ItemTier.C,
    damagemultiplier: 1,
  },
  {
    key: Ammo.ASSAULT_RIFLE_AMMO,
    name: "Assault rifle ammo",
    description: "Ammo for assault rifles",
    group: AmmoGroup.ASSAULT_RIFLE,
    tier: ItemTier.D,
    damagemultiplier: 1,
  },
  {
    key: Ammo.MACHINE_GUN_AMMO,
    name: "Machine gun ammo",
    description: "Ammo for machine guns",
    group: AmmoGroup.MACHINE_GUN,
    tier: ItemTier.C,
    damagemultiplier: 1,
  },
  {
    key: Ammo.EXPLOSIVE_SHOTGUN_AMMO,
    group: AmmoGroup.SHOTGUN,
    tier: ItemTier.A,
    description: "Unleash a fiery blast with every shot using these explosive shotgun shells",
    name: "Explosive shells",
    damagemultiplier: 2,
  },
  {
    key: Ammo.EXPLOSIVE_ASSAULT_RIFLE_AMMO,
    group: AmmoGroup.ASSAULT_RIFLE,
    tier: ItemTier.A,
    description:
      "Take down enemies with explosive force using these specially designed assault rifle rounds.",
    name: "Explosive assault rifle ammo",
    damagemultiplier: 2,
  },
  {
    key: Ammo.ROCKETS,
    group: AmmoGroup.ROCKET_LAUNCHER,
    tier: ItemTier.A,
    description: "Ammo for rocket launchers",
    name: "Rockets",
    damagemultiplier: 10,
  },
  {
    key: Ammo.FIREWORKS,
    group: AmmoGroup.FIREWORK,
    tier: ItemTier.F,
    description: "Ammo for firework launcher",
    name: "Firework",
    damagemultiplier: 0,
  },
  {
    key: Ammo.GRENADES,
    group: AmmoGroup.GRENADE_LAUNCHER,
    tier: ItemTier.A,
    description: "Grenades for grenade launcher",
    name: "Grenades",
    damagemultiplier: 0,
  },
  {
    key: Ammo.PLASMA_RAYS,
    group: AmmoGroup.PLASMA_RAYS,
    tier: ItemTier.S,
    description: "Ammo for rayguns",
    name: "Plasma rays",
    damagemultiplier: 3,
  },
  {
    key: Ammo.FIRE_EXTINGUISHER_POWDER,
    group: AmmoGroup.FIRE_EXTINGUISHER,
    tier: ItemTier.F,
    description: "Powder for fire extinguisher",
    name: "Fire extinguisher powder",
    damagemultiplier: 0,
  },
  {
    key: Ammo.SMOKE_GRENADES,
    group: AmmoGroup.SMOKE_GRANADES,
    tier: ItemTier.F,
    description: "Smoke grenades for smoke grenade launcher",
    name: "Smoke grenades",
    damagemultiplier: 0,
  },
]);

export function isItemKeyAmmo(key: string): key is AmmoItemKey {
  return ammo.has(key as AmmoItemKey);
}

export function isItemAmmo(item: Item): item is AmmoItem {
  return isItemKeyAmmo(item.key);
}

export function getAmmoKeyForAmmoGroup(ammoGroup: AmmoGroup): AmmoItemKey {
  for (const ammoItemInfo of ammo.values()) {
    if (ammoItemInfo.group === ammoGroup) {
      return ammoItemInfo.key;
    }
  }
  throw new Error(`No ammo found for group ${ammoGroup}`);
}

export function getAmmoGroup(ammoKey: AmmoItemKey): AmmoGroup {
  return ammo.get(ammoKey)!.group;
}

export function getAmmoDamageMultiplier(ammoKey: AmmoItemKey): number {
  return ammo.get(ammoKey)!.damagemultiplier;
}
