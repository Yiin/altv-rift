import { Item } from "@shared/modules/items";
import { ToolBlueprintKey } from "./blueprints/tool.blueprints";
import {
  FirearmWeaponBlueprintKey,
  MeleeWeaponBlueprintKey,
  ThrowableWeaponBlueprintKey,
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
};

export type Blueprint = {
  key: string;
  name: string;
  description?: string;
  recipes: BlueprintRecipe[];
};

export type BlueprintKey =
  | ToolBlueprintKey
  | FirearmWeaponBlueprintKey
  | ThrowableWeaponBlueprintKey
  | MeleeWeaponBlueprintKey;
