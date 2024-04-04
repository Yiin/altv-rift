import { registerItems } from "../../items-registry";
import { makeKeys } from "../../../../utility/make-keys";
import { Item, ItemKey } from "../../types";

export const Sand = makeKeys<SandItemKey>()({
  SAND: "sand",
  GRAVEL: "gravel",
});

export type SandItemKey = Brand<string, "SandItemKey">;

export type SandItem = {
  key: SandItemKey;
  amount: number;
};

export type SandItemInfo = {
  key: SandItemKey;
  name: string;
  description: string;
};

const sands = registerItems<SandItemInfo>([
  {
    key: Sand.SAND,
    name: "Sand",
    description:
      "Extracted and smelted to its purest form, this sand serves as the foundation for countless creations. A staple in any craftsman's inventory",
  },
  {
    key: Sand.GRAVEL,
    name: "Gravel",
    description: "Gravel is a loose aggregation of rock fragments and is used for making concrete.",
  },
]);

export function isItemKeySand(key: string): key is SandItemKey {
  return sands.has(key as SandItemKey);
}

export function isItemSand(item: Item): item is SandItem {
  return isItemKeySand(item.key);
}
