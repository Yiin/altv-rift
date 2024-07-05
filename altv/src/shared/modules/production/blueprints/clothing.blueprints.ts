import { makeKeys } from "@shared/utility/make-keys";
import { getItemName } from "@shared/modules/items/lib";
import { Metal } from "@shared/modules/items/registry/materials/metal.items";
import { Scrap } from "@shared/modules/items/registry/materials/scrap.items";
import { ArmorItem } from "@shared/modules/items/registry/clothing/armor/armor.items";
import { Armor } from "@shared/modules/items/registry/clothing/armor/armor.keys";
import { ItemGrade } from "@shared/modules/items/enums";
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
        { key: Scrap.SCRAP, grade: ItemGrade.COMMON, amount: 10 },
        { key: Metal.METAL, grade: ItemGrade.COMMON, amount: 30 },
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
        { key: Scrap.SCRAP, grade: ItemGrade.COMMON, amount: 10 },
        { key: Metal.METAL, grade: ItemGrade.COMMON, amount: 30 },
      ],
    },
  ],
});
