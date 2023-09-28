export const FromClient = {
  GET_DISCORD_AUTH_URL: "GET_DISCORD_AUTH_URL",
  TRY_CACHED_TOKEN: "TRY_CACHED_TOKEN",
  GET_ENTITY_ACTIONS: "GET_ENTITY_ACTIONS",
  START_CONVERSATION: "START_CONVERSATION",
  BEGIN_TREE_HIT: "BEGIN_TREE_HIT",
  TREE_HIT: "TREE_HIT",
  RELOAD_WEAPON: "RELOAD_WEAPON",
  START_FISHING: "START_FISHING",
  STOP_FISHING: "STOP_FISHING",
  TOGGLE_VEHICLE_DOOR: "TOGGLE_VEHICLE_DOOR",
} as const;

export interface CallFromClient<
  P extends import("@altv/server").Player = import("@altv/server").Player
> {
  [FromClient.GET_DISCORD_AUTH_URL]: (player: P) => string;
  [FromClient.TRY_CACHED_TOKEN]: (player: P, token: string) => boolean;
  [FromClient.GET_ENTITY_ACTIONS]: (
    player: P,
    entityId: number
  ) => { label: string; key: string }[];
  [FromClient.START_CONVERSATION]: (
    player: P,
    pedId: import("@altv/server").Ped["id"]
  ) => {
    type: "quest";
    pages: string[];
  };
  [FromClient.BEGIN_TREE_HIT]: (player: P, virtualTreeId: number) => number;
  [FromClient.TREE_HIT]: (
    player: P,
    virtualTreeId: number
  ) => import("@shared/modules/woodcutting/interfaces").TreeHitResult;
  [FromClient.RELOAD_WEAPON]: (player: P) => boolean;
  [FromClient.START_FISHING]: (player: P) => void;
  [FromClient.STOP_FISHING]: (player: P) => void;
  [FromClient.TOGGLE_VEHICLE_DOOR]: (
    player: P,
    vehicleId: number,
    doorId: number,
    shouldClose?: boolean
  ) => void;
}
