import * as alt from "@altv/server";
import { toRaw } from "vue";
import { InventoryItemSource, ItemSource } from "@shared/interfaces";
import {
  FishBaitItem,
  FishingRodItem,
  isItemFishBait,
  isItemFishingRod,
} from "@shared/modules/items";
import { InGamePlayer } from "@/utility/assertions";
import { addItemToInventory, findItem, findSourceInventory, removeItem } from "../api";

export function useFishBaitOnFishingRod(
  fishingRodSource: ItemSource,
  fishBaitSource: InventoryItemSource
) {
  const fishingRod = findItem.call(fishingRodSource);
  const fishBait = findItem.call(fishBaitSource);
  const fishBaitInventory = findSourceInventory.call(fishBaitSource);

  if (!fishingRod || !fishBait || !fishBaitInventory) {
    return false;
  }

  if (!isItemFishingRod(fishingRod) || !isItemFishBait(fishBait)) {
    return false;
  }

  removeItem(fishBaitSource);

  const previousBait = useFishBaitItemOnFishingRoadItem(fishingRod, fishBait);

  if (previousBait) {
    addItemToInventory(fishBaitInventory, previousBait);
  }

  return true;
}

export function removeBaitFromFishingRod(source: ItemSource) {
  const fishingRod = findItem.call(source);

  if (!fishingRod) {
    return false;
  }

  if (!isItemFishingRod(fishingRod)) {
    return false;
  }

  // Fishing rod is equipped
  if (source.type === "equipment") {
    const player = alt.Player.all.find(
      (player): player is InGamePlayer => player.character?.id === source.sourceId
    );

    if (!player) {
      return false;
    }

    const bait = removeBaitFromFishingRodItem(fishingRod);

    if (!bait) {
      return false;
    }

    if (!addItemToInventory(player.character.inventory, bait)) {
      // If player inventory is full, load bait back into the weapon
      useFishBaitItemOnFishingRoadItem(fishingRod, bait);
      return false;
    }

    return true;
  }
  // Weapon is in some inventory
  const ammo = removeBaitFromFishingRodItem(fishingRod);

  if (!ammo) {
    return false;
  }

  const inventory = findSourceInventory.call(source);

  if (!inventory) {
    return false;
  }

  if (!addItemToInventory(inventory, ammo)) {
    // If inventory is full, load ammo back into the weapon
    useFishBaitItemOnFishingRoadItem(fishingRod, ammo);
    return false;
  }
  return true;
}

export function useFishBaitItemOnFishingRoadItem(
  fishingRod: FishingRodItem,
  fishBait: FishBaitItem
) {
  // Different kind of bait, swap
  if (fishingRod.bait && fishingRod.bait.key !== fishBait.key) {
    const unequippedItem = fishingRod.bait;

    fishingRod.bait = fishBait;

    return unequippedItem;
  }
  // Same kind of bait, add to existing
  else if (fishingRod.bait) {
    fishingRod.bait.amount += fishBait.amount;

    return null;
  }
  // No bait, equip
  else {
    fishingRod.bait = toRaw(fishBait);

    return null;
  }
}

export function removeBaitFromFishingRodItem(item: FishingRodItem) {
  const bait = item.bait;

  if (!bait) {
    return null;
  }

  item.bait = null;

  return bait;
}
