import alt from "@altv/server";
import { ItemGrade, Scrap, createItem } from "@shared/modules/items";
import { createInventory } from "@shared/modules/inventory";
import { createStorage } from "../items-manager";

const lootPositions: alt.IVector3[] = [{ x: 4881.341, y: -5112.318, z: 1.174 }];

createStorage({
  pos: lootPositions[0],
  inventory: createInventory({
    size: 10,
    items: [
      createItem(Scrap.SCRAP, {
        amount: ~~(Math.random() * 100),
        grade: ItemGrade.CONTRABAND,
      }),
    ],
  }),
  label: "Storage Box",
});
