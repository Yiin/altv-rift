import alt from "@altv/server";
import { toRaw } from "@yiin/reactive-proxy-state";
import {
  GroundItemSource,
  InventoryItemSource,
  ItemSource,
  ItemSourceOrigin,
  PlayerEquipmentItemSource,
} from "@shared/interfaces";
import {
  FishingBaitItem,
  FishingRodItem,
  isItemFishingBait,
  isItemFishingRod,
} from "@shared/modules/items";
import { addItemToInventory } from "@shared/modules/inventory";
import { InGamePlayer } from "@/core/utility/assertions";
import { dropItemOnTheGround } from "../dropped-items";
import { findItem, findInventoryByItemSource, removeItem } from "../api";

export function useFishingBaitOnFishingRod(
  fishingRodSource: ItemSource,
  fishingBaitSource: InventoryItemSource | PlayerEquipmentItemSource | GroundItemSource,
): boolean {
  const fishingRod = findItem(fishingRodSource);
  const fishingBait = findItem(fishingBaitSource);
  const fishingBaitInventory =
    fishingBaitSource.origin === ItemSourceOrigin.Ground
      ? null
      : findInventoryByItemSource(fishingBaitSource);

  if (
    !fishingRod ||
    !fishingBait ||
    (fishingBaitSource.origin !== ItemSourceOrigin.Ground && !fishingBaitInventory)
  ) {
    return false;
  }

  if (!isItemFishingRod(fishingRod) || !isItemFishingBait(fishingBait)) {
    return false;
  }

  const droppedItemPos =
    fishingBaitSource.origin === ItemSourceOrigin.Ground
      ? alt.VirtualEntity.getByID(fishingBaitSource.originId)?.pos
      : null;

  removeItem(fishingBaitSource);

  const previousBait = useFishingBaitItemOnFishingRoadItem(fishingRod, fishingBait);

  if (previousBait) {
    if (fishingBaitInventory) {
      addItemToInventory(fishingBaitInventory, previousBait);
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
      useFishingBaitItemOnFishingRoadItem(fishingRod, bait);
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
    useFishingBaitItemOnFishingRoadItem(fishingRod, ammo);
    return false;
  }
  return true;
}

export function useFishingBaitItemOnFishingRoadItem(
  fishingRod: FishingRodItem,
  fishingBait: FishingBaitItem,
): FishingBaitItem | null {
  // Different kind of bait, swap
  if (fishingRod.bait && fishingRod.bait.key !== fishingBait.key) {
    const unequippedItem = fishingRod.bait;

    fishingRod.bait = fishingBait;

    return unequippedItem;
  }
  // Same kind of bait, add to existing
  else if (fishingRod.bait) {
    fishingRod.bait.amount += fishingBait.amount;

    return null;
  }
  // No bait, equip
  else {
    fishingRod.bait = toRaw(fishingBait);

    return null;
  }
}

export function removeBaitFromFishingRodItem(item: FishingRodItem): FishingBaitItem | null {
  const bait = item.bait;

  if (!bait) {
    return null;
  }

  item.bait = null;

  return bait;
}
