import { NpcID } from "@shared/modules/npc/types";

export const FromClient = {
  USE_ITEM: "USE_ITEM",
  EQUIP_ITEM: "EQUIP_ITEM",
  DROP_ITEM: "DROP_ITEM",
  APPLY_NPC_DAMAGE: "APPLY_NPC_DAMAGE",
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
  [FromClient.APPLY_NPC_DAMAGE]: (
    player: import("alt-server").Player,
    npcId: NpcID,
    damageData: DamageData
  ) => number;
  [FromClient.GET_DISCORD_AUTH_URL]: (
    player: import("alt-server").Player
  ) => string;
  [FromClient.TRY_CACHED_TOKEN]: (
    player: import("alt-server").Player,
    token: string
  ) => boolean;
}
