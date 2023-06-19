import { NpcID, NpcSyncPayload } from "@shared/modules/npc/types";

export const FromClient = {
  BEGIN_CONNECTION: "BEGIN_CONNECTION",
  SCREENSHOT_POPULATE_DATA: "SCREENSHOT_POPULATE_DATA",
  DISCORD_AUTH_DONE: "DISCORD_AUTH_DONE",
  REQUEST_ITEM: "REQUEST_ITEM",
  SYNC_NPC: "SYNC_NPC",
  STOP_NPC_TASK: "STOP_NPC_TASK",
} as const;

export interface EventFromClient {
  [FromClient.BEGIN_CONNECTION]: (player: import("alt-server").Player) => void;
  [FromClient.SCREENSHOT_POPULATE_DATA]: (
    player: import("alt-server").Player,
    payload: {
      data: string;
      i: number;
      totalLength: number;
    }
  ) => void;
  [FromClient.DISCORD_AUTH_DONE]: (
    player: import("alt-server").Player,
    token: string
  ) => void;
  [FromClient.REQUEST_ITEM]: (player: import("alt-server").Player) => void;
  [FromClient.SYNC_NPC]: (
    player: import("alt-server").Player,
    payload: NpcSyncPayload
  ) => void;
  [FromClient.STOP_NPC_TASK]: (
    player: import("alt-server").Player,
    npcId: NpcID
  ) => void;
}

declare module "alt-server" {
  export function onClient<T extends keyof typeof FromClient>(
    eventName: T,
    listener: EventFromClient[T]
  ): void;
}
