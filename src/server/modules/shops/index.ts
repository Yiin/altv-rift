import { Shop } from "@shared/interfaces";
import { getShopsRegistry } from "./registry";

export function getShop(shopId: string): Shop | undefined {
  const shops = getShopsRegistry();

  return shops.get(shopId);
}
