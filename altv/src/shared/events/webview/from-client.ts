import { Character, User } from "@shared/interfaces";
import { GameState } from "@shared/store/game-state.store";
import { ClientState } from "@shared/store/client.store";
import { NotificationType } from "@shared/interfaces/notification";
import { StoreUpdatePayload } from "@shared/store/utils";
import { Item } from "@shared/modules/items";

export const FromClient = {
  SETUP_DISCORD_AUTH: "SETUP_DISCORD_AUTH",
  DEBUG: "DEBUG",
  TOGGLE_ELEMENT: "TOGGLE_ELEMENT",
  SET_USER_STATE: "SET_USER_STATE",
  UPDATE_USER_STATE: "UPDATE_USER_STATE",
  SET_CHARACTER_STATE: "SET_CHARACTER_STATE",
  UPDATE_CHARACTER_STATE: "UPDATE_CHARACTER_STATE",
  SET_GAME_STATE: "SET_GAME_STATE",
  UPDATE_GAME_STATE: "UPDATE_GAME_STATE",
  SET_CLIENT_STATE: "SET_CLIENT_STATE",
  UPDATE_CLIENT_STATE: "UPDATE_CLIENT_STATE",
  SHOW_NOTIFICATION: "SHOW_NOTIFICATION",
  INVENTORY_ITEM_ADD: "INVENTORY_ITEM_ADD",
  OPEN_BUILDER_MENU: "OPEN_BUILDER_MENU",
} as const;

export interface EventFromClient {
  [FromClient.SETUP_DISCORD_AUTH]: (url: string) => void;
  [FromClient.DEBUG]: (data: any) => void;
  [FromClient.TOGGLE_ELEMENT]: (element: string, visible: boolean) => void;
  [FromClient.SET_USER_STATE]: (data: User) => void;
  [FromClient.UPDATE_USER_STATE]: (data: StoreUpdatePayload) => void;
  [FromClient.SET_CHARACTER_STATE]: (data: Character) => void;
  [FromClient.UPDATE_CHARACTER_STATE]: (data: StoreUpdatePayload) => void;
  [FromClient.SET_GAME_STATE]: (data: GameState) => void;
  [FromClient.UPDATE_GAME_STATE]: (data: StoreUpdatePayload) => void;
  [FromClient.SET_CLIENT_STATE]: (data: ClientState) => void;
  [FromClient.UPDATE_CLIENT_STATE]: (data: StoreUpdatePayload) => void;
  [FromClient.SHOW_NOTIFICATION]: (type: NotificationType, title: string, text: string) => void;
  [FromClient.INVENTORY_ITEM_ADD]: (item: Item) => void;
  [FromClient.OPEN_BUILDER_MENU]: (
    screenPosition: { x: number; y: number },
    worldPosition: { x: number; y: number; z: number },
    selectedEntity: {
      type: "shop";
      id: string;
    } | null
  ) => void;
}

declare global {
  export interface Alt {
    on<T extends keyof typeof FromClient>(eventName: T, listener: EventFromClient[T]): void;
  }
}
