import * as alt from "@altv/client";
import { StoreDefinition, defineStore } from "pinia";
import { ref } from "vue";
import { updateStoreState } from "@shared/store/utils";
import { ClientEvents } from "@shared/events/client";
import { WebviewEvents } from "@shared/events/webview";
import { Character } from "@shared/interfaces";
import { getWebview } from "@/core/user-interface/webview";
import { pinia } from ".";

type CharacterStore = StoreDefinition<"character", Character, {}, {}>;

let characterStore: CharacterStore | undefined;

export const isCharacterStoreAvailable = ref(false);

export const useCharacter = () => {
  if (!characterStore) {
    throw new Error("Character store have not been setup.");
  }
  return characterStore(pinia);
};

alt.Events.onServer(ClientEvents.FromServer.UPDATE_CHARACTER_STATE, (event: any) => {
  getWebview().emitRaw(WebviewEvents.FromClient.UPDATE_CHARACTER_STATE, event);

  const character = useCharacter();

  updateStoreState(character, event);
});

alt.Events.onServer(ClientEvents.FromServer.SET_CHARACTER_STATE, (state: any) => {
  getWebview().emitRaw(WebviewEvents.FromClient.SET_CHARACTER_STATE, state);

  console.log("setting character state: start");
  if (characterStore) {
    const character = useCharacter();
    character.$state = state;
  } else {
    characterStore = defineStore("character", {
      state: () => state,
    });
    isCharacterStoreAvailable.value = true;
  }
  console.log("setting character state: end");
});
