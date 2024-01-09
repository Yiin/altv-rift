import { getShopsRegistry } from "./registry";

export function getShop(shopId: string) {
    const shops = getShopsRegistry();

    return shops.get(shopId);
}
