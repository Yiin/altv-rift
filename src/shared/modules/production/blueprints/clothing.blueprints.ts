import { makeKeys } from "@shared/utility/make-keys";
import { getItemName } from "@shared/modules/items/lib";
import { Metal } from "@shared/modules/items/registry/materials/metal.items";
import { Scrap } from "@shared/modules/items/registry/materials/scrap.items";
import { Armor, ArmorItem } from "@shared/modules/items/registry/clothing/armor/armor.items";
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
      item: {
        key: Armor.FemaleBlackUtilityVest,
        grade: ItemGrade.BASE,
        amount: 5,
      } as ArmorItem,
      parts: [
        { key: Scrap.COMMON_SCRAP, amount: 10 },
        { key: Metal.COMMON_METAL, amount: 30 },
      ],
    },
  ],
});

registerBlueprint({
  key: Armor.MaleBlackUtilityVest,
  name: `${getItemName(Armor.MaleBlackUtilityVest)} (M) Blueprint`,
  recipes: [
    {
      item: {
        key: Armor.MaleBlackUtilityVest,
        grade: ItemGrade.BASE,
        amount: 5,
      } as ArmorItem,
      parts: [
        { key: Scrap.COMMON_SCRAP, amount: 10 },
        { key: Metal.COMMON_METAL, amount: 30 },
      ],
    },
  ],
});
