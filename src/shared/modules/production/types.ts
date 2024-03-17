import { Item } from "@shared/modules/items";
import { HatchetBlueprintKey } from "./blueprints/hatchet.blueprints";
import { FishingRodBlueprintKey } from "./blueprints/fishing-rod.blueprints";
import { PickaxeBlueprintKey } from "./blueprints/pickaxe.blueprints";

/**
 * Blueprints
 */
export type BlueprintRecipe = {
  item: Partial<Item>;
  parts: Partial<Item>[];
  isUpgrade?: true;
};

export type Blueprint = {
  key: string;
  recipes: BlueprintRecipe[];
};

export type BlueprintKey = HatchetBlueprintKey | FishingRodBlueprintKey | PickaxeBlueprintKey;
