import { z } from "zod";

export const FromClient = {
  GET_DISCORD_AUTH_URL: "GET_DISCORD_AUTH_URL",
  TRY_CACHED_TOKEN: "TRY_CACHED_TOKEN",
  START_CONVERSATION: "START_CONVERSATION",
  BEGIN_TREE_HIT: "BEGIN_TREE_HIT",
  TREE_HIT: "TREE_HIT",
  RELOAD_WEAPON: "RELOAD_WEAPON",
  START_FISHING: "START_FISHING",
  STOP_FISHING: "STOP_FISHING",
  START_DIGGING: "START_DIGGING",
  STOP_DIGGING: "STOP_DIGGING",
  TOGGLE_VEHICLE_DOOR: "TOGGLE_VEHICLE_DOOR",
  OPEN_STORAGE: "OPEN_STORAGE",
} as const;

export interface CallFromClient<
  Player extends import("@altv/server").Player = import("@altv/server").Player
> {
  [FromClient.GET_DISCORD_AUTH_URL]: (player: Player) => string;
  [FromClient.TRY_CACHED_TOKEN]: (player: Player, token: string) => boolean;
  [FromClient.START_CONVERSATION]: (
    player: Player,
    pedId: import("@altv/server").Ped["id"]
  ) => {
    type: "quest";
    pages: string[];
  };
  [FromClient.BEGIN_TREE_HIT]: (player: Player, virtualTreeId: number) => number;
  [FromClient.TREE_HIT]: (
    player: Player,
    virtualTreeId: number
  ) => import("@shared/modules/woodcutting/interfaces").TreeHitResult;
  [FromClient.RELOAD_WEAPON]: (player: Player) => boolean;
  [FromClient.START_FISHING]: (player: Player) => void;
  [FromClient.STOP_FISHING]: (player: Player) => void;
  [FromClient.START_DIGGING]: (player: Player) => void;
  [FromClient.STOP_DIGGING]: (player: Player) => void;
  [FromClient.TOGGLE_VEHICLE_DOOR]: (
    player: Player,
    vehicleId: number,
    doorId: number,
    shouldClose?: boolean
  ) => void;
  [FromClient.OPEN_STORAGE]: (player: Player, storageId: number) => boolean;
}

export const FromClientValidation = {
  [FromClient.GET_DISCORD_AUTH_URL]: {
    returns: z.string(),
  },
  [FromClient.TRY_CACHED_TOKEN]: {
    args: [z.string()],
    returns: z.boolean(),
  },
  [FromClient.START_CONVERSATION]: {
    args: [z.number()],
    returns: z.object({
      type: z.literal("quest"),
      pages: z.array(z.string()),
    }),
  },
  [FromClient.BEGIN_TREE_HIT]: {
    args: [z.number()],
    returns: z.number(),
  },
  [FromClient.TREE_HIT]: {
    args: [z.number()],
    returns: z.number(),
  },
  [FromClient.RELOAD_WEAPON]: {
    returns: z.boolean(),
  },
  [FromClient.START_FISHING]: {},
  [FromClient.STOP_FISHING]: {},
  [FromClient.START_DIGGING]: {},
  [FromClient.STOP_DIGGING]: {},
  [FromClient.TOGGLE_VEHICLE_DOOR]: {
    args: [z.number(), z.number(), z.boolean().optional()],
  },
  [FromClient.OPEN_STORAGE]: {
    args: [z.number()],
    returns: z.boolean(),
  },
} satisfies Record<keyof typeof FromClient, { args?: [z.ZodTypeAny, ...z.ZodTypeAny[]], returns?: z.ZodTypeAny }>;
