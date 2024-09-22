import { Shop } from "@shared/interfaces";
import { getShopsRegistry } from "../shops.registry";

export function getShop(shopId: string): Shop | undefined {
  const shops = getShopsRegistry();

  return shops.get(shopId);
}
