import { makeKeys } from "@shared/utility/make-keys";
import { Armor, getItemName, ItemGrade, ArmorItem, createItem, ItemComponents, Metal } from "@shared/modules/items";
import { initializeBlueprints, registerBlueprint } from "../blueprints.registry";

export const ClothingBlueprint = makeKeys<ClothingBlueprintKey>()({
  FemaleBlackUtilityVest: Armor.FemaleBlackUtilityVest,
  MaleBlackUtilityVest: Armor.MaleBlackUtilityVest,
});

export type ClothingBlueprintKey = Brand<string, "ClothingBlueprintKey">;

initializeBlueprints(() => {
  registerBlueprint({
    key: Armor.FemaleBlackUtilityVest,
    name: `${getItemName(Armor.FemaleBlackUtilityVest)} (F) Blueprint`,
    recipes: [
      {
        key: Armor.FemaleBlackUtilityVest,
        durationSeconds: 5,
        item: {
          key: Armor.FemaleBlackUtilityVest,
          grade: ItemGrade.COMMON,
          amount: 5,
        } as ArmorItem,
        parts: [
          createItem(ItemComponents.COMMON_ITEM_COMPONENTS, { amount: 10 }),
          createItem(Metal.COMMON_METAL, { amount: 30 }),
        ],
      },
    ],
  });

  registerBlueprint({
    key: Armor.MaleBlackUtilityVest,
    name: `${getItemName(Armor.MaleBlackUtilityVest)} (M) Blueprint`,
    recipes: [
      {
        key: Armor.MaleBlackUtilityVest,
        durationSeconds: 5,
        item: {
          key: Armor.MaleBlackUtilityVest,
          grade: ItemGrade.COMMON,
          amount: 5,
        } as ArmorItem,
        parts: [
          createItem(ItemComponents.COMMON_ITEM_COMPONENTS, { amount: 10 }),
          createItem(Metal.COMMON_METAL, { amount: 30 }),
        ],
      },
    ],
  });
});