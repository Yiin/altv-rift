import { getItemInfoByKey } from "../items-registry";
import { ItemKey } from "../types";

export function getItemTier(key: ItemKey) {
  const itemInfo = getItemInfoByKey(key);
  return itemInfo && 'tier' in itemInfo ? itemInfo.tier : null;
}
