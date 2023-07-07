export const FromClient = {
  BEGIN_CONNECTION: "BEGIN_CONNECTION",
  SCREENSHOT_POPULATE_DATA: "SCREENSHOT_POPULATE_DATA",
  DISCORD_AUTH_DONE: "DISCORD_AUTH_DONE",
  REQUEST_ITEM: "REQUEST_ITEM",
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
}

declare module "alt-server" {
  export function onClient<T extends keyof typeof FromClient>(
    eventName: T,
    listener: EventFromClient[T]
  ): void;
}
