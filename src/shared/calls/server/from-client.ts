export const FromClient = {
  USE_ITEM: "USE_ITEM",
  EQUIP_ITEM: "EQUIP_ITEM",
  DROP_ITEM: "DROP_ITEM",
  GET_DISCORD_AUTH_URL: "GET_DISCORD_AUTH_URL",
  TRY_CACHED_TOKEN: "TRY_CACHED_TOKEN",
  GET_ENTITY_ACTIONS: "GET_ENTITY_ACTIONS",
  START_CONVERSATION: "START_CONVERSATION",
  TREE_HIT: "TREE_HIT",
} as const;

export interface CallFromClient {
  [FromClient.USE_ITEM]: (player: import("alt-server").Player, slot: number) => boolean;
  [FromClient.EQUIP_ITEM]: (player: import("alt-server").Player, slot: number) => boolean;
  [FromClient.DROP_ITEM]: (player: import("alt-server").Player, slot: number) => boolean;
  [FromClient.GET_DISCORD_AUTH_URL]: (player: import("alt-server").Player) => string;
  [FromClient.TRY_CACHED_TOKEN]: (player: import("alt-server").Player, token: string) => boolean;
  [FromClient.GET_ENTITY_ACTIONS]: (
    player: import("alt-server").Player,
    entityId: number
  ) => { label: string; key: string }[];
  [FromClient.START_CONVERSATION]: (
    player: import("alt-server").Player,
    pedId: import("alt-server").Ped["id"]
  ) => {
    type: "quest";
    pages: string[];
  };
  [FromClient.TREE_HIT]: (
    player: import("alt-server").Player,
    virtualTreeId: number
  ) => import("@shared/modules/woodcutting/interfaces").TreeHitResult;
}
