import { makeKeys } from "@shared/utility/make-keys";
import { FirearmWeapon, FirearmWeaponItemKey, getItemTier, getItemName, ItemGrade, FirearmWeaponItem, createItem, Metal, ItemComponents } from "@shared/modules/items";
import { initializeBlueprints, registerBlueprint } from "../blueprints.registry";

// We re-use weapon item key as it's blueprint key for easier management.
export const FirearmWeaponBlueprint = makeKeys<FirearmWeaponBlueprintKey>()(FirearmWeapon);

export type FirearmWeaponBlueprintKey = Brand<string, "FirearmWeaponBlueprintKey">;

initializeBlueprints(() => {
  Object.values(FirearmWeaponBlueprint).forEach((key) => {
    const itemKey = key as string as FirearmWeaponItemKey;

    const tier = getItemTier(itemKey);
    const multiplier =
      tier !== null
        ? 2
        : 1;

    registerBlueprint({
      key,
      name: `${getItemName(itemKey)} blueprint`,
      description: `Lets you craft and upgrade ${getItemName(itemKey)}.`,
      recipes: [
        // base
        {
          key: itemKey,
          durationSeconds: 2,
          item: {
            key: itemKey,
            grade: ItemGrade.COMMON,
          } as FirearmWeaponItem,
          parts: [
            createItem(Metal.COMMON_METAL, { amount: 5 * multiplier }),
            createItem(ItemComponents.COMMON_ITEM_COMPONENTS, { amount: 5 * multiplier }),
          ],
        },

        // +1
        {
          key: itemKey + "+1",
          isUpgrade: true,
          durationSeconds: 3,
          item: {
            key: itemKey,
            grade: ItemGrade.UNCOMMON,
          } as FirearmWeaponItem,
          parts: [
            createItem(itemKey, { grade: ItemGrade.COMMON }) as FirearmWeaponItem,
            createItem(Metal.UNCOMMON_METAL, { amount: 10 * multiplier }),
            createItem(ItemComponents.UNCOMMON_ITEM_COMPONENTS, { amount: 10 * multiplier }),
          ],
          levelRequired: 15,
        },

        // +2
        {
          key: itemKey + "+2",
          isUpgrade: true,
          durationSeconds: 4,
          item: {
            key: itemKey,
            grade: ItemGrade.RARE,
          } as FirearmWeaponItem,
          parts: [
            createItem(itemKey, { grade: ItemGrade.UNCOMMON }) as FirearmWeaponItem,
            createItem(Metal.RARE_METAL, { amount: 15 * multiplier }),
            createItem(ItemComponents.RARE_ITEM_COMPONENTS, { amount: 15 * multiplier }),
          ],
          levelRequired: 30,
        },

        // +3
        {
          key: itemKey + "+3",
          isUpgrade: true,
          durationSeconds: 5,
          item: {
            key: itemKey,
            grade: ItemGrade.EPIC,
          } as FirearmWeaponItem,
          parts: [
            createItem(itemKey, { grade: ItemGrade.RARE }) as FirearmWeaponItem,
            createItem(Metal.EPIC_METAL, { amount: 20 * multiplier }),
            createItem(ItemComponents.EPIC_ITEM_COMPONENTS, { amount: 20 * multiplier }),
          ],
          levelRequired: 45,
        },

        // +4
        {
          key: itemKey + "+4",
          isUpgrade: true,
          durationSeconds: 6,
          item: {
            key: itemKey,
            grade: ItemGrade.LEGENDARY,
          } as FirearmWeaponItem,
          parts: [
            createItem(itemKey, { grade: ItemGrade.EPIC }) as FirearmWeaponItem,
            createItem(Metal.LEGENDARY_METAL, { amount: 25 * multiplier }),
            createItem(ItemComponents.LEGENDARY_ITEM_COMPONENTS, { amount: 25 * multiplier }),
          ],
          levelRequired: 60,
        },
      ],
    });
  });
});