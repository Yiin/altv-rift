export const FromWebview = {
  VIEW_READY: "VIEW_READY",
  UPDATE_CHARACTER_APPEARANCE: "UPDATE_CHARACTER_APPEARANCE",
  INPUT_FOCUS: "INPUT_FOCUS",
  CAMERA_MOVE_START: "CAMERA_MOVE_START",
  CAMERA_MOVE_END: "CAMERA_MOVE_END",
  PLAY_SOUND: "PLAY_SOUND",
  ACTION_MENU_SELECT: "ACTION_MENU_SELECT",
  TOGGLE_PLAYER_PREVIEW: "TOGGLE_PLAYER_PREVIEW",
  TRACK_QUEST: "TRACK_QUEST",
} as const;

interface EventFromWebview {
  [FromWebview.VIEW_READY]: () => void;
  [FromWebview.UPDATE_CHARACTER_APPEARANCE]: (data: string, x: number) => void;
  [FromWebview.INPUT_FOCUS]: (isFocused: boolean) => void;
  [FromWebview.CAMERA_MOVE_START]: () => void;
  [FromWebview.CAMERA_MOVE_END]: () => void;
  [FromWebview.PLAY_SOUND]: (audioName: string, ref: string) => void;
  [FromWebview.ACTION_MENU_SELECT]: (key: string) => void;
  [FromWebview.TOGGLE_PLAYER_PREVIEW]: (show: boolean) => void;
  [FromWebview.TRACK_QUEST]: (key: string) => void;
}

declare module "alt-client" {
  export interface WebView {
    on<T extends keyof EventFromWebview>(eventName: T, listener: EventFromWebview[T]): void;
  }
}
