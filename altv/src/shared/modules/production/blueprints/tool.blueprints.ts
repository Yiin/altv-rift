import { makeKeys } from "@shared/utility/make-keys";
import { Wood } from "@shared/modules/items/registry/materials/wood.items";
import { Metal } from "@shared/modules/items/registry/materials/metal.items";
import { Tool } from "@shared/modules/items/registry/tool.items";
import { ToolItem, ToolItemKey } from "@shared/modules/items/registry/tool.items";
import { getItemName } from "@shared/modules/items/lib";
import { ItemGrade } from "@shared/modules/items/enums";
import { registerBlueprint } from "../blueprints.registry";

export const ToolBlueprint = makeKeys<ToolBlueprintKey>()({
  ...Tool,
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
        key: itemKey,
        durationSeconds: 3,
        item: {
          key: itemKey,
          grade: ItemGrade.COMMON,
        } as ToolItem,
        parts: [
          { key: Wood.WOOD, grade: ItemGrade.COMMON, amount: 5 },
          { key: Metal.METAL, grade: ItemGrade.COMMON, amount: 5 },
        ],
      },
      {
        key: itemKey + "+1",
        isUpgrade: true,
        durationSeconds: 5,
        item: {
          key: itemKey,
          grade: ItemGrade.UNCOMMON,
        } as ToolItem,
        parts: [
          { key: itemKey, grade: ItemGrade.COMMON } as ToolItem,
          { key: Wood.WOOD, grade: ItemGrade.UNCOMMON, amount: 5 },
          { key: Metal.METAL, grade: ItemGrade.UNCOMMON, amount: 5 },
        ],
        levelRequired: 10,
      },
      {
        key: itemKey + "+2",
        isUpgrade: true,
        durationSeconds: 10,
        item: {
          key: itemKey,
          grade: ItemGrade.RARE,
        } as ToolItem,
        parts: [
          { key: itemKey, grade: ItemGrade.UNCOMMON } as ToolItem,
          { key: Wood.WOOD, grade: ItemGrade.RARE, amount: 5 },
          { key: Metal.METAL, grade: ItemGrade.RARE, amount: 5 },
        ],
        levelRequired: 20,
      },
      {
        key: itemKey + "+3",
        isUpgrade: true,
        durationSeconds: 15,
        item: {
          key: itemKey,
          grade: ItemGrade.EPIC,
        } as ToolItem,
        parts: [
          { key: itemKey, grade: ItemGrade.RARE } as ToolItem,
          { key: Wood.WOOD, grade: ItemGrade.EPIC, amount: 5 },
          { key: Metal.METAL, grade: ItemGrade.EPIC, amount: 5 },
        ],
        levelRequired: 30,
      },
      {
        key: itemKey + "+4",
        isUpgrade: true,
        durationSeconds: 20,
        item: {
          key: itemKey,
          grade: ItemGrade.LEGENDARY,
        } as ToolItem,
        parts: [
          { key: itemKey, grade: ItemGrade.EPIC } as ToolItem,
          { key: Wood.WOOD, grade: ItemGrade.LEGENDARY, amount: 5 },
          { key: Metal.METAL, grade: ItemGrade.LEGENDARY, amount: 5 },
        ],
        levelRequired: 40,
      },
    ],
  });
});
