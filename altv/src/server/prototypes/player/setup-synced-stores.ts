import alt from "@altv/server";
import { ClientEvents } from "@shared/events/client";
import { Character, User } from "@shared/interfaces";
import { LoggedInPlayer } from "@/core/utility/assertions";
import { GameState, getDefaultGameState } from "@shared/store/game-state.store";
import { reactive } from "@yiin/reactive-proxy-state";

declare module "@altv/server" {
  export interface Player {
    setupUserStore(user: User): void;
    setupCharacterStore(this: LoggedInPlayer, character: Character): void;

    user: User;
    character?: Character;
    gameState?: GameState;
  }
}

const unsubscribeStores = new WeakMap<alt.Player, (() => void)[]>();

alt.Player.prototype.setupUserStore = async function (user: User) {
  // User store
  this.user = reactive(user, (event) => {
    this.emitRaw(ClientEvents.FromServer.UPDATE_USER_STATE, event);
  });
};

alt.Player.prototype.setupCharacterStore = async function (character: Character) {
  // Character store
  this.character = reactive(character, (event) => {
    this.emitRaw(ClientEvents.FromServer.UPDATE_CHARACTER_STATE, event);
  });

  // In-Game state
  this.gameState = reactive(getDefaultGameState(), (event) => {
    this.emitRaw(ClientEvents.FromServer.UPDATE_GAME_STATE, event);
  });
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
