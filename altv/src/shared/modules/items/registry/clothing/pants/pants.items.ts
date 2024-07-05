import { Item, registerItems } from "@shared/modules/items";
import { PantsItemKey } from "./pants.keys";
const PANTS_ITEMS: Record<string, PantsItemInfo> = (await import("./pants.json")).default as any;

export type PantsItem = {
  key: PantsItemKey;

  customName?: string | null;
};

export type PantsItemInfo = {
  key: PantsItemKey;
  ped: string;
  dlc: string;
  dlcDrawableId: number;
  componentId: number;
  drawableId: number;
  textureId: number;
  name: string;
  price: number;
  restrictionTags: string[] | null;
};

export const pants = registerItems(Object.values(PANTS_ITEMS));

/**
 * Type guards for pants
 */
export function isItemKeyPants(key: string): key is PantsItemKey {
  return pants.has(key as PantsItemKey);
}

export function isItemPants(item: Item): item is PantsItem {
  return isItemKeyPants(item.key);
}
