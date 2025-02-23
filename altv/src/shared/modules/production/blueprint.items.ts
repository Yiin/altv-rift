import { registerItems } from "@shared/modules/items";
import { makeKeys } from "@shared/utility/make-keys";
import { Item } from "../items/types";
import {
  AmmoBlueprint,
  ClothingBlueprint,
  FirearmWeaponBlueprint,
  ThrowableWeaponBlueprint,
  MeleeWeaponBlueprint,
  ToolBlueprint,
  WeaponComponentBlueprint,
} from "./blueprints";
import { getBlueprints } from "./blueprints.registry";

export const UnlearnedBlueprint = makeKeys<UnlearnedBlueprintItemKey>()({
  ...blueprintKeysUnlearnedToBlueprintItemKeys(AmmoBlueprint),
  ...blueprintKeysUnlearnedToBlueprintItemKeys(ClothingBlueprint),
  ...blueprintKeysUnlearnedToBlueprintItemKeys(FirearmWeaponBlueprint),
  ...blueprintKeysUnlearnedToBlueprintItemKeys(ThrowableWeaponBlueprint),
  ...blueprintKeysUnlearnedToBlueprintItemKeys(MeleeWeaponBlueprint),
  ...blueprintKeysUnlearnedToBlueprintItemKeys(ToolBlueprint),
  ...blueprintKeysUnlearnedToBlueprintItemKeys(WeaponComponentBlueprint),
});

export type UnlearnedBlueprintItemKey = Brand<string, "UnlearnedBlueprintItemKey">;

export type UnlearnedBlueprintItem = {
  key: UnlearnedBlueprintItemKey;
};

export type UnlearnedBlueprintItemInfo = {
  key: UnlearnedBlueprintItemKey;
  name: string;
  description?: string;
};

export const unlearnedBlueprints = registerItems<UnlearnedBlueprintItemInfo>(
  getBlueprints().map(({ key, name, description }) => ({
    key: `blueprint_${key}` as UnlearnedBlueprintItemKey,
    name,
    description,
  })),
);

/***
 * Type guards for blueprints
 */
export function isItemKeyUnlearnedBlueprint(key: string): key is UnlearnedBlueprintItemKey {
  return unlearnedBlueprints.has(key as UnlearnedBlueprintItemKey);
}

export function isItemUnlearnedBlueprint(item: Item): item is UnlearnedBlueprintItem {
  return isItemKeyUnlearnedBlueprint(item.key);
}

/**
 * Utils
 */
function blueprintKeysUnlearnedToBlueprintItemKeys<T extends {}>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [`blueprint_${key}`, value]),
  ) as T;
}
