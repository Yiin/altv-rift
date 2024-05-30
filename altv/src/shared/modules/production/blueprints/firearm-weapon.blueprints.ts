import { makeKeys } from "@shared/utility/make-keys";
import { getItemName, getItemTier } from "@shared/modules/items/lib";
import { Metal } from "@shared/modules/items/registry/materials/metal.items";
import { ItemGrade, ItemTier } from "@shared/modules/items/enums";
import { Scrap } from "@shared/modules/items/registry/materials/scrap.items";
import {
  FirearmWeapon,
  FirearmWeaponItem,
  FirearmWeaponItemKey,
} from "@shared/modules/items/registry/weapons/firearm-weapon.items";
import { registerBlueprint } from "../blueprints.registry";

// We re-use weapon item key as it's blueprint key for easier management.
export const FirearmWeaponBlueprint = makeKeys<FirearmWeaponBlueprintKey>()(FirearmWeapon);

export type FirearmWeaponBlueprintKey = Brand<string, "FirearmWeaponBlueprintKey">;

Object.values(FirearmWeaponBlueprint).forEach((key) => {
  const itemKey = key as string as FirearmWeaponItemKey;

  const tier = getItemTier(itemKey);
  const multiplier =
    tier !== null
      ? {
          [ItemTier.S]: 10,
          [ItemTier.A]: 8,
          [ItemTier.B]: 6,
          [ItemTier.C]: 4,
          [ItemTier.D]: 3,
          [ItemTier.E]: 2,
          [ItemTier.F]: 1,
        }[tier]
      : 1;

  registerBlueprint({
    key,
    name: `${getItemName(itemKey)} blueprint`,
    description: `Lets you craft and upgrade ${getItemName(itemKey)}.`,
    recipes: [
      // base
      {
        key: itemKey,
        durationSeconds: 2,
        item: {
          key: itemKey,
          grade: ItemGrade.COMMON,
        } as FirearmWeaponItem,
        parts: [
          { key: Metal.METAL, grade: ItemGrade.COMMON, amount: 5 * multiplier },
          { key: Scrap.SCRAP, grade: ItemGrade.COMMON, amount: 5 * multiplier },
        ],
      },

      // +1
      {
        key: itemKey + "+1",
        isUpgrade: true,
        durationSeconds: 5,
        item: {
          key: itemKey,
          grade: ItemGrade.UNCOMMON,
        } as FirearmWeaponItem,
        parts: [
          { key: itemKey, grade: ItemGrade.COMMON } as FirearmWeaponItem,
          { key: Metal.METAL, grade: ItemGrade.UNCOMMON, amount: 10 * multiplier },
          { key: Scrap.SCRAP, grade: ItemGrade.UNCOMMON, amount: 10 * multiplier },
        ],
      },

      // +2
      {
        key: itemKey + "+2",
        isUpgrade: true,
        durationSeconds: 10,
        item: {
          key: itemKey,
          grade: ItemGrade.RARE,
        } as FirearmWeaponItem,
        parts: [
          { key: itemKey, grade: ItemGrade.UNCOMMON } as FirearmWeaponItem,
          { key: Metal.METAL, grade: ItemGrade.RARE, amount: 15 * multiplier },
          { key: Scrap.SCRAP, grade: ItemGrade.RARE, amount: 15 * multiplier },
        ],
      },

      // +3
      {
        key: itemKey + "+3",
        isUpgrade: true,
        durationSeconds: 20,
        item: {
          key: itemKey,
          grade: ItemGrade.EPIC,
        } as FirearmWeaponItem,
        parts: [
          { key: itemKey, grade: ItemGrade.RARE } as FirearmWeaponItem,
          { key: Metal.METAL, grade: ItemGrade.EPIC, amount: 20 * multiplier },
          { key: Scrap.SCRAP, grade: ItemGrade.EPIC, amount: 20 * multiplier },
        ],
      },

      // +4
      {
        key: itemKey + "+4",
        isUpgrade: true,
        durationSeconds: 30,
        item: {
          key: itemKey,
          grade: ItemGrade.LEGENDARY,
        } as FirearmWeaponItem,
        parts: [
          { key: itemKey, grade: ItemGrade.EPIC } as FirearmWeaponItem,
          { key: Metal.METAL, grade: ItemGrade.LEGENDARY, amount: 25 * multiplier },
          { key: Scrap.SCRAP, grade: ItemGrade.LEGENDARY, amount: 25 * multiplier },
        ],
      },
    ],
  });
});
