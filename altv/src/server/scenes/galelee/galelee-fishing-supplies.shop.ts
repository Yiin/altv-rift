import { setupShop } from "@/modules/shops/lib/setup-shop";
import { createInventory } from "@shared/modules/inventory";
import { FishingBait, FishingRod, createItem } from "@shared/modules/items";

const shopkeeper = setupShop({
  id: 'galelee-shopkeeper',
  ped: {
    model: 'CSB_Undercover',
    pos: { x: 1302.92236328125,
      y: 4225.18017578125,
      z: 33.90868377685547 },
    heading: 1.2860373258590698,
  },
  inventory: createInventory({
    size: 10,
    pricedItems: [
      { item: createItem(FishingRod.FISHING_ROD), price: 1000 },
      { item: createItem(FishingBait.WORMS), price: 10 },
      { item: createItem(FishingBait.ROE), price: 30 },
      { item: createItem(FishingBait.CRAWFISH), price: 50 },
    ]
  }),
  name: 'Galelee Fishing Supplies Shop',
});
