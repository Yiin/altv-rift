import * as alt from "@altv/server";

export type LoggedInPlayer = alt.Player & {
  pinia: Exclude<alt.Player["pinia"], undefined>;
  user: Exclude<alt.Player["user"], undefined>;
};

export type InGamePlayer = alt.Player & {
  character: Exclude<alt.Player["character"], undefined>;
  gameState: Exclude<alt.Player["gameState"], undefined>;
};

export function needsToBeInGame(player: alt.Player): asserts player is InGamePlayer {
  if (!isInGame(player)) {
    throw new Error("Not in game.");
  }
}

export function isInGame(player: alt.Player): player is InGamePlayer {
  return player.character !== undefined;
}

export function needsToBeLoggedIn(player: alt.Player): asserts player is LoggedInPlayer {
  if (!isLoggedIn(player)) {
    throw new Error("Not logged in.");
  }
}

export function isLoggedIn(player: alt.Player): player is LoggedInPlayer {
  return player.user !== undefined;
}
