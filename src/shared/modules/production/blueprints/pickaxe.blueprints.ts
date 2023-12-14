import { makeKeys } from "@shared/utility/make-keys";
import { Pickaxe } from "@shared/modules/items";
import { Wood } from "@shared/modules/items/registry/materials/wood.items";
import { Metal } from "@shared/modules/items/registry/materials/metal.items";
import { registerBlueprint } from "../blueprints.registry";

export const PickaxeBlueprint = makeKeys<PickaxeBlueprintKey>()({
  BASIC_PICKAXE: "basic_pickaxe",
  ADVANCED_PICKAXE: "advanced_pickaxe",
  EXPERT_PICKAXE: "expert_pickaxe",
  ELITE_PICKAXE: "elite_pickaxe",
  EPIC_PICKAXE: "epic_pickaxe",
});

export type PickaxeBlueprintKey = Brand<string, "PickaxeBlueprintKey">;

// Basic Pickaxe
registerBlueprint({
  key: PickaxeBlueprint.BASIC_PICKAXE,
  item: {
    key: Pickaxe.BASIC_PICKAXE,
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

// Advanced Pickaxe
registerBlueprint({
  key: PickaxeBlueprint.ADVANCED_PICKAXE,
  item: {
    key: Pickaxe.ADVANCED_PICKAXE,
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

// Expert Pickaxe
registerBlueprint({
  key: PickaxeBlueprint.EXPERT_PICKAXE,
  item: {
    key: Pickaxe.EXPERT_PICKAXE,
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

// Elite Pickaxe
registerBlueprint({
  key: PickaxeBlueprint.ELITE_PICKAXE,
  item: {
    key: Pickaxe.ELITE_PICKAXE,
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

// Epic Pickaxe
registerBlueprint({
  key: PickaxeBlueprint.EPIC_PICKAXE,
  item: {
    key: Pickaxe.EPIC_PICKAXE,
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
