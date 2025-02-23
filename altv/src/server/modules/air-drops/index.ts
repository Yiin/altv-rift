import alt from "@altv/server";
import { addSeconds, minutesToSeconds } from "date-fns";
import _ from "lodash";
import { Item } from "@shared/modules/items";
import { StorageType } from "@shared/store/game-state.store";
import { AirDropType } from "@shared/modules/air-drops";
import { registerCmd } from "../chat";
import { createStorage } from "../items-manager/storage";
import { createInventory } from "../../../shared/modules/inventory/api";
import { buildLootTable, pickRandomLootTable } from "../loot/loot-tables";

const airDropLocations: alt.Vector3[] = [];

export function buildAirDropLootTable() {
  const lootTable = pickRandomLootTable((table) => !!table.type);
  const items = buildLootTable(lootTable);

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

registerCmd("airdrop", (player) => {
  const lootTable = buildAirDropLootTable();

  spawnAirDrop({
    label: "Testing",
    pos: player.pos,
    type: lootTable.type!,
    items: lootTable.items,
    durationInSeconds: minutesToSeconds(5),
  });
});
