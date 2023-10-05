import { Item, ItemGrade, ItemKey } from "@shared/modules/items";
import { HatchetBlueprintKey } from "./blueprints/hatchet.blueprints";
import { FishingRodBlueprintKey } from "./blueprints/fishing-rod.blueprints";

export type BlueprintPart = {
  key: ItemKey;
  amount: number;
  grade?: ItemGrade;
};

export type Blueprint = {
  key: string;
  item: Partial<Item>;
  parts: BlueprintPart[];
};

export type BlueprintKey = HatchetBlueprintKey | FishingRodBlueprintKey;
