export enum EquipmentSlot {
  Mask = "mask",
  Glasses = "glasses",
  Headwear = "headwear",
  Earrings = "earrings",
  Top = "top",
  Armor = "armor",
  Accessory = "accessory",
  Weapon = "weapon",
  Gloves = "gloves",
  LeftHand = "lefthand",
  Pants = "pants",
  RightHand = "righthand",
  Backpack = "backpack",
  Shoes = "shoes",
  Phone = "phone",
  Tool = "tool",
  QuickSlot1 = "quick1",
  QuickSlot2 = "quick2",
  QuickSlot3 = "quick3",
  QuickSlot4 = "quick4",

  // Ammo
  AssaultRifleAmmo = "assaultrifleammo",
  HandgunAmmo = "handgunammo",
  MachineGunAmmo = "machinegunammo",
  ShotgunAmmo = "shotgunammo",
  SniperRifleAmmo = "sniperrifleammo",
  RocketLauncherAmmo = "rocketlauncherammo",
  FireworkAmmo = "fireworkammo",
  GrenadeLauncherAmmo = "grenadelauncherammo",
  PlasmaRaysAmmo = "plasmaraysammo",
  FireExtinguisherAmmo = "fireextinguisherammo",
  SmokeGranadesAmmo = "smokegranadesammo",
}

export type AmmoEquipmentSlot =
  | EquipmentSlot.AssaultRifleAmmo
  | EquipmentSlot.HandgunAmmo
  | EquipmentSlot.MachineGunAmmo
  | EquipmentSlot.ShotgunAmmo
  | EquipmentSlot.SniperRifleAmmo
  | EquipmentSlot.RocketLauncherAmmo
  | EquipmentSlot.FireworkAmmo
  | EquipmentSlot.GrenadeLauncherAmmo
  | EquipmentSlot.PlasmaRaysAmmo
  | EquipmentSlot.FireExtinguisherAmmo
  | EquipmentSlot.SmokeGranadesAmmo;
