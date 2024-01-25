import { Appearance, ScreenPosition } from "@prisma/client/edge";
import { EquipmentSlot, InventoryItemSource, ItemSource, ShopSource } from "../../interfaces";

export const FromWebview = {
  CREATE_CHARACTER: "CREATE_CHARACTER",
  MOVE_WINDOW: "MOVE_WINDOW",
  MOVE_ITEM: "MOVE_ITEM",
  USE_ITEM: "USE_ITEM",
  EQUIP_ITEM: "EQUIP_ITEM",
  UNEQUIP_ITEM: "UNEQUIP_ITEM",
  DROP_ITEM: "DROP_ITEM",
  COMBINE_ITEMS: "COMBINE_ITEMS",
  UNLOAD_AMMO: "UNLOAD_AMMO",
  REMOVE_BAIT: "REMOVE_BAIT",
  BUY_ITEM: "BUY_ITEM",
  SELL_ITEM: "SELL_ITEM",
} as const;

export interface CallFromWebview<
  P extends import("@altv/server").Player = import("@altv/server").Player
> {
  [FromWebview.CREATE_CHARACTER]: (
    player: import("@altv/server").Player,
    data: {
      name: string;
      appearance: Appearance;
    }
  ) => boolean;
  [FromWebview.MOVE_WINDOW]: (
    player: import("@altv/server").Player,
    name: string,
    screen: ScreenPosition
  ) => void;
  [FromWebview.MOVE_ITEM]: (
    player: import("@altv/server").Player,
    from: ItemSource,
    toSlot: ItemSource,
    amount?: number
  ) => boolean;
  [FromWebview.USE_ITEM]: (player: P, source: ItemSource) => boolean;
  [FromWebview.EQUIP_ITEM]: (player: P, source: ItemSource) => boolean;
  [FromWebview.UNEQUIP_ITEM]: (player: P, equipmentSlot: EquipmentSlot) => boolean;
  [FromWebview.DROP_ITEM]: (player: P, source: ItemSource, amount: number) => boolean;
  [FromWebview.COMBINE_ITEMS]: (player: P, sourceA: ItemSource, sourceB: ItemSource) => boolean;
  [FromWebview.UNLOAD_AMMO]: (player: P, source: ItemSource) => boolean;
  [FromWebview.REMOVE_BAIT]: (player: P, source: ItemSource) => boolean;
  [FromWebview.BUY_ITEM]: (player: P, source: InventoryItemSource, amount: number) => boolean;
  [FromWebview.SELL_ITEM]: (player: P, shopSource: ShopSource, itemSource: InventoryItemSource, amount: number) => boolean;
}
