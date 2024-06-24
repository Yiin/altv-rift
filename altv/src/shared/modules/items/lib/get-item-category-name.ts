import {
  isItemKeyAccessory,
  isItemKeyAmmo,
  isItemKeyArmor,
  isItemKeyBlueprint,
  isItemKeyConsumable,
  isItemKeyEarrings,
  isItemKeyFirearmWeapon,
  isItemKeyFishingBait,
  isItemKeyFoodIngredient,
  isItemKeyGlasses,
  isItemKeyGloves,
  isItemKeyHeadwear,
  isItemKeyLeftHand,
  isItemKeyMask,
  isItemKeyMaterial,
  isItemKeyMeleeWeapon,
  isItemKeyNote,
  isItemKeyOre,
  isItemKeyPants,
  isItemKeyRightHand,
  isItemKeyShoes,
  isItemKeyThrowableWeapon,
  isItemKeyTool,
  isItemKeyTop,
  isItemKeyTreeLog,
  isItemKeyWeaponComponent,
} from "../registry";
import { ItemKey } from "../types";

export function getItemCategoryName(key: ItemKey) {
  if (isItemKeyAccessory(key)) {
    return "Accessory";
  }
  if (isItemKeyAmmo(key)) {
    return "Ammo";
  }
  if (isItemKeyArmor(key)) {
    return "Armor";
  }
  if (isItemKeyBlueprint(key)) {
    return "Blueprint";
  }
  if (isItemKeyEarrings(key)) {
    return "Earrings";
  }
  if (isItemKeyFirearmWeapon(key)) {
    return "Firearm weapon";
  }
  if (isItemKeyFishingBait(key)) {
    return "Fish bait";
  }
  if (isItemKeyFoodIngredient(key)) {
    return "Food ingredient";
  }
  if (isItemKeyGlasses(key)) {
    return "Glasses";
  }
  if (isItemKeyHeadwear(key)) {
    return "Headwear";
  }
  if (isItemKeyGloves(key)) {
    return "Gloves";
  }
  if (isItemKeyLeftHand(key)) {
    return "Left hand accessorie";
  }
  if (isItemKeyRightHand(key)) {
    return "Right hand accessorie";
  }
  if (isItemKeyMask(key)) {
    return "Mask";
  }
  if (isItemKeyMeleeWeapon(key)) {
    return "Melee weapon";
  }
  if (isItemKeyNote(key)) {
    return "Note";
  }
  if (isItemKeyOre(key)) {
    return "Ore";
  }
  if (isItemKeyPants(key)) {
    return "Pants";
  }
  if (isItemKeyShoes(key)) {
    return "Shoes";
  }
  if (isItemKeyThrowableWeapon(key)) {
    return "Throwable weapon";
  }
  if (isItemKeyTop(key)) {
    return "Top";
  }
  if (isItemKeyTreeLog(key)) {
    return "Tree log";
  }
  if (isItemKeyWeaponComponent(key)) {
    return "Weapon component";
  }
  if (isItemKeyMaterial(key)) {
    return "Material";
  }
  if (isItemKeyConsumable(key)) {
    return "Consumable";
  }
  if (isItemKeyTool(key)) {
    return "Tool";
  }
  return "Unknown";
}
