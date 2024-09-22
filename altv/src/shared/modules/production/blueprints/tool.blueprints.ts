import { makeKeys } from "@shared/utility/make-keys";
import { Tool, ToolItemKey, getItemName, ItemGrade, ToolItem, createItem, Wood, Metal } from "@shared/modules/items";
import { initializeBlueprints, registerBlueprint } from "../blueprints.registry";

export const ToolBlueprint = makeKeys<ToolBlueprintKey>()(Tool);

export type ToolBlueprintKey = Brand<string, "ToolBlueprintKey">;

initializeBlueprints(() => {
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
            createItem(Wood.COMMON_WOOD, { amount: 5 }),
            createItem(Metal.COMMON_METAL, { amount: 5 }),
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
            createItem(itemKey, { grade: ItemGrade.COMMON }) as ToolItem,
            createItem(Wood.UNCOMMON_WOOD, { amount: 5 }),
            createItem(Metal.UNCOMMON_METAL, { amount: 5 }),
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
            createItem(itemKey, { grade: ItemGrade.UNCOMMON }) as ToolItem,
            createItem(Wood.RARE_WOOD, { amount: 5 }),
            createItem(Metal.RARE_METAL, { amount: 5 }),
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
            createItem(itemKey, { grade: ItemGrade.RARE }) as ToolItem,
            createItem(Wood.EPIC_WOOD, { amount: 5 }),
            createItem(Metal.EPIC_METAL, { amount: 5 }),
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
            createItem(itemKey, { grade: ItemGrade.EPIC }) as ToolItem,
            createItem(Wood.LEGENDARY_WOOD, { amount: 5 }),
            createItem(Metal.LEGENDARY_METAL, { amount: 5 }),
          ],
          levelRequired: 40,
        },
      ],
    });
  });
});
