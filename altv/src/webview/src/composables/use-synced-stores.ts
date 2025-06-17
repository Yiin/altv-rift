import { defineStore } from "pinia";
import { updateState } from "@yiin/reactive-proxy-state";
import { WebviewEvents } from "@shared/events/webview";
import {
  setCharacterStore,
  useCharacter,
  type CharacterStore,
} from "@/store/synced/character.store";
import { useClient } from "@/store/synced/client.store";
import { useGameState } from "@/store/synced/game-state.store";
import { setUserStore, useUser, type UserStore } from "@/store/synced/user.store";
import { useAlt } from "./use-alt";

export function useSyncedStores() {
  const { on } = useAlt();
  const clientStore = useClient();
  const gameStateStore = useGameState();

  on(WebviewEvents.FromClient.UPDATE_CLIENT_STATE, (event: any) => {
    try {
      updateState(clientStore, event);
    } catch (e) {
      console.error("UPDATE_CLIENT_STATE", e);
    }
  });

  on(WebviewEvents.FromClient.UPDATE_USER_STATE, (event) => {
    const userStore = useUser();

    if (!userStore) {
      try {
        const store = defineStore("user", {
          state: () => ({}),
        }) as UserStore;
        updateState(store, event);
        setUserStore(store);
      } catch (e) {
        console.error("SET_USER_STATE", e);
      }
    } else {
      try {
        updateState(userStore, event);
      } catch (e) {
        console.error("UPDATE_USER_STATE", e);
      }
    }
  });

  on(WebviewEvents.FromClient.UPDATE_CHARACTER_STATE, (event: any) => {
    const characterStore = useCharacter();

    if (!characterStore) {
      try {
        const store = defineStore("character", {
          state: () => ({}),
        }) as CharacterStore;
        updateState(store, event);
        setCharacterStore(store);
      } catch (e) {
        console.error("UPDATE_CHARACTER_STATE", e);
      }
    } else {
      try {
        updateState(characterStore, event);
      } catch (e) {
        console.error("UPDATE_CHARACTER_STATE", e);
      }
    }
  });

  on(WebviewEvents.FromClient.UPDATE_GAME_STATE, (event: any) => {
    try {
      updateState(gameStateStore, event);
    } catch (e) {
      console.error("UPDATE_GAME_STATE", e);
    }
  });
}
