// Client throws errors because it imports this file from @/shared/events/server/index.ts

import alt from "@altv/server";

export type LoggedInPlayer = alt.Player & {
  /* @ts-ignore */
  pinia: Exclude<alt.Player["pinia"], undefined>;
  /* @ts-ignore */
  user: Exclude<alt.Player["user"], undefined>;
};

export type InGamePlayer = alt.Player & {
  /* @ts-ignore */
  character: Exclude<alt.Player["character"], undefined>;
  /* @ts-ignore */
  gameState: Exclude<alt.Player["gameState"], undefined>;
};

/* @ts-ignore */
export function needsToBeInGame(player: alt.Player): asserts player is InGamePlayer {
  if (!isInGame(player)) {
    throw new Error("Not in game.");
  }
}

export function isInGame(player: alt.Player): player is InGamePlayer {
  /* @ts-ignore */
  return player.character !== undefined;
}

export function needsToBeLoggedIn(player: alt.Player): asserts player is LoggedInPlayer {
  if (!isLoggedIn(player)) {
    throw new Error("Not logged in.");
  }
}

export function isLoggedIn(player: alt.Player): player is LoggedInPlayer {
  /* @ts-ignore */
  return player.user !== undefined;
}
