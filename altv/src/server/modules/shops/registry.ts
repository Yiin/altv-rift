import { minutesToMilliseconds } from "date-fns";
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

// Periodically update the database with the latest shop data
setInterval(() => {
  for (const shop of registry.values()) {
    prisma.shop.upsert({
      where: { id: shop.id },
      update: shop,
      create: shop,
    });
  }
}, minutesToMilliseconds(5));
