import { Equipment } from "@shared/interfaces";

export const FromClient = {
  USE_ITEM: "USE_ITEM",
  EQUIP_ITEM: "EQUIP_ITEM",
  UNEQUIP_ITEM: "UNEQUIP_ITEM",
  DROP_ITEM: "DROP_ITEM",
  GET_DISCORD_AUTH_URL: "GET_DISCORD_AUTH_URL",
  TRY_CACHED_TOKEN: "TRY_CACHED_TOKEN",
  GET_ENTITY_ACTIONS: "GET_ENTITY_ACTIONS",
  START_CONVERSATION: "START_CONVERSATION",
  BEGIN_TREE_HIT: "BEGIN_TREE_HIT",
  TREE_HIT: "TREE_HIT",
} as const;

export interface CallFromClient<
  P extends import("alt-server").Player = import("alt-server").Player
> {
  [FromClient.USE_ITEM]: (player: P, slot: number) => boolean;
  [FromClient.EQUIP_ITEM]: (player: P, slot: number) => boolean;
  [FromClient.UNEQUIP_ITEM]: (player: P, equipmentSlot: keyof Equipment) => boolean;
  [FromClient.DROP_ITEM]: (player: P, slot: number) => boolean;
  [FromClient.GET_DISCORD_AUTH_URL]: (player: P) => string;
  [FromClient.TRY_CACHED_TOKEN]: (player: P, token: string) => boolean;
  [FromClient.GET_ENTITY_ACTIONS]: (
    player: P,
    entityId: number
  ) => { label: string; key: string }[];
  [FromClient.START_CONVERSATION]: (
    player: P,
    pedId: import("alt-server").Ped["id"]
  ) => {
    type: "quest";
    pages: string[];
  };
  [FromClient.BEGIN_TREE_HIT]: (player: P, virtualTreeId: number) => number;
  [FromClient.TREE_HIT]: (
    player: P,
    virtualTreeId: number
  ) => import("@shared/modules/woodcutting/interfaces").TreeHitResult;
}
