import alt from "@altv/server";
import { watch, watchEffect } from "vue";
import { FishingGameType, PlayerFlags } from "@shared/store/game-state.store";
import {
  BAIT_TO_FISH_MAP,
  FishBaitItem,
  FishBaitItemKey,
  isItemFishBait,
} from "@shared/modules/items/registry/fish-bait.items";
import { FishingRodItem, createItem, getItemName, isItemFishingRod } from "@shared/modules/items";
import { EquipmentSlot, InventoryItem, ItemSourceOrigin } from "@shared/interfaces";
import { rollItem } from "@shared/utility/random";
import { InGamePlayer, isInGame } from "@/core/utility/assertions";
import { sendChatMessage } from "@/modules/chat";

/**
 * Start fishing action for the player.
 */
export function startFishing(player: InGamePlayer): void {
  if (!player.getEquipedItemInSlot(EquipmentSlot.Tool)) {
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
      sendChatMessage(player, `You don't have a fishing rod!`);
      return;
    }

    if (
      !player.equipItem({
        origin: ItemSourceOrigin.PlayerInventory,
        originId: player.character.id,
        inventorySlot: bestFishingRod.slot,
      })
    ) {
      sendChatMessage(player, `For some reason you couldn't equip fishing rod...`);
      return;
    }
  }

  const fishingRod = player.getEquipedItemInSlot(EquipmentSlot.Tool);

  if (!fishingRod || !isItemFishingRod(fishingRod)) {
    sendChatMessage(player, `You dont have a fishing rod!`);
    return;
  }

  if (!fishingRod.bait) {
    const firstBait = player.character.inventory.items.find(
      (item): item is InventoryItem<FishBaitItem> => isItemFishBait(item.item),
    );

    if (!firstBait) {
      sendChatMessage(player, `You don't have any bait!`);
      return;
    }

    if (
      !player.equipItem({
        origin: ItemSourceOrigin.PlayerInventory,
        originId: player.character.id,
        inventorySlot: firstBait.slot,
      })
    ) {
      sendChatMessage(player, `For some reason you can't use bait...`);
      return;
    }
  }

  player.gameState.flags.add(PlayerFlags.IsFishing);
  player.playScenario("WORLD_HUMAN_STAND_FISHING");
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
}

/**
 * Start catching a fish.
 */
export function startCatchingFish(player: InGamePlayer, baitKey: FishBaitItemKey): void {
  if (!player.gameState.flags.has(PlayerFlags.IsFishing)) {
    // Player is not fishing
    return;
  }

  if (player.gameState.flags.has(PlayerFlags.IsCatchingAFish)) {
    // Player is already catching a fish
    return;
  }

  player.gameState.flags.add(PlayerFlags.IsCatchingAFish);

  const gameType = rollItem([
    [1, FishingGameType.TimeClick],
    // [1, FishingGameType.Keys]
  ]);

  switch (gameType) {
    case FishingGameType.TimeClick: {
      const durationMs = 2000;
      const targetSize = 0.1;
      const startingOffset = targetSize * 2;
      const endOffset = targetSize * 0.5;
      const targetPosition = Math.random() * (1 - startingOffset - endOffset) + startingOffset;

      player.gameState.fishingProgress = {
        baitKey,
        gameType,
        startedAt: Date.now(),
        durationMs,
        targetPosition,
        targetSize,
      };

      const timeout = alt.Timers.setTimeout(() => {
        if (!player.gameState.flags.has(PlayerFlags.IsCatchingAFish)) {
          return;
        }

        stopFishing(player);
      }, durationMs + 1000);

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
    case FishingGameType.Keys: {
      const durationMs = 5000;
      player.gameState.fishingProgress = {
        baitKey,
        gameType,
        startedAt: Date.now(),
        durationMs,
        keys: Array.from({ length: 10 }).map(() =>
          rollItem([
            [1, alt.Enums.KeyCode.W],
            [1, alt.Enums.KeyCode.A],
            [1, alt.Enums.KeyCode.S],
            [1, alt.Enums.KeyCode.D],
          ]),
        ),
        pressedKeys: [],
      };

      const timeout = alt.Timers.setTimeout(() => {
        if (!player.gameState.flags.has(PlayerFlags.IsCatchingAFish)) {
          return;
        }

        stopFishing(player);
      }, durationMs + 1000);

      const stopWatching = watchEffect(() => {
        const notCatchingAFish = !player.gameState.flags.has(PlayerFlags.IsCatchingAFish);
        const isWrongGame = player.gameState.fishingProgress?.gameType !== FishingGameType.Keys;

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

export function catchAFish(player: InGamePlayer, baitKey: FishBaitItemKey): void {
  const possibleCatch = BAIT_TO_FISH_MAP.get(baitKey);

  if (!possibleCatch) {
    sendChatMessage(player, `Bad bait...`);
    return;
  }

  const fish = possibleCatch[~~(Math.random() * possibleCatch.length)];

  if (!fish) {
    sendChatMessage(player, `You caught nothing...`);
    return;
  }

  stopCatchingAFish(player);

  sendChatMessage(player, `You caught a ${getItemName(fish)}!`);

  player.character.skills.fishing += ~~(Math.random() * 100) * 10 + 50;

  player.addItem(createItem(fish, { amount: 1 }));
}
