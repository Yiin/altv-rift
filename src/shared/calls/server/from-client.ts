export const FromClient = {
  USE_ITEM: "USE_ITEM",
  EQUIP_ITEM: "EQUIP_ITEM",
  DROP_ITEM: "DROP_ITEM",
  GET_DISCORD_AUTH_URL: "GET_DISCORD_AUTH_URL",
  TRY_CACHED_TOKEN: "TRY_CACHED_TOKEN",
} as const;

export interface CallFromClient {
  [FromClient.USE_ITEM]: (
    player: import("alt-server").Player,
    slot: number
  ) => boolean;
  [FromClient.EQUIP_ITEM]: (
    player: import("alt-server").Player,
    slot: number
  ) => boolean;
  [FromClient.DROP_ITEM]: (
    player: import("alt-server").Player,
    slot: number
  ) => boolean;
  [FromClient.GET_DISCORD_AUTH_URL]: (
    player: import("alt-server").Player
  ) => string;
  [FromClient.TRY_CACHED_TOKEN]: (
    player: import("alt-server").Player,
    token: string
  ) => boolean;
}
