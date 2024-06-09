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
        grade: ItemGrade.COMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: Wood.WOOD, grade: ItemGrade.COMMON, amount: 10 },
        { key: Scrap.SCRAP, grade: ItemGrade.COMMON, amount: 2 },
      ],
    },
    {
      key: MeleeWeapon.BAT + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.BAT,
        grade: ItemGrade.UNCOMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.BAT, grade: ItemGrade.COMMON } as MeleeWeaponItem,
        { key: Wood.WOOD, grade: ItemGrade.UNCOMMON, amount: 10 },
        { key: Scrap.SCRAP, grade: ItemGrade.UNCOMMON, amount: 2 },
      ],
      levelRequired: 5,
    },
    {
      key: MeleeWeapon.BAT + "+2",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.BAT,
        grade: ItemGrade.RARE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.BAT, grade: ItemGrade.UNCOMMON } as MeleeWeaponItem,
        { key: Wood.WOOD, grade: ItemGrade.RARE, amount: 10 },
        { key: Scrap.SCRAP, grade: ItemGrade.RARE, amount: 2 },
      ],
      levelRequired: 10,
    },
    {
      key: MeleeWeapon.BAT + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.BAT,
        grade: ItemGrade.EPIC,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.BAT, grade: ItemGrade.RARE } as MeleeWeaponItem,
        { key: Wood.WOOD, grade: ItemGrade.EPIC, amount: 10 },
        { key: Scrap.SCRAP, grade: ItemGrade.EPIC, amount: 2 },
      ],
      levelRequired: 15,
    },
    {
      key: MeleeWeapon.BAT + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.BAT,
        grade: ItemGrade.LEGENDARY,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.BAT, grade: ItemGrade.EPIC } as MeleeWeaponItem,
        { key: Wood.WOOD, grade: ItemGrade.LEGENDARY, amount: 10 },
        { key: Scrap.SCRAP, grade: ItemGrade.LEGENDARY, amount: 2 },
      ],
      levelRequired: 20,
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
        grade: ItemGrade.COMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: Metal.METAL, grade: ItemGrade.COMMON, amount: 10 },
        { key: Wood.WOOD, grade: ItemGrade.COMMON, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.BATTLEAXE + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.BATTLEAXE,
        grade: ItemGrade.UNCOMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.BATTLEAXE, grade: ItemGrade.COMMON } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.UNCOMMON, amount: 10 },
        { key: Wood.WOOD, grade: ItemGrade.UNCOMMON, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.BATTLEAXE + "+2",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.BATTLEAXE,
        grade: ItemGrade.RARE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.BATTLEAXE, grade: ItemGrade.UNCOMMON } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.RARE, amount: 10 },
        { key: Wood.WOOD, grade: ItemGrade.RARE, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.BATTLEAXE + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.BATTLEAXE,
        grade: ItemGrade.EPIC,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.BATTLEAXE, grade: ItemGrade.RARE } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.EPIC, amount: 10 },
        { key: Wood.WOOD, grade: ItemGrade.EPIC, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.BATTLEAXE + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.BATTLEAXE,
        grade: ItemGrade.LEGENDARY,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.BATTLEAXE, grade: ItemGrade.EPIC } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.LEGENDARY, amount: 10 },
        { key: Wood.WOOD, grade: ItemGrade.LEGENDARY, amount: 5 },
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
        grade: ItemGrade.COMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: Metal.METAL, grade: ItemGrade.COMMON, amount: 2 },
        { key: Scrap.SCRAP, grade: ItemGrade.COMMON, amount: 3 },
      ],
    },
    {
      key: MeleeWeapon.BOTTLE + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.BOTTLE,
        grade: ItemGrade.UNCOMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.BOTTLE, grade: ItemGrade.COMMON } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.UNCOMMON, amount: 3 },
        { key: Scrap.SCRAP, grade: ItemGrade.UNCOMMON, amount: 4 },
      ],
    },
    {
      key: MeleeWeapon.BOTTLE + "+2",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.BOTTLE,
        grade: ItemGrade.RARE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.BOTTLE, grade: ItemGrade.UNCOMMON } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.RARE, amount: 4 },
        { key: Scrap.SCRAP, grade: ItemGrade.RARE, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.BOTTLE + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.BOTTLE,
        grade: ItemGrade.EPIC,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.BOTTLE, grade: ItemGrade.RARE } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.EPIC, amount: 5 },
        { key: Scrap.SCRAP, grade: ItemGrade.EPIC, amount: 6 },
      ],
    },
    {
      key: MeleeWeapon.BOTTLE + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.BOTTLE,
        grade: ItemGrade.LEGENDARY,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.BOTTLE, grade: ItemGrade.EPIC } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.LEGENDARY, amount: 6 },
        { key: Scrap.SCRAP, grade: ItemGrade.LEGENDARY, amount: 7 },
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
        grade: ItemGrade.COMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: Metal.METAL, grade: ItemGrade.COMMON, amount: 10 },
        { key: Scrap.SCRAP, grade: ItemGrade.COMMON, amount: 3 },
      ],
    },
    {
      key: MeleeWeapon.CROWBAR + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.CROWBAR,
        grade: ItemGrade.UNCOMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.CROWBAR, grade: ItemGrade.COMMON } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.UNCOMMON, amount: 10 },
        { key: Scrap.SCRAP, grade: ItemGrade.UNCOMMON, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.CROWBAR + "+2",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.CROWBAR,
        grade: ItemGrade.RARE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.CROWBAR, grade: ItemGrade.UNCOMMON } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.RARE, amount: 10 },
        { key: Scrap.SCRAP, grade: ItemGrade.RARE, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.CROWBAR + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.CROWBAR,
        grade: ItemGrade.EPIC,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.CROWBAR, grade: ItemGrade.RARE } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.EPIC, amount: 10 },
        { key: Scrap.SCRAP, grade: ItemGrade.EPIC, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.CROWBAR + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.CROWBAR,
        grade: ItemGrade.LEGENDARY,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.CROWBAR, grade: ItemGrade.EPIC } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.LEGENDARY, amount: 10 },
        { key: Scrap.SCRAP, grade: ItemGrade.LEGENDARY, amount: 5 },
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
        grade: ItemGrade.COMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: Metal.METAL, grade: ItemGrade.COMMON, amount: 5 },
        { key: Wood.WOOD, grade: ItemGrade.COMMON, amount: 2 },
        { key: Scrap.SCRAP, grade: ItemGrade.COMMON, amount: 3 },
      ],
    },
    {
      key: MeleeWeapon.DAGGER + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.DAGGER,
        grade: ItemGrade.UNCOMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.DAGGER, grade: ItemGrade.COMMON } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.UNCOMMON, amount: 5 },
        { key: Wood.WOOD, grade: ItemGrade.UNCOMMON, amount: 2 },
        {
          key: Scrap.SCRAP,
          grade: ItemGrade.UNCOMMON,
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
        grade: ItemGrade.RARE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.DAGGER, grade: ItemGrade.UNCOMMON } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.RARE, amount: 5 },
        { key: Wood.WOOD, grade: ItemGrade.RARE, amount: 2 },
        { key: Scrap.SCRAP, grade: ItemGrade.RARE, amount: 3 },
      ],
    },
    {
      key: MeleeWeapon.DAGGER + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.DAGGER,
        grade: ItemGrade.EPIC,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.DAGGER, grade: ItemGrade.RARE } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.EPIC, amount: 5 },
        { key: Wood.WOOD, grade: ItemGrade.EPIC, amount: 2 },
        { key: Scrap.SCRAP, grade: ItemGrade.EPIC, amount: 3 },
      ],
    },
    {
      key: MeleeWeapon.DAGGER + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.DAGGER,
        grade: ItemGrade.LEGENDARY,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.DAGGER, grade: ItemGrade.EPIC } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.LEGENDARY, amount: 5 },
        { key: Wood.WOOD, grade: ItemGrade.LEGENDARY, amount: 2 },
        { key: Scrap.SCRAP, grade: ItemGrade.LEGENDARY, amount: 3 },
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
        grade: ItemGrade.COMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: Metal.METAL, grade: ItemGrade.COMMON, amount: 5 },
        { key: Wood.WOOD, grade: ItemGrade.COMMON, amount: 2 },
        { key: Scrap.SCRAP, grade: ItemGrade.COMMON, amount: 3 },
      ],
    },
    {
      key: MeleeWeapon.GOLFCLUB + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.GOLFCLUB,
        grade: ItemGrade.UNCOMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.GOLFCLUB, grade: ItemGrade.COMMON } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.UNCOMMON, amount: 8 },
        { key: Wood.WOOD, grade: ItemGrade.UNCOMMON, amount: 3 },
        { key: Scrap.SCRAP, grade: ItemGrade.UNCOMMON, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.GOLFCLUB + "+2",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.GOLFCLUB,
        grade: ItemGrade.RARE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.GOLFCLUB, grade: ItemGrade.UNCOMMON } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.RARE, amount: 12 },
        { key: Wood.WOOD, grade: ItemGrade.RARE, amount: 4 },
        { key: Scrap.SCRAP, grade: ItemGrade.RARE, amount: 7 },
      ],
    },
    {
      key: MeleeWeapon.GOLFCLUB + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.GOLFCLUB,
        grade: ItemGrade.EPIC,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.GOLFCLUB, grade: ItemGrade.RARE } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.EPIC, amount: 15 },
        { key: Wood.WOOD, grade: ItemGrade.EPIC, amount: 5 },
        { key: Scrap.SCRAP, grade: ItemGrade.EPIC, amount: 10 },
      ],
    },
    {
      key: MeleeWeapon.GOLFCLUB + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.GOLFCLUB,
        grade: ItemGrade.LEGENDARY,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.GOLFCLUB, grade: ItemGrade.EPIC } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.LEGENDARY, amount: 20 },
        { key: Wood.WOOD, grade: ItemGrade.LEGENDARY, amount: 7 },
        { key: Scrap.SCRAP, grade: ItemGrade.LEGENDARY, amount: 15 },
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
        grade: ItemGrade.COMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: Metal.METAL, grade: ItemGrade.COMMON, amount: 5 },
        { key: Scrap.SCRAP, grade: ItemGrade.COMMON, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.HAMMER + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.HAMMER,
        grade: ItemGrade.UNCOMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.HAMMER, grade: ItemGrade.COMMON } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.UNCOMMON, amount: 10 },
        { key: Scrap.SCRAP, grade: ItemGrade.UNCOMMON, amount: 10 },
      ],
    },
    {
      key: MeleeWeapon.HAMMER + "+2",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.HAMMER,
        grade: ItemGrade.RARE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.HAMMER, grade: ItemGrade.UNCOMMON } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.RARE, amount: 15 },
        { key: Scrap.SCRAP, grade: ItemGrade.RARE, amount: 15 },
      ],
    },
    {
      key: MeleeWeapon.HAMMER + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.HAMMER,
        grade: ItemGrade.EPIC,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.HAMMER, grade: ItemGrade.RARE } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.EPIC, amount: 20 },
        { key: Scrap.SCRAP, grade: ItemGrade.EPIC, amount: 20 },
      ],
    },
    {
      key: MeleeWeapon.HAMMER + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.HAMMER,
        grade: ItemGrade.LEGENDARY,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.HAMMER, grade: ItemGrade.EPIC } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.LEGENDARY, amount: 25 },
        { key: Scrap.SCRAP, grade: ItemGrade.LEGENDARY, amount: 25 },
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
        grade: ItemGrade.COMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: Metal.METAL, grade: ItemGrade.COMMON, amount: 5 },
        { key: Wood.WOOD, grade: ItemGrade.COMMON, amount: 2 },
        { key: Scrap.SCRAP, grade: ItemGrade.COMMON, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.KNIFE + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.KNIFE,
        grade: ItemGrade.UNCOMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.KNIFE, grade: ItemGrade.COMMON } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.UNCOMMON, amount: 5 },
        { key: Wood.WOOD, grade: ItemGrade.UNCOMMON, amount: 2 },
        { key: Scrap.SCRAP, grade: ItemGrade.UNCOMMON, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.KNIFE + "+2",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.KNIFE,
        grade: ItemGrade.RARE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.KNIFE, grade: ItemGrade.UNCOMMON } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.RARE, amount: 5 },
        { key: Wood.WOOD, grade: ItemGrade.RARE, amount: 2 },
        { key: Scrap.SCRAP, grade: ItemGrade.RARE, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.KNIFE + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.KNIFE,
        grade: ItemGrade.EPIC,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.KNIFE, grade: ItemGrade.RARE } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.EPIC, amount: 5 },
        { key: Wood.WOOD, grade: ItemGrade.EPIC, amount: 2 },
        { key: Scrap.SCRAP, grade: ItemGrade.EPIC, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.KNIFE + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.KNIFE,
        grade: ItemGrade.LEGENDARY,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.KNIFE, grade: ItemGrade.EPIC } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.LEGENDARY, amount: 5 },
        { key: Wood.WOOD, grade: ItemGrade.LEGENDARY, amount: 2 },
        { key: Scrap.SCRAP, grade: ItemGrade.LEGENDARY, amount: 5 },
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
        grade: ItemGrade.COMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: Metal.METAL, grade: ItemGrade.COMMON, amount: 5 },
        { key: Scrap.SCRAP, grade: ItemGrade.COMMON, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.KNUCKLE + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.KNUCKLE,
        grade: ItemGrade.UNCOMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.KNUCKLE, grade: ItemGrade.COMMON } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.UNCOMMON, amount: 5 },
        { key: Scrap.SCRAP, grade: ItemGrade.UNCOMMON, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.KNUCKLE + "+2",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.KNUCKLE,
        grade: ItemGrade.RARE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.KNUCKLE, grade: ItemGrade.UNCOMMON } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.RARE, amount: 10 },
        { key: Scrap.SCRAP, grade: ItemGrade.RARE, amount: 10 },
      ],
    },
    {
      key: MeleeWeapon.KNUCKLE + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.KNUCKLE,
        grade: ItemGrade.EPIC,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.KNUCKLE, grade: ItemGrade.RARE } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.EPIC, amount: 15 },
        { key: Scrap.SCRAP, grade: ItemGrade.EPIC, amount: 15 },
      ],
    },
    {
      key: MeleeWeapon.KNUCKLE + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.KNUCKLE,
        grade: ItemGrade.LEGENDARY,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.KNUCKLE, grade: ItemGrade.EPIC } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.LEGENDARY, amount: 20 },
        { key: Scrap.SCRAP, grade: ItemGrade.LEGENDARY, amount: 20 },
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
        grade: ItemGrade.COMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: Metal.METAL, grade: ItemGrade.COMMON, amount: 5 },
        { key: Wood.WOOD, grade: ItemGrade.COMMON, amount: 3 },
        { key: Scrap.SCRAP, grade: ItemGrade.COMMON, amount: 2 },
      ],
    },
    {
      key: MeleeWeapon.MACHETE + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.MACHETE,
        grade: ItemGrade.UNCOMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.MACHETE, grade: ItemGrade.COMMON } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.UNCOMMON, amount: 6 },
        { key: Wood.WOOD, grade: ItemGrade.UNCOMMON, amount: 4 },
        { key: Scrap.SCRAP, grade: ItemGrade.UNCOMMON, amount: 3 },
      ],
    },
    {
      key: MeleeWeapon.MACHETE + "+2",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.MACHETE,
        grade: ItemGrade.RARE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.MACHETE, grade: ItemGrade.UNCOMMON } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.RARE, amount: 7 },
        { key: Wood.WOOD, grade: ItemGrade.RARE, amount: 5 },
        { key: Scrap.SCRAP, grade: ItemGrade.RARE, amount: 4 },
      ],
    },
    {
      key: MeleeWeapon.MACHETE + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.MACHETE,
        grade: ItemGrade.EPIC,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.MACHETE, grade: ItemGrade.RARE } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.EPIC, amount: 8 },
        { key: Wood.WOOD, grade: ItemGrade.EPIC, amount: 6 },
        { key: Scrap.SCRAP, grade: ItemGrade.EPIC, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.MACHETE + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.MACHETE,
        grade: ItemGrade.LEGENDARY,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.MACHETE, grade: ItemGrade.EPIC } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.LEGENDARY, amount: 9 },
        { key: Wood.WOOD, grade: ItemGrade.LEGENDARY, amount: 7 },
        { key: Scrap.SCRAP, grade: ItemGrade.LEGENDARY, amount: 6 },
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
        grade: ItemGrade.COMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: Wood.WOOD, grade: ItemGrade.COMMON, amount: 10 },
        { key: Metal.METAL, grade: ItemGrade.COMMON, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.NIGHTSTICK + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.NIGHTSTICK,
        grade: ItemGrade.UNCOMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.NIGHTSTICK, grade: ItemGrade.COMMON } as MeleeWeaponItem,
        { key: Wood.WOOD, grade: ItemGrade.UNCOMMON, amount: 10 },
        { key: Metal.METAL, grade: ItemGrade.UNCOMMON, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.NIGHTSTICK + "+2",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.NIGHTSTICK,
        grade: ItemGrade.RARE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.NIGHTSTICK, grade: ItemGrade.UNCOMMON } as MeleeWeaponItem,
        { key: Wood.WOOD, grade: ItemGrade.RARE, amount: 10 },
        { key: Metal.METAL, grade: ItemGrade.RARE, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.NIGHTSTICK + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.NIGHTSTICK,
        grade: ItemGrade.EPIC,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.NIGHTSTICK, grade: ItemGrade.RARE } as MeleeWeaponItem,
        { key: Wood.WOOD, grade: ItemGrade.EPIC, amount: 10 },
        { key: Metal.METAL, grade: ItemGrade.EPIC, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.NIGHTSTICK + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.NIGHTSTICK,
        grade: ItemGrade.LEGENDARY,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.NIGHTSTICK, grade: ItemGrade.EPIC } as MeleeWeaponItem,
        { key: Wood.WOOD, grade: ItemGrade.LEGENDARY, amount: 10 },
        { key: Metal.METAL, grade: ItemGrade.LEGENDARY, amount: 5 },
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
        grade: ItemGrade.COMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: Metal.METAL, grade: ItemGrade.COMMON, amount: 5 },
        { key: Scrap.SCRAP, grade: ItemGrade.COMMON, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.PIPEWRENCH + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.PIPEWRENCH,
        grade: ItemGrade.UNCOMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.PIPEWRENCH, grade: ItemGrade.COMMON } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.UNCOMMON, amount: 8 },
        { key: Scrap.SCRAP, grade: ItemGrade.UNCOMMON, amount: 8 },
      ],
    },
    {
      key: MeleeWeapon.PIPEWRENCH + "+2",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.PIPEWRENCH,
        grade: ItemGrade.RARE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.PIPEWRENCH, grade: ItemGrade.UNCOMMON } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.RARE, amount: 12 },
        { key: Scrap.SCRAP, grade: ItemGrade.RARE, amount: 12 },
      ],
    },
    {
      key: MeleeWeapon.PIPEWRENCH + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.PIPEWRENCH,
        grade: ItemGrade.EPIC,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.PIPEWRENCH, grade: ItemGrade.RARE } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.EPIC, amount: 15 },
        { key: Scrap.SCRAP, grade: ItemGrade.EPIC, amount: 15 },
      ],
    },
    {
      key: MeleeWeapon.PIPEWRENCH + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.PIPEWRENCH,
        grade: ItemGrade.LEGENDARY,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.PIPEWRENCH, grade: ItemGrade.EPIC } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.LEGENDARY, amount: 20 },
        { key: Scrap.SCRAP, grade: ItemGrade.LEGENDARY, amount: 20 },
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
        grade: ItemGrade.COMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: Wood.WOOD, grade: ItemGrade.COMMON, amount: 10 },
        { key: Scrap.SCRAP, grade: ItemGrade.COMMON, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.POOLCUE + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.POOLCUE,
        grade: ItemGrade.UNCOMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.POOLCUE, grade: ItemGrade.COMMON } as MeleeWeaponItem,
        { key: Wood.WOOD, grade: ItemGrade.UNCOMMON, amount: 15 },
        { key: Scrap.SCRAP, grade: ItemGrade.UNCOMMON, amount: 10 },
      ],
    },
    {
      key: MeleeWeapon.POOLCUE + "+2",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.POOLCUE,
        grade: ItemGrade.RARE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.POOLCUE, grade: ItemGrade.UNCOMMON } as MeleeWeaponItem,
        { key: Wood.WOOD, grade: ItemGrade.RARE, amount: 20 },
        { key: Metal.METAL, grade: ItemGrade.RARE, amount: 10 },
        { key: Scrap.SCRAP, grade: ItemGrade.RARE, amount: 15 },
      ],
    },
    {
      key: MeleeWeapon.POOLCUE + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.POOLCUE,
        grade: ItemGrade.EPIC,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.POOLCUE, grade: ItemGrade.RARE } as MeleeWeaponItem,
        { key: Wood.WOOD, grade: ItemGrade.EPIC, amount: 25 },
        { key: Metal.METAL, grade: ItemGrade.EPIC, amount: 15 },
        { key: Scrap.SCRAP, grade: ItemGrade.EPIC, amount: 20 },
      ],
    },
    {
      key: MeleeWeapon.POOLCUE + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.POOLCUE,
        grade: ItemGrade.LEGENDARY,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.POOLCUE, grade: ItemGrade.EPIC } as MeleeWeaponItem,
        { key: Wood.WOOD, grade: ItemGrade.LEGENDARY, amount: 30 },
        { key: Metal.METAL, grade: ItemGrade.LEGENDARY, amount: 20 },
        { key: Scrap.SCRAP, grade: ItemGrade.LEGENDARY, amount: 25 },
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
        grade: ItemGrade.COMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: Metal.METAL, grade: ItemGrade.COMMON, amount: 10 },
        { key: Scrap.SCRAP, grade: ItemGrade.COMMON, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.STONEHATCHET + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.STONEHATCHET,
        grade: ItemGrade.UNCOMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.STONEHATCHET, grade: ItemGrade.COMMON } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.UNCOMMON, amount: 8 },
        { key: Scrap.SCRAP, grade: ItemGrade.UNCOMMON, amount: 4 },
      ],
    },
    {
      key: MeleeWeapon.STONEHATCHET + "+2",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.STONEHATCHET,
        grade: ItemGrade.RARE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.STONEHATCHET, grade: ItemGrade.UNCOMMON } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.RARE, amount: 6 },
        { key: Scrap.SCRAP, grade: ItemGrade.RARE, amount: 3 },
      ],
    },
    {
      key: MeleeWeapon.STONEHATCHET + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.STONEHATCHET,
        grade: ItemGrade.EPIC,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.STONEHATCHET, grade: ItemGrade.RARE } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.EPIC, amount: 4 },
        { key: Scrap.SCRAP, grade: ItemGrade.EPIC, amount: 2 },
      ],
    },
    {
      key: MeleeWeapon.STONEHATCHET + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.STONEHATCHET,
        grade: ItemGrade.LEGENDARY,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.STONEHATCHET, grade: ItemGrade.EPIC } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.LEGENDARY, amount: 2 },
        { key: Scrap.SCRAP, grade: ItemGrade.LEGENDARY, amount: 1 },
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
        grade: ItemGrade.COMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: Metal.METAL, grade: ItemGrade.COMMON, amount: 5 },
        { key: Wood.WOOD, grade: ItemGrade.COMMON, amount: 5 },
        { key: Scrap.SCRAP, grade: ItemGrade.COMMON, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.SWITCHBLADE + "+1",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.SWITCHBLADE,
        grade: ItemGrade.UNCOMMON,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.SWITCHBLADE, grade: ItemGrade.COMMON } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.UNCOMMON, amount: 5 },
        { key: Wood.WOOD, grade: ItemGrade.UNCOMMON, amount: 5 },
        { key: Scrap.SCRAP, grade: ItemGrade.UNCOMMON, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.SWITCHBLADE + "+2",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.SWITCHBLADE,
        grade: ItemGrade.RARE,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.SWITCHBLADE, grade: ItemGrade.UNCOMMON } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.RARE, amount: 5 },
        { key: Wood.WOOD, grade: ItemGrade.RARE, amount: 5 },
        { key: Scrap.SCRAP, grade: ItemGrade.RARE, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.SWITCHBLADE + "+3",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.SWITCHBLADE,
        grade: ItemGrade.EPIC,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.SWITCHBLADE, grade: ItemGrade.RARE } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.EPIC, amount: 5 },
        { key: Wood.WOOD, grade: ItemGrade.EPIC, amount: 5 },
        { key: Scrap.SCRAP, grade: ItemGrade.EPIC, amount: 5 },
      ],
    },
    {
      key: MeleeWeapon.SWITCHBLADE + "+4",
      isUpgrade: true,
      durationSeconds: 10,
      item: {
        key: MeleeWeapon.SWITCHBLADE,
        grade: ItemGrade.LEGENDARY,
      } as MeleeWeaponItem,
      parts: [
        { key: MeleeWeapon.SWITCHBLADE, grade: ItemGrade.EPIC } as MeleeWeaponItem,
        { key: Metal.METAL, grade: ItemGrade.LEGENDARY, amount: 5 },
        { key: Wood.WOOD, grade: ItemGrade.LEGENDARY, amount: 5 },
        { key: Scrap.SCRAP, grade: ItemGrade.LEGENDARY, amount: 5 },
      ],
    },
  ],
});
