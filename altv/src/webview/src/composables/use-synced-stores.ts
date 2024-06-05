import { defineStore } from "pinia";
import { WebviewEvents } from "@shared/events/webview";
import { updateStoreState } from "@shared/store/utils";
import { setCharacterStore, useCharacter } from "@/store/synced/character.store";
import { useClient } from "@/store/synced/client.store";
import { useGameState } from "@/store/synced/game-state.store";
import { setUserStore, useUser } from "@/store/synced/user.store";
import { pinia } from "@/store";
import { useAlt } from "./use-alt";

export function useSyncedStores() {
  const { on } = useAlt();
  const clientStore = useClient();
  const gameStateStore = useGameState();

  on(WebviewEvents.FromClient.SET_CLIENT_STATE, (state: any) => {
    try {
      clientStore.$reset();
      clientStore.$patch(state);
    } catch (e) {
      console.error("SET_CLIENT_STATE", e);
    }
  });
  on(WebviewEvents.FromClient.UPDATE_CLIENT_STATE, (event: any) => {
    try {
      updateStoreState(clientStore, event);
    } catch (e) {
      console.error("UPDATE_CLIENT_STATE", e);
    }
  });

  on(WebviewEvents.FromClient.SET_USER_STATE, (event: any) => {
    const userStore = useUser();

    if (userStore) {
      userStore.$dispose();
      delete pinia.state.value[userStore.$id];
    }

    try {
      setUserStore(
        defineStore("user", {
          state: () => event,
        }),
      );
    } catch (e) {
      console.error("SET_USER_STATE", e);
    }
  });
  on(WebviewEvents.FromClient.UPDATE_USER_STATE, (event) => {
    const userStore = useUser();

    try {
      updateStoreState(userStore, event);
    } catch (e) {
      console.error("UPDATE_USER_STATE", e);
    }
  });

  on(WebviewEvents.FromClient.SET_CHARACTER_STATE, (state) => {
    const characterStore = useCharacter();

    if (characterStore) {
      characterStore.$dispose();
      delete pinia.state.value[characterStore.$id];
    }

    try {
      console.log("[WebView] Setting character store state");
      setCharacterStore(
        defineStore("character", {
          state: () => state,
        }),
      );
    } catch (e) {
      console.error("SET_CHARACTER_STATE", e);
    }
  });
  on(WebviewEvents.FromClient.UPDATE_CHARACTER_STATE, (event: any) => {
    const characterStore = useCharacter();

    try {
      updateStoreState(characterStore, event);
    } catch (e) {
      console.error("UPDATE_CHARACTER_STATE", e);
    }
  });

  on(WebviewEvents.FromClient.SET_GAME_STATE, (state: any) => {
    try {
      gameStateStore.$state = state;
    } catch (e) {
      console.error("SET_GAME_STATE", e);
    }
  });
  on(WebviewEvents.FromClient.UPDATE_GAME_STATE, (event: any) => {
    try {
      updateStoreState(gameStateStore, event);
    } catch (e) {
      console.error("UPDATE_GAME_STATE", e);
    }
  });
}
