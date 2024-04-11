import alt from "@altv/server";
import { toRaw } from "vue";
import {
  GroundItemSource,
  InventoryItemSource,
  ItemSource,
  ItemSourceOrigin,
  PlayerEquipmentItemSource,
} from "@shared/interfaces";
import {
  FishBaitItem,
  FishingRodItem,
  isItemFishBait,
  isItemFishingRod,
} from "@shared/modules/items";
import { addItemToInventory } from "@shared/modules/inventory";
import { InGamePlayer } from "@/core/utility/assertions";
import { dropItemOnTheGround } from "../dropped-items";
import { findItem, findInventoryByItemSource, removeItem } from "../api";

export function useFishBaitOnFishingRod(
  fishingRodSource: ItemSource,
  fishBaitSource: InventoryItemSource | PlayerEquipmentItemSource | GroundItemSource,
): boolean {
  const fishingRod = findItem(fishingRodSource);
  const fishBait = findItem(fishBaitSource);
  const fishBaitInventory =
    fishBaitSource.origin === ItemSourceOrigin.Ground
      ? null
      : findInventoryByItemSource(fishBaitSource);

  if (
    !fishingRod ||
    !fishBait ||
    (fishBaitSource.origin !== ItemSourceOrigin.Ground && !fishBaitInventory)
  ) {
    return false;
  }

  if (!isItemFishingRod(fishingRod) || !isItemFishBait(fishBait)) {
    return false;
  }

  const droppedItemPos =
    fishBaitSource.origin === ItemSourceOrigin.Ground
      ? alt.VirtualEntity.getByID(fishBaitSource.originId)?.pos
      : null;

  removeItem(fishBaitSource);

  const previousBait = useFishBaitItemOnFishingRoadItem(fishingRod, fishBait);

  if (previousBait) {
    if (fishBaitInventory) {
      addItemToInventory(fishBaitInventory, previousBait);
    } else if (droppedItemPos) {
      dropItemOnTheGround(previousBait, droppedItemPos);
    }
  }

  return true;
}

export function removeBaitFromFishingRod(source: ItemSource): boolean {
  const fishingRod = findItem(source);

  if (!fishingRod) {
    return false;
  }

  if (!isItemFishingRod(fishingRod)) {
    return false;
  }

  if (source.origin === ItemSourceOrigin.Ground) {
    const droppedItemVE = alt.VirtualEntity.getByID(source.originId);

    if (!droppedItemVE) {
      return false;
    }

    const bait = removeBaitFromFishingRodItem(fishingRod);

    if (!bait) {
      return false;
    }

    droppedItemVE.streamSyncedMeta.item = fishingRod;
    dropItemOnTheGround(bait, droppedItemVE.pos);

    return true;
  }

  // Fishing rod is equipped
  if (source.origin === ItemSourceOrigin.PlayerEquipment) {
    const player = alt.Player.all.find(
      (player): player is InGamePlayer => player.character?.id === source.originId,
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

  const inventory = findInventoryByItemSource(source);

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
  fishBait: FishBaitItem,
): FishBaitItem | null {
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

export function removeBaitFromFishingRodItem(item: FishingRodItem): FishBaitItem | null {
  const bait = item.bait;

  if (!bait) {
    return null;
  }

  item.bait = null;

  return bait;
}
