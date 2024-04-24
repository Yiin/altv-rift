import { makeKeys } from "@shared/utility/make-keys";
import { getItemName } from "@shared/modules/items/lib";
import { Metal } from "@shared/modules/items/registry/materials/metal.items";
import { Scrap } from "@shared/modules/items/registry/materials/scrap.items";
import { Ammo, AmmoItem, AmmoItemKey } from "@shared/modules/items/registry/ammo/ammo.items";
import { ItemGrade } from "@shared/modules/items";
import { registerBlueprint } from "../blueprints.registry";

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
    recipes: [
      ItemGrade.COMMON,
      ItemGrade.UNCOMMON,
      ItemGrade.RARE,
      ItemGrade.EPIC,
      ItemGrade.LEGENDARY,
    ].map((grade) => ({
      key,
      durationSeconds: 2,
      item: {
        key: itemKey,
        amount: 10,
        grade,
      } as AmmoItem,
      parts: [{ key: Metal.METAL, grade, amount: 1 }],
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
          { key: Scrap.SCRAP, grade: ItemGrade.UNCOMMON, amount: 1 },
          { key: Metal.METAL, grade: ItemGrade.COMMON, amount: 1 },
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
        durationSeconds: 2,
        item: {
          key: itemKey,
          amount: 5,
        } as AmmoItem,
        parts: [
          { key: Scrap.SCRAP, grade: ItemGrade.COMMON, amount: 2 },
          { key: Metal.METAL, grade: ItemGrade.COMMON, amount: 2 },
        ],
      },
    ],
  });
});
