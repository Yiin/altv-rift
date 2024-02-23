import alt from "@altv/server";
import { addSeconds, minutesToSeconds } from "date-fns";
import { ITEMS_REGISTRY, Item, ItemGrade, createItem } from "@shared/modules/items";
import { StorageType } from "@shared/store/game-state.store";
import { registerCmd } from "../chat";
import { createStorage } from "./storage";
import { createInventory } from "./api";

export function spawnAirDrop(options: { label: string; pos: alt.IVector3, items: Item[], durationInSeconds: number }) {
  const lootBoxStorage = createStorage({
    type: StorageType.AirDrop,
    pos: new alt.Vector3(options.pos).sub(0, 0, 0.7),
    inventory: createInventory({ size: 10, items: options.items }),
    label: options.label,
    interpolate: {
      ts: alt.getNetTime(),
      from: new alt.Vector3(options.pos).add({ x: 0, y: 0, z: 50 }),
      speed: 3,
    },
    meta: {
      validUntil: addSeconds(Date.now(), options.durationInSeconds).getTime(),
    }
  });

  alt.Timers.setTimeout(() => {
    lootBoxStorage.destroy();
  }, options.durationInSeconds * 1000);
}

alt.Events.onBaseObjectRemove;


registerCmd('x', (player) => {
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

  spawnAirDrop({
    label: "Testing",
    pos: player.pos,
    items,
    durationInSeconds: minutesToSeconds(5),
  });
});
