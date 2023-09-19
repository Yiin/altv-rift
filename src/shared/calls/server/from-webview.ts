import { Appearance, ScreenPosition } from "@prisma/client/edge";
import { EquipmentSlot, InventoryItemSource, ItemSource } from "../../interfaces";

export const FromWebview = {
  CREATE_CHARACTER: "CREATE_CHARACTER",
  MOVE_ITEM: "MOVE_ITEM",
  MOVE_WINDOW: "MOVE_WINDOW",
  USE_ITEM: "USE_ITEM",
  EQUIP_ITEM: "EQUIP_ITEM",
  UNEQUIP_ITEM: "UNEQUIP_ITEM",
  DROP_ITEM: "DROP_ITEM",
  COMBINE_ITEMS: "COMBINE_ITEMS",
  UNLOAD_AMMO: "UNLOAD_AMMO",
  REMOVE_BAIT: "REMOVE_BAIT",
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
    from: ItemSource,
    toSlot: ItemSource
  ) => boolean;
  [FromWebview.MOVE_WINDOW]: (
    player: import("alt-server").Player,
    name: string,
    screen: ScreenPosition
  ) => void;
  [FromWebview.USE_ITEM]: (player: P, source: InventoryItemSource) => boolean;
  [FromWebview.EQUIP_ITEM]: (player: P, source: InventoryItemSource) => boolean;
  [FromWebview.UNEQUIP_ITEM]: (player: P, equipmentSlot: EquipmentSlot) => boolean;
  [FromWebview.DROP_ITEM]: (player: P, source: ItemSource) => boolean;
  [FromWebview.COMBINE_ITEMS]: (player: P, sourceA: ItemSource, sourceB: ItemSource) => boolean;
  [FromWebview.UNLOAD_AMMO]: (player: P, source: ItemSource) => boolean;
  [FromWebview.REMOVE_BAIT]: (player: P, source: ItemSource) => boolean;
}
