import alt from "alt-server";

export type InGamePlayer = alt.Player & { store: { isLoggedIn: true } };

export function needsToBeInGame(player: alt.Player): asserts player is InGamePlayer {
  // @ts-ignore Client throws error because it imports this file from @/shared/events/server/index.ts
  if (!player.store.isLoggedIn) {
    throw new Error("Not in game.");
  }
}

export function isInGame(player: alt.Player): player is InGamePlayer {
  // @ts-ignore Client throws error because it imports this file from @/shared/events/server/index.ts
  return player.store.isLoggedIn;
}
