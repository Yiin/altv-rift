import { Character } from "@shared/interfaces";
import { Store, StoreDefinition } from "pinia";

type CharacterStore = StoreDefinition<"character", Character, {}, {}>;

let characterStore: CharacterStore;

export function setCharacterStore(store: CharacterStore) {
  characterStore = store;
}

export const useCharacter = () => 'altMock' in globalThis ? {
  id: '0x',
  appearance: {
    sex: 1,
  },
  equipment: {},
  inventory: {
    size: 30,
    items: [],
  }
} as any as Store<"character", Character, {}, {}> : characterStore?.();
