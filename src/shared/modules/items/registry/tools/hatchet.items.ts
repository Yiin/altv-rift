import { registerItem } from "../../items-registry";
import { makeItemKeys } from "../../lib/make-item-keys";
import { Item } from "../../types";

export const Hatchets = makeItemKeys<HatchetItemKey>()({
  BASIC_HATCHET: "basic_hatchet",
  BASIC_PICKAXE: "basic_pickaxe",
  HARDENED_HATCHET: "hardened_hatchet",
});

export type HatchetItemKey = Brand<string, "HatchetItemKey">;

export type HatchetItem = {
  key: HatchetItemKey;
};

export type HatchetItemInfo = {
  key: HatchetItemKey;
  name: string;
  description: string;
};

export const hatchets: Record<HatchetItemKey, HatchetItemInfo> = {
  [Hatchets.BASIC_HATCHET]: {
    key: Hatchets.BASIC_HATCHET,
    name: "Basic Hatchet",
    description: "A basic hatchet for woodcutting.",
  },
  [Hatchets.HARDENED_HATCHET]: {
    key: Hatchets.HARDENED_HATCHET,
    name: "Hardened Hatchet",
    description: "A hardened hatchet for woodcutting.",
  },
} as Record<HatchetItemKey, HatchetItemInfo>;

/**
 * Register all hatchets.
 */
for (const [key, info] of Object.entries(hatchets)) {
  registerItem(key as HatchetItemKey, info);
}

export function isItemKeyHatchet(key: string): key is HatchetItemKey {
  return key in hatchets;
}

export function isItemHatchet(item: Item): item is HatchetItem {
  return isItemKeyHatchet(item.key);
}
