import { makeKeys } from "@shared/utility/make-keys";
import { Hatchet, ItemGrade } from "@shared/modules/items";
import { Wood } from "@shared/modules/items/registry/materials/wood.items";
import { Metal } from "@shared/modules/items/registry/materials/metal.items";
import { registerBlueprint } from "../blueprints.registry";

export const HatchetBlueprint = makeKeys<HatchetBlueprintKey>()(Hatchet);

export type HatchetBlueprintKey = Brand<string, "HatchetBlueprintKey">;

registerBlueprint({
  key: HatchetBlueprint.HATCHET,
  recipes: [
    {
      item: {
        key: Hatchet.HATCHET,
        grade: ItemGrade.BASE,
      },
      parts: [
        {
          key: Wood.COMMON_WOOD,
          amount: 5,
        },
        {
          key: Metal.COMMON_METAL,
          amount: 5,
        },
      ],
    },
    {
      isUpgrade: true,
      item: {
        key: Hatchet.HATCHET,
        grade: ItemGrade.ONE,
      },
      parts: [
        {
          key: Wood.UNCOMMON_WOOD,
          amount: 5,
        },
        {
          key: Metal.UNCOMMON_METAL,
          amount: 5,
        },
      ],
    },
    {
      isUpgrade: true,
      item: {
        key: Hatchet.HATCHET,
        grade: ItemGrade.TWO,
      },
      parts: [
        {
          key: Wood.RARE_WOOD,
          amount: 5,
        },
        {
          key: Metal.RARE_METAL,
          amount: 5,
        },
      ],
    },
    {
      isUpgrade: true,
      item: {
        key: Hatchet.HATCHET,
        grade: ItemGrade.THREE,
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
    },
    {
      isUpgrade: true,
      item: {
        key: Hatchet.HATCHET,
        grade: ItemGrade.FOUR,
      },
      parts: [
        {
          key: Wood.LEGENDARY_WOOD,
          amount: 5,
        },
        {
          key: Metal.LEGENDARY_METAL,
          amount: 5,
        },
      ],
    },
  ],
});
