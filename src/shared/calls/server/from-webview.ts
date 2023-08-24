import { Appearance, ScreenPosition } from "@prisma/client";
import { EquipmentSlot } from "../../interfaces";

export const FromWebview = {
  CREATE_CHARACTER: "CREATE_CHARACTER",
  MOVE_ITEM: "MOVE_ITEM",
  MOVE_WINDOW: "MOVE_WINDOW",
  USE_ITEM: "USE_ITEM",
  EQUIP_ITEM: "EQUIP_ITEM",
  UNEQUIP_ITEM: "UNEQUIP_ITEM",
  DROP_ITEM: "DROP_ITEM",
  LOAD_AMMO: "LOAD_AMMO",
  UNLOAD_AMMO: "UNLOAD_AMMO",
} as const;

export interface CallFromWebview<
  P extends import("alt-server").Player = import("alt-server").Player
> {
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
    screen: ScreenPosition
  ) => void;
  [FromWebview.USE_ITEM]: (player: P, slot: number) => boolean;
  [FromWebview.EQUIP_ITEM]: (player: P, slot: number) => boolean;
  [FromWebview.UNEQUIP_ITEM]: (player: P, equipmentSlot: EquipmentSlot) => boolean;
  [FromWebview.DROP_ITEM]: (player: P, slot: number) => boolean;
  [FromWebview.LOAD_AMMO]: (player: P, slotA: number, slotB: number) => boolean;
  [FromWebview.UNLOAD_AMMO]: (player: P, slot: number) => boolean;
}
