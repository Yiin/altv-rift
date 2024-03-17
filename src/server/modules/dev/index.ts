import alt from "@altv/server";
import { createItem, ItemGrade, ITEMS_REGISTRY } from "@shared/modules/items";
import { registerCmd } from "../chat";
import "./v1";

const vg = alt.VirtualEntityGroup.create({ maxEntitiesInStream: 50 });

registerCmd("s", (player) => {
  // generate random amount 1-6
  const amount = Math.floor(Math.random() * 6) + 1;

  const items = [];

  for (let i = 0; i < amount; i++) {
    // generate random item
    const keys = [...ITEMS_REGISTRY.keys()];
    const randomKey = keys[Math.floor(Math.random() * keys.length)];

    // generate random grade
    const grades = [ItemGrade.BASE, ItemGrade.ONE, ItemGrade.TWO, ItemGrade.THREE, ItemGrade.FOUR];
    const randomGrade = grades[Math.floor(Math.random() * grades.length)];

    // generate random amount
    const randomAmount = Math.floor(Math.random() * 100) + 1;

    items.push(createItem(randomKey, { grade: randomGrade, amount: randomAmount }));
  }

  alt.VirtualEntity.create({
    group: vg,
    pos: player.pos,
    streamingDistance: 300,
    data: {
      entityType: "storage",
      items,
    },
  });
});
