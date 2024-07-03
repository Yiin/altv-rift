import { registerItems } from "../../items-registry";
import { makeKeys } from "../../../../utility/make-keys";
import { Item } from "../../types";

export const Hide = makeKeys<HideItemKey>()({
  DEMON_BOAR_HIDE: "demonboarhide",
});

export type HideItemKey = Brand<string, "HideItemKey">;

export type HideItem = {
  key: HideItemKey;
  amount: number;
};

export type HideItemInfo = {
  key: HideItemKey;
  name: string;
  description: string;
};

export const ore = registerItems<HideItemInfo>([
  {
    key: Hide.DEMON_BOAR_HIDE,
    name: "Demon Boar Hide",
    description: "This hide is used by the demon boar. It is very durable and can be used to craft various items.",
  },
]);

export function isItemKeyHide(key: string): key is HideItemKey {
  return ore.has(key as HideItemKey);
}

export function isItemHide(item: Item): item is HideItem {
  return isItemKeyHide(item.key);
}
