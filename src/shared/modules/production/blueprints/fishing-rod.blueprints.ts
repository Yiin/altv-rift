import { makeKeys } from "@shared/utility/make-keys";
import { FishingRod } from "@shared/modules/items";
import { Wood } from "@shared/modules/items/registry/materials/wood.items";
import { Metal } from "@shared/modules/items/registry/materials/metal.items";
import { registerBlueprint } from "../blueprints.registry";

export const FishingRodBlueprint = makeKeys<FishingRodBlueprintKey>()({
  BASIC_FISHING_ROD: "basic_fishing_rod",
  ADVANCED_FISHING_ROD: "advanced_fishing_rod",
  EXPERT_FISHING_ROD: "expert_fishing_rod",
  ELITE_FISHING_ROD: "elite_fishing_rod",
  EPIC_FISHING_ROD: "epic_fishing_rod",
});

export type FishingRodBlueprintKey = Brand<string, "FishingRodBlueprintKey">;

// Basic FishingRod
registerBlueprint({
  key: FishingRodBlueprint.BASIC_FISHING_ROD,
  item: {
    key: FishingRod.BASIC_FISHING_ROD,
    amount: 1,
  },
  parts: [
    {
      key: Wood.BASIC_WOOD,
      amount: 5,
    },
    {
      key: Metal.BASIC_METAL,
      amount: 5,
    },
  ],
});

// Advanced FishingRod
registerBlueprint({
  key: FishingRodBlueprint.ADVANCED_FISHING_ROD,
  item: {
    key: FishingRod.ADVANCED_FISHING_ROD,
    amount: 1,
  },
  parts: [
    {
      key: Wood.ADVANCED_WOOD,
      amount: 5,
    },
    {
      key: Metal.ADVANCED_METAL,
      amount: 5,
    },
  ],
});

// Expert FishingRod
registerBlueprint({
  key: FishingRodBlueprint.EXPERT_FISHING_ROD,
  item: {
    key: FishingRod.EXPERT_FISHING_ROD,
    amount: 1,
  },
  parts: [
    {
      key: Wood.EXPERT_WOOD,
      amount: 5,
    },
    {
      key: Metal.EXPERT_METAL,
      amount: 5,
    },
  ],
});

// Elite FishingRod
registerBlueprint({
  key: FishingRodBlueprint.ELITE_FISHING_ROD,
  item: {
    key: FishingRod.ELITE_FISHING_ROD,
    amount: 1,
  },
  parts: [
    {
      key: Wood.ELITE_WOOD,
      amount: 5,
    },
    {
      key: Metal.ELITE_METAL,
      amount: 5,
    },
  ],
});

// Epic FishingRod
registerBlueprint({
  key: FishingRodBlueprint.EPIC_FISHING_ROD,
  item: {
    key: FishingRod.EPIC_FISHING_ROD,
    amount: 1,
  },
  parts: [
    {
      key: Wood.EPIC_WOOD,
      amount: 5,
    },
    {
      key: Metal.EPIC_METAL,
      amount: 5,
    },
  ],
});
