export enum PlayerFlags {
  InFishingArea = "InFishingArea",
  IsFishing = "IsFishing",
}

export interface GameState {
  isInGame: boolean;
  isLoggedIn: boolean;
  flags: Set<PlayerFlags>;
}

export const getDefaultGameState = (): GameState => ({
  isInGame: false,
  isLoggedIn: false,
  flags: new Set(),
});
