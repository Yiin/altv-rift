import { NotificationType } from "@shared/interfaces/notification";
import { Item } from "@shared/modules/items";
import { StateEvent } from "@yiin/reactive-proxy-state";

export const FromClient = {
  SETUP_DISCORD_AUTH: "SETUP_DISCORD_AUTH",
  DEBUG: "DEBUG",
  TOGGLE_ELEMENT: "TOGGLE_ELEMENT",
  UPDATE_USER_STATE: "UPDATE_USER_STATE",
  UPDATE_CHARACTER_STATE: "UPDATE_CHARACTER_STATE",
  UPDATE_GAME_STATE: "UPDATE_GAME_STATE",
  UPDATE_CLIENT_STATE: "UPDATE_CLIENT_STATE",
  SHOW_NOTIFICATION: "SHOW_NOTIFICATION",
  INVENTORY_ITEM_ADD: "INVENTORY_ITEM_ADD",
  OPEN_BUILDER_MENU: "OPEN_BUILDER_MENU",
  REGISTER_FISHING_CLICK: "REGISTER_FISHING_CLICK",
} as const;

export interface EventFromClient {
  [FromClient.SETUP_DISCORD_AUTH]: (url: string) => void;
  [FromClient.DEBUG]: (data: any) => void;
  [FromClient.TOGGLE_ELEMENT]: (element: string, visible: boolean) => void;
  [FromClient.UPDATE_USER_STATE]: (data: StateEvent) => void;
  [FromClient.UPDATE_CHARACTER_STATE]: (data: StateEvent) => void;
  [FromClient.UPDATE_GAME_STATE]: (data: StateEvent) => void;
  [FromClient.UPDATE_CLIENT_STATE]: (data: StateEvent) => void;
  [FromClient.SHOW_NOTIFICATION]: (
    type: NotificationType,
    text: string,
    options?: { title?: string },
  ) => void;
  [FromClient.INVENTORY_ITEM_ADD]: (item: Item) => void;
  [FromClient.OPEN_BUILDER_MENU]: (
    screenPosition: { x: number; y: number },
    worldPosition: { x: number; y: number; z: number },
    selectedEntity: {
      type: "shop";
      id: string;
    } | null,
  ) => void;
  [FromClient.REGISTER_FISHING_CLICK]: () => void;
}

declare global {
  export interface Alt {
    on<T extends keyof typeof FromClient>(eventName: T, listener: EventFromClient[T]): void;
  }
}
