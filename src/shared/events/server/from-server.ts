export const FromServer = {
  USER_LOADED: "USER_LOADED",
  MANUAL_DISCORD_AUTH_DONE: "MANUAL_DISCORD_AUTH_DONE",
} as const;

export interface EventFromServer {
  [FromServer.USER_LOADED]: (
    player: import("alt-server").Player
  ) => Promise<void> | void;
  [FromServer.MANUAL_DISCORD_AUTH_DONE]: (
    player: import("alt-server").Player,
    token: string
  ) => Promise<void> | void;
}

declare module "alt-server" {
  export function on<T extends keyof typeof FromServer>(
    eventName: T,
    listener: EventFromServer[T]
  ): void;
}
