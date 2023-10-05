import { makeKeys } from "@shared/utility/make-keys";
import { Hatchet, ItemGrade } from "@shared/modules/items";
import { Wood } from "@shared/modules/items/registry/materials/wood.items";
import { Metal } from "@shared/modules/items/registry/materials/metal.items";
import { registerBlueprint } from "../blueprints.registry";

export const HatchetBlueprint = makeKeys<HatchetBlueprintKey>()({
  BASIC_HATCHET: "basic_hatchet",
  ADVANCED_HATCHET: "advanced_hatchet",
  EXPERT_HATCHET: "expert_hatchet",
  ELITE_HATCHET: "elite_hatchet",
  EPIC_HATCHET: "epic_hatchet",
});

export type HatchetBlueprintKey = Brand<string, "HatchetBlueprintKey">;

// Basic Hatchet
registerBlueprint({
  key: HatchetBlueprint.BASIC_HATCHET,
  item: {
    key: Hatchet.BASIC_HATCHET,
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

// Advanced Hatchet
registerBlueprint({
  key: HatchetBlueprint.ADVANCED_HATCHET,
  item: {
    key: Hatchet.ADVANCED_HATCHET,
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

// Expert Hatchet
registerBlueprint({
  key: HatchetBlueprint.EXPERT_HATCHET,
  item: {
    key: Hatchet.EXPERT_HATCHET,
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

// Elite Hatchet
registerBlueprint({
  key: HatchetBlueprint.ELITE_HATCHET,
  item: {
    key: Hatchet.ELITE_HATCHET,
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

// Epic Hatchet
registerBlueprint({
  key: HatchetBlueprint.EPIC_HATCHET,
  item: {
    key: Hatchet.EPIC_HATCHET,
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
