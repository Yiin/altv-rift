import { type Store, type StoreDefinition } from "pinia";
import { type Character, EquipmentSlot } from "@shared/interfaces";
import { Ammo, ItemGrade, UnlearnedBlueprint, createItem } from "@shared/modules/items";

type CharacterStore = StoreDefinition<"character", Character, {}, {}>;

let characterStore: CharacterStore;

export function setCharacterStore(store: CharacterStore) {
  characterStore = store;
}

export function isCharacterStoreAvailable() {
  return !!characterStore;
}

export const useCharacter = () =>
  "altMock" in globalThis
    ? ({
        id: "0x",
        appearance: {
          sex: 1,
        },
        money: 246435,
        equipment: {
          [EquipmentSlot.HandgunAmmo]: {
            key: Ammo.HANDGUN_AMMO,
            amount: 1000,
            grade: ItemGrade.RARE,
          },
          [EquipmentSlot.Weapon]: createItem("pistol" as any, {
            grade: ItemGrade.LIMITED,
          }),
        },
        inventory: {
          size: 30,
          items: [
            {
              slot: 1,
              item: createItem("pistol" as any, {
                grade: ItemGrade.RARE,
              }),
            },
            {
              slot: 2,
              item: createItem("pistol" as any, {
                grade: ItemGrade.EPIC,
              }),
            },
            {
              slot: 0,
              item: createItem("DLC_MP_XMAS3_M_JBIB_1_0" as any),
            },
            {
              slot: 4,
              item: createItem("specialcarbine" as any),
            },
            {
              slot: 5,
              item: createItem("specialcarbine" as any, {
                grade: ItemGrade.UNCOMMON,
              }),
            },
            {
              slot: 3,
              item: createItem("handgunammo" as any, {
                amount: 100,
                grade: ItemGrade.RARE,
              }),
            },
            {
              slot: 9,
              item: createItem("scrap" as any, { grade: ItemGrade.COMMON, amount: 5 }),
            },
            {
              slot: 10,
              item: createItem("metal" as any, { grade: ItemGrade.COMMON, amount: 5 }),
            },
            {
              slot: 11,
              item: createItem("scrap" as any, { grade: ItemGrade.LEGENDARY, amount: 50 }),
            },
            {
              slot: 12,
              item: createItem("metal" as any, { grade: ItemGrade.LEGENDARY, amount: 50 }),
            },
          ],
        },
        blueprints: Object.values(UnlearnedBlueprint),
        skills: {
          fishing: 0,
          mining: 0,
          woodcutting: 0,
        },
      } as any as Store<"character", Character, {}, {}>)
    : characterStore?.();
