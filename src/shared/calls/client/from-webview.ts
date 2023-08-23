import { Equipment } from "../../interfaces";

export const FromWebview = {
  USE_ITEM: "USE_ITEM",
  EQUIP_ITEM: "EQUIP_ITEM",
  UNEQUIP_ITEM: "UNEQUIP_ITEM",
  DROP_ITEM: "DROP_ITEM",
} as const;

export interface CallFromWebview {
  [FromWebview.USE_ITEM]: (slot: number) => boolean;
  [FromWebview.EQUIP_ITEM]: (slot: number) => boolean;
  [FromWebview.UNEQUIP_ITEM]: (equipmentSlot: keyof Equipment) => boolean;
  [FromWebview.DROP_ITEM]: (slot: number) => boolean;
}
