import { Shop } from "@shared/interfaces";
import { StorageType } from "@shared/store/game-state.store";
import { createStorage } from "@/modules/items-manager";
import { getShopsRegistry } from "../shops.registry";
import { createStaticPed } from "@/modules/peds/registry";
import { PedFlags } from "@shared/modules/ped";

export function setupShop(shop: Shop): void {
  getShopsRegistry().set(shop.id, shop);

  createStorage({
    type: StorageType.Shop,
    inventory: shop.inventory,
    label: shop.name,
    pos: shop.ped.pos,
    onOpen() {
      console.log(`Shop ${shop.name} opened`); //
    },
  });

  createStaticPed({
    ...shop.ped,
    flags: PedFlags.Peaceful | PedFlags.ShopKeeper,
  });
}
