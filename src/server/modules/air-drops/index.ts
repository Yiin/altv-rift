import alt from "@altv/server";
import { addSeconds, minutesToSeconds } from "date-fns";
import _ from "lodash";
import { Item, getAllItemKeys } from "@shared/modules/items";
import { StorageType } from "@shared/store/game-state.store";
import { AirDropType } from "@shared/modules/air-drops";
import { registerCmd } from "../chat";
import { createStorage } from "../items-manager/storage";
import { createInventory } from "../../../shared/modules/inventory/api";
import lootTables from "./loot-tables";

const airDropLocations: alt.Vector3[] = [];

export function buildAirDropLootTable() {
  // pick random loot table based on score
  const totalScore = lootTables.reduce((acc, table) => acc + table.score, 0);
  const randomScore = _.random(0, totalScore);
  let currentScore = 0;
  let lootTable = lootTables[0];
  for (const table of lootTables) {
    currentScore += table.score;
    if (randomScore <= currentScore) {
      lootTable = table;
      break;
    }
  }

  const seed = Math.random();

  // generate loot table items
  const items: Item[] = [];
  const itemsAmount = lootTable.getItemsAmount();
  const validItemKeys = getAllItemKeys().filter((key) => lootTable.filterItemKey(key, seed));

  for (let i = 0; i < itemsAmount; i++) {
    const itemKey = _.sample(validItemKeys)!;

    _.remove(validItemKeys, (key) => key === itemKey);

    const item = lootTable.createItem(itemKey);
    items.push(item);
  }

  return {
    type: lootTable.type,
    items,
  };
}

export function spawnAirDrop(options: {
  type: AirDropType;
  label: string;
  pos: alt.IVector3;
  items: Item[];
  durationInSeconds: number;
}) {
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
    airDropType: options.type,
    meta: {
      validUntil: addSeconds(Date.now(), options.durationInSeconds).getTime(),
    },
  });

  alt.Timers.setTimeout(() => {
    lootBoxStorage.destroy();
  }, options.durationInSeconds * 1000);
}

alt.Events.onBaseObjectRemove;

registerCmd("x", (player) => {
  const lootTable = buildAirDropLootTable();

  spawnAirDrop({
    label: "Testing",
    pos: player.pos,
    type: lootTable.type,
    items: lootTable.items,
    durationInSeconds: minutesToSeconds(5),
  });
});
