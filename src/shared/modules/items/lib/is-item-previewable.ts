import { ItemKey } from "../types";

export function isItemPreviewable(key: ItemKey) {
  return ["introduction_map"].includes(key);
}
