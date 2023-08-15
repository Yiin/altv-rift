import { NotificationType } from "@shared/interfaces/notification";
import { StoreUpdatePayload } from "@shared/store/utils";

export const FromClient = {
  SETUP_DISCORD_AUTH: "SETUP_DISCORD_AUTH",
  DEBUG: "DEBUG",
  TOGGLE_ELEMENT: "TOGGLE_ELEMENT",
  UPDATE_PLAYER_STATE: "UPDATE_PLAYER_STATE",
  SET_CLIENT_STATE: "SET_CLIENT_STATE",
  UPDATE_CLIENT_STATE: "UPDATE_CLIENT_STATE",
  SHOW_NOTIFICATION: "SHOW_NOTIFICATION"
} as const;

interface EventFromClient {
  [FromClient.SETUP_DISCORD_AUTH]: (url: string) => void;
  [FromClient.DEBUG]: (data: any) => void;
  [FromClient.TOGGLE_ELEMENT]: (element: string, visible: boolean) => void;
  [FromClient.UPDATE_PLAYER_STATE]: (data: StoreUpdatePayload) => void;
  [FromClient.SET_CLIENT_STATE]: (data: StoreUpdatePayload) => void;
  [FromClient.UPDATE_CLIENT_STATE]: (data: StoreUpdatePayload) => void;
  [FromClient.SHOW_NOTIFICATION]: (type: NotificationType, title: string, text: string) => void;
}

declare global {
  export interface Alt {
    on<T extends keyof typeof FromClient>(
      eventName: T,
      listener: EventFromClient[T]
    ): void;
  }
}
