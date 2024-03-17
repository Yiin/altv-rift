import { ItemGrade, ItemKey } from "../items";
import { Upgrade } from "./types";

const upgrades: Upgrade[] = [];

export function registerUpgrade(upgrade: Upgrade) {
  upgrades.push(upgrade);
}

export function getUpgrade(baseItem: ItemKey, itemGrade: ItemGrade) {
  return Array.from(upgrades).find((upgrade) => upgrade.baseItem === baseItem && upgrade.baseGrade === itemGrade);
}
