import { makeKeys } from "@shared/utility/make-keys";
import { ItemGrade, Metal, Scrap, ThrowableWeapon, Wood } from "@shared/modules/items";
import { registerBlueprint } from "../blueprints.registry";

// We re-use weapon item key as it's blueprint key for easier management.
export const ThrowableWeaponBlueprint = makeKeys<ThrowableWeaponBlueprintKey>()(ThrowableWeapon);

export type ThrowableWeaponBlueprintKey = Brand<string, "ThrowableWeaponBlueprintKey">;

registerBlueprint({
  key: ThrowableWeapon.GRENADE,
  recipes: [
    {
      item: {
        key: ThrowableWeapon.GRENADE,
        grade: ItemGrade.BASE,
      },
      parts: [
        {
          key: Scrap.COMMON_SCRAP,
          amount: 10,
        },
        {
          key: Metal.COMMON_METAL,
          amount: 5,
        },
      ],
    },
  ],
});

registerBlueprint({
  key: ThrowableWeapon.STICKYBOMB,
  recipes: [
    {
      item: {
        key: ThrowableWeapon.STICKYBOMB,
        grade: ItemGrade.BASE,
      },
      parts: [
        {
          key: Metal.COMMON_METAL,
          amount: 3,
        },
        {
          key: Scrap.COMMON_SCRAP,
          amount: 2,
        },
        {
          key: Wood.COMMON_WOOD,
          amount: 1,
        },
      ],
    },
  ],
});

registerBlueprint({
  key: ThrowableWeapon.SMOKEGRENADE,
  recipes: [
    {
      item: {
        key: ThrowableWeapon.SMOKEGRENADE,
        grade: ItemGrade.BASE,
      },
      parts: [
        {
          key: Metal.COMMON_METAL,
          amount: 2,
        },
        {
          key: Scrap.COMMON_SCRAP,
          amount: 2,
        },
      ],
    },
  ],
});

registerBlueprint({
  key: ThrowableWeaponBlueprint.JERRYCAN,
  recipes: [
    {
      item: {
        key: ThrowableWeapon.JERRYCAN,
        grade: ItemGrade.BASE,
      },
      parts: [
        {
          key: Metal.COMMON_METAL,
          amount: 2,
        },
        {
          key: Scrap.COMMON_SCRAP,
          amount: 2,
        },
        {
          key: Wood.COMMON_WOOD,
          amount: 1,
        },
      ],
    },
  ],
});

registerBlueprint({
  key: ThrowableWeaponBlueprint.MOLOTOV,
  recipes: [
    {
      item: {
        key: ThrowableWeapon.MOLOTOV,
        grade: ItemGrade.BASE,
      },
      parts: [
        {
          key: Scrap.COMMON_SCRAP,
          amount: 3,
        },
        {
          key: Metal.COMMON_METAL,
          amount: 2,
        },
        {
          key: Wood.COMMON_WOOD,
          amount: 1,
        },
      ],
    },
  ],
});

registerBlueprint({
  key: ThrowableWeaponBlueprint.HAZARDCAN,
  recipes: [
    {
      item: {
        key: ThrowableWeapon.HAZARDCAN,
        grade: ItemGrade.BASE,
      },
      parts: [
        {
          key: Metal.COMMON_METAL,
          amount: 3,
        },
        {
          key: Scrap.COMMON_SCRAP,
          amount: 7,
        },
      ],
    },
  ],
});

registerBlueprint({
  key: ThrowableWeaponBlueprint.BZGAS,
  recipes: [
    {
      item: {
        key: ThrowableWeapon.BZGAS,
        grade: ItemGrade.BASE,
      },
      parts: [
        {
          key: Scrap.COMMON_SCRAP,
          amount: 3,
        },
        {
          key: Metal.COMMON_METAL,
          amount: 2,
        },
      ],
    },
  ],
});

registerBlueprint({
  key: ThrowableWeaponBlueprint.FLARE,
  recipes: [
    {
      item: {
        key: ThrowableWeapon.FLARE,
        grade: ItemGrade.BASE,
      },
      parts: [
        {
          key: Metal.COMMON_METAL,
          amount: 2,
        },
        {
          key: Scrap.COMMON_SCRAP,
          amount: 3,
        },
        {
          key: Wood.COMMON_WOOD,
          amount: 1,
        },
      ],
    },
  ],
});

registerBlueprint({
  key: ThrowableWeaponBlueprint.PROXMINE,
  recipes: [
    {
      item: {
        key: ThrowableWeapon.PROXMINE,
        grade: ItemGrade.BASE,
      },
      parts: [
        {
          key: Metal.COMMON_METAL,
          amount: 10,
        },
        {
          key: Scrap.COMMON_SCRAP,
          amount: 10,
        },
      ],
    },
  ],
});

registerBlueprint({
  key: ThrowableWeaponBlueprint.PIPEBOMB,
  recipes: [
    {
      item: {
        key: ThrowableWeapon.PIPEBOMB,
        grade: ItemGrade.BASE,
      },
      parts: [
        {
          key: Metal.COMMON_METAL,
          amount: 2,
        },
        {
          key: Scrap.COMMON_SCRAP,
          amount: 3,
        },
      ],
    },
  ],
});
