import alt from "alt-server";

export type InGamePlayer = alt.Player & { store: { isLoggedIn: true } };

export function needsToBeInGame(player: alt.Player): asserts player is InGamePlayer {
  if (!player.store.isLoggedIn) {
    throw new Error("Not in game.");
  }
}
