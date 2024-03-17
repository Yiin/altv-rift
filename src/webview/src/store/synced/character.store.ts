import { type Store, type StoreDefinition } from "pinia";
import { type Character, EquipmentSlot } from "@shared/interfaces";
import { Ammo } from "@shared/modules/items";

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
        equipment: {
          [EquipmentSlot.HandgunAmmo]: {
            key: Ammo.HANDGUN_AMMO,
            amount: 1000,
          },
        },
        inventory: {
          size: 30,
          items: [],
        },
        blueprints: ["pistol", "pistol_plus", "pistol_plus_plus", "pistol_plus_plus_plus"],
      } as any as Store<"character", Character, {}, {}>)
    : characterStore?.();
