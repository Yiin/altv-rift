import { Item } from "@shared/modules/items";
import { ToolBlueprintKey } from "./blueprints/tool.blueprints";
import {
  AmmoBlueprintKey,
  ClothingBlueprintKey,
  FirearmWeaponBlueprintKey,
  MeleeWeaponBlueprintKey,
  ThrowableWeaponBlueprintKey,
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
  | ToolBlueprintKey
  | FirearmWeaponBlueprintKey
  | ThrowableWeaponBlueprintKey
  | MeleeWeaponBlueprintKey
  | ClothingBlueprintKey
  | WeaponComponentBlueprintKey;
