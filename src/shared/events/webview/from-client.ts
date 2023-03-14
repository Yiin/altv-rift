import { StoreUpdatePayload } from "@shared/store/utils";

export const FromClient = {
  SETUP_DISCORD_AUTH: "SETUP_DISCORD_AUTH",
  VIEW_READY: "VIEW_READY",
  DEBUG: "DEBUG",
  TOGGLE_ELEMENT: "TOGGLE_ELEMENT",
  UPDATE_STATE: "UPDATE_STATE",
} as const;

interface EventFromClient {
  [FromClient.SETUP_DISCORD_AUTH]: (url: string) => void;
  [FromClient.VIEW_READY]: () => void;
  [FromClient.DEBUG]: (data: any) => void;
  [FromClient.TOGGLE_ELEMENT]: (element: string, visible: boolean) => void;
  [FromClient.UPDATE_STATE]: (data: StoreUpdatePayload) => void;
}

declare global {
  export interface Alt {
    on<T extends keyof typeof FromClient>(
      eventName: T,
      listener: EventFromClient[T]
    ): void;
  }
}
