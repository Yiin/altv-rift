import { makeKeys } from "@shared/utility/make-keys";
import { ThrowableWeapon, getItemName, ItemGrade, ThrowableWeaponItem, createItem, ItemComponents, Metal, Wood } from "@shared/modules/items";
import { initializeBlueprints, registerBlueprint } from "../blueprints.registry";

// We re-use weapon item key as it's blueprint key for easier management.
export const ThrowableWeaponBlueprint = makeKeys<ThrowableWeaponBlueprintKey>()(ThrowableWeapon);

export type ThrowableWeaponBlueprintKey = Brand<string, "ThrowableWeaponBlueprintKey">;

initializeBlueprints(() => {
  registerBlueprint({
    key: ThrowableWeaponBlueprint.GRENADE,
    name: `${getItemName(ThrowableWeapon.GRENADE)} blueprint`,
    recipes: [
      {
        key: ThrowableWeapon.GRENADE,
        durationSeconds: 3,
        item: {
          key: ThrowableWeapon.GRENADE,
          grade: ItemGrade.COMMON,
          amount: 5,
        } as ThrowableWeaponItem,
        parts: [
          createItem(ItemComponents.COMMON_ITEM_COMPONENTS, { amount: 10 }),
          createItem(Metal.COMMON_METAL, { amount: 5 }),
        ],
      },
    ],
  });

  registerBlueprint({
    key: ThrowableWeaponBlueprint.STICKYBOMB,
    name: `${getItemName(ThrowableWeapon.STICKYBOMB)} blueprint`,
    recipes: [
      {
        key: ThrowableWeapon.STICKYBOMB,
        durationSeconds: 3,
        item: {
          key: ThrowableWeapon.STICKYBOMB,
          grade: ItemGrade.COMMON,
          amount: 5,
        } as ThrowableWeaponItem,
        parts: [
          createItem(Metal.COMMON_METAL, { amount: 3 }),
          createItem(ItemComponents.COMMON_ITEM_COMPONENTS, { amount: 2 }),
          createItem(Wood.COMMON_WOOD, { amount: 1 }),
        ],
      },
    ],
  });

  registerBlueprint({
    key: ThrowableWeaponBlueprint.SMOKEGRENADE,
    name: `${getItemName(ThrowableWeapon.SMOKEGRENADE)} blueprint`,
    recipes: [
      {
        key: ThrowableWeapon.SMOKEGRENADE,
        durationSeconds: 3,
        item: {
          key: ThrowableWeapon.SMOKEGRENADE,
          grade: ItemGrade.COMMON,
          amount: 5,
        } as ThrowableWeaponItem,
        parts: [
          createItem(Metal.COMMON_METAL, { amount: 2 }),
          createItem(ItemComponents.COMMON_ITEM_COMPONENTS, { amount: 2 }),
        ],
      },
    ],
  });

  registerBlueprint({
    key: ThrowableWeaponBlueprint.JERRYCAN,
    name: `${getItemName(ThrowableWeapon.JERRYCAN)} blueprint`,
    recipes: [
      {
        key: ThrowableWeapon.JERRYCAN,
        durationSeconds: 3,
        item: {
          key: ThrowableWeapon.JERRYCAN,
          grade: ItemGrade.COMMON,
          amount: 5,
        } as ThrowableWeaponItem,
        parts: [
          createItem(Metal.COMMON_METAL, { amount: 2 }),
          createItem(ItemComponents.COMMON_ITEM_COMPONENTS, { amount: 2 }),
          createItem(Wood.COMMON_WOOD, { amount: 1 }),
        ],
      },
    ],
  });

  registerBlueprint({
    key: ThrowableWeaponBlueprint.MOLOTOV,
    name: `${getItemName(ThrowableWeapon.MOLOTOV)} blueprint`,
    recipes: [
      {
        key: ThrowableWeapon.MOLOTOV,
        durationSeconds: 3,
        item: {
          key: ThrowableWeapon.MOLOTOV,
          grade: ItemGrade.COMMON,
          amount: 5,
        } as ThrowableWeaponItem,
        parts: [
          createItem(ItemComponents.COMMON_ITEM_COMPONENTS, { amount: 3 }),
          createItem(Metal.COMMON_METAL, { amount: 2 }),
          createItem(Wood.COMMON_WOOD, { amount: 1 }),
        ],
      },
    ],
  });

  registerBlueprint({
    key: ThrowableWeaponBlueprint.HAZARDCAN,
    name: `${getItemName(ThrowableWeapon.HAZARDCAN)} blueprint`,
    recipes: [
      {
        key: ThrowableWeapon.HAZARDCAN,
        durationSeconds: 3,
        item: {
          key: ThrowableWeapon.HAZARDCAN,
          grade: ItemGrade.COMMON,
          amount: 5,
        } as ThrowableWeaponItem,
        parts: [
          createItem(Metal.COMMON_METAL, { amount: 3 }),
          createItem(ItemComponents.COMMON_ITEM_COMPONENTS, { amount: 7 }),
        ],
      },
    ],
  });

  registerBlueprint({
    key: ThrowableWeaponBlueprint.BZGAS,
    name: `${getItemName(ThrowableWeapon.BZGAS)} blueprint`,
    recipes: [
      {
        key: ThrowableWeapon.BZGAS,
        durationSeconds: 3,
        item: {
          key: ThrowableWeapon.BZGAS,
          grade: ItemGrade.COMMON,
          amount: 5,
        } as ThrowableWeaponItem,
        parts: [
          createItem(ItemComponents.COMMON_ITEM_COMPONENTS, { amount: 3 }),
          createItem(Metal.COMMON_METAL, { amount: 2 }),
        ],
      },
    ],
  });

  registerBlueprint({
    key: ThrowableWeaponBlueprint.FLARE,
    name: `${getItemName(ThrowableWeapon.FLARE)} blueprint`,
    recipes: [
      {
        key: ThrowableWeapon.FLARE,
        durationSeconds: 3,
        item: {
          key: ThrowableWeapon.FLARE,
          grade: ItemGrade.COMMON,
          amount: 5,
        } as ThrowableWeaponItem,
        parts: [
          createItem(Metal.COMMON_METAL, { amount: 2 }),
          createItem(ItemComponents.COMMON_ITEM_COMPONENTS, { amount: 3 }),
          createItem(Wood.COMMON_WOOD, { amount: 1 }),
        ],
      },
    ],
  });

  registerBlueprint({
    key: ThrowableWeaponBlueprint.PROXMINE,
    name: `${getItemName(ThrowableWeapon.PROXMINE)} blueprint`,
    recipes: [
      {
        key: ThrowableWeapon.PROXMINE,
        durationSeconds: 3,
        item: {
          key: ThrowableWeapon.PROXMINE,
          grade: ItemGrade.COMMON,
          amount: 5,
        } as ThrowableWeaponItem,
        parts: [
          createItem(Metal.COMMON_METAL, { amount: 10 }),
          createItem(ItemComponents.COMMON_ITEM_COMPONENTS, { amount: 10 }),
        ],
      },
    ],
  });

  registerBlueprint({
    key: ThrowableWeaponBlueprint.PIPEBOMB,
    name: `${getItemName(ThrowableWeapon.PIPEBOMB)} blueprint`,
    recipes: [
      {
        key: ThrowableWeapon.PIPEBOMB,
        durationSeconds: 3,
        item: {
          key: ThrowableWeapon.PIPEBOMB,
          grade: ItemGrade.COMMON,
          amount: 5,
        } as ThrowableWeaponItem,
        parts: [
          createItem(Metal.COMMON_METAL, { amount: 2 }),
          createItem(ItemComponents.COMMON_ITEM_COMPONENTS, { amount: 3 }),
        ],
      },
    ],
  });
});