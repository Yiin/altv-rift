import alt from "@altv/shared";
import { z } from "zod";
import { EquipmentSlot } from "@shared/interfaces";
import { schema } from "../validation";

export const FromClient = {
  GET_DISCORD_AUTH_URL: "GET_DISCORD_AUTH_URL",
  TRY_CACHED_TOKEN: "TRY_CACHED_TOKEN",
  BEGIN_TREE_HIT: "BEGIN_TREE_HIT",
  TREE_HIT: "TREE_HIT",
  RELOAD_WEAPON: "RELOAD_WEAPON",
  START_FISHING: "START_FISHING",
  STOP_FISHING: "STOP_FISHING",
  START_DIGGING: "START_DIGGING",
  STOP_DIGGING: "STOP_DIGGING",
  TOGGLE_VEHICLE_DOOR: "TOGGLE_VEHICLE_DOOR",
  OPEN_STORAGE: "OPEN_STORAGE",
  REGISTER_KEY_PRESS: "REGISTER_KEY_PRESS",
  USE_QUICK_SLOT: "USE_QUICK_SLOT",
  BEGIN_ORE_HIT: "BEGIN_ORE_HIT",
  ORE_HIT: "ORE_HIT",
} as const;

export interface CallFromClient {
  [FromClient.GET_DISCORD_AUTH_URL]: () => string;
  [FromClient.TRY_CACHED_TOKEN]: (token: string) => boolean;
  [FromClient.BEGIN_TREE_HIT]: (virtualTreeId: number) => number;
  [FromClient.TREE_HIT]: (virtualTreeId: number) => number;
  [FromClient.RELOAD_WEAPON]: () => boolean;
  [FromClient.START_FISHING]: () => void;
  [FromClient.STOP_FISHING]: () => void;
  [FromClient.START_DIGGING]: () => void;
  [FromClient.STOP_DIGGING]: () => void;
  [FromClient.TOGGLE_VEHICLE_DOOR]: (
    vehicleId: number,
    doorId: number,
    shouldClose?: boolean,
  ) => void;
  [FromClient.OPEN_STORAGE]: (storageId: number) => boolean;
  [FromClient.REGISTER_KEY_PRESS]: (key: alt.Enums.KeyCode) => void;
  [FromClient.USE_QUICK_SLOT]: (slot: EquipmentSlot) => boolean;
  [FromClient.BEGIN_ORE_HIT]: (virtualOreId: number) => number;
  [FromClient.ORE_HIT]: (virtualOreId: number) => number;
}

export const FromClientValidation = {
  [FromClient.GET_DISCORD_AUTH_URL]: {
    returns: z.string(),
  },
  [FromClient.TRY_CACHED_TOKEN]: {
    args: [z.string()],
    returns: z.boolean(),
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
  [FromClient.REGISTER_KEY_PRESS]: {
    args: [z.number()],
  },
  [FromClient.USE_QUICK_SLOT]: {
    args: [schema.equipmentSlot],
    returns: z.boolean(),
  },
  [FromClient.BEGIN_ORE_HIT]: {
    args: [z.number()],
    returns: z.number(),
  },
  [FromClient.ORE_HIT]: {
    args: [z.number()],
    returns: z.number(),
  },
} satisfies Record<
  keyof typeof FromClient,
  { args?: [z.ZodTypeAny, ...z.ZodTypeAny[]]; returns?: z.ZodTypeAny }
>;
