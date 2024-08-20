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
  CLOSE_WINDOW: "CLOSE_WINDOW",
  WHEEL_UP: "WHEEL_UP",
  WHEEL_DOWN: "WHEEL_DOWN",
  LEFT_CLICK: "LEFT_CLICK",
  RIGHT_CLICK: "RIGHT_CLICK",
} as const;

declare module "@altv/shared" {
  namespace Events {
    interface CustomWebViewToClientEvent {
      [FromWebview.VIEW_READY]: () => void;
      [FromWebview.UPDATE_CHARACTER_APPEARANCE]: (
        appearance: import("@prisma/client/edge").Appearance,
      ) => void;
      [FromWebview.INPUT_FOCUS]: (isFocused: boolean) => void;
      [FromWebview.CAMERA_MOVE_START]: () => void;
      [FromWebview.CAMERA_MOVE_END]: () => void;
      [FromWebview.PLAY_SOUND]: (audioName: string, ref: string) => void;
      [FromWebview.ACTION_MENU_SELECT]: (key: string) => void;
      [FromWebview.TOGGLE_PLAYER_PREVIEW]: (show: boolean) => void;
      [FromWebview.TRACK_QUEST]: (key: string) => void;
      [FromWebview.CLOSE_WINDOW]: () => void;
      [FromWebview.WHEEL_UP]: (delta: number) => void;
      [FromWebview.WHEEL_DOWN]: (delta: number) => void;
      [FromWebview.LEFT_CLICK]: (pos: { x: number; y: number }) => void;
      [FromWebview.RIGHT_CLICK]: (pos: { x: number; y: number }) => void;
    }
  }
}
