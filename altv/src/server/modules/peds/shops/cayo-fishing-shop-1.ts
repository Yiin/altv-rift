import alt from "@altv/server";
import { PedFlags } from "@shared/modules/ped";
import { createInventory } from "@shared/modules/inventory";
import { FishingRod, ItemGrade, createItem } from "@shared/modules/items";
import { setupShop } from "@/modules/shops/lib/setup-shop";
import { createStaticPed } from "../registry";

const positions: { pos: alt.IVector3; heading: number }[] = [
  {
    pos: { x: 5098.45703125, y: -4612.04833984375, z: 2.3875732421875 },
    heading: -2.622116804122925,
  },
];

for (const { pos, heading } of positions) {
  const ped = createStaticPed({
    model: "U_M_O_TapHillBilly",
    pos,
    heading,
    flags: PedFlags.Peaceful | PedFlags.ShopKeeper,
  });

  const shop = setupShop({
    id: "cayo-fishing-shop-1",
    name: "Cayo Fishing Shop",
    ped: {
      model: "U_M_O_TapHillBilly",
      pos,
      heading,
    },
    inventory: {
      size: 8,
      items: [
        {
          slot: 0,
          item: createItem(FishingRod.FISHING_ROD, { grade: ItemGrade.COMMON }),
          price: 1000,
        },
      ],
    },
    shopTable: "cayo-fishing-shop-1",
    lastRefill: new Date(),
  });

  ped.playAnimation("rcmjosh1", "idle", 1, -1);
}
