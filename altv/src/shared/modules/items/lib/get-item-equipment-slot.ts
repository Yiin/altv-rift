import { AmmoEquipmentSlot, EquipmentSlot } from "@shared/interfaces";
import {
  isItemKeyAmmo,
  isItemKeyClothing,
  isItemKeyWeapon,
  isItemKeyAccessory,
  isItemKeyArmor,
  isItemKeyEarrings,
  isItemKeyGlasses,
  isItemKeyGloves,
  isItemKeyHeadwear,
  isItemKeyLeftHand,
  isItemKeyMask,
  isItemKeyPants,
  isItemKeyRightHand,
  isItemKeyShoes,
  isItemKeyTop,
  isItemKeyTool,
  getAmmoGroup,
  FirearmWeaponItemKey,
  getWeaponAmmoGroup,
} from "../registry";
import { Item, ItemKey } from "../types";
import { AmmoGroup } from "../registry/weapons/weapon-groups";

/**
 * Determines the equipment slot suitable for the given item,
 */
export function getItemKeyEquipmentSlot(key: ItemKey): EquipmentSlot | undefined {
  if (isItemKeyAmmo(key)) {
    switch (getAmmoGroup(key)) {
      case AmmoGroup.ASSAULT_RIFLE:
        return EquipmentSlot.AssaultRifleAmmo;
      case AmmoGroup.HANDGUN:
        return EquipmentSlot.HandgunAmmo;
      case AmmoGroup.MACHINE_GUN:
        return EquipmentSlot.MachineGunAmmo;
      case AmmoGroup.SHOTGUN:
        return EquipmentSlot.ShotgunAmmo;
      case AmmoGroup.SNIPER_RIFLE:
        return EquipmentSlot.SniperRifleAmmo;
      case AmmoGroup.ROCKET_LAUNCHER:
        return EquipmentSlot.RocketLauncherAmmo;
      case AmmoGroup.FIREWORK:
        return EquipmentSlot.FireworkAmmo;
      case AmmoGroup.GRENADE_LAUNCHER:
        return EquipmentSlot.GrenadeLauncherAmmo;
      case AmmoGroup.PLASMA_RAYS:
        return EquipmentSlot.PlasmaRaysAmmo;
      case AmmoGroup.FIRE_EXTINGUISHER:
        return EquipmentSlot.FireExtinguisherAmmo;
      case AmmoGroup.SMOKE_GRANADES:
        return EquipmentSlot.SmokeGranadesAmmo;
    }
  }
  if (isItemKeyWeapon(key)) {
    return EquipmentSlot.Weapon;
  }
  if (isItemKeyClothing(key)) {
    if (isItemKeyAccessory(key)) {
      return EquipmentSlot.Accessory;
    }
    if (isItemKeyArmor(key)) {
      return EquipmentSlot.Armor;
    }
    if (isItemKeyEarrings(key)) {
      return EquipmentSlot.Earrings;
    }
    if (isItemKeyGlasses(key)) {
      return EquipmentSlot.Glasses;
    }
    if (isItemKeyGloves(key)) {
      return EquipmentSlot.Gloves;
    }
    if (isItemKeyHeadwear(key)) {
      return EquipmentSlot.Headwear;
    }
    if (isItemKeyLeftHand(key)) {
      return EquipmentSlot.LeftHand;
    }
    if (isItemKeyMask(key)) {
      return EquipmentSlot.Mask;
    }
    if (isItemKeyPants(key)) {
      return EquipmentSlot.Pants;
    }
    if (isItemKeyRightHand(key)) {
      return EquipmentSlot.RightHand;
    }
    if (isItemKeyShoes(key)) {
      return EquipmentSlot.Shoes;
    }
    if (isItemKeyTop(key)) {
      return EquipmentSlot.Top;
    }
  }
  if (isItemKeyTool(key)) {
    return EquipmentSlot.Weapon;
  }
  return;
}

export function getItemEquipmentSlot(item: Item): EquipmentSlot | undefined {
  return getItemKeyEquipmentSlot(item.key);
}

export function getWeaponAmmoEquipmentSlot(key: FirearmWeaponItemKey): AmmoEquipmentSlot {
  switch (getWeaponAmmoGroup(key)) {
    case AmmoGroup.ASSAULT_RIFLE:
      return EquipmentSlot.AssaultRifleAmmo;
    case AmmoGroup.HANDGUN:
      return EquipmentSlot.HandgunAmmo;
    case AmmoGroup.MACHINE_GUN:
      return EquipmentSlot.MachineGunAmmo;
    case AmmoGroup.SHOTGUN:
      return EquipmentSlot.ShotgunAmmo;
    case AmmoGroup.SNIPER_RIFLE:
      return EquipmentSlot.SniperRifleAmmo;
    case AmmoGroup.ROCKET_LAUNCHER:
      return EquipmentSlot.RocketLauncherAmmo;
    case AmmoGroup.FIREWORK:
      return EquipmentSlot.FireworkAmmo;
    case AmmoGroup.GRENADE_LAUNCHER:
      return EquipmentSlot.GrenadeLauncherAmmo;
    case AmmoGroup.PLASMA_RAYS:
      return EquipmentSlot.PlasmaRaysAmmo;
    case AmmoGroup.FIRE_EXTINGUISHER:
      return EquipmentSlot.FireExtinguisherAmmo;
    case AmmoGroup.SMOKE_GRANADES:
      return EquipmentSlot.SmokeGranadesAmmo;
  }
  throw new Error(`Unknown ammo group for weapon: ${key}`);
}
