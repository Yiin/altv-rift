export const FromClient = {
  BEGIN_CONNECTION: "BEGIN_CONNECTION",
  SCREENSHOT_POPULATE_DATA: "SCREENSHOT_POPULATE_DATA",
  DISCORD_AUTH_DONE: "DISCORD_AUTH_DONE",
  NOTIFY: "NOTIFY",
  WEAPON_SHOOT: "WEAPON_SHOOT",
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
  [FromClient.DISCORD_AUTH_DONE]: (player: import("alt-server").Player, token: string) => void;
  [FromClient.NOTIFY]: (player: import("alt-server").Player, notification: string) => void;
  [FromClient.WEAPON_SHOOT]: (player: import("alt-server").Player) => void;
}

declare module "alt-server" {
  export function onClient<T extends keyof typeof FromClient>(
    eventName: T,
    listener: EventFromClient[T]
  ): void;
}
