import alt from "alt-shared";
import { IErrorScreen, ISpinner } from "@shared/interfaces";
import { StoreUpdatePayload } from "@shared/store/utils";

export const FromServer = {
  BEGIN_NATIVE_DISCORD_AUTH: "BEGIN_NATIVE_DISCORD_AUTH",
  BEGIN_MANUAL_DISCORD_AUTH: "BEGIN_MANUAL_DISCORD_AUTH",
  START_CHARACTER_CREATION_SCENE: "START_CHARACTER_CREATION_SCENE",
  END_CHARACTER_CREATION_SCENE: "END_CHARACTER_CREATION_SCENE",
  START_CHARACTER_SELECTION_SCENE: "START_CHARACTER_SELECTION_SCENE",
  CANCEL_CHARACTER_CREATION: "CANCEL_CHARACTER_CREATION",
  CHARACTER_CREATED: "CHARACTER_CREATED",
  SET_PLAYER_DECORATIONS: "SET_PLAYER_DECORATIONS",
  START_GAME: "START_GAME",
  SETUP_WEBVIEW: "SETUP_WEBVIEW",
  PLAYER_EMIT_SPINNER: "PLAYER_EMIT_SPINNER",
  PLAYER_EMIT_SPINNER_CLEAR: "PLAYER_EMIT_SPINNER_CLEAR",
  SCREENSHOT_CREATE: "SCREENSHOT_CREATE",
  PLAYER_RELOAD: "PLAYER_RELOAD",
  PLAYER_EMIT_NOTIFICATION: "PLAYER_EMIT_NOTIFICATION",
  PLAYER_EMIT_MISSION_TEXT: "PLAYER_EMIT_MISSION_TEXT",
  PLAYER_EMIT_TEMP_OBJECT_LERP: "PLAYER_EMIT_TEMP_OBJECT_LERP",
  IPL_LOAD: "IPL_LOAD",
  IPL_UNLOAD: "IPL_UNLOAD",
  PLAYER_EMIT_ERROR_SCREEN: "PLAYER_EMIT_ERROR_SCREEN",
  PLAYER_EMIT_ERROR_SCREEN_CLEAR: "PLAYER_EMIT_ERROR_SCREEN_CLEAR",
  ENTITYSET_ACTIVATE: "ENTITYSET_ACTIVATE",
  ENTITYSET_DEACTIVATE: "ENTITYSET_DEACTIVATE",
  SET_STATE: "SET_STATE",
  UPDATE_STATE: "UPDATE_STATE",
} as const;

export interface EventFromServer {
  [FromServer.BEGIN_NATIVE_DISCORD_AUTH]: () => void;
  [FromServer.BEGIN_MANUAL_DISCORD_AUTH]: (url: string) => void;
  [FromServer.START_CHARACTER_CREATION_SCENE]: () => void;
  [FromServer.END_CHARACTER_CREATION_SCENE]: () => void;
  [FromServer.START_CHARACTER_SELECTION_SCENE]: () => void;
  [FromServer.CANCEL_CHARACTER_CREATION]: () => void;
  [FromServer.CHARACTER_CREATED]: () => void;
  [FromServer.SET_PLAYER_DECORATIONS]: (
    decorations: { collection: number; overlay: number }[]
  ) => void;
  [FromServer.START_GAME]: () => void;
  [FromServer.SETUP_WEBVIEW]: (url?: string) => void;
  [FromServer.PLAYER_EMIT_SPINNER]: (data: ISpinner) => void;
  [FromServer.PLAYER_EMIT_SPINNER_CLEAR]: () => void;
  [FromServer.SCREENSHOT_CREATE]: () => void;
  [FromServer.PLAYER_RELOAD]: () => void;
  [FromServer.PLAYER_EMIT_NOTIFICATION]: (text: string) => void;
  [FromServer.PLAYER_EMIT_MISSION_TEXT]: (
    text: string,
    duration?: number
  ) => void;
  [FromServer.PLAYER_EMIT_TEMP_OBJECT_LERP]: (
    model: string,
    start: alt.IVector3,
    end: alt.IVector3,
    speed: number
  ) => void;
  [FromServer.IPL_LOAD]: (name: string) => void;
  [FromServer.IPL_UNLOAD]: (name: string) => void;
  [FromServer.PLAYER_EMIT_ERROR_SCREEN]: (screen: IErrorScreen) => void;
  [FromServer.PLAYER_EMIT_ERROR_SCREEN_CLEAR]: () => void;
  [FromServer.ENTITYSET_ACTIVATE]: (
    interior: number,
    entitySetName: string
  ) => void;
  [FromServer.ENTITYSET_DEACTIVATE]: (
    interior: number,
    entitySetName: string
  ) => void;
  [FromServer.SET_STATE]: (state: any) => void;
  [FromServer.UPDATE_STATE]: (payload: StoreUpdatePayload) => void;
}

declare module "alt-client" {
  export function onServer<T extends keyof typeof FromServer>(
    eventName: T,
    listener: EventFromServer[T]
  ): void;
}
