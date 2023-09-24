import * as alt from "@altv/server";
import { Pinia, Store, createPinia, defineStore } from "pinia";
import { ClientEvents } from "@shared/events/client";
import { subscribeToStore } from "@shared/store/utils";
import { Character, User } from "@shared/interfaces";
import { serverStore } from "@/store/server.store";
import { LoggedInPlayer } from "@/utility/assertions";
import { useGameState } from "@/store/game-state.store";

declare module "@altv/server" {
  export interface Player {
    setupUserStore(user: User): void;
    setupCharacterStore(this: LoggedInPlayer, character: Character): void;

    pinia?: Pinia;
    user: Store<"user", User, {}, {}>;
    character?: Store<"character", Character, {}, {}>;
    gameState?: ReturnType<typeof useGameState>;
  }
}

const unsubscribeStores = new WeakMap<alt.Player, (() => void)[]>();

alt.Player.prototype.setupUserStore = async function (user: User) {
  this.pinia = createPinia();

  // User store
  this.user = defineStore("user", {
    state: () => user,
  })(this.pinia);

  const unsubscribeUserStore = subscribeToStore(this.user, {
    onSetState: (state) => {
      this.emit(ClientEvents.FromServer.SET_USER_STATE, state);
    },
    onUpdateState: (payload) => {
      this.emit(ClientEvents.FromServer.UPDATE_USER_STATE, payload);
    },
  });

  // Server state
  const unsubscribeServerStore = subscribeToStore(serverStore, {
    onSetState: (state) => {
      this.emit(ClientEvents.FromServer.SET_SERVER_STATE, state);
    },
    onUpdateState: (payload) => {
      this.emit(ClientEvents.FromServer.UPDATE_SERVER_STATE, payload);
    },
  });

  unsubscribeStores.set(this, [unsubscribeUserStore, unsubscribeServerStore]);
};

alt.Player.prototype.setupCharacterStore = async function (character: Character) {
  // Character store
  this.character = defineStore("character", {
    state: () => character,
  })(this.pinia);

  const unsubscribeCharacterStore = subscribeToStore(this.character, {
    onSetState: (state) => {
      this.emit(ClientEvents.FromServer.SET_CHARACTER_STATE, state);
    },
    onUpdateState: (payload) => {
      this.emit(ClientEvents.FromServer.UPDATE_CHARACTER_STATE, payload);
    },
  });

  // In-Game state
  this.gameState = useGameState(this.pinia);
  this.gameState.isLoggedIn = true;
  this.gameState.isInGame = true;

  const unsubscribeGameStateStore = subscribeToStore(this.gameState, {
    onSetState: (state) => {
      alt.log("Setting game state", state);
      this.emit(ClientEvents.FromServer.SET_GAME_STATE, state);
    },
    onUpdateState: (payload) => {
      alt.log("Updating game state", payload);
      this.emit(ClientEvents.FromServer.UPDATE_GAME_STATE, payload);
    },
  });

  unsubscribeStores.set(this, [
    ...unsubscribeStores.get(this)!,
    unsubscribeCharacterStore,
    unsubscribeGameStateStore,
  ]);
};

/**
 * Unsubscribe from all stores when a player disconnects
 */
alt.Events.onPlayerDisconnect(({ player }) => {
  const unsubscribe = unsubscribeStores.get(player);
  if (!unsubscribe) {
    return;
  }

  for (const unsubscribeStore of unsubscribe) {
    unsubscribeStore();
  }
});
