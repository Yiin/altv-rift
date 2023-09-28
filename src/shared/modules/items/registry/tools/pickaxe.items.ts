import { registerItem } from "../../items-registry";
import { makeItemKeys } from "../../lib/make-item-keys";
import { Item } from "../../types";

export const Pickaxes = makeItemKeys<PickaxeItemKey>()({
  BASIC_PICKAXE: "basic_pickaxe",
});

export type PickaxeItemKey = Brand<string, "PickaxeItemKey">;

export type PickaxeItem = {
  key: PickaxeItemKey;
};

export type PickaxeItemInfo = {
  key: PickaxeItemKey;
  name: string;
  description: string;
};

export const pickaxes: Record<PickaxeItemKey, PickaxeItemInfo> = {
  [Pickaxes.BASIC_PICKAXE]: {
    key: Pickaxes.BASIC_PICKAXE,
    name: "Basic Pickaxe",
    description: "A basic pickaxe for mining.",
  },
} as Record<PickaxeItemKey, PickaxeItemInfo>;

/**
 * Register all pickaxes.
 */
for (const [key, info] of Object.entries(pickaxes)) {
  registerItem(key as PickaxeItemKey, info);
}

export function isItemKeyPickaxe(key: string): key is PickaxeItemKey {
  return key in pickaxes;
}

export function isItemPickaxe(item: Item): item is PickaxeItem {
  return isItemKeyPickaxe(item.key);
}
