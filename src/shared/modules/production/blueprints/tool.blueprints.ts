import { makeKeys } from "@shared/utility/make-keys";
import { Wood } from "@shared/modules/items/registry/materials/wood.items";
import { Metal } from "@shared/modules/items/registry/materials/metal.items";
import { FishingRod } from "@shared/modules/items/registry/tools/fishing-rod.items";
import { Hatchet } from "@shared/modules/items/registry/tools/hatchet.items";
import { Pickaxe } from "@shared/modules/items/registry/tools/pickaxe.items";
import { ToolItem, ToolItemKey } from "@shared/modules/items/registry/tools/tool.items";
import { getItemName } from "@shared/modules/items/lib";
import { ItemGrade } from "@shared/modules/items/enums";
import { registerBlueprint } from "../blueprints.registry";

export const ToolBlueprint = makeKeys<ToolBlueprintKey>()({
  ...FishingRod,
  ...Hatchet,
  ...Pickaxe,
});

export type ToolBlueprintKey = Brand<string, "ToolBlueprintKey">;

Object.values(ToolBlueprint).forEach((key) => {
  const itemKey = key as string as ToolItemKey;

  registerBlueprint({
    key,
    name: `${getItemName(itemKey)} blueprint`,
    description: `Lets you craft and upgrade ${getItemName(itemKey)}.`,
    recipes: [
      {
        durationSeconds: 3,
        item: {
          key: itemKey,
          grade: ItemGrade.BASE,
        } as ToolItem,
        parts: [
          { key: Wood.COMMON_WOOD, amount: 5 },
          { key: Metal.COMMON_METAL, amount: 5 },
        ],
      },
      {
        isUpgrade: true,
        durationSeconds: 5,
        item: {
          key: itemKey,
          grade: ItemGrade.ONE,
        } as ToolItem,
        parts: [
          { key: itemKey, grade: ItemGrade.BASE } as ToolItem,
          { key: Wood.UNCOMMON_WOOD, amount: 5 },
          { key: Metal.UNCOMMON_METAL, amount: 5 },
        ],
      },
      {
        isUpgrade: true,
        durationSeconds: 10,
        item: {
          key: itemKey,
          grade: ItemGrade.TWO,
        } as ToolItem,
        parts: [
          { key: itemKey, grade: ItemGrade.ONE } as ToolItem,
          { key: Wood.RARE_WOOD, amount: 5 },
          { key: Metal.RARE_METAL, amount: 5 },
        ],
      },
      {
        isUpgrade: true,
        durationSeconds: 15,
        item: {
          key: itemKey,
          grade: ItemGrade.THREE,
        } as ToolItem,
        parts: [
          { key: itemKey, grade: ItemGrade.TWO } as ToolItem,
          { key: Wood.EPIC_WOOD, amount: 5 },
          { key: Metal.EPIC_METAL, amount: 5 },
        ],
      },
      {
        isUpgrade: true,
        durationSeconds: 20,
        item: {
          key: itemKey,
          grade: ItemGrade.FOUR,
        } as ToolItem,
        parts: [
          { key: itemKey, grade: ItemGrade.THREE } as ToolItem,
          { key: Wood.LEGENDARY_WOOD, amount: 5 },
          { key: Metal.LEGENDARY_METAL, amount: 5 },
        ],
      },
    ],
  });
});
