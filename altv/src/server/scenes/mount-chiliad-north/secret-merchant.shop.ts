

import { setupShop } from "@/modules/shops/lib/setup-shop";
import { createInventory } from "@shared/modules/inventory";
import { Ammo, createItem, ItemGrade } from "@shared/modules/items";

setupShop({
  id: 'mount-chiliad-north-secret-merchant',
  ped: {
    pos: {
      x: 1087.5338134765625,
      y: 6510.056640625,
      z: 21.061948776245117
    },
    heading: -3.1202,
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
