import { ItemKey } from "../types";
import { getItemKeyEquipmentSlot } from "./get-item-equipment-slot";

export function isItemEquipable(key: ItemKey) {
  return !!getItemKeyEquipmentSlot(key);
}
