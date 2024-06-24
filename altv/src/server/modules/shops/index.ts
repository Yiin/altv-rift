import { Shop } from "@shared/interfaces";
import { getShopsRegistry } from "./registry";
import "./shops.controller";

export function getShop(shopId: string): Shop | undefined {
  const shops = getShopsRegistry();

  return shops.get(shopId);
}
