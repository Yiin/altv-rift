import { Shop } from "@shared/interfaces";
import { PedKey } from "@shared/modules/ped/list";
import { createStaticPed } from "@/modules/peds/registry";
import { getShopsRegistry } from "../registry";

export function setupShop(shop: Shop) {
  getShopsRegistry().set(shop.id, shop as Shop);

  createStaticPed(shop.id as PedKey, shop.ped, {
    name: shop.name,
  });
}
