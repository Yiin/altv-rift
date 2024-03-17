import { makeKeys } from "@shared/utility/make-keys";
import { Metal, ItemGrade, MeleeWeapon, Wood } from "@shared/modules/items";
import { Scrap } from "@shared/modules/items/registry/materials/scrap.items";
import { registerBlueprint } from "../blueprints.registry";

// We re-use weapon item key as it's blueprint key for easier management.
export const MeleeWeaponBlueprint = makeKeys<MeleeWeaponBlueprintKey>()(MeleeWeapon);

export type MeleeWeaponBlueprintKey = Brand<string, "MeleeWeaponBlueprintKey">;

registerBlueprint({
  key: MeleeWeapon.BAT,
  recipes: [
    {
      item: {
        key: MeleeWeapon.BAT,
        grade: ItemGrade.BASE,
      },
      parts: [
        { key: Wood.COMMON_WOOD, amount: 10 },
        { key: Scrap.COMMON_SCRAP, amount: 2 },
      ],
    },
    {
      item: {
        key: MeleeWeapon.BAT,
        grade: ItemGrade.ONE,
      },
      parts: [
        { key: MeleeWeapon.BAT, grade: ItemGrade.BASE },
        { key: Wood.UNCOMMON_WOOD, amount: 10 },
        { key: Scrap.UNCOMMON_SCRAP, amount: 2 },
      ],
    },
    {
      item: {
        key: MeleeWeapon.BAT,
        grade: ItemGrade.TWO,
      },
      parts: [
        { key: MeleeWeapon.BAT, grade: ItemGrade.ONE },
        { key: Wood.RARE_WOOD, amount: 10 },
        { key: Scrap.RARE_SCRAP, amount: 2 },
      ],
    },
    {
      item: {
        key: MeleeWeapon.BAT,
        grade: ItemGrade.THREE,
      },
      parts: [
        { key: MeleeWeapon.BAT, grade: ItemGrade.TWO },
        { key: Wood.EPIC_WOOD, amount: 10 },
        { key: Scrap.EPIC_SCRAP, amount: 2 },
      ],
    },
    {
      item: {
        key: MeleeWeapon.BAT,
        grade: ItemGrade.FOUR,
      },
      parts: [
        { key: MeleeWeapon.BAT, grade: ItemGrade.THREE },
        { key: Wood.LEGENDARY_WOOD, amount: 10 },
        { key: Scrap.LEGENDARY_SCRAP, amount: 2 },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeaponBlueprint.BATTLEAXE,
  recipes: [
    {
      item: {
        key: MeleeWeapon.BATTLEAXE,
        grade: ItemGrade.BASE,
      },
      parts: [
        {
          key: Metal.COMMON_METAL,
          amount: 10,
        },
        {
          key: Wood.COMMON_WOOD,
          amount: 5,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.BATTLEAXE,
        grade: ItemGrade.ONE,
      },
      parts: [
        {
          key: MeleeWeapon.BATTLEAXE,
          grade: ItemGrade.BASE,
        },
        {
          key: Metal.UNCOMMON_METAL,
          amount: 10,
        },
        {
          key: Wood.UNCOMMON_WOOD,
          amount: 5,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.BATTLEAXE,
        grade: ItemGrade.TWO,
      },
      parts: [
        {
          key: MeleeWeapon.BATTLEAXE,
          grade: ItemGrade.ONE,
        },
        {
          key: Metal.RARE_METAL,
          amount: 10,
        },
        {
          key: Wood.RARE_WOOD,
          amount: 5,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.BATTLEAXE,
        grade: ItemGrade.THREE,
      },
      parts: [
        {
          key: MeleeWeapon.BATTLEAXE,
          grade: ItemGrade.TWO,
        },
        {
          key: Metal.EPIC_METAL,
          amount: 10,
        },
        {
          key: Wood.EPIC_WOOD,
          amount: 5,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.BATTLEAXE,
        grade: ItemGrade.FOUR,
      },
      parts: [
        {
          key: MeleeWeapon.BATTLEAXE,
          grade: ItemGrade.THREE,
        },
        {
          key: Metal.LEGENDARY_METAL,
          amount: 10,
        },
        {
          key: Wood.LEGENDARY_WOOD,
          amount: 5,
        },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeaponBlueprint.BOTTLE,
  recipes: [
    {
      item: {
        key: MeleeWeapon.BOTTLE,
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
    {
      item: {
        key: MeleeWeapon.BOTTLE,
        grade: ItemGrade.ONE,
      },
      parts: [
        {
          key: MeleeWeapon.BOTTLE,
          grade: ItemGrade.BASE,
        },
        {
          key: Metal.UNCOMMON_METAL,
          amount: 3,
        },
        {
          key: Scrap.UNCOMMON_SCRAP,
          amount: 4,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.BOTTLE,
        grade: ItemGrade.TWO,
      },
      parts: [
        {
          key: MeleeWeapon.BOTTLE,
          grade: ItemGrade.ONE,
        },
        {
          key: Metal.RARE_METAL,
          amount: 4,
        },
        {
          key: Scrap.RARE_SCRAP,
          amount: 5,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.BOTTLE,
        grade: ItemGrade.THREE,
      },
      parts: [
        {
          key: MeleeWeapon.BOTTLE,
          grade: ItemGrade.TWO,
        },
        {
          key: Metal.EPIC_METAL,
          amount: 5,
        },
        {
          key: Scrap.EPIC_SCRAP,
          amount: 6,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.BOTTLE,
        grade: ItemGrade.FOUR,
      },
      parts: [
        {
          key: MeleeWeapon.BOTTLE,
          grade: ItemGrade.THREE,
        },
        {
          key: Metal.LEGENDARY_METAL,
          amount: 6,
        },
        {
          key: Scrap.LEGENDARY_SCRAP,
          amount: 7,
        },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeaponBlueprint.CROWBAR,
  recipes: [
    {
      item: {
        key: MeleeWeapon.CROWBAR,
        grade: ItemGrade.BASE,
      },
      parts: [
        {
          key: Metal.COMMON_METAL,
          amount: 10,
        },
        {
          key: Scrap.COMMON_SCRAP,
          amount: 3,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.CROWBAR,
        grade: ItemGrade.ONE,
      },
      parts: [
        {
          key: MeleeWeapon.CROWBAR,
          grade: ItemGrade.BASE,
        },
        {
          key: Metal.UNCOMMON_METAL,
          amount: 10,
        },
        {
          key: Scrap.UNCOMMON_SCRAP,
          amount: 5,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.CROWBAR,
        grade: ItemGrade.TWO,
      },
      parts: [
        {
          key: MeleeWeapon.CROWBAR,
          grade: ItemGrade.ONE,
        },
        {
          key: Metal.RARE_METAL,
          amount: 10,
        },
        {
          key: Scrap.RARE_SCRAP,
          amount: 5,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.CROWBAR,
        grade: ItemGrade.THREE,
      },
      parts: [
        {
          key: MeleeWeapon.CROWBAR,
          grade: ItemGrade.TWO,
        },
        {
          key: Metal.EPIC_METAL,
          amount: 10,
        },
        {
          key: Scrap.EPIC_SCRAP,
          amount: 5,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.CROWBAR,
        grade: ItemGrade.FOUR,
      },
      parts: [
        {
          key: MeleeWeapon.CROWBAR,
          grade: ItemGrade.THREE,
        },
        {
          key: Metal.LEGENDARY_METAL,
          amount: 10,
        },
        {
          key: Scrap.LEGENDARY_SCRAP,
          amount: 5,
        },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeapon.DAGGER,
  recipes: [
    {
      item: {
        key: MeleeWeapon.DAGGER,
        grade: ItemGrade.BASE,
      },
      parts: [
        {
          key: Metal.COMMON_METAL,
          amount: 5,
        },
        {
          key: Wood.COMMON_WOOD,
          amount: 2,
        },
        {
          key: Scrap.COMMON_SCRAP,
          amount: 3,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.DAGGER,
        grade: ItemGrade.ONE,
      },
      parts: [
        {
          key: MeleeWeapon.DAGGER,
          grade: ItemGrade.BASE,
        },
        {
          key: Metal.UNCOMMON_METAL,
          amount: 5,
        },
        {
          key: Wood.UNCOMMON_WOOD,
          amount: 2,
        },
        {
          key: Scrap.UNCOMMON_SCRAP,
          amount: 3,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.DAGGER,
        grade: ItemGrade.TWO,
      },
      parts: [
        {
          key: MeleeWeapon.DAGGER,
          grade: ItemGrade.ONE,
        },
        {
          key: Metal.RARE_METAL,
          amount: 5,
        },
        {
          key: Wood.RARE_WOOD,
          amount: 2,
        },
        {
          key: Scrap.RARE_SCRAP,
          amount: 3,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.DAGGER,
        grade: ItemGrade.THREE,
      },
      parts: [
        {
          key: MeleeWeapon.DAGGER,
          grade: ItemGrade.TWO,
        },
        {
          key: Metal.EPIC_METAL,
          amount: 5,
        },
        {
          key: Wood.EPIC_WOOD,
          amount: 2,
        },
        {
          key: Scrap.EPIC_SCRAP,
          amount: 3,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.DAGGER,
        grade: ItemGrade.FOUR,
      },
      parts: [
        {
          key: MeleeWeapon.DAGGER,
          grade: ItemGrade.THREE,
        },
        {
          key: Metal.LEGENDARY_METAL,
          amount: 5,
        },
        {
          key: Wood.LEGENDARY_WOOD,
          amount: 2,
        },
        {
          key: Scrap.LEGENDARY_SCRAP,
          amount: 3,
        },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeaponBlueprint.FLASHLIGHT,
  recipes: [
    {
      item: {
        key: MeleeWeapon.FLASHLIGHT,
        grade: ItemGrade.BASE,
      },
      parts: [
        {
          key: Metal.COMMON_METAL,
        },
        {
          key: Scrap.COMMON_SCRAP,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.FLASHLIGHT,
        grade: ItemGrade.ONE,
      },
      parts: [
        {
          key: MeleeWeapon.FLASHLIGHT,
          grade: ItemGrade.BASE,
        },
        {
          key: Metal.UNCOMMON_METAL,
        },
        {
          key: Scrap.UNCOMMON_SCRAP,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.FLASHLIGHT,
        grade: ItemGrade.TWO,
      },
      parts: [
        {
          key: MeleeWeapon.FLASHLIGHT,
          grade: ItemGrade.ONE,
        },
        {
          key: Metal.RARE_METAL,
        },
        {
          key: Scrap.RARE_SCRAP,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.FLASHLIGHT,
        grade: ItemGrade.THREE,
      },
      parts: [
        {
          key: MeleeWeapon.FLASHLIGHT,
          grade: ItemGrade.TWO,
        },
        {
          key: Metal.EPIC_METAL,
        },
        {
          key: Scrap.EPIC_SCRAP,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.FLASHLIGHT,
        grade: ItemGrade.FOUR,
      },
      parts: [
        {
          key: MeleeWeapon.FLASHLIGHT,
          grade: ItemGrade.THREE,
        },
        {
          key: Metal.LEGENDARY_METAL,
        },
        {
          key: Scrap.LEGENDARY_SCRAP,
        },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeaponBlueprint.GOLFCLUB,
  recipes: [
    {
      item: {
        key: MeleeWeapon.GOLFCLUB,
        grade: ItemGrade.BASE,
      },
      parts: [
        {
          key: Metal.COMMON_METAL,
          amount: 5,
        },
        {
          key: Wood.COMMON_WOOD,
          amount: 2,
        },
        {
          key: Scrap.COMMON_SCRAP,
          amount: 3,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.GOLFCLUB,
        grade: ItemGrade.ONE,
      },
      parts: [
        {
          key: MeleeWeapon.GOLFCLUB,
          grade: ItemGrade.BASE,
        },
        {
          key: Metal.UNCOMMON_METAL,
          amount: 8,
        },
        {
          key: Wood.UNCOMMON_WOOD,
          amount: 3,
        },
        {
          key: Scrap.UNCOMMON_SCRAP,
          amount: 5,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.GOLFCLUB,
        grade: ItemGrade.TWO,
      },
      parts: [
        {
          key: MeleeWeapon.GOLFCLUB,
          grade: ItemGrade.ONE,
        },
        {
          key: Metal.RARE_METAL,
          amount: 12,
        },
        {
          key: Wood.RARE_WOOD,
          amount: 4,
        },
        {
          key: Scrap.RARE_SCRAP,
          amount: 7,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.GOLFCLUB,
        grade: ItemGrade.THREE,
      },
      parts: [
        {
          key: MeleeWeapon.GOLFCLUB,
          grade: ItemGrade.TWO,
        },
        {
          key: Metal.EPIC_METAL,
          amount: 15,
        },
        {
          key: Wood.EPIC_WOOD,
          amount: 5,
        },
        {
          key: Scrap.EPIC_SCRAP,
          amount: 10,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.GOLFCLUB,
        grade: ItemGrade.FOUR,
      },
      parts: [
        {
          key: MeleeWeapon.GOLFCLUB,
          grade: ItemGrade.THREE,
        },
        {
          key: Metal.LEGENDARY_METAL,
          amount: 20,
        },
        {
          key: Wood.LEGENDARY_WOOD,
          amount: 7,
        },
        {
          key: Scrap.LEGENDARY_SCRAP,
          amount: 15,
        },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeapon.HAMMER,
  recipes: [
    {
      item: {
        key: MeleeWeapon.HAMMER,
        grade: ItemGrade.BASE,
      },
      parts: [
        {
          key: Metal.COMMON_METAL,
          amount: 5,
        },
        {
          key: Scrap.COMMON_SCRAP,
          amount: 5,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.HAMMER,
        grade: ItemGrade.ONE,
      },
      parts: [
        {
          key: MeleeWeapon.HAMMER,
          grade: ItemGrade.BASE,
        },
        {
          key: Metal.UNCOMMON_METAL,
          amount: 10,
        },
        {
          key: Scrap.UNCOMMON_SCRAP,
          amount: 10,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.HAMMER,
        grade: ItemGrade.TWO,
      },
      parts: [
        {
          key: MeleeWeapon.HAMMER,
          grade: ItemGrade.ONE,
        },
        {
          key: Metal.RARE_METAL,
          amount: 15,
        },
        {
          key: Scrap.RARE_SCRAP,
          amount: 15,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.HAMMER,
        grade: ItemGrade.THREE,
      },
      parts: [
        {
          key: MeleeWeapon.HAMMER,
          grade: ItemGrade.TWO,
        },
        {
          key: Metal.EPIC_METAL,
          amount: 20,
        },
        {
          key: Scrap.EPIC_SCRAP,
          amount: 20,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.HAMMER,
        grade: ItemGrade.FOUR,
      },
      parts: [
        {
          key: MeleeWeapon.HAMMER,
          grade: ItemGrade.THREE,
        },
        {
          key: Metal.LEGENDARY_METAL,
          amount: 25,
        },
        {
          key: Scrap.LEGENDARY_SCRAP,
          amount: 25,
        },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeapon.HATCHET,
  recipes: [
    {
      item: {
        key: MeleeWeapon.HATCHET,
        grade: ItemGrade.BASE,
      },
      parts: [
        {
          key: Wood.COMMON_WOOD,
          amount: 10,
        },
        {
          key: Metal.COMMON_METAL,
          amount: 5,
        },
        {
          key: Scrap.COMMON_SCRAP,
          amount: 2,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.HATCHET,
        grade: ItemGrade.ONE,
      },
      parts: [
        {
          key: MeleeWeapon.HATCHET,
          grade: ItemGrade.BASE,
        },
        {
          key: Wood.UNCOMMON_WOOD,
          amount: 10,
        },
        {
          key: Metal.UNCOMMON_METAL,
          amount: 7,
        },
        {
          key: Scrap.UNCOMMON_SCRAP,
          amount: 3,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.HATCHET,
        grade: ItemGrade.TWO,
      },
      parts: [
        {
          key: MeleeWeapon.HATCHET,
          grade: ItemGrade.ONE,
        },
        {
          key: Wood.RARE_WOOD,
          amount: 10,
        },
        {
          key: Metal.RARE_METAL,
          amount: 9,
        },
        {
          key: Scrap.RARE_SCRAP,
          amount: 4,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.HATCHET,
        grade: ItemGrade.THREE,
      },
      parts: [
        {
          key: MeleeWeapon.HATCHET,
          grade: ItemGrade.TWO,
        },
        {
          key: Wood.EPIC_WOOD,
          amount: 12,
        },
        {
          key: Metal.EPIC_METAL,
          amount: 12,
        },
        {
          key: Scrap.EPIC_SCRAP,
          amount: 5,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.HATCHET,
        grade: ItemGrade.FOUR,
      },
      parts: [
        {
          key: MeleeWeapon.HATCHET,
          grade: ItemGrade.THREE,
        },
        {
          key: Wood.LEGENDARY_WOOD,
          amount: 15,
        },
        {
          key: Metal.LEGENDARY_METAL,
          amount: 15,
        },
        {
          key: Scrap.LEGENDARY_SCRAP,
          amount: 7,
        },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeaponBlueprint.KNIFE,
  recipes: [
    {
      item: {
        key: MeleeWeapon.KNIFE,
        grade: ItemGrade.BASE,
      },
      parts: [
        {
          key: Metal.COMMON_METAL,
          amount: 5,
        },
        {
          key: Wood.COMMON_WOOD,
          amount: 2,
        },
        {
          key: Scrap.COMMON_SCRAP,
          amount: 5,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.KNIFE,
        grade: ItemGrade.ONE,
      },
      parts: [
        {
          item: {
            key: MeleeWeapon.KNIFE,
            grade: ItemGrade.BASE,
          },
        },
        {
          key: Metal.UNCOMMON_METAL,
          amount: 5,
        },
        {
          key: Wood.UNCOMMON_WOOD,
          amount: 2,
        },
        {
          key: Scrap.UNCOMMON_SCRAP,
          amount: 5,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.KNIFE,
        grade: ItemGrade.TWO,
      },
      parts: [
        {
          item: {
            key: MeleeWeapon.KNIFE,
            grade: ItemGrade.ONE,
          },
        },
        {
          key: Metal.RARE_METAL,
          amount: 5,
        },
        {
          key: Wood.RARE_WOOD,
          amount: 2,
        },
        {
          key: Scrap.RARE_SCRAP,
          amount: 5,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.KNIFE,
        grade: ItemGrade.THREE,
      },
      parts: [
        {
          item: {
            key: MeleeWeapon.KNIFE,
            grade: ItemGrade.TWO,
          },
        },
        {
          key: Metal.EPIC_METAL,
          amount: 5,
        },
        {
          key: Wood.EPIC_WOOD,
          amount: 2,
        },
        {
          key: Scrap.EPIC_SCRAP,
          amount: 5,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.KNIFE,
        grade: ItemGrade.FOUR,
      },
      parts: [
        {
          item: {
            key: MeleeWeapon.KNIFE,
            grade: ItemGrade.THREE,
          },
        },
        {
          key: Metal.LEGENDARY_METAL,
          amount: 5,
        },
        {
          key: Wood.LEGENDARY_WOOD,
          amount: 2,
        },
        {
          key: Scrap.LEGENDARY_SCRAP,
          amount: 5,
        },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeaponBlueprint.KNUCKLE,
  recipes: [
    {
      item: {
        key: MeleeWeapon.KNUCKLE,
        grade: ItemGrade.BASE,
      },
      parts: [
        {
          key: Metal.COMMON_METAL,
          amount: 5,
        },
        {
          key: Scrap.COMMON_SCRAP,
          amount: 5,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.KNUCKLE,
        grade: ItemGrade.ONE,
      },
      parts: [
        {
          key: MeleeWeapon.KNUCKLE,
          grade: ItemGrade.BASE,
        },
        {
          key: Metal.UNCOMMON_METAL,
          amount: 5,
        },
        {
          key: Scrap.UNCOMMON_SCRAP,
          amount: 5,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.KNUCKLE,
        grade: ItemGrade.TWO,
      },
      parts: [
        {
          key: MeleeWeapon.KNUCKLE,
          grade: ItemGrade.ONE,
        },
        {
          key: Metal.RARE_METAL,
          amount: 10,
        },
        {
          key: Scrap.RARE_SCRAP,
          amount: 10,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.KNUCKLE,
        grade: ItemGrade.THREE,
      },
      parts: [
        {
          key: MeleeWeapon.KNUCKLE,
          grade: ItemGrade.TWO,
        },
        {
          key: Metal.EPIC_METAL,
          amount: 15,
        },
        {
          key: Scrap.EPIC_SCRAP,
          amount: 15,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.KNUCKLE,
        grade: ItemGrade.FOUR,
      },
      parts: [
        {
          key: MeleeWeapon.KNUCKLE,
          grade: ItemGrade.THREE,
        },
        {
          key: Metal.LEGENDARY_METAL,
          amount: 20,
        },
        {
          key: Scrap.LEGENDARY_SCRAP,
          amount: 20,
        },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeaponBlueprint.MACHETE,
  recipes: [
    {
      item: {
        key: MeleeWeapon.MACHETE,
        grade: ItemGrade.BASE,
      },
      parts: [
        {
          key: Metal.COMMON_METAL,
          amount: 5,
        },
        {
          key: Wood.COMMON_WOOD,
          amount: 3,
        },
        {
          key: Scrap.COMMON_SCRAP,
          amount: 2,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.MACHETE,
        grade: ItemGrade.ONE,
      },
      parts: [
        {
          key: MeleeWeapon.MACHETE,
          grade: ItemGrade.BASE,
        },
        {
          key: Metal.UNCOMMON_METAL,
          amount: 6,
        },
        {
          key: Wood.UNCOMMON_WOOD,
          amount: 4,
        },
        {
          key: Scrap.UNCOMMON_SCRAP,
          amount: 3,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.MACHETE,
        grade: ItemGrade.TWO,
      },
      parts: [
        {
          key: MeleeWeapon.MACHETE,
          grade: ItemGrade.ONE,
        },
        {
          key: Metal.RARE_METAL,
          amount: 7,
        },
        {
          key: Wood.RARE_WOOD,
          amount: 5,
        },
        {
          key: Scrap.RARE_SCRAP,
          amount: 4,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.MACHETE,
        grade: ItemGrade.THREE,
      },
      parts: [
        {
          key: MeleeWeapon.MACHETE,
          grade: ItemGrade.TWO,
        },
        {
          key: Metal.EPIC_METAL,
          amount: 8,
        },
        {
          key: Wood.EPIC_WOOD,
          amount: 6,
        },
        {
          key: Scrap.EPIC_SCRAP,
          amount: 5,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.MACHETE,
        grade: ItemGrade.FOUR,
      },
      parts: [
        {
          key: MeleeWeapon.MACHETE,
          grade: ItemGrade.THREE,
        },
        {
          key: Metal.LEGENDARY_METAL,
          amount: 9,
        },
        {
          key: Wood.LEGENDARY_WOOD,
          amount: 7,
        },
        {
          key: Scrap.LEGENDARY_SCRAP,
          amount: 6,
        },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeaponBlueprint.NIGHTSTICK,
  recipes: [
    {
      item: {
        key: MeleeWeapon.NIGHTSTICK,
        grade: ItemGrade.BASE,
      },
      parts: [
        {
          key: Wood.COMMON_WOOD,
          amount: 10,
        },
        {
          key: Metal.COMMON_METAL,
          amount: 5,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.NIGHTSTICK,
        grade: ItemGrade.ONE,
      },
      parts: [
        {
          key: MeleeWeapon.NIGHTSTICK,
          grade: ItemGrade.BASE,
        },
        {
          key: Wood.UNCOMMON_WOOD,
          amount: 10,
        },
        {
          key: Metal.UNCOMMON_METAL,
          amount: 5,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.NIGHTSTICK,
        grade: ItemGrade.TWO,
      },
      parts: [
        {
          key: MeleeWeapon.NIGHTSTICK,
          grade: ItemGrade.ONE,
        },
        {
          key: Wood.RARE_WOOD,
          amount: 10,
        },
        {
          key: Metal.RARE_METAL,
          amount: 5,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.NIGHTSTICK,
        grade: ItemGrade.THREE,
      },
      parts: [
        {
          key: MeleeWeapon.NIGHTSTICK,
          grade: ItemGrade.TWO,
        },
        {
          key: Wood.EPIC_WOOD,
          amount: 10,
        },
        {
          key: Metal.EPIC_METAL,
          amount: 5,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.NIGHTSTICK,
        grade: ItemGrade.FOUR,
      },
      parts: [
        {
          key: MeleeWeapon.NIGHTSTICK,
          grade: ItemGrade.THREE,
        },
        {
          key: Wood.LEGENDARY_WOOD,
          amount: 10,
        },
        {
          key: Metal.LEGENDARY_METAL,
          amount: 5,
        },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeapon.PIPEWRENCH,
  recipes: [
    {
      item: {
        key: MeleeWeapon.PIPEWRENCH,
        grade: ItemGrade.BASE,
      },
      parts: [
        {
          key: Metal.COMMON_METAL,
          amount: 5,
        },
        {
          key: Scrap.COMMON_SCRAP,
          amount: 5,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.PIPEWRENCH,
        grade: ItemGrade.ONE,
      },
      parts: [
        {
          key: MeleeWeapon.PIPEWRENCH,
          grade: ItemGrade.BASE,
        },
        {
          key: Metal.UNCOMMON_METAL,
          amount: 8,
        },
        {
          key: Scrap.UNCOMMON_SCRAP,
          amount: 8,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.PIPEWRENCH,
        grade: ItemGrade.TWO,
      },
      parts: [
        {
          key: MeleeWeapon.PIPEWRENCH,
          grade: ItemGrade.ONE,
        },
        {
          key: Metal.RARE_METAL,
          amount: 12,
        },
        {
          key: Scrap.RARE_SCRAP,
          amount: 12,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.PIPEWRENCH,
        grade: ItemGrade.THREE,
      },
      parts: [
        {
          key: MeleeWeapon.PIPEWRENCH,
          grade: ItemGrade.TWO,
        },
        {
          key: Metal.EPIC_METAL,
          amount: 15,
        },
        {
          key: Scrap.EPIC_SCRAP,
          amount: 15,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.PIPEWRENCH,
        grade: ItemGrade.FOUR,
      },
      parts: [
        {
          key: MeleeWeapon.PIPEWRENCH,
          grade: ItemGrade.THREE,
        },
        {
          key: Metal.LEGENDARY_METAL,
          amount: 20,
        },
        {
          key: Scrap.LEGENDARY_SCRAP,
          amount: 20,
        },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeaponBlueprint.POOLCUE,
  recipes: [
    {
      item: {
        key: MeleeWeapon.POOLCUE,
        grade: ItemGrade.BASE,
      },
      parts: [
        {
          key: Wood.COMMON_WOOD,
          amount: 10,
        },
        {
          key: Scrap.COMMON_SCRAP,
          amount: 5,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.POOLCUE,
        grade: ItemGrade.ONE,
      },
      parts: [
        {
          key: MeleeWeapon.POOLCUE,
          grade: ItemGrade.BASE,
        },
        {
          key: Wood.UNCOMMON_WOOD,
          amount: 15,
        },
        {
          key: Scrap.UNCOMMON_SCRAP,
          amount: 10,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.POOLCUE,
        grade: ItemGrade.TWO,
      },
      parts: [
        {
          key: MeleeWeapon.POOLCUE,
          grade: ItemGrade.ONE,
        },
        {
          key: Wood.RARE_WOOD,
          amount: 20,
        },
        {
          key: Metal.RARE_METAL,
          amount: 10,
        },
        {
          key: Scrap.RARE_SCRAP,
          amount: 15,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.POOLCUE,
        grade: ItemGrade.THREE,
      },
      parts: [
        {
          key: MeleeWeapon.POOLCUE,
          grade: ItemGrade.TWO,
        },
        {
          key: Wood.EPIC_WOOD,
          amount: 25,
        },
        {
          key: Metal.EPIC_METAL,
          amount: 15,
        },
        {
          key: Scrap.EPIC_SCRAP,
          amount: 20,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.POOLCUE,
        grade: ItemGrade.FOUR,
      },
      parts: [
        {
          key: MeleeWeapon.POOLCUE,
          grade: ItemGrade.THREE,
        },
        {
          key: Wood.LEGENDARY_WOOD,
          amount: 30,
        },
        {
          key: Metal.LEGENDARY_METAL,
          amount: 20,
        },
        {
          key: Scrap.LEGENDARY_SCRAP,
          amount: 25,
        },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeaponBlueprint.STONEHATCHET,
  recipes: [
    {
      item: {
        key: MeleeWeapon.STONEHATCHET,
        grade: ItemGrade.BASE,
      },
      parts: [
        {
          key: Metal.COMMON_METAL,
          amount: 10,
        },
        {
          key: Scrap.COMMON_SCRAP,
          amount: 5,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.STONEHATCHET,
        grade: ItemGrade.ONE,
      },
      parts: [
        {
          key: MeleeWeapon.STONEHATCHET,
          grade: ItemGrade.BASE,
        },
        {
          key: Metal.UNCOMMON_METAL,
          amount: 8,
        },
        {
          key: Scrap.UNCOMMON_SCRAP,
          amount: 4,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.STONEHATCHET,
        grade: ItemGrade.TWO,
      },
      parts: [
        {
          key: MeleeWeapon.STONEHATCHET,
          grade: ItemGrade.ONE,
        },
        {
          key: Metal.RARE_METAL,
          amount: 6,
        },
        {
          key: Scrap.RARE_SCRAP,
          amount: 3,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.STONEHATCHET,
        grade: ItemGrade.THREE,
      },
      parts: [
        {
          key: MeleeWeapon.STONEHATCHET,
          grade: ItemGrade.TWO,
        },
        {
          key: Metal.EPIC_METAL,
          amount: 4,
        },
        {
          key: Scrap.EPIC_SCRAP,
          amount: 2,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.STONEHATCHET,
        grade: ItemGrade.FOUR,
      },
      parts: [
        {
          key: MeleeWeapon.STONEHATCHET,
          grade: ItemGrade.THREE,
        },
        {
          key: Metal.LEGENDARY_METAL,
          amount: 2,
        },
        {
          key: Scrap.LEGENDARY_SCRAP,
          amount: 1,
        },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeaponBlueprint.SWITCHBLADE,
  recipes: [
    {
      item: {
        key: MeleeWeapon.SWITCHBLADE,
        grade: ItemGrade.BASE,
      },
      parts: [
        {
          key: Metal.COMMON_METAL,
          amount: 5,
        },
        {
          key: Wood.COMMON_WOOD,
          amount: 5,
        },
        {
          key: Scrap.COMMON_SCRAP,
          amount: 5,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.SWITCHBLADE,
        grade: ItemGrade.ONE,
      },
      parts: [
        {
          key: MeleeWeapon.SWITCHBLADE,
          grade: ItemGrade.BASE,
        },
        {
          key: Metal.UNCOMMON_METAL,
          amount: 5,
        },
        {
          key: Wood.UNCOMMON_WOOD,
          amount: 5,
        },
        {
          key: Scrap.UNCOMMON_SCRAP,
          amount: 5,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.SWITCHBLADE,
        grade: ItemGrade.TWO,
      },
      parts: [
        {
          key: MeleeWeapon.SWITCHBLADE,
          grade: ItemGrade.ONE,
        },
        {
          key: Metal.RARE_METAL,
          amount: 5,
        },
        {
          key: Wood.RARE_WOOD,
          amount: 5,
        },
        {
          key: Scrap.RARE_SCRAP,
          amount: 5,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.SWITCHBLADE,
        grade: ItemGrade.THREE,
      },
      parts: [
        {
          key: MeleeWeapon.SWITCHBLADE,
          grade: ItemGrade.TWO,
        },
        {
          key: Metal.EPIC_METAL,
          amount: 5,
        },
        {
          key: Wood.EPIC_WOOD,
          amount: 5,
        },
        {
          key: Scrap.EPIC_SCRAP,
          amount: 5,
        },
      ],
    },
    {
      item: {
        key: MeleeWeapon.SWITCHBLADE,
        grade: ItemGrade.FOUR,
      },
      parts: [
        {
          key: MeleeWeapon.SWITCHBLADE,
          grade: ItemGrade.THREE,
        },
        {
          key: Metal.LEGENDARY_METAL,
          amount: 5,
        },
        {
          key: Wood.LEGENDARY_WOOD,
          amount: 5,
        },
        {
          key: Scrap.LEGENDARY_SCRAP,
          amount: 5,
        },
      ],
    },
  ],
});
