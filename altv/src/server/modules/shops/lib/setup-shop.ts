import { Shop } from "@shared/interfaces";
import { StorageType } from "@shared/store/game-state.store";
import { createStorage } from "@/modules/items-manager";
import { getShopsRegistry } from "../shops.registry";
import { createStaticPed } from "@/modules/peds/peds.registry";
import { PedFlags } from "@shared/modules/ped";
import { WindowType } from "@shared/store/client.store";

type SetupShopOptions = {
  windowType?: WindowType;
};

type DeleteShop = () => void;

export function setupShop(shop: Shop, options: SetupShopOptions = {}): DeleteShop {
  getShopsRegistry().set(shop.id, shop);

  const pos = shop.pos ?? shop.ped?.pos;

  if (!pos) {
    throw new Error(`Shop ${shop.name} has no position`);
  }

  const shopStorage = createStorage({
    type: StorageType.Shop,
    inventory: shop.inventory,
    label: shop.name,
    pos,
    onOpen() {
      console.log(`Shop ${shop.name} opened`);
    },
    windowType: options.windowType ?? WindowType.CLOTHING_SHOP,
  });

  const shopkeeper = shop.ped
    ? createStaticPed({
        ...shop.ped,
        flags: PedFlags.Peaceful | PedFlags.ShopKeeper,
      })
    : null;

  return () => {
    getShopsRegistry().delete(shop.id);
    shopkeeper?.destroy();
    shopStorage.destroy();
  };
}
