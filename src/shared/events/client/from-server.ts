import * as alt from "@altv/shared";
import { StoreUpdatePayload } from "@shared/store/utils";
import { Spinner } from "@shared/modules/game/ui/spinner/spinner";

export const FromServer = {
  BEGIN_NATIVE_DISCORD_AUTH: "BEGIN_NATIVE_DISCORD_AUTH",
  REMEMBER_AUTH_TOKEN: "REMEMBER_AUTH_TOKEN",
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
  ENTITYSET_ACTIVATE: "ENTITYSET_ACTIVATE",
  ENTITYSET_DEACTIVATE: "ENTITYSET_DEACTIVATE",
  SET_USER_STATE: "SET_USER_STATE",
  UPDATE_USER_STATE: "UPDATE_USER_STATE",
  SET_CHARACTER_STATE: "SET_CHARACTER_STATE",
  UPDATE_CHARACTER_STATE: "UPDATE_CHARACTER_STATE",
  SET_GAME_STATE: "SET_GAME_STATE",
  UPDATE_GAME_STATE: "UPDATE_GAME_STATE",
  SET_SERVER_STATE: "SET_SERVER_STATE",
  UPDATE_SERVER_STATE: "UPDATE_SERVER_STATE",
} as const;

declare module "@altv/shared" {
  namespace Events {
    interface CustomServerToPlayerEvent {
      [FromServer.BEGIN_NATIVE_DISCORD_AUTH]: () => void;
      [FromServer.REMEMBER_AUTH_TOKEN]: (token: string) => void;
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
      [FromServer.PLAYER_EMIT_SPINNER]: (data: Spinner) => void;
      [FromServer.PLAYER_EMIT_SPINNER_CLEAR]: () => void;
      [FromServer.SCREENSHOT_CREATE]: () => void;
      [FromServer.PLAYER_RELOAD]: () => void;
      [FromServer.PLAYER_EMIT_NOTIFICATION]: (text: string) => void;
      [FromServer.PLAYER_EMIT_MISSION_TEXT]: (text: string, duration?: number) => void;
      [FromServer.PLAYER_EMIT_TEMP_OBJECT_LERP]: (
        model: string,
        start: alt.IVector3,
        end: alt.IVector3,
        speed: number
      ) => void;
      [FromServer.IPL_LOAD]: (name: string) => void;
      [FromServer.IPL_UNLOAD]: (name: string) => void;
      [FromServer.ENTITYSET_ACTIVATE]: (interior: number, entitySetName: string) => void;
      [FromServer.ENTITYSET_DEACTIVATE]: (interior: number, entitySetName: string) => void;
      [FromServer.SET_USER_STATE]: (state: any) => void;
      [FromServer.UPDATE_USER_STATE]: (payload: StoreUpdatePayload) => void;
      [FromServer.SET_CHARACTER_STATE]: (state: any) => void;
      [FromServer.UPDATE_CHARACTER_STATE]: (payload: StoreUpdatePayload) => void;
      [FromServer.SET_GAME_STATE]: (state: any) => void;
      [FromServer.UPDATE_GAME_STATE]: (payload: StoreUpdatePayload) => void;
      [FromServer.SET_SERVER_STATE]: (state: any) => void;
      [FromServer.UPDATE_SERVER_STATE]: (payload: StoreUpdatePayload) => void;
    }
  }
}
