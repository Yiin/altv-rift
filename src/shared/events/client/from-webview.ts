export const FromWebview = {
  UPDATE_CHARACTER_APPEARANCE: "UPDATE_CHARACTER_APPEARANCE",
  INPUT_FOCUS: "INPUT_FOCUS",
  CAMERA_MOVE_START: "CAMERA_MOVE_START",
  CAMERA_MOVE_END: "CAMERA_MOVE_END",
  PLAY_SOUND: "PLAY_SOUND",
} as const;

interface EventFromWebview {
  [FromWebview.UPDATE_CHARACTER_APPEARANCE]: (data: string, x: number) => void;
  [FromWebview.INPUT_FOCUS]: (isFocused: boolean) => void;
  [FromWebview.CAMERA_MOVE_START]: () => void;
  [FromWebview.CAMERA_MOVE_END]: () => void;
  [FromWebview.PLAY_SOUND]: (audioName: string, ref: string) => void;
}

declare module "alt-client" {
  export interface WebView {
    on(
      eventName: keyof typeof FromWebview,
      listener: EventFromWebview[typeof eventName]
    ): void;
  }
}
