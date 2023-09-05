import alt from "alt-client";
import { StoreDefinition, defineStore } from "pinia";
import { updateStoreState } from "@shared/store/utils";
import { ClientEvents } from "@shared/events/client";
import { WebviewEvents } from "@shared/events/webview";
import { Character } from "@shared/interfaces";
import { getWebview } from "@/user-interface/webview";
import { pinia } from ".";

type CharacterStore = StoreDefinition<"character", Character, {}, {}>;

let characterStore: CharacterStore | undefined;

export const useCharacter = () => {
  if (!characterStore) {
    throw new Error("Character store have not been setup.");
  }
  return characterStore(pinia);
};

alt.onServer(ClientEvents.FromServer.UPDATE_CHARACTER_STATE, (event: any) => {
  getWebview().emit(WebviewEvents.FromClient.UPDATE_CHARACTER_STATE, event);

  const character = useCharacter();

  updateStoreState(character, event);
});

alt.onServer(ClientEvents.FromServer.SET_CHARACTER_STATE, (state: any) => {
  getWebview().emit(WebviewEvents.FromClient.SET_CHARACTER_STATE, state);

  if (characterStore) {
    const character = useCharacter();
    character.$dispose();
    delete pinia.state.value[character.$id];
  }

  characterStore = defineStore("character", {
    state: () => state,
  });
});
