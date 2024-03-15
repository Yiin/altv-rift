import { makeKeys } from "@shared/utility/make-keys";
import { Metal, FirearmWeapon, ItemGrade } from "@shared/modules/items";
import { Scrap } from "@shared/modules/items/registry/materials/scrap.items";
import { registerBlueprint } from "../blueprints.registry";

export const PistolBlueprint = makeKeys<PistolBlueprintKey>()({
  PISTOL: "pistol",
  PISTOL_PLUS: "pistol_plus",
  PISTOL_PLUS_PLUS: "pistol_plus_plus",
  PISTOL_PLUS_PLUS_PLUS: "pistol_plus_plus_plus",
});

export type PistolBlueprintKey = Brand<string, "PistolBlueprintKey">;

registerBlueprint({
  key: PistolBlueprint.PISTOL,
  item: {
    key: FirearmWeapon.PISTOL,
    grade: ItemGrade.BASE,
  },
  parts: [
    {
      key: Metal.BASIC_METAL,
      amount: 5
    },
    {
      key: Scrap.BASIC_SCRAP,
      amount: 5
    }
  ]
});
