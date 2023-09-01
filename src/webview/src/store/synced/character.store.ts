import { Character } from "@shared/interfaces";
import { StoreDefinition } from "pinia";

type CharacterStore = StoreDefinition<"character", Character, {}, {}>;

let characterStore: CharacterStore;

export function setCharacterStore(store: CharacterStore) {
  characterStore = store;
}

export const useCharacter = () => characterStore?.();
