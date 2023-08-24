import { Item } from "@shared/interfaces";

export function getItemData<T extends Item>(item: T) {
  return item[item.type] as T[T["type"]];
}
