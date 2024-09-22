import { makeKeys } from "@shared/utility/make-keys";
import { Ammo, AmmoItem, AmmoItemKey, createItem, getItemName, getMetalByGrade, ItemComponents, ItemGrade, Metal } from "@shared/modules/items";
import { initializeBlueprints, registerBlueprint } from "../blueprints.registry";

export const AmmoBlueprint = makeKeys<AmmoBlueprintKey>()({
  HANDGUN_AMMO: Ammo.HANDGUN_AMMO,
  SHOTGUN_AMMO: Ammo.SHOTGUN_AMMO,
  SNIPER_RIFLE_AMMO: Ammo.SNIPER_RIFLE_AMMO,
  ASSAULT_RIFLE_AMMO: Ammo.ASSAULT_RIFLE_AMMO,
  MACHINE_GUN_AMMO: Ammo.MACHINE_GUN_AMMO,
  EXPLOSIVE_SHOTGUN_AMMO: Ammo.EXPLOSIVE_SHOTGUN_AMMO,
  EXPLOSIVE_ASSAULT_RIFLE_AMMO: Ammo.EXPLOSIVE_ASSAULT_RIFLE_AMMO,
  ROCKETS: Ammo.ROCKETS,
  GRENADES: Ammo.GRENADES,
  PLASMA_RAYS: Ammo.PLASMA_RAYS,
  SMOKE_GRENADES: Ammo.SMOKE_GRENADES,
});

export type AmmoBlueprintKey = Brand<string, "AmmoBlueprintKey">;

initializeBlueprints(() => {
  [
    AmmoBlueprint.HANDGUN_AMMO,
    AmmoBlueprint.SHOTGUN_AMMO,
    AmmoBlueprint.SNIPER_RIFLE_AMMO,
    AmmoBlueprint.ASSAULT_RIFLE_AMMO,
    AmmoBlueprint.MACHINE_GUN_AMMO,
  ].forEach((key) => {
    const itemKey = key as string as AmmoItemKey;

    registerBlueprint({
      key,
      name: `${getItemName(itemKey)} blueprint`,
      recipes: ([
        ItemGrade.COMMON,
        ItemGrade.UNCOMMON,
        ItemGrade.RARE,
        ItemGrade.EPIC,
        ItemGrade.LEGENDARY,
      ] as const).map((grade) => ({
        key: key + grade,
        durationSeconds: 1,
        item: {
          key: itemKey,
          amount: 20,
          grade,
        } as AmmoItem,
        parts: [createItem(getMetalByGrade(grade), { amount: 1 })],
        levelRequired: ({
          [ItemGrade.COMMON]: 1,
          [ItemGrade.UNCOMMON]: 5,
          [ItemGrade.RARE]: 20,
          [ItemGrade.EPIC]: 45,
          [ItemGrade.LEGENDARY]: 80,
        })[grade]
      })),
    });
  });

  [
    AmmoBlueprint.EXPLOSIVE_SHOTGUN_AMMO,
    AmmoBlueprint.EXPLOSIVE_ASSAULT_RIFLE_AMMO,
    //
  ].forEach((key) => {
    const itemKey = key as string as AmmoItemKey;

    registerBlueprint({
      key,
      name: `${getItemName(itemKey)} blueprint`,
      recipes: [
        {
          key,
          durationSeconds: 2,
          item: {
            key: itemKey,
            amount: 10,
          } as AmmoItem,
          parts: [
            createItem(ItemComponents.UNCOMMON_ITEM_COMPONENTS, { amount: 1 }),
            createItem(Metal.COMMON_METAL, { amount: 1 }),
          ],
        },
      ],
    });
  });

  [
    AmmoBlueprint.ROCKETS,
    AmmoBlueprint.GRENADES,
    AmmoBlueprint.PLASMA_RAYS,
    AmmoBlueprint.SMOKE_GRENADES,
  ].forEach((key) => {
    const itemKey = key as string as AmmoItemKey;

    registerBlueprint({
      key,
      name: `${getItemName(itemKey)} blueprint`,
      recipes: [
        {
          key,
          durationSeconds: 1,
          item: {
            key: itemKey,
            amount: 5,
          } as AmmoItem,
          parts: [
            createItem(ItemComponents.COMMON_ITEM_COMPONENTS, { amount: 2 }),
            createItem(Metal.COMMON_METAL, { amount: 2 }),
          ],
        },
      ],
    });
  });
});