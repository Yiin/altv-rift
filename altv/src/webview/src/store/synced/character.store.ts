import { type StoreDefinition } from "pinia";
import { ref } from "vue";
import { type Character } from "@shared/interfaces";

type CharacterStore = StoreDefinition<"character", Character, {}, {}>;

const characterStore = ref<CharacterStore | null>(null);

export function setCharacterStore(store: CharacterStore) {
  characterStore.value = store;
}

export function isCharacterStoreAvailable() {
  return !!characterStore.value;
}

export const useCharacter = () =>
  characterStore.value
      ? characterStore.value()
      : (null as any as ReturnType<CharacterStore>);
