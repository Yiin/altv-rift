import { registerItems } from "@shared/modules/items";
import {
  AmmoBlueprint,
  ClothingBlueprint,
  FirearmWeaponBlueprint,
  MeleeWeaponBlueprint,
  ThrowableWeaponBlueprint,
  ToolBlueprint,
  WeaponComponentBlueprint,
  getBlueprints,
} from "@shared/modules/production";
import { makeKeys } from "@shared/utility/make-keys";
import { Item } from "../types";

export const UnlearnedBlueprint = makeKeys<UnlearnedBlueprintItemKey>()({
  ...blueprintKeysToBlueprintItemKeys(AmmoBlueprint),
  ...blueprintKeysToBlueprintItemKeys(ClothingBlueprint),
  ...blueprintKeysToBlueprintItemKeys(FirearmWeaponBlueprint),
  ...blueprintKeysToBlueprintItemKeys(ThrowableWeaponBlueprint),
  ...blueprintKeysToBlueprintItemKeys(MeleeWeaponBlueprint),
  ...blueprintKeysToBlueprintItemKeys(ToolBlueprint),
  ...blueprintKeysToBlueprintItemKeys(WeaponComponentBlueprint),
});

export type UnlearnedBlueprintItemKey = Brand<string, "UnlearnedBlueprintItemKey">;

export type BlueprintItem = {
  key: UnlearnedBlueprintItemKey;
};

export type BlueprintItemInfo = {
  key: UnlearnedBlueprintItemKey;
  name: string;
  description?: string;
};

export const blueprints = registerItems<BlueprintItemInfo>(
  getBlueprints().map(({ key, name, description }) => ({
    key: `blueprint_${key}` as UnlearnedBlueprintItemKey,
    name,
    description,
  })),
);

/***
 * Type guards for blueprints
 */
export function isItemKeyBlueprint(key: string): key is UnlearnedBlueprintItemKey {
  return blueprints.has(key as UnlearnedBlueprintItemKey);
}

export function isItemBlueprint(item: Item): item is BlueprintItem {
  return isItemKeyBlueprint(item.key);
}

/**
 * Utils
 */
function blueprintKeysToBlueprintItemKeys<T extends {}>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [`blueprint_${key}`, value]),
  ) as T;
}
