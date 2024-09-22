import alt from "@altv/server";
import { hoursToMilliseconds, minutesToMilliseconds } from "date-fns";
import { createInventory } from "@shared/modules/inventory";
import { createStorage, getStorageInventory } from "../items-manager";
import { ITEM_COMPONENTS_METAL_AMMO_LOW } from "./loot-tables/item-components-metal-ammo.low";
import { WOOD_ITEM_COMPONENTS_METAL_LOW } from "./loot-tables/wood-item-components-metal.low";
import { buildLootTable } from "./loot-tables";

const lastOpened = new Map<alt.VirtualEntity, number>();

const lootPositions = [
  // scrap & ammo
  {
    label: "Military supplies crate",
    x: 4881.341,
    y: -5112.318,
    z: 1.174,
    lootTable: ITEM_COMPONENTS_METAL_AMMO_LOW,
  },
  // materials
  { label: "Trash dump", x: 4824.928, y: -5436.561, z: 15.492, lootTable: WOOD_ITEM_COMPONENTS_METAL_LOW },
  // materials
  { label: "Trash dump", x: 4848.745, y: -5344.653, z: 12.408, lootTable: WOOD_ITEM_COMPONENTS_METAL_LOW },
  // scrap & ammo
  {
    label: "Military supplies crate",
    x: 4896.79,
    y: -4791.6,
    z: 2.001371,
    lootTable: ITEM_COMPONENTS_METAL_AMMO_LOW,
  },
  { label: "Supply boxes", x: 3900.166, y: -4696.845, z: 3.467, lootTable: WOOD_ITEM_COMPONENTS_METAL_LOW }
].map(({ label, x, y, z, lootTable }) => {
  return {
    storage: createStorage({
      pos: { x, y, z },
      inventory: createInventory({
        size: 10,
        items: buildLootTable(lootTable),
      }),
      label: label ?? "Storage Box",
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
