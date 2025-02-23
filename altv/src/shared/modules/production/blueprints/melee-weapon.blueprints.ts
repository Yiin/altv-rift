import { makeKeys } from "@shared/utility/make-keys";
import { MeleeWeapon, MeleeWeaponItem } from "@shared/modules/items/registry/weapons/melee-weapon.items";
import { getItemName } from "@shared/modules/items/lib/get-item-name";
import { ItemGrade } from "@shared/modules/items/enums";
import { createItem } from "@shared/modules/items/lib/create-item";
import { Wood } from "@shared/modules/items/registry/materials/wood.items";
import { ItemComponents } from "@shared/modules/items/registry/materials/item-components.items";
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
        createItem(Wood.COMMON_WOOD, { amount: 10 }),
        createItem(ItemComponents.COMMON_ITEM_COMPONENTS, { amount: 2 }),
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
        createItem(MeleeWeapon.BAT, { grade: ItemGrade.COMMON } as MeleeWeaponItem),
        createItem(Wood.UNCOMMON_WOOD, { amount: 10 }),
        createItem(ItemComponents.UNCOMMON_ITEM_COMPONENTS, { amount: 2 }),
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
        createItem(MeleeWeapon.BAT, { grade: ItemGrade.UNCOMMON } as MeleeWeaponItem),
        createItem(Wood.RARE_WOOD, { amount: 10 }),
        createItem(ItemComponents.RARE_ITEM_COMPONENTS, { amount: 2 }),
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
        createItem(MeleeWeapon.BAT, { grade: ItemGrade.RARE } as MeleeWeaponItem),
        createItem(Wood.EPIC_WOOD, { amount: 10 }),
        createItem(ItemComponents.EPIC_ITEM_COMPONENTS, { amount: 2 }),
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
        createItem(MeleeWeapon.BAT, { grade: ItemGrade.EPIC } as MeleeWeaponItem),
        createItem(Wood.LEGENDARY_WOOD, { amount: 10 }),
        createItem(ItemComponents.LEGENDARY_ITEM_COMPONENTS, { amount: 2 }),
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
        createItem(Metal.COMMON_METAL, { amount: 10 }),
        createItem(Wood.COMMON_WOOD, { amount: 5 }),
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
        createItem(MeleeWeapon.BATTLEAXE, { grade: ItemGrade.COMMON } as MeleeWeaponItem),
        createItem(Metal.UNCOMMON_METAL, { amount: 10 }),
        createItem(Wood.UNCOMMON_WOOD, { amount: 5 }),
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
        createItem(MeleeWeapon.BATTLEAXE, { grade: ItemGrade.UNCOMMON } as MeleeWeaponItem),
        createItem(Metal.RARE_METAL, { amount: 10 }),
        createItem(Wood.RARE_WOOD, { amount: 5 }),
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
        createItem(MeleeWeapon.BATTLEAXE, { grade: ItemGrade.RARE } as MeleeWeaponItem),
        createItem(Metal.EPIC_METAL, { amount: 10 }),
        createItem(Wood.EPIC_WOOD, { amount: 5 }),
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
        createItem(MeleeWeapon.BATTLEAXE, { grade: ItemGrade.EPIC } as MeleeWeaponItem),
        createItem(Metal.LEGENDARY_METAL, { amount: 10 }),
        createItem(Wood.LEGENDARY_WOOD, { amount: 5 }),
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
        createItem(Metal.COMMON_METAL, { amount: 2 }),
        createItem(ItemComponents.COMMON_ITEM_COMPONENTS, { amount: 3 }),
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
        createItem(MeleeWeapon.BOTTLE, { grade: ItemGrade.COMMON } as MeleeWeaponItem),
        createItem(Metal.UNCOMMON_METAL, { amount: 3 }),
        createItem(ItemComponents.UNCOMMON_ITEM_COMPONENTS, { amount: 4 }),
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
        createItem(MeleeWeapon.BOTTLE, { grade: ItemGrade.UNCOMMON } as MeleeWeaponItem),
        createItem(Metal.RARE_METAL, { amount: 4 }),
        createItem(ItemComponents.RARE_ITEM_COMPONENTS, { amount: 5 }),
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
        createItem(MeleeWeapon.BOTTLE, { grade: ItemGrade.RARE } as MeleeWeaponItem),
        createItem(Metal.EPIC_METAL, { amount: 5 }),
        createItem(ItemComponents.EPIC_ITEM_COMPONENTS, { amount: 6 }),
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
        createItem(MeleeWeapon.BOTTLE, { grade: ItemGrade.EPIC } as MeleeWeaponItem),
        createItem(Metal.LEGENDARY_METAL, { amount: 6 }),
        createItem(ItemComponents.LEGENDARY_ITEM_COMPONENTS, { amount: 7 }),
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
        createItem(Metal.COMMON_METAL, { amount: 10 }),
        createItem(ItemComponents.COMMON_ITEM_COMPONENTS, { amount: 3 }),
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
        createItem(MeleeWeapon.CROWBAR, { grade: ItemGrade.COMMON } as MeleeWeaponItem),
        createItem(Metal.UNCOMMON_METAL, { amount: 10 }),
        createItem(ItemComponents.UNCOMMON_ITEM_COMPONENTS, { amount: 5 }),
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
        createItem(MeleeWeapon.CROWBAR, { grade: ItemGrade.UNCOMMON } as MeleeWeaponItem),
        createItem(Metal.RARE_METAL, { amount: 10 }),
        createItem(ItemComponents.RARE_ITEM_COMPONENTS, { amount: 5 }),
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
        createItem(MeleeWeapon.CROWBAR, { grade: ItemGrade.RARE } as MeleeWeaponItem),
        createItem(Metal.EPIC_METAL, { amount: 10 }),
        createItem(ItemComponents.EPIC_ITEM_COMPONENTS, { amount: 5 }),
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
        createItem(MeleeWeapon.CROWBAR, { grade: ItemGrade.EPIC } as MeleeWeaponItem),
        createItem(Metal.LEGENDARY_METAL, { amount: 10 }),
        createItem(ItemComponents.LEGENDARY_ITEM_COMPONENTS, { amount: 5 }),
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
        createItem(Metal.COMMON_METAL, { amount: 5 }),
        createItem(Wood.COMMON_WOOD, { amount: 2 }),
        createItem(ItemComponents.COMMON_ITEM_COMPONENTS, { amount: 3 }),
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
        createItem(MeleeWeapon.DAGGER, { grade: ItemGrade.COMMON } as MeleeWeaponItem),
        createItem(Metal.UNCOMMON_METAL, { amount: 5 }),
        createItem(Wood.UNCOMMON_WOOD, { amount: 2 }),
        createItem(ItemComponents.UNCOMMON_ITEM_COMPONENTS, { amount: 3 }),
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
        createItem(MeleeWeapon.DAGGER, { grade: ItemGrade.UNCOMMON } as MeleeWeaponItem),
        createItem(Metal.RARE_METAL, { amount: 5 }),
        createItem(Wood.RARE_WOOD, { amount: 2 }),
        createItem(ItemComponents.RARE_ITEM_COMPONENTS, { amount: 3 }),
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
        createItem(MeleeWeapon.DAGGER, { grade: ItemGrade.RARE } as MeleeWeaponItem),
        createItem(Metal.EPIC_METAL, { amount: 5 }),
        createItem(Wood.EPIC_WOOD, { amount: 2 }),
        createItem(ItemComponents.EPIC_ITEM_COMPONENTS, { amount: 3 }),
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
        createItem(MeleeWeapon.DAGGER, { grade: ItemGrade.EPIC } as MeleeWeaponItem),
        createItem(Metal.LEGENDARY_METAL, { amount: 5 }),
        createItem(Wood.LEGENDARY_WOOD, { amount: 2 }),
        createItem(ItemComponents.LEGENDARY_ITEM_COMPONENTS, { amount: 3 }),
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
        createItem(Metal.COMMON_METAL, { amount: 5 }),
        createItem(Wood.COMMON_WOOD, { amount: 2 }),
        createItem(ItemComponents.COMMON_ITEM_COMPONENTS, { amount: 3 }),
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
        createItem(MeleeWeapon.GOLFCLUB, { grade: ItemGrade.COMMON } as MeleeWeaponItem),
        createItem(Metal.UNCOMMON_METAL, { amount: 8 }),
        createItem(Wood.UNCOMMON_WOOD, { amount: 3 }),
        createItem(ItemComponents.UNCOMMON_ITEM_COMPONENTS, { amount: 5 }),
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
        createItem(MeleeWeapon.GOLFCLUB, { grade: ItemGrade.UNCOMMON } as MeleeWeaponItem),
        createItem(Metal.RARE_METAL, { amount: 12 }),
        createItem(Wood.RARE_WOOD, { amount: 4 }),
        createItem(ItemComponents.RARE_ITEM_COMPONENTS, { amount: 7 }),
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
        createItem(MeleeWeapon.GOLFCLUB, { grade: ItemGrade.RARE } as MeleeWeaponItem),
        createItem(Metal.EPIC_METAL, { amount: 15 }),
        createItem(Wood.EPIC_WOOD, { amount: 5 }),
        createItem(ItemComponents.EPIC_ITEM_COMPONENTS, { amount: 10 }),
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
        createItem(MeleeWeapon.GOLFCLUB, { grade: ItemGrade.EPIC } as MeleeWeaponItem),
        createItem(Metal.LEGENDARY_METAL, { amount: 20 }),
        createItem(Wood.LEGENDARY_WOOD, { amount: 7 }),
        createItem(ItemComponents.LEGENDARY_ITEM_COMPONENTS, { amount: 15 }),
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
        createItem(Metal.COMMON_METAL, { amount: 5 }),
        createItem(ItemComponents.COMMON_ITEM_COMPONENTS, { amount: 5 }),
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
        createItem(MeleeWeapon.HAMMER, { grade: ItemGrade.COMMON } as MeleeWeaponItem),
        createItem(Metal.UNCOMMON_METAL, { amount: 10 }),
        createItem(ItemComponents.UNCOMMON_ITEM_COMPONENTS, { amount: 10 }),
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
        createItem(MeleeWeapon.HAMMER, { grade: ItemGrade.UNCOMMON } as MeleeWeaponItem),
        createItem(Metal.RARE_METAL, { amount: 15 }),
        createItem(ItemComponents.RARE_ITEM_COMPONENTS, { amount: 15 }),
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
        createItem(MeleeWeapon.HAMMER, { grade: ItemGrade.RARE } as MeleeWeaponItem),
        createItem(Metal.EPIC_METAL, { amount: 20 }),
        createItem(ItemComponents.EPIC_ITEM_COMPONENTS, { amount: 20 }),
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
        createItem(MeleeWeapon.HAMMER, { grade: ItemGrade.EPIC } as MeleeWeaponItem),
        createItem(Metal.LEGENDARY_METAL, { amount: 25 }),
        createItem(ItemComponents.LEGENDARY_ITEM_COMPONENTS, { amount: 25 }),
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
        createItem(Metal.COMMON_METAL, { amount: 5 }),
        createItem(Wood.COMMON_WOOD, { amount: 2 }),
        createItem(ItemComponents.COMMON_ITEM_COMPONENTS, { amount: 5 }),
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
        createItem(MeleeWeapon.KNIFE, { grade: ItemGrade.COMMON } as MeleeWeaponItem),
        createItem(Metal.UNCOMMON_METAL, { amount: 5 }),
        createItem(Wood.UNCOMMON_WOOD, { amount: 2 }),
        createItem(ItemComponents.UNCOMMON_ITEM_COMPONENTS, { amount: 5 }),
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
        createItem(MeleeWeapon.KNIFE, { grade: ItemGrade.UNCOMMON } as MeleeWeaponItem),
        createItem(Metal.RARE_METAL, { amount: 5 }),
        createItem(Wood.RARE_WOOD, { amount: 2 }),
        createItem(ItemComponents.RARE_ITEM_COMPONENTS, { amount: 5 }),
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
        createItem(MeleeWeapon.KNIFE, { grade: ItemGrade.RARE } as MeleeWeaponItem),
        createItem(Metal.EPIC_METAL, { amount: 5 }),
        createItem(Wood.EPIC_WOOD, { amount: 2 }),
        createItem(ItemComponents.EPIC_ITEM_COMPONENTS, { amount: 5 }),
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
        createItem(MeleeWeapon.KNIFE, { grade: ItemGrade.EPIC } as MeleeWeaponItem),
        createItem(Metal.LEGENDARY_METAL, { amount: 5 }),
        createItem(Wood.LEGENDARY_WOOD, { amount: 2 }),
        createItem(ItemComponents.LEGENDARY_ITEM_COMPONENTS, { amount: 5 }),
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
        createItem(Metal.COMMON_METAL, { amount: 5 }),
        createItem(ItemComponents.COMMON_ITEM_COMPONENTS, { amount: 5 }),
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
        createItem(MeleeWeapon.KNUCKLE, { grade: ItemGrade.COMMON } as MeleeWeaponItem),
        createItem(Metal.UNCOMMON_METAL, { amount: 5 }),
        createItem(ItemComponents.UNCOMMON_ITEM_COMPONENTS, { amount: 5 }),
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
        createItem(MeleeWeapon.KNUCKLE, { grade: ItemGrade.UNCOMMON } as MeleeWeaponItem),
        createItem(Metal.RARE_METAL, { amount: 10 }),
        createItem(ItemComponents.RARE_ITEM_COMPONENTS, { amount: 10 }),
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
        createItem(MeleeWeapon.KNUCKLE, { grade: ItemGrade.RARE } as MeleeWeaponItem),
        createItem(Metal.EPIC_METAL, { amount: 15 }),
        createItem(ItemComponents.EPIC_ITEM_COMPONENTS, { amount: 15 }),
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
        createItem(MeleeWeapon.KNUCKLE, { grade: ItemGrade.EPIC } as MeleeWeaponItem),
        createItem(Metal.LEGENDARY_METAL, { amount: 20 }),
        createItem(ItemComponents.LEGENDARY_ITEM_COMPONENTS, { amount: 20 }),
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
        createItem(Metal.COMMON_METAL, { amount: 5 }),
        createItem(Wood.COMMON_WOOD, { amount: 3 }),
        createItem(ItemComponents.COMMON_ITEM_COMPONENTS, { amount: 2 }),
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
        createItem(MeleeWeapon.MACHETE, { grade: ItemGrade.COMMON } as MeleeWeaponItem),
        createItem(Metal.UNCOMMON_METAL, { amount: 6 }),
        createItem(Wood.UNCOMMON_WOOD, { amount: 4 }),
        createItem(ItemComponents.UNCOMMON_ITEM_COMPONENTS, { amount: 3 }),
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
        createItem(MeleeWeapon.MACHETE, { grade: ItemGrade.UNCOMMON } as MeleeWeaponItem),
        createItem(Metal.RARE_METAL, { amount: 7 }),
        createItem(Wood.RARE_WOOD, { amount: 5 }),
        createItem(ItemComponents.RARE_ITEM_COMPONENTS, { amount: 4 }),
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
        createItem(MeleeWeapon.MACHETE, { grade: ItemGrade.RARE } as MeleeWeaponItem),
        createItem(Metal.EPIC_METAL, { amount: 8 }),
        createItem(Wood.EPIC_WOOD, { amount: 6 }),
        createItem(ItemComponents.EPIC_ITEM_COMPONENTS, { amount: 5 }),
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
        createItem(MeleeWeapon.MACHETE, { grade: ItemGrade.EPIC } as MeleeWeaponItem),
        createItem(Metal.LEGENDARY_METAL, { amount: 9 }),
        createItem(Wood.LEGENDARY_WOOD, { amount: 7 }),
        createItem(ItemComponents.LEGENDARY_ITEM_COMPONENTS, { amount: 6 }),
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
        createItem(Wood.COMMON_WOOD, { amount: 10 }),
        createItem(Metal.COMMON_METAL, { amount: 5 }),
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
        createItem(MeleeWeapon.NIGHTSTICK, { grade: ItemGrade.COMMON } as MeleeWeaponItem),
        createItem(Wood.UNCOMMON_WOOD, { amount: 10 }),
        createItem(Metal.UNCOMMON_METAL, { amount: 5 }),
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
        createItem(MeleeWeapon.NIGHTSTICK, { grade: ItemGrade.UNCOMMON } as MeleeWeaponItem),
        createItem(Wood.RARE_WOOD, { amount: 10 }),
        createItem(Metal.RARE_METAL, { amount: 5 }),
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
        createItem(MeleeWeapon.NIGHTSTICK, { grade: ItemGrade.RARE } as MeleeWeaponItem),
        createItem(Wood.EPIC_WOOD, { amount: 10 }),
        createItem(Metal.EPIC_METAL, { amount: 5 }),
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
        createItem(MeleeWeapon.NIGHTSTICK, { grade: ItemGrade.EPIC } as MeleeWeaponItem),
        createItem(Wood.LEGENDARY_WOOD, { amount: 10 }),
        createItem(Metal.LEGENDARY_METAL, { amount: 5 }),
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
        createItem(Metal.COMMON_METAL, { amount: 5 }),
        createItem(ItemComponents.COMMON_ITEM_COMPONENTS, { amount: 5 }),
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
        createItem(MeleeWeapon.PIPEWRENCH, { grade: ItemGrade.COMMON } as MeleeWeaponItem),
        createItem(Metal.UNCOMMON_METAL, { amount: 8 }),
        createItem(ItemComponents.UNCOMMON_ITEM_COMPONENTS, { amount: 8 }),
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
        createItem(MeleeWeapon.PIPEWRENCH, { grade: ItemGrade.UNCOMMON } as MeleeWeaponItem),
        createItem(Metal.RARE_METAL, { amount: 12 }),
        createItem(ItemComponents.RARE_ITEM_COMPONENTS, { amount: 12 }),
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
        createItem(MeleeWeapon.PIPEWRENCH, { grade: ItemGrade.RARE } as MeleeWeaponItem),
        createItem(Metal.EPIC_METAL, { amount: 15 }),
        createItem(ItemComponents.EPIC_ITEM_COMPONENTS, { amount: 15 }),
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
        createItem(MeleeWeapon.PIPEWRENCH, { grade: ItemGrade.EPIC } as MeleeWeaponItem),
        createItem(Metal.LEGENDARY_METAL, { amount: 20 }),
        createItem(ItemComponents.LEGENDARY_ITEM_COMPONENTS, { amount: 20 }),
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
        createItem(Wood.COMMON_WOOD, { amount: 10 }),
        createItem(ItemComponents.COMMON_ITEM_COMPONENTS, { amount: 5 }),
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
        createItem(MeleeWeapon.POOLCUE, { grade: ItemGrade.COMMON } as MeleeWeaponItem),
        createItem(Wood.UNCOMMON_WOOD, { amount: 15 }),
        createItem(ItemComponents.UNCOMMON_ITEM_COMPONENTS, { amount: 10 }),
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
        createItem(MeleeWeapon.POOLCUE, { grade: ItemGrade.UNCOMMON } as MeleeWeaponItem),
        createItem(Wood.RARE_WOOD, { amount: 20 }),
        createItem(Metal.RARE_METAL, { amount: 10 }),
        createItem(ItemComponents.RARE_ITEM_COMPONENTS, { amount: 15 }),
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
        createItem(MeleeWeapon.POOLCUE, { grade: ItemGrade.RARE } as MeleeWeaponItem),
        createItem(Wood.EPIC_WOOD, { amount: 25 }),
        createItem(Metal.EPIC_METAL, { amount: 15 }),
        createItem(ItemComponents.EPIC_ITEM_COMPONENTS, { amount: 20 }),
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
        createItem(MeleeWeapon.POOLCUE, { grade: ItemGrade.EPIC } as MeleeWeaponItem),
        createItem(Wood.LEGENDARY_WOOD, { amount: 30 }),
        createItem(Metal.LEGENDARY_METAL, { amount: 20 }),
        createItem(ItemComponents.LEGENDARY_ITEM_COMPONENTS, { amount: 25 }),
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
        createItem(Metal.COMMON_METAL, { amount: 10 }),
        createItem(ItemComponents.COMMON_ITEM_COMPONENTS, { amount: 5 }),
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
        createItem(MeleeWeapon.STONEHATCHET, { grade: ItemGrade.COMMON } as MeleeWeaponItem),
        createItem(Metal.UNCOMMON_METAL, { amount: 8 }),
        createItem(ItemComponents.UNCOMMON_ITEM_COMPONENTS, { amount: 4 }),
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
        createItem(MeleeWeapon.STONEHATCHET, { grade: ItemGrade.UNCOMMON } as MeleeWeaponItem),
        createItem(Metal.RARE_METAL, { amount: 6 }),
        createItem(ItemComponents.RARE_ITEM_COMPONENTS, { amount: 3 }),
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
        createItem(MeleeWeapon.STONEHATCHET, { grade: ItemGrade.RARE } as MeleeWeaponItem),
        createItem(Metal.EPIC_METAL, { amount: 4 }),
        createItem(ItemComponents.EPIC_ITEM_COMPONENTS, { amount: 2 }),
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
        createItem(MeleeWeapon.STONEHATCHET, { grade: ItemGrade.EPIC } as MeleeWeaponItem),
        createItem(Metal.LEGENDARY_METAL, { amount: 2 }),
        createItem(ItemComponents.LEGENDARY_ITEM_COMPONENTS, { amount: 1 }),
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
        createItem(Metal.COMMON_METAL, { amount: 5 }),
        createItem(Wood.COMMON_WOOD, { amount: 5 }),
        createItem(ItemComponents.COMMON_ITEM_COMPONENTS, { amount: 5 }),
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
        createItem(MeleeWeapon.SWITCHBLADE, { grade: ItemGrade.COMMON } as MeleeWeaponItem),
        createItem(Metal.UNCOMMON_METAL, { amount: 5 }),
        createItem(Wood.UNCOMMON_WOOD, { amount: 5 }),
        createItem(ItemComponents.UNCOMMON_ITEM_COMPONENTS, { amount: 5 }),
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
        createItem(MeleeWeapon.SWITCHBLADE, { grade: ItemGrade.UNCOMMON } as MeleeWeaponItem),
        createItem(Metal.RARE_METAL, { amount: 5 }),
        createItem(Wood.RARE_WOOD, { amount: 5 }),
        createItem(ItemComponents.RARE_ITEM_COMPONENTS, { amount: 5 }),
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
        createItem(MeleeWeapon.SWITCHBLADE, { grade: ItemGrade.RARE } as MeleeWeaponItem),
        createItem(Metal.EPIC_METAL, { amount: 5 }),
        createItem(Wood.EPIC_WOOD, { amount: 5 }),
        createItem(ItemComponents.EPIC_ITEM_COMPONENTS, { amount: 5 }),
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
        createItem(MeleeWeapon.SWITCHBLADE, { grade: ItemGrade.EPIC } as MeleeWeaponItem),
        createItem(Metal.LEGENDARY_METAL, { amount: 5 }),
        createItem(Wood.LEGENDARY_WOOD, { amount: 5 }),
        createItem(ItemComponents.LEGENDARY_ITEM_COMPONENTS, { amount: 5 }),
      ],
    },
  ],
});
