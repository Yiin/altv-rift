import { ItemData } from "@shared/interfaces";

export function getItemData<T extends ItemData>(data: T) {
  return data[data.type] as T[typeof data.type];
}
