import { makeKeys } from "@shared/utility/make-keys";
import { Scrap } from "@shared/modules/items/registry/materials/scrap.items";
import {
  MeleeWeapon,
  MeleeWeaponItem,
} from "@shared/modules/items/registry/weapons/melee-weapon.items";
import { getItemName } from "@shared/modules/items/lib";
import { ItemGrade } from "@shared/modules/items/enums";
import { Wood } from "@shared/modules/items/registry/materials/wood.items";
import { Metal } from "@shared/modules/items/registry/materials/metal.items";
import { registerBlueprint } from "../blueprints.registry";

// We re-use weapon item key as it's blueprint key for easier management.
export const MeleeWeaponBlueprint = makeKeys<MeleeWeaponBlueprintKey>()(MeleeWeapon);

export type MeleeWeaponBlueprintKey = Brand<string, "MeleeWeaponBlueprintKey">;

registerBlueprint({
  key: MeleeWeapon.BAT,
  name: `${getItemName(MeleeWeapon.BAT)} blueprint`,
  description: `Lets you craft and upgrade ${getItemName(MeleeWeapon.BAT)}.`,
  recipes: [
    {
      key: MeleeWeapon.BAT,
      durationSeconds: 5,
      item: {
        key: MeleeWeapon.BAT,
        grade: ItemGrade.BASE,
      } as MeleeWeaponItem,
      parts: [
        { key: Wood.COMMON_WOOD, amount: 10 },
        { key: Scrap.COMMON_SCRAP, amount: 2 },
      ],
    },
    {
      key: MeleeWeapon.BAT + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.BAT,
        grade: ItemGrade.ONE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.BAT, grade: ItemGrade.BASE } as MeleeWeaponItem,
        { key: Wood.UNCOMMON_WOOD, amount: 10 },
        { key: Scrap.UNCOMMON_SCRAP, amount: 2 },
      ],
    },
    {
      key: MeleeWeapon.BAT + "+2",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.BAT,
        grade: ItemGrade.TWO,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.BAT, grade: ItemGrade.ONE } as MeleeWeaponItem,
        { key: Wood.RARE_WOOD, amount: 10 },
        { key: Scrap.RARE_SCRAP, amount: 2 },
      ],
    },
    {
      key: MeleeWeapon.BAT + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.BAT,
        grade: ItemGrade.THREE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.BAT, grade: ItemGrade.TWO } as MeleeWeaponItem,
        { key: Wood.EPIC_WOOD, amount: 10 },
        { key: Scrap.EPIC_SCRAP, amount: 2 },
      ],
    },
    {
      key: MeleeWeapon.BAT + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.BAT,
        grade: ItemGrade.FOUR,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.BAT, grade: ItemGrade.THREE } as MeleeWeaponItem,
        { key: Wood.LEGENDARY_WOOD, amount: 10 },
        { key: Scrap.LEGENDARY_SCRAP, amount: 2 },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeaponBlueprint.BATTLEAXE,
  name: `${getItemName(MeleeWeapon.BATTLEAXE)} blueprint`,
  description: `Lets you craft and upgrade ${getItemName(MeleeWeapon.BATTLEAXE)}.`,
  recipes: [
    {
      key: MeleeWeapon.BATTLEAXE,
      durationSeconds: 5,
      item: {
        key: MeleeWeapon.BATTLEAXE,
        grade: ItemGrade.BASE,
      } as MeleeWeaponItem,
      parts: [
        { key: Metal.COMMON_METAL, amount: 10 },
        { key: Wood.COMMON_WOOD, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.BATTLEAXE + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.BATTLEAXE,
        grade: ItemGrade.ONE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.BATTLEAXE, grade: ItemGrade.BASE } as MeleeWeaponItem,
        { key: Metal.UNCOMMON_METAL, amount: 10 },
        { key: Wood.UNCOMMON_WOOD, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.BATTLEAXE + "+2",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.BATTLEAXE,
        grade: ItemGrade.TWO,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.BATTLEAXE, grade: ItemGrade.ONE } as MeleeWeaponItem,
        { key: Metal.RARE_METAL, amount: 10 },
        { key: Wood.RARE_WOOD, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.BATTLEAXE + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.BATTLEAXE,
        grade: ItemGrade.THREE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.BATTLEAXE, grade: ItemGrade.TWO } as MeleeWeaponItem,
        { key: Metal.EPIC_METAL, amount: 10 },
        { key: Wood.EPIC_WOOD, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.BATTLEAXE + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.BATTLEAXE,
        grade: ItemGrade.FOUR,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.BATTLEAXE, grade: ItemGrade.THREE } as MeleeWeaponItem,
        { key: Metal.LEGENDARY_METAL, amount: 10 },
        { key: Wood.LEGENDARY_WOOD, amount: 5 },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeaponBlueprint.BOTTLE,
  name: `${getItemName(MeleeWeapon.BOTTLE)} blueprint`,
  description: `Lets you craft and upgrade ${getItemName(MeleeWeapon.BOTTLE)}.`,
  recipes: [
    {
      key: MeleeWeapon.BOTTLE,
      durationSeconds: 5,
      item: {
        key: MeleeWeapon.BOTTLE,
        grade: ItemGrade.BASE,
      } as MeleeWeaponItem,
      parts: [
        { key: Metal.COMMON_METAL, amount: 2 },
        { key: Scrap.COMMON_SCRAP, amount: 3 },
      ],
    },
    {
      key: MeleeWeapon.BOTTLE + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.BOTTLE,
        grade: ItemGrade.ONE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.BOTTLE, grade: ItemGrade.BASE } as MeleeWeaponItem,
        { key: Metal.UNCOMMON_METAL, amount: 3 },
        { key: Scrap.UNCOMMON_SCRAP, amount: 4 },
      ],
    },
    {
      key: MeleeWeapon.BOTTLE + "+2",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.BOTTLE,
        grade: ItemGrade.TWO,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.BOTTLE, grade: ItemGrade.ONE } as MeleeWeaponItem,
        { key: Metal.RARE_METAL, amount: 4 },
        { key: Scrap.RARE_SCRAP, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.BOTTLE + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.BOTTLE,
        grade: ItemGrade.THREE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.BOTTLE, grade: ItemGrade.TWO } as MeleeWeaponItem,
        { key: Metal.EPIC_METAL, amount: 5 },
        { key: Scrap.EPIC_SCRAP, amount: 6 },
      ],
    },
    {
      key: MeleeWeapon.BOTTLE + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.BOTTLE,
        grade: ItemGrade.FOUR,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.BOTTLE, grade: ItemGrade.THREE } as MeleeWeaponItem,
        { key: Metal.LEGENDARY_METAL, amount: 6 },
        { key: Scrap.LEGENDARY_SCRAP, amount: 7 },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeaponBlueprint.CROWBAR,
  name: `${getItemName(MeleeWeapon.CROWBAR)} blueprint`,
  description: `Lets you craft and upgrade ${getItemName(MeleeWeapon.CROWBAR)}.`,
  recipes: [
    {
      key: MeleeWeapon.CROWBAR,
      durationSeconds: 5,
      item: {
        key: MeleeWeapon.CROWBAR,
        grade: ItemGrade.BASE,
      } as MeleeWeaponItem,
      parts: [
        { key: Metal.COMMON_METAL, amount: 10 },
        { key: Scrap.COMMON_SCRAP, amount: 3 },
      ],
    },
    {
      key: MeleeWeapon.CROWBAR + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.CROWBAR,
        grade: ItemGrade.ONE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.CROWBAR, grade: ItemGrade.BASE } as MeleeWeaponItem,
        { key: Metal.UNCOMMON_METAL, amount: 10 },
        { key: Scrap.UNCOMMON_SCRAP, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.CROWBAR + "+2",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.CROWBAR,
        grade: ItemGrade.TWO,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.CROWBAR, grade: ItemGrade.ONE } as MeleeWeaponItem,
        { key: Metal.RARE_METAL, amount: 10 },
        { key: Scrap.RARE_SCRAP, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.CROWBAR + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.CROWBAR,
        grade: ItemGrade.THREE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.CROWBAR, grade: ItemGrade.TWO } as MeleeWeaponItem,
        { key: Metal.EPIC_METAL, amount: 10 },
        { key: Scrap.EPIC_SCRAP, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.CROWBAR + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.CROWBAR,
        grade: ItemGrade.FOUR,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.CROWBAR, grade: ItemGrade.THREE } as MeleeWeaponItem,
        { key: Metal.LEGENDARY_METAL, amount: 10 },
        { key: Scrap.LEGENDARY_SCRAP, amount: 5 },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeapon.DAGGER,
  name: `${getItemName(MeleeWeapon.DAGGER)} blueprint`,
  description: `Lets you craft and upgrade ${getItemName(MeleeWeapon.DAGGER)}.`,
  recipes: [
    {
      key: MeleeWeapon.DAGGER,
      durationSeconds: 5,
      item: {
        key: MeleeWeapon.DAGGER,
        grade: ItemGrade.BASE,
      } as MeleeWeaponItem,
      parts: [
        { key: Metal.COMMON_METAL, amount: 5 },
        { key: Wood.COMMON_WOOD, amount: 2 },
        { key: Scrap.COMMON_SCRAP, amount: 3 },
      ],
    },
    {
      key: MeleeWeapon.DAGGER + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.DAGGER,
        grade: ItemGrade.ONE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.DAGGER, grade: ItemGrade.BASE } as MeleeWeaponItem,
        { key: Metal.UNCOMMON_METAL, amount: 5 },
        { key: Wood.UNCOMMON_WOOD, amount: 2 },
        {
          key: Scrap.UNCOMMON_SCRAP,
          amount: 3,
        },
      ],
    },
    {
      key: MeleeWeapon.DAGGER + "+2",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.DAGGER,
        grade: ItemGrade.TWO,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.DAGGER, grade: ItemGrade.ONE } as MeleeWeaponItem,
        { key: Metal.RARE_METAL, amount: 5 },
        { key: Wood.RARE_WOOD, amount: 2 },
        { key: Scrap.RARE_SCRAP, amount: 3 },
      ],
    },
    {
      key: MeleeWeapon.DAGGER + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.DAGGER,
        grade: ItemGrade.THREE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.DAGGER, grade: ItemGrade.TWO } as MeleeWeaponItem,
        { key: Metal.EPIC_METAL, amount: 5 },
        { key: Wood.EPIC_WOOD, amount: 2 },
        { key: Scrap.EPIC_SCRAP, amount: 3 },
      ],
    },
    {
      key: MeleeWeapon.DAGGER + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.DAGGER,
        grade: ItemGrade.FOUR,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.DAGGER, grade: ItemGrade.THREE } as MeleeWeaponItem,
        { key: Metal.LEGENDARY_METAL, amount: 5 },
        { key: Wood.LEGENDARY_WOOD, amount: 2 },
        { key: Scrap.LEGENDARY_SCRAP, amount: 3 },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeaponBlueprint.GOLFCLUB,
  name: `${getItemName(MeleeWeapon.GOLFCLUB)} blueprint`,
  description: `Lets you craft and upgrade ${getItemName(MeleeWeapon.GOLFCLUB)}.`,
  recipes: [
    {
      key: MeleeWeapon.GOLFCLUB,
      durationSeconds: 5,
      item: {
        key: MeleeWeapon.GOLFCLUB,
        grade: ItemGrade.BASE,
      } as MeleeWeaponItem,
      parts: [
        { key: Metal.COMMON_METAL, amount: 5 },
        { key: Wood.COMMON_WOOD, amount: 2 },
        { key: Scrap.COMMON_SCRAP, amount: 3 },
      ],
    },
    {
      key: MeleeWeapon.GOLFCLUB + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.GOLFCLUB,
        grade: ItemGrade.ONE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.GOLFCLUB, grade: ItemGrade.BASE } as MeleeWeaponItem,
        { key: Metal.UNCOMMON_METAL, amount: 8 },
        { key: Wood.UNCOMMON_WOOD, amount: 3 },
        { key: Scrap.UNCOMMON_SCRAP, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.GOLFCLUB + "+2",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.GOLFCLUB,
        grade: ItemGrade.TWO,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.GOLFCLUB, grade: ItemGrade.ONE } as MeleeWeaponItem,
        { key: Metal.RARE_METAL, amount: 12 },
        { key: Wood.RARE_WOOD, amount: 4 },
        { key: Scrap.RARE_SCRAP, amount: 7 },
      ],
    },
    {
      key: MeleeWeapon.GOLFCLUB + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.GOLFCLUB,
        grade: ItemGrade.THREE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.GOLFCLUB, grade: ItemGrade.TWO } as MeleeWeaponItem,
        { key: Metal.EPIC_METAL, amount: 15 },
        { key: Wood.EPIC_WOOD, amount: 5 },
        { key: Scrap.EPIC_SCRAP, amount: 10 },
      ],
    },
    {
      key: MeleeWeapon.GOLFCLUB + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.GOLFCLUB,
        grade: ItemGrade.FOUR,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.GOLFCLUB, grade: ItemGrade.THREE } as MeleeWeaponItem,
        { key: Metal.LEGENDARY_METAL, amount: 20 },
        { key: Wood.LEGENDARY_WOOD, amount: 7 },
        { key: Scrap.LEGENDARY_SCRAP, amount: 15 },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeapon.HAMMER,
  name: `${getItemName(MeleeWeapon.HAMMER)} blueprint`,
  description: `Lets you craft and upgrade ${getItemName(MeleeWeapon.HAMMER)}.`,
  recipes: [
    {
      key: MeleeWeapon.HAMMER,
      durationSeconds: 5,
      item: {
        key: MeleeWeapon.HAMMER,
        grade: ItemGrade.BASE,
      } as MeleeWeaponItem,
      parts: [
        { key: Metal.COMMON_METAL, amount: 5 },
        { key: Scrap.COMMON_SCRAP, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.HAMMER + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.HAMMER,
        grade: ItemGrade.ONE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.HAMMER, grade: ItemGrade.BASE } as MeleeWeaponItem,
        { key: Metal.UNCOMMON_METAL, amount: 10 },
        { key: Scrap.UNCOMMON_SCRAP, amount: 10 },
      ],
    },
    {
      key: MeleeWeapon.HAMMER + "+2",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.HAMMER,
        grade: ItemGrade.TWO,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.HAMMER, grade: ItemGrade.ONE } as MeleeWeaponItem,
        { key: Metal.RARE_METAL, amount: 15 },
        { key: Scrap.RARE_SCRAP, amount: 15 },
      ],
    },
    {
      key: MeleeWeapon.HAMMER + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.HAMMER,
        grade: ItemGrade.THREE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.HAMMER, grade: ItemGrade.TWO } as MeleeWeaponItem,
        { key: Metal.EPIC_METAL, amount: 20 },
        { key: Scrap.EPIC_SCRAP, amount: 20 },
      ],
    },
    {
      key: MeleeWeapon.HAMMER + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.HAMMER,
        grade: ItemGrade.FOUR,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.HAMMER, grade: ItemGrade.THREE } as MeleeWeaponItem,
        { key: Metal.LEGENDARY_METAL, amount: 25 },
        { key: Scrap.LEGENDARY_SCRAP, amount: 25 },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeaponBlueprint.KNIFE,
  name: `${getItemName(MeleeWeapon.KNIFE)} blueprint`,
  description: `Lets you craft and upgrade ${getItemName(MeleeWeapon.KNIFE)}.`,
  recipes: [
    {
      key: MeleeWeapon.KNIFE,
      durationSeconds: 5,
      item: {
        key: MeleeWeapon.KNIFE,
        grade: ItemGrade.BASE,
      } as MeleeWeaponItem,
      parts: [
        { key: Metal.COMMON_METAL, amount: 5 },
        { key: Wood.COMMON_WOOD, amount: 2 },
        { key: Scrap.COMMON_SCRAP, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.KNIFE + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.KNIFE,
        grade: ItemGrade.ONE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.KNIFE, grade: ItemGrade.BASE } as MeleeWeaponItem,
        { key: Metal.UNCOMMON_METAL, amount: 5 },
        { key: Wood.UNCOMMON_WOOD, amount: 2 },
        { key: Scrap.UNCOMMON_SCRAP, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.KNIFE + "+2",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.KNIFE,
        grade: ItemGrade.TWO,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.KNIFE, grade: ItemGrade.ONE } as MeleeWeaponItem,
        { key: Metal.RARE_METAL, amount: 5 },
        { key: Wood.RARE_WOOD, amount: 2 },
        { key: Scrap.RARE_SCRAP, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.KNIFE + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.KNIFE,
        grade: ItemGrade.THREE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.KNIFE, grade: ItemGrade.TWO } as MeleeWeaponItem,
        { key: Metal.EPIC_METAL, amount: 5 },
        { key: Wood.EPIC_WOOD, amount: 2 },
        { key: Scrap.EPIC_SCRAP, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.KNIFE + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.KNIFE,
        grade: ItemGrade.FOUR,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.KNIFE, grade: ItemGrade.THREE } as MeleeWeaponItem,
        { key: Metal.LEGENDARY_METAL, amount: 5 },
        { key: Wood.LEGENDARY_WOOD, amount: 2 },
        { key: Scrap.LEGENDARY_SCRAP, amount: 5 },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeaponBlueprint.KNUCKLE,
  name: `${getItemName(MeleeWeapon.KNUCKLE)} blueprint`,
  description: `Lets you craft and upgrade ${getItemName(MeleeWeapon.KNUCKLE)}.`,
  recipes: [
    {
      key: MeleeWeapon.KNUCKLE,
      durationSeconds: 5,
      item: {
        key: MeleeWeapon.KNUCKLE,
        grade: ItemGrade.BASE,
      } as MeleeWeaponItem,
      parts: [
        { key: Metal.COMMON_METAL, amount: 5 },
        { key: Scrap.COMMON_SCRAP, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.KNUCKLE + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.KNUCKLE,
        grade: ItemGrade.ONE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.KNUCKLE, grade: ItemGrade.BASE } as MeleeWeaponItem,
        { key: Metal.UNCOMMON_METAL, amount: 5 },
        { key: Scrap.UNCOMMON_SCRAP, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.KNUCKLE + "+2",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.KNUCKLE,
        grade: ItemGrade.TWO,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.KNUCKLE, grade: ItemGrade.ONE } as MeleeWeaponItem,
        { key: Metal.RARE_METAL, amount: 10 },
        { key: Scrap.RARE_SCRAP, amount: 10 },
      ],
    },
    {
      key: MeleeWeapon.KNUCKLE + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.KNUCKLE,
        grade: ItemGrade.THREE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.KNUCKLE, grade: ItemGrade.TWO } as MeleeWeaponItem,
        { key: Metal.EPIC_METAL, amount: 15 },
        { key: Scrap.EPIC_SCRAP, amount: 15 },
      ],
    },
    {
      key: MeleeWeapon.KNUCKLE + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.KNUCKLE,
        grade: ItemGrade.FOUR,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.KNUCKLE, grade: ItemGrade.THREE } as MeleeWeaponItem,
        { key: Metal.LEGENDARY_METAL, amount: 20 },
        { key: Scrap.LEGENDARY_SCRAP, amount: 20 },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeaponBlueprint.MACHETE,
  name: `${getItemName(MeleeWeapon.MACHETE)} blueprint`,
  description: `Lets you craft and upgrade ${getItemName(MeleeWeapon.MACHETE)}.`,
  recipes: [
    {
      key: MeleeWeapon.MACHETE,
      durationSeconds: 5,
      item: {
        key: MeleeWeapon.MACHETE,
        grade: ItemGrade.BASE,
      } as MeleeWeaponItem,
      parts: [
        { key: Metal.COMMON_METAL, amount: 5 },
        { key: Wood.COMMON_WOOD, amount: 3 },
        { key: Scrap.COMMON_SCRAP, amount: 2 },
      ],
    },
    {
      key: MeleeWeapon.MACHETE + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.MACHETE,
        grade: ItemGrade.ONE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.MACHETE, grade: ItemGrade.BASE } as MeleeWeaponItem,
        { key: Metal.UNCOMMON_METAL, amount: 6 },
        { key: Wood.UNCOMMON_WOOD, amount: 4 },
        { key: Scrap.UNCOMMON_SCRAP, amount: 3 },
      ],
    },
    {
      key: MeleeWeapon.MACHETE + "+2",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.MACHETE,
        grade: ItemGrade.TWO,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.MACHETE, grade: ItemGrade.ONE } as MeleeWeaponItem,
        { key: Metal.RARE_METAL, amount: 7 },
        { key: Wood.RARE_WOOD, amount: 5 },
        { key: Scrap.RARE_SCRAP, amount: 4 },
      ],
    },
    {
      key: MeleeWeapon.MACHETE + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.MACHETE,
        grade: ItemGrade.THREE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.MACHETE, grade: ItemGrade.TWO } as MeleeWeaponItem,
        { key: Metal.EPIC_METAL, amount: 8 },
        { key: Wood.EPIC_WOOD, amount: 6 },
        { key: Scrap.EPIC_SCRAP, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.MACHETE + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.MACHETE,
        grade: ItemGrade.FOUR,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.MACHETE, grade: ItemGrade.THREE } as MeleeWeaponItem,
        { key: Metal.LEGENDARY_METAL, amount: 9 },
        { key: Wood.LEGENDARY_WOOD, amount: 7 },
        { key: Scrap.LEGENDARY_SCRAP, amount: 6 },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeaponBlueprint.NIGHTSTICK,
  name: `${getItemName(MeleeWeapon.NIGHTSTICK)} blueprint`,
  description: `Lets you craft and upgrade ${getItemName(MeleeWeapon.NIGHTSTICK)}.`,
  recipes: [
    {
      key: MeleeWeapon.NIGHTSTICK,
      durationSeconds: 5,
      item: {
        key: MeleeWeapon.NIGHTSTICK,
        grade: ItemGrade.BASE,
      } as MeleeWeaponItem,
      parts: [
        { key: Wood.COMMON_WOOD, amount: 10 },
        { key: Metal.COMMON_METAL, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.NIGHTSTICK + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.NIGHTSTICK,
        grade: ItemGrade.ONE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.NIGHTSTICK, grade: ItemGrade.BASE } as MeleeWeaponItem,
        { key: Wood.UNCOMMON_WOOD, amount: 10 },
        { key: Metal.UNCOMMON_METAL, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.NIGHTSTICK + "+2",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.NIGHTSTICK,
        grade: ItemGrade.TWO,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.NIGHTSTICK, grade: ItemGrade.ONE } as MeleeWeaponItem,
        { key: Wood.RARE_WOOD, amount: 10 },
        { key: Metal.RARE_METAL, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.NIGHTSTICK + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.NIGHTSTICK,
        grade: ItemGrade.THREE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.NIGHTSTICK, grade: ItemGrade.TWO } as MeleeWeaponItem,
        { key: Wood.EPIC_WOOD, amount: 10 },
        { key: Metal.EPIC_METAL, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.NIGHTSTICK + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.NIGHTSTICK,
        grade: ItemGrade.FOUR,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.NIGHTSTICK, grade: ItemGrade.THREE } as MeleeWeaponItem,
        { key: Wood.LEGENDARY_WOOD, amount: 10 },
        { key: Metal.LEGENDARY_METAL, amount: 5 },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeapon.PIPEWRENCH,
  name: `${getItemName(MeleeWeapon.PIPEWRENCH)} blueprint`,
  description: `Lets you craft and upgrade ${getItemName(MeleeWeapon.PIPEWRENCH)}.`,
  recipes: [
    {
      key: MeleeWeapon.PIPEWRENCH,
      durationSeconds: 5,
      item: {
        key: MeleeWeapon.PIPEWRENCH,
        grade: ItemGrade.BASE,
      } as MeleeWeaponItem,
      parts: [
        { key: Metal.COMMON_METAL, amount: 5 },
        { key: Scrap.COMMON_SCRAP, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.PIPEWRENCH + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.PIPEWRENCH,
        grade: ItemGrade.ONE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.PIPEWRENCH, grade: ItemGrade.BASE } as MeleeWeaponItem,
        { key: Metal.UNCOMMON_METAL, amount: 8 },
        { key: Scrap.UNCOMMON_SCRAP, amount: 8 },
      ],
    },
    {
      key: MeleeWeapon.PIPEWRENCH + "+2",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.PIPEWRENCH,
        grade: ItemGrade.TWO,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.PIPEWRENCH, grade: ItemGrade.ONE } as MeleeWeaponItem,
        { key: Metal.RARE_METAL, amount: 12 },
        { key: Scrap.RARE_SCRAP, amount: 12 },
      ],
    },
    {
      key: MeleeWeapon.PIPEWRENCH + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.PIPEWRENCH,
        grade: ItemGrade.THREE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.PIPEWRENCH, grade: ItemGrade.TWO } as MeleeWeaponItem,
        { key: Metal.EPIC_METAL, amount: 15 },
        { key: Scrap.EPIC_SCRAP, amount: 15 },
      ],
    },
    {
      key: MeleeWeapon.PIPEWRENCH + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.PIPEWRENCH,
        grade: ItemGrade.FOUR,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.PIPEWRENCH, grade: ItemGrade.THREE } as MeleeWeaponItem,
        { key: Metal.LEGENDARY_METAL, amount: 20 },
        { key: Scrap.LEGENDARY_SCRAP, amount: 20 },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeaponBlueprint.POOLCUE,
  name: `${getItemName(MeleeWeapon.POOLCUE)} blueprint`,
  description: `Lets you craft and upgrade ${getItemName(MeleeWeapon.POOLCUE)}.`,
  recipes: [
    {
      key: MeleeWeapon.POOLCUE,
      durationSeconds: 5,
      item: {
        key: MeleeWeapon.POOLCUE,
        grade: ItemGrade.BASE,
      } as MeleeWeaponItem,
      parts: [
        { key: Wood.COMMON_WOOD, amount: 10 },
        { key: Scrap.COMMON_SCRAP, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.POOLCUE + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.POOLCUE,
        grade: ItemGrade.ONE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.POOLCUE, grade: ItemGrade.BASE } as MeleeWeaponItem,
        { key: Wood.UNCOMMON_WOOD, amount: 15 },
        { key: Scrap.UNCOMMON_SCRAP, amount: 10 },
      ],
    },
    {
      key: MeleeWeapon.POOLCUE + "+2",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.POOLCUE,
        grade: ItemGrade.TWO,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.POOLCUE, grade: ItemGrade.ONE } as MeleeWeaponItem,
        { key: Wood.RARE_WOOD, amount: 20 },
        { key: Metal.RARE_METAL, amount: 10 },
        { key: Scrap.RARE_SCRAP, amount: 15 },
      ],
    },
    {
      key: MeleeWeapon.POOLCUE + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.POOLCUE,
        grade: ItemGrade.THREE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.POOLCUE, grade: ItemGrade.TWO } as MeleeWeaponItem,
        { key: Wood.EPIC_WOOD, amount: 25 },
        { key: Metal.EPIC_METAL, amount: 15 },
        { key: Scrap.EPIC_SCRAP, amount: 20 },
      ],
    },
    {
      key: MeleeWeapon.POOLCUE + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.POOLCUE,
        grade: ItemGrade.FOUR,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.POOLCUE, grade: ItemGrade.THREE } as MeleeWeaponItem,
        { key: Wood.LEGENDARY_WOOD, amount: 30 },
        { key: Metal.LEGENDARY_METAL, amount: 20 },
        { key: Scrap.LEGENDARY_SCRAP, amount: 25 },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeaponBlueprint.STONEHATCHET,
  name: `${getItemName(MeleeWeapon.STONEHATCHET)} blueprint`,
  description: `Lets you craft and upgrade ${getItemName(MeleeWeapon.STONEHATCHET)}.`,
  recipes: [
    {
      key: MeleeWeapon.STONEHATCHET,
      durationSeconds: 5,
      item: {
        key: MeleeWeapon.STONEHATCHET,
        grade: ItemGrade.BASE,
      } as MeleeWeaponItem,
      parts: [
        { key: Metal.COMMON_METAL, amount: 10 },
        { key: Scrap.COMMON_SCRAP, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.STONEHATCHET + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.STONEHATCHET,
        grade: ItemGrade.ONE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.STONEHATCHET, grade: ItemGrade.BASE } as MeleeWeaponItem,
        { key: Metal.UNCOMMON_METAL, amount: 8 },
        { key: Scrap.UNCOMMON_SCRAP, amount: 4 },
      ],
    },
    {
      key: MeleeWeapon.STONEHATCHET + "+2",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.STONEHATCHET,
        grade: ItemGrade.TWO,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.STONEHATCHET, grade: ItemGrade.ONE } as MeleeWeaponItem,
        { key: Metal.RARE_METAL, amount: 6 },
        { key: Scrap.RARE_SCRAP, amount: 3 },
      ],
    },
    {
      key: MeleeWeapon.STONEHATCHET + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.STONEHATCHET,
        grade: ItemGrade.THREE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.STONEHATCHET, grade: ItemGrade.TWO } as MeleeWeaponItem,
        { key: Metal.EPIC_METAL, amount: 4 },
        { key: Scrap.EPIC_SCRAP, amount: 2 },
      ],
    },
    {
      key: MeleeWeapon.STONEHATCHET + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.STONEHATCHET,
        grade: ItemGrade.FOUR,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.STONEHATCHET, grade: ItemGrade.THREE } as MeleeWeaponItem,
        { key: Metal.LEGENDARY_METAL, amount: 2 },
        { key: Scrap.LEGENDARY_SCRAP, amount: 1 },
      ],
    },
  ],
});

registerBlueprint({
  key: MeleeWeaponBlueprint.SWITCHBLADE,
  name: `${getItemName(MeleeWeapon.SWITCHBLADE)} blueprint`,
  description: `Lets you craft and upgrade ${getItemName(MeleeWeapon.SWITCHBLADE)}.`,
  recipes: [
    {
      key: MeleeWeapon.SWITCHBLADE,
      durationSeconds: 5,
      item: {
        key: MeleeWeapon.SWITCHBLADE,
        grade: ItemGrade.BASE,
      } as MeleeWeaponItem,
      parts: [
        { key: Metal.COMMON_METAL, amount: 5 },
        { key: Wood.COMMON_WOOD, amount: 5 },
        { key: Scrap.COMMON_SCRAP, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.SWITCHBLADE + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.SWITCHBLADE,
        grade: ItemGrade.ONE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.SWITCHBLADE, grade: ItemGrade.BASE } as MeleeWeaponItem,
        { key: Metal.UNCOMMON_METAL, amount: 5 },
        { key: Wood.UNCOMMON_WOOD, amount: 5 },
        { key: Scrap.UNCOMMON_SCRAP, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.SWITCHBLADE + "+2",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.SWITCHBLADE,
        grade: ItemGrade.TWO,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.SWITCHBLADE, grade: ItemGrade.ONE } as MeleeWeaponItem,
        { key: Metal.RARE_METAL, amount: 5 },
        { key: Wood.RARE_WOOD, amount: 5 },
        { key: Scrap.RARE_SCRAP, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.SWITCHBLADE + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.SWITCHBLADE,
        grade: ItemGrade.THREE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.SWITCHBLADE, grade: ItemGrade.TWO } as MeleeWeaponItem,
        { key: Metal.EPIC_METAL, amount: 5 },
        { key: Wood.EPIC_WOOD, amount: 5 },
        { key: Scrap.EPIC_SCRAP, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.SWITCHBLADE + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.SWITCHBLADE,
        grade: ItemGrade.FOUR,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.SWITCHBLADE, grade: ItemGrade.THREE } as MeleeWeaponItem,
        { key: Metal.LEGENDARY_METAL, amount: 5 },
        { key: Wood.LEGENDARY_WOOD, amount: 5 },
        { key: Scrap.LEGENDARY_SCRAP, amount: 5 },
      ],
    },
  ],
});
