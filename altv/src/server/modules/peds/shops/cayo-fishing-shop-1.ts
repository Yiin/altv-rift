import alt from "@altv/server";
import { ItemGrade, Tool, createItem } from "@shared/modules/items";
import { setupShop } from "@/modules/shops/lib/setup-shop";

const positions: { pos: alt.IVector3; heading: number }[] = [
  {
    pos: { x: 5098.45703125, y: -4612.04833984375, z: 2.3875732421875 },
    heading: -2.622116804122925,
  },
];

for (const { pos, heading } of positions) {
  const shop = setupShop({
    id: "cayo-fishing-shop-1",
    name: "Cayo Fishing Shop",
    pos,
    ped: {
      model: "U_M_O_TapHillBilly",
      heading,
    },
    inventory: {
      size: 8,
      items: [
        {
          slot: 0,
          item: createItem(Tool.FISHING_ROD, { grade: ItemGrade.COMMON }),
          price: 1000,
        },
      ],
    },
  });

  // ped.playAnimation("rcmjosh1", "idle", 1, -1);
}
