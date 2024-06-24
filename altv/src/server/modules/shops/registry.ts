import { Shop } from "@shared/interfaces";
import { prisma } from "@/core/database";
import { setupShop } from "./lib/setup-shop";

const registry = new Map<Shop["id"], Shop>();

prisma.shop.findMany().then((shops) => {
  for (const shop of shops) {
    setupShop(shop as Shop);
  }
});

export function getShopsRegistry(): Map<string, Shop> {
  return registry;
}
