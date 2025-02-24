import {
  ItemGrade,
  getWeaponComponentHashKey,
  getWeaponHashKey,
  isItemKeyAmmo,
  isItemKeyClothing,
  isItemKeyConsumable,
  isItemKeyFirearmWeapon,
  isItemKeyFishingBait,
  isItemKeyMaterial,
  isItemKeyPants,
  isItemKeyThrowableWeapon,
  isItemKeyTool,
  isItemKeyWeapon,
  isItemKeyWeaponComponent,
} from "@shared/modules/items";
import { asset } from "./asset";

export const getItemImage = (key: string) => {
  if (isItemKeyClothing(key)) {
    return asset(`assets/items/clothing/${key}.webp`);
  }
  if (isItemKeyWeapon(key)) {
    return asset(`assets/items/weapons/${getWeaponHashKey(key)}.webp`);
  }
  if (isItemKeyAmmo(key)) {
    return asset(`assets/items/ammo/${key}.webp`);
  }
  if (isItemKeyMaterial(key)) {
    if (
      ["common_", "uncommon_", "rare_", "epic_", "legendary_"].some((grade) =>
        key.startsWith(grade),
      )
    ) {
      // remove grade from key
      key = key.replace(/^.+_/, "");
    }
    return asset(`assets/items/materials/${key}.webp`);
  }
  if (isItemKeyTool(key)) {
    return asset(`assets/items/tools/${key}.webp`);
  }
  if (isItemKeyWeaponComponent(key)) {
    return asset(`assets/items/weapon-components/${getWeaponComponentHashKey(key)}.webp`);
  }
  if (isItemKeyConsumable(key)) {
    if (key.startsWith("cooked")) {
      key = key.replace(/^cooked/, "raw");
      return asset(`assets/items/materials/${key}.webp`);
    }
    return asset(`assets/items/consumables/${key}.webp`);
  }
  if (isItemKeyFishingBait(key)) {
    return asset(`assets/items/fish-bait/${key}.webp`);
  }
  return asset(`assets/items/${key}.webp`);
};

export function getItemGradeTextColor(grade: ItemGrade) {
  return {
    [ItemGrade.COMMON]: `text-common`,
    [ItemGrade.UNCOMMON]: `text-uncommon`,
    [ItemGrade.RARE]: `text-rare`,
    [ItemGrade.EPIC]: `text-epic`,
    [ItemGrade.LEGENDARY]: `text-legendary`,
    [ItemGrade.CONTRABAND]: `text-contraband`,
    [ItemGrade.LIMITED]: `text-limited`,
  }[grade];
}

export function getItemIconPosition(item: { key: string }) {
  if (isItemKeyPants(item.key)) {
    return "top center";
  }
  return "center";
}

export function getItemClasses(item: { key: string }) {
  if (isItemKeyClothing(item.key)) {
    return "brightness-125";
  }
  if (isItemKeyFirearmWeapon(item.key)) {
    return "brightness-150";
  }
  if (isItemKeyThrowableWeapon(item.key)) {
    return "scale-50";
  }
  return;
}

export function getRandomDescription(itemName: string) {
  const descriptions = [
    "Just what it says on the tin.",
    "Exactly as advertised.",
    "Mystery-free, guaranteed.",
    "No frills, just function.",
    "It is what it is.",
    "Uncomplicated and straightforward.",
    "Plain, simple, and effective.",
    "What you see is what you get.",
    "No backstory, just utility.",
    "As basic as it gets.",
    "Straight to the point.",
    "Description not needed.",
    "Function over form.",
    "Simplicity is its charm.",
    "No bells and whistles.",
    "Practicality at its finest.",
    "Elegantly minimalistic.",
    "All name, no fluff.",
  ];
  const hash = [...itemName].reduce(
    (hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0,
    0,
  );
  const index = Math.abs(hash % descriptions.length);
  return descriptions[index];
}
