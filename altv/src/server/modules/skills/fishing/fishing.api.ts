import alt from "@altv/server";
import { watchEffect } from "@yiin/reactive-proxy-state";
import { FishingGameType, PlayerFlags } from "@shared/store/game-state.store";
import {
  BAIT_TO_FISH_MAP,
  FishingBaitItem,
  FishingBaitItemKey,
  getBaitChance,
  isItemFishingBait,
} from "@shared/modules/items/registry/fish-bait.items";
import { FishingRodItem, createItem, isItemFishingRod } from "@shared/modules/items";
import {
  EquipmentSlot,
  InventoryItem,
  ItemSourceOrigin,
  NotificationType,
} from "@shared/interfaces";
import { rollOption } from "@shared/utility/random";
import { getLevel } from "@shared/modules/experience/experience-table";
import { InGamePlayer, isInGame } from "@/core/utility/assertions";

/**
 * Start fishing action for the player.
 */
export function startFishing(player: InGamePlayer): void {
  const equipedItem = player.getEquipedItemInSlot(EquipmentSlot.Weapon);

  if (!equipedItem || !isItemFishingRod(equipedItem)) {
    const bestFishingRod = player.character.inventory.items.reduce(
      (best, next) => {
        if (best && isItemFishingRod(next.item)) {
          return best.item.key > next.item.key
            ? (best as InventoryItem<FishingRodItem>)
            : (next as InventoryItem<FishingRodItem>);
        } else if (!best && isItemFishingRod(next.item)) {
          return next as InventoryItem<FishingRodItem>;
        }
        return null;
      },
      null as InventoryItem<FishingRodItem> | null,
    );

    if (!bestFishingRod) {
      player.notify(NotificationType.Error, "You don't have a fishing rod!");
      return;
    }

    if (
      !player.equipItem({
        origin: ItemSourceOrigin.PlayerInventory,
        originId: player.character.id,
        inventorySlot: bestFishingRod.slot,
      })
    ) {
      player.notify(NotificationType.Error, "For some reason you couldn't equip fishing rod...");
      return;
    }
  }

  const fishingRod = player.getEquipedItemInSlot(EquipmentSlot.Weapon);

  if (!fishingRod || !isItemFishingRod(fishingRod)) {
    player.notify(NotificationType.Error, "You dont have a fishing rod!");
    return;
  }

  if (!fishingRod.bait) {
    const firstBait = player.character.inventory.items.find(
      (item): item is InventoryItem<FishingBaitItem> => isItemFishingBait(item.item),
    );

    if (!firstBait) {
      player.notify(NotificationType.Warning, "You don't have any bait!");
      return;
    }

    if (
      !player.equipItem({
        origin: ItemSourceOrigin.PlayerInventory,
        originId: player.character.id,
        inventorySlot: firstBait.slot,
      })
    ) {
      player.notify(NotificationType.Error, "For some reason you can't use this bait...");
      return;
    }
  }

  player.gameState.flags.add(PlayerFlags.IsFishing);
  player.playScenario("WORLD_HUMAN_STAND_FISHING");

  player.notify(NotificationType.Info, "You start fishing...");

  if (player.objectInHand) {
    const obj = alt.Object.getByID(player.objectInHand);
    if (obj) {
      obj.visible = false;
    }
  }
}

/**
 * Stop fishing action for the player.
 */
export function stopFishing(player: InGamePlayer): void {
  stopCatchingAFish(player);
  player.gameState.flags.delete(PlayerFlags.IsFishing);
  player.clearTasks();
  //
  player.applyEquipment();

  if (player.objectInHand) {
    const obj = alt.Object.getByID(player.objectInHand);
    if (obj) {
      obj.visible = true;
    }
  }
}

/**
 * Start catching a fish.
 */
export function startCatchingFish(player: InGamePlayer, baitKey: FishingBaitItemKey): void {
  if (!player.gameState.flags.has(PlayerFlags.IsFishing)) {
    // Player is not fishing
    return;
  }

  if (player.gameState.flags.has(PlayerFlags.IsCatchingAFish)) {
    // Player is already catching a fish
    return;
  }

  player.gameState.flags.add(PlayerFlags.IsCatchingAFish);

  const gameType = rollOption([[1, FishingGameType.TimeClick]]);

  switch (gameType) {
    case FishingGameType.TimeClick: {
      const baitChance = getBaitChance(baitKey);
      const durationMs = 2000;

      // Default size is the size of the target when baitChance === fishing level / 10,
      // e.g. baitChance is 0.1 and fishing level is 10.
      const DEFAULT_SIZE = 0.05;
      const level = getLevel(player.character.skills.fishing.exp);

      // Apply the same diminishing returns formula for consistency
      const levelBonus = level / (10 + level / 5);
      const targetSize = Math.min(1, DEFAULT_SIZE * baitChance * (1 + levelBonus));

      const targetPosition = Math.random();

      player.gameState.fishingProgress = {
        baitKey,
        gameType,
        startedAt: Date.now() + player.ping,
        durationMs: durationMs + player.ping,
        targetPosition,
        targetSize,
      };

      const timeout = alt.Timers.setTimeout(() => {
        if (!player.gameState.flags.has(PlayerFlags.IsCatchingAFish)) {
          return;
        }

        stopFishing(player);
      }, durationMs * 3);

      const stopWatching = watchEffect(() => {
        const notCatchingAFish = !player.gameState.flags.has(PlayerFlags.IsCatchingAFish);
        const isWrongGame =
          player.gameState.fishingProgress?.gameType !== FishingGameType.TimeClick;

        if (!isInGame(player) || notCatchingAFish || isWrongGame) {
          timeout.destroy();
          stopWatching();
        }
      });

      break;
    }
  }
}

export function stopCatchingAFish(player: InGamePlayer): void {
  player.gameState.flags.delete(PlayerFlags.IsCatchingAFish);
  player.gameState.fishingProgress = null;
}

export function catchAFish(player: InGamePlayer, baitKey: FishingBaitItemKey): void {
  const possibleCatch = BAIT_TO_FISH_MAP.get(baitKey);

  if (!possibleCatch) {
    player.notify(NotificationType.Warning, "This bait seems to be useless...");
    return;
  }

  const fish = possibleCatch[~~(Math.random() * possibleCatch.length)];

  if (!fish) {
    return;
  }

  stopCatchingAFish(player);

  const xp = (1 / getBaitChance(baitKey)) * 25;

  player.character.skills.fishing.exp += xp;

  player.addItem(createItem(fish, { amount: 1 }));
}
