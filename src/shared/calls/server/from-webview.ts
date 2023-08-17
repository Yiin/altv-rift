import { Appearance, ScreenPosition } from "@prisma/client";

export const FromWebview = {
  CREATE_CHARACTER: "CREATE_CHARACTER",
  MOVE_ITEM: "MOVE_ITEM",
  MOVE_WINDOW: "MOVE_WINDOW",
} as const;

export interface CallFromWebview {
  [FromWebview.CREATE_CHARACTER]: (
    player: import("alt-server").Player,
    data: {
      name: string;
      appearance: Appearance;
    }
  ) => boolean;
  [FromWebview.MOVE_ITEM]: (
    player: import("alt-server").Player,
    fromSlot: number,
    toSlot: number
  ) => boolean;
  [FromWebview.MOVE_WINDOW]: (
    player: import("alt-server").Player,
    name: string,
    screen: ScreenPosition,
  ) => void;
}
