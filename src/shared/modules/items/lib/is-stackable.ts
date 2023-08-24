import { ItemData } from "@shared/interfaces";

export function isStackable<T extends ItemData>(data?: T): data is T & { amount: number } {
  return !!(data && "amount" in data);
}
