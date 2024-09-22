import { Item } from "@shared/modules/items";
import {
  AmmoBlueprintKey,
  ClothingBlueprintKey,
  FirearmWeaponBlueprintKey,
  MeleeWeaponBlueprintKey,
  ThrowableWeaponBlueprintKey,
  ToolBlueprintKey,
  WeaponComponentBlueprintKey,
} from "./blueprints";

/**
 * Blueprints
 */
export type BlueprintRecipe = {
  key: string;
  isUpgrade?: true;
  durationSeconds: number;
  item: Item;
  parts: Item[];
  levelRequired?: number;
};

export type Blueprint = {
  key: string;
  name: string;
  description?: string;
  recipes: BlueprintRecipe[];
};

export type BlueprintKey =
  | AmmoBlueprintKey
  | ClothingBlueprintKey
  | FirearmWeaponBlueprintKey
  | MeleeWeaponBlueprintKey
  | ThrowableWeaponBlueprintKey
  | ToolBlueprintKey
  | WeaponComponentBlueprintKey;
