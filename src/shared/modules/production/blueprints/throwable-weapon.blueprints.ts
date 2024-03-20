import { makeKeys } from "@shared/utility/make-keys";
import {
  ThrowableWeapon,
  ThrowableWeaponItem,
} from "@shared/modules/items/registry/weapons/throwable-weapon.items";
import { getItemName } from "@shared/modules/items/lib";
import { ItemGrade } from "@shared/modules/items/enums";
import { Scrap } from "@shared/modules/items/registry/materials/scrap.items";
import { Metal } from "@shared/modules/items/registry/materials/metal.items";
import { Wood } from "@shared/modules/items/registry/materials/wood.items";
import { registerBlueprint } from "../blueprints.registry";

// We re-use weapon item key as it's blueprint key for easier management.
export const ThrowableWeaponBlueprint = makeKeys<ThrowableWeaponBlueprintKey>()(ThrowableWeapon);

export type ThrowableWeaponBlueprintKey = Brand<string, "ThrowableWeaponBlueprintKey">;

registerBlueprint({
  key: ThrowableWeaponBlueprint.GRENADE,
  name: `${getItemName(ThrowableWeapon.GRENADE)} blueprint`,
  recipes: [
    {
      durationSeconds: 3,
      item: {
        key: ThrowableWeapon.GRENADE,
        grade: ItemGrade.BASE,
        amount: 5,
      } as ThrowableWeaponItem,
      parts: [
        { key: Scrap.COMMON_SCRAP, amount: 10 },
        { key: Metal.COMMON_METAL, amount: 5 },
      ],
    },
  ],
});

registerBlueprint({
  key: ThrowableWeaponBlueprint.STICKYBOMB,
  name: `${getItemName(ThrowableWeapon.STICKYBOMB)} blueprint`,
  recipes: [
    {
      durationSeconds: 3,
      item: {
        key: ThrowableWeapon.STICKYBOMB,
        grade: ItemGrade.BASE,
        amount: 5,
      } as ThrowableWeaponItem,
      parts: [
        { key: Metal.COMMON_METAL, amount: 3 },
        { key: Scrap.COMMON_SCRAP, amount: 2 },
        { key: Wood.COMMON_WOOD, amount: 1 },
      ],
    },
  ],
});

registerBlueprint({
  key: ThrowableWeaponBlueprint.SMOKEGRENADE,
  name: `${getItemName(ThrowableWeapon.SMOKEGRENADE)} blueprint`,
  recipes: [
    {
      durationSeconds: 3,
      item: {
        key: ThrowableWeapon.SMOKEGRENADE,
        grade: ItemGrade.BASE,
        amount: 5,
      } as ThrowableWeaponItem,
      parts: [
        { key: Metal.COMMON_METAL, amount: 2 },
        { key: Scrap.COMMON_SCRAP, amount: 2 },
      ],
    },
  ],
});

registerBlueprint({
  key: ThrowableWeaponBlueprint.JERRYCAN,
  name: `${getItemName(ThrowableWeapon.JERRYCAN)} blueprint`,
  recipes: [
    {
      durationSeconds: 3,
      item: {
        key: ThrowableWeapon.JERRYCAN,
        grade: ItemGrade.BASE,
        amount: 5,
      } as ThrowableWeaponItem,
      parts: [
        { key: Metal.COMMON_METAL, amount: 2 },
        { key: Scrap.COMMON_SCRAP, amount: 2 },
        { key: Wood.COMMON_WOOD, amount: 1 },
      ],
    },
  ],
});

registerBlueprint({
  key: ThrowableWeaponBlueprint.MOLOTOV,
  name: `${getItemName(ThrowableWeapon.MOLOTOV)} blueprint`,
  recipes: [
    {
      durationSeconds: 3,
      item: {
        key: ThrowableWeapon.MOLOTOV,
        grade: ItemGrade.BASE,
        amount: 5,
      } as ThrowableWeaponItem,
      parts: [
        { key: Scrap.COMMON_SCRAP, amount: 3 },
        { key: Metal.COMMON_METAL, amount: 2 },
        { key: Wood.COMMON_WOOD, amount: 1 },
      ],
    },
  ],
});

registerBlueprint({
  key: ThrowableWeaponBlueprint.HAZARDCAN,
  name: `${getItemName(ThrowableWeapon.HAZARDCAN)} blueprint`,
  recipes: [
    {
      durationSeconds: 3,
      item: {
        key: ThrowableWeapon.HAZARDCAN,
        grade: ItemGrade.BASE,
        amount: 5,
      } as ThrowableWeaponItem,
      parts: [
        { key: Metal.COMMON_METAL, amount: 3 },
        { key: Scrap.COMMON_SCRAP, amount: 7 },
      ],
    },
  ],
});

registerBlueprint({
  key: ThrowableWeaponBlueprint.BZGAS,
  name: `${getItemName(ThrowableWeapon.BZGAS)} blueprint`,
  recipes: [
    {
      durationSeconds: 3,
      item: {
        key: ThrowableWeapon.BZGAS,
        grade: ItemGrade.BASE,
        amount: 5,
      } as ThrowableWeaponItem,
      parts: [
        { key: Scrap.COMMON_SCRAP, amount: 3 },
        { key: Metal.COMMON_METAL, amount: 2 },
      ],
    },
  ],
});

registerBlueprint({
  key: ThrowableWeaponBlueprint.FLARE,
  name: `${getItemName(ThrowableWeapon.FLARE)} blueprint`,
  recipes: [
    {
      durationSeconds: 3,
      item: {
        key: ThrowableWeapon.FLARE,
        grade: ItemGrade.BASE,
        amount: 5,
      } as ThrowableWeaponItem,
      parts: [
        { key: Metal.COMMON_METAL, amount: 2 },
        { key: Scrap.COMMON_SCRAP, amount: 3 },
        { key: Wood.COMMON_WOOD, amount: 1 },
      ],
    },
  ],
});

registerBlueprint({
  key: ThrowableWeaponBlueprint.PROXMINE,
  name: `${getItemName(ThrowableWeapon.PROXMINE)} blueprint`,
  recipes: [
    {
      durationSeconds: 3,
      item: {
        key: ThrowableWeapon.PROXMINE,
        grade: ItemGrade.BASE,
        amount: 5,
      } as ThrowableWeaponItem,
      parts: [
        { key: Metal.COMMON_METAL, amount: 10 },
        { key: Scrap.COMMON_SCRAP, amount: 10 },
      ],
    },
  ],
});

registerBlueprint({
  key: ThrowableWeaponBlueprint.PIPEBOMB,
  name: `${getItemName(ThrowableWeapon.PIPEBOMB)} blueprint`,
  recipes: [
    {
      durationSeconds: 3,
      item: {
        key: ThrowableWeapon.PIPEBOMB,
        grade: ItemGrade.BASE,
        amount: 5,
      } as ThrowableWeaponItem,
      parts: [
        { key: Metal.COMMON_METAL, amount: 2 },
        { key: Scrap.COMMON_SCRAP, amount: 3 },
      ],
    },
  ],
});
