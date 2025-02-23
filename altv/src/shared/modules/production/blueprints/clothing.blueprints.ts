import { makeKeys } from "@shared/utility/make-keys";
import { Armor } from "@shared/modules/items/registry/clothing/armor/armor.keys";
import { ArmorItem } from "@shared/modules/items/registry/clothing/armor/armor.items";
import { getItemName } from "@shared/modules/items/lib/get-item-name";
import { ItemGrade } from "@shared/modules/items/enums";
import { createItem } from "@shared/modules/items/lib/create-item";
import { ItemComponents } from "@shared/modules/items/registry/materials/item-components.items";
import { Metal } from "@shared/modules/items/registry/materials/metal.items";
import { registerBlueprint } from "../blueprints.registry";

export const ClothingBlueprint = makeKeys<ClothingBlueprintKey>()({
  FemaleBlackUtilityVest: Armor.FemaleBlackUtilityVest,
  MaleBlackUtilityVest: Armor.MaleBlackUtilityVest,
});

export type ClothingBlueprintKey = Brand<string, "ClothingBlueprintKey">;

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