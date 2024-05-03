import _ from "lodash";
import { Item, getAllItemKeys } from "@shared/modules/items";
import { LootTable } from "../types";
import { MIX_WEAPONS_LOW } from "./mix-weapons.low";
import { MIX_WEAPONS_HIGH } from "./mix-weapons.high";
import { FIREARM_WEAPONS_MID } from "./firearm-weapons.mid";
import { FIREARM_WEAPONS_HIGH } from "./firearm-weapons.high";
import { HANDGUN_WEAPONS_LOW } from "./handgun-weapons.low";
import { HEAVY_WEAPONS_HIGH } from "./heavy-weapons.high";
import { CAYO_MAIN_DOCK_LOOT } from "./cayo-main-dock-loot.low";

const LOOT_TABLES: LootTable[] = [
  MIX_WEAPONS_LOW,
  MIX_WEAPONS_HIGH,
  FIREARM_WEAPONS_MID,
  FIREARM_WEAPONS_HIGH,
  HANDGUN_WEAPONS_LOW,
  HEAVY_WEAPONS_HIGH,
  CAYO_MAIN_DOCK_LOOT,
];

export function getAllLootTables() {
  return LOOT_TABLES;
}

export function pickRandomLootTable(filter?: (table: LootTable) => boolean) {
  const tables = filter ? LOOT_TABLES.filter(filter) : LOOT_TABLES;
  const totalScore = tables.reduce((acc, table) => acc + table.score, 0);
  const randomScore = _.random(0, totalScore);

  let currentScore = 0;
  let lootTable = tables[0];

  for (const table of tables) {
    currentScore += table.score;
    if (randomScore <= currentScore) {
      lootTable = table;
      break;
    }
  }

  return lootTable;
}

export function buildLootTable(lootTable: LootTable) {
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

  return items;
}
