import alt from "@altv/server";
import { hoursToMilliseconds, minutesToMilliseconds } from "date-fns";
import { createInventory } from "@shared/modules/inventory";
import { createStorage, getStorageInventory } from "../items-manager";
import { SCRAP_METAL_AMMO_LOW } from "./loot-tables/scrap-metal-ammo.low";
import { WOOD_SCRAP_METAL_LOW } from "./loot-tables/wood-scrap-metal.low";
import { buildLootTable } from "./loot-tables";

const lastOpened = new Map<alt.VirtualEntity, number>();

const lootPositions = [
  // scrap & ammo
  { x: 4881.341, y: -5112.318, z: 1.174, lootTable: SCRAP_METAL_AMMO_LOW },
  // materials
  { x: 4824.928, y: -5436.561, z: 15.492, lootTable: WOOD_SCRAP_METAL_LOW },
  // materials
  { x: 4848.745, y: -5344.653, z: 12.408, lootTable: WOOD_SCRAP_METAL_LOW },
].map(({ x, y, z, lootTable }) => {
  return {
    storage: createStorage({
      pos: { x, y, z },
      inventory: createInventory({
        size: 10,
        items: buildLootTable(lootTable),
      }),
      label: "Storage Box",
      onOpen() {
        lastOpened.set(this, Date.now());
      },
    }),
    lootTable,
  };
});

/**
 * Every 5 minutes refill loot storages that haven't been opened in past 2 hours.
 */
alt.Timers.setInterval(() => {
  for (const { storage, lootTable } of lootPositions) {
    const lastOpen = lastOpened.get(storage);

    if (!lastOpen) {
      // never opened, skip
      continue;
    }

    const diff = Date.now() - lastOpen;
    if (diff < hoursToMilliseconds(2)) {
      continue;
    }

    // refill
    const inventory = getStorageInventory(storage.id);

    if (!inventory) {
      alt.logError(`Storage inventory not found for ${storage.id}`);
      continue;
    }

    inventory.items = createInventory({ size: 100, items: buildLootTable(lootTable) }).items;
  }
}, minutesToMilliseconds(5));
