import { ItemKey } from "../types";

export function isItemPreviewable(key: ItemKey): any {
  return ["introduction_map"].includes(key);
}
