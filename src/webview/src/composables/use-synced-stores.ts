import { setCharacterStore, useCharacter } from "@/store/synced/character.store";
import { useClient } from "@/store/synced/client.store";
import { useGameState } from "@/store/synced/game-state.store";
import { setUserStore, useUser } from "@/store/synced/user.store";
import { WebviewEvents } from "@shared/events/webview";
import { updateStoreState } from "@shared/store/utils";
import { useAlt } from "./use-alt";
import { pinia } from "@/store";
import { defineStore } from "pinia";

export function useSyncedStores() {
  const { on } = useAlt();
  const clientStore = useClient();
  const gameStateStore = useGameState();

  on(WebviewEvents.FromClient.SET_CLIENT_STATE, (state: any) => {
    clientStore.$state = state;
  });
  on(WebviewEvents.FromClient.UPDATE_CLIENT_STATE, (event: any) => {
    updateStoreState(clientStore, event);
  });

  on(WebviewEvents.FromClient.SET_USER_STATE, (event: any) => {
    const userStore = useUser();

    if (userStore) {
      userStore.$dispose();
      delete pinia.state.value[userStore.$id];
    }

    setUserStore(
      defineStore("user", {
        state: () => event,
      })
    );
  });
  on(WebviewEvents.FromClient.UPDATE_USER_STATE, (event: any) => {
    const userStore = useUser();
    updateStoreState(userStore, event);
  });

  on(WebviewEvents.FromClient.SET_CHARACTER_STATE, (state: any) => {
    const characterStore = useCharacter();

    if (characterStore) {
      characterStore.$dispose();
      delete pinia.state.value[characterStore.$id];
    }

    setCharacterStore(
      defineStore("character", {
        state: () => state,
      })
    );
  });
  on(WebviewEvents.FromClient.UPDATE_CHARACTER_STATE, (event: any) => {
    const characterStore = useCharacter();

    updateStoreState(characterStore, event);
  });

  on(WebviewEvents.FromClient.SET_GAME_STATE, (state: any) => {
    gameStateStore.$state = state;
  });
  on(WebviewEvents.FromClient.UPDATE_GAME_STATE, (event: any) => {
    updateStoreState(gameStateStore, event);
  });
}
