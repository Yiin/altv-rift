import { setupShop } from "@/modules/shops/lib/setup-shop";
import { createInventory } from "@shared/modules/inventory";
import { Ammo, createItem, ItemGrade } from "@shared/modules/items";

setupShop({
  id: 'grapeseed-secret-merchant',
  pos: {
    x: 2473.711181640625,
    y: 4445.14111328125,
    z: 35.41604995727539
  },
  ped: {
    heading: -1.6890,
    model: 'g_m_m_chicold_01',
  },
  name: 'Secret Merchant',
  inventory: createInventory({
    size: 10,
    pricedItems: [
      {
        item: createItem(Ammo.ASSAULT_RIFLE_AMMO, {
          grade: ItemGrade.CONTRABAND,
        }), price: 1000
      },
      {
        item: createItem(Ammo.HANDGUN_AMMO, {
          grade: ItemGrade.CONTRABAND,
        }), price: 1000
      },
      {
        item: createItem(Ammo.SHOTGUN_AMMO, {
          grade: ItemGrade.CONTRABAND,
        }), price: 1000
      },
    ]
  })
});
