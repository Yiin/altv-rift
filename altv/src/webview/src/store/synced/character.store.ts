import { type Store, type StoreDefinition } from "pinia";
import { ref } from "vue";
import { type Character, EquipmentSlot } from "@shared/interfaces";
import { Ammo, ItemGrade, UnlearnedBlueprint, createItem } from "@shared/modules/items";
import { createInventory } from "@shared/modules/inventory";

type CharacterStore = StoreDefinition<"character", Character, {}, {}>;

const characterStore = ref<CharacterStore | null>(null);

export function setCharacterStore(store: CharacterStore) {
  characterStore.value = store;
}

export function isCharacterStoreAvailable() {
  return "altMock" in globalThis || !!characterStore.value;
}

export const useCharacter = () =>
  "altMock" in globalThis
    ? ({
        id: "0x",
        appearance: {
          sex: 1,
        },
        money: 3258,
        equipment: {
          [EquipmentSlot.HandgunAmmo]: createItem(Ammo.HANDGUN_AMMO, {
            amount: 1000,
            grade: ItemGrade.RARE,
          }),
          [EquipmentSlot.Weapon]: createItem("pistol" as any, {
            grade: ItemGrade.LIMITED,
          }),
        },
        inventory: createInventory({
          size: 30,
          items: [
            createItem("pistol" as any, {
              grade: ItemGrade.RARE,
            }),
            createItem("pistol" as any, {
              grade: ItemGrade.EPIC,
            }),
            createItem("DLC_MP_XMAS3_M_JBIB_1_0" as any),
            createItem("specialcarbine" as any),
            createItem("specialcarbine" as any, {
              grade: ItemGrade.UNCOMMON,
            }),
            createItem("handgunammo" as any, {
              amount: 100,
              grade: ItemGrade.RARE,
            }),
            createItem("scrap" as any, { grade: ItemGrade.COMMON, amount: 5 }),
            createItem("metal" as any, { grade: ItemGrade.COMMON, amount: 5 }),
            createItem("scrap" as any, { grade: ItemGrade.LEGENDARY, amount: 50 }),
            createItem("metal" as any, { grade: ItemGrade.LEGENDARY, amount: 50 }),
          ],
        }),
        blueprints: Object.values(UnlearnedBlueprint),
        skills: {
          fishing: 0,
          mining: 0,
          woodcutting: 0,
        },
      } as any as ReturnType<CharacterStore>)
    : characterStore.value
      ? characterStore.value()
      : (null as any as ReturnType<CharacterStore>);
