import { type StoreDefinition } from "pinia";
import { ref } from "vue";
import { type Character } from "@shared/interfaces";

export type CharacterStore = StoreDefinition<"character", Character, {}, {}>;

const characterStore = ref<CharacterStore | null>(
  "altMock" in window
    ? defineStore("character", {
        state: () =>
          ({
            inventory: {
              size: 20,
              items: [],
            },
            skills: {},
            money: 1000,
          }) as any,
      })
    : null,
);

export function setCharacterStore(store: CharacterStore) {
  characterStore.value = store;
}

export function isCharacterStoreAvailable() {
  return !!characterStore.value;
}

export const useCharacter = () =>
  characterStore.value ? characterStore.value() : (null as any as ReturnType<CharacterStore>);
