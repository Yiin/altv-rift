import alt from "alt-server";
import { ServerCall } from "@shared/calls/server";
import { PlayerFlags } from "@shared/store/game-state.store";
import {
  BAIT_TO_FISH_MAP,
  FishBait,
  FishBaitItem,
  isItemFishBait,
} from "@shared/modules/items/registry/fish-bait.items";
import { FishingRodItem, createItem, isItemFishingRod } from "@shared/modules/items";
import { InventoryItem } from "@shared/interfaces";
import { rpc } from "@/rpc";
import { isInGame, needsToBeInGame } from "@/utility/assertions";
import { sendChatMessage } from "@/modules/chat";

rpc.registerClient(ServerCall.FromClient.START_FISHING, (player: alt.Player) => {
  needsToBeInGame(player);

  if (!player.getEquipedItemInSlot("tool")) {
    const bestFishingRod = player.character.inventory.items.reduce((best, next) => {
      if (best && isItemFishingRod(next.item)) {
        return best.item.key > next.item.key
          ? (best as InventoryItem<FishingRodItem>)
          : (next as InventoryItem<FishingRodItem>);
      } else if (!best && isItemFishingRod(next.item)) {
        return next as InventoryItem<FishingRodItem>;
      }
      return null;
    }, null as InventoryItem<FishingRodItem> | null);

    if (!bestFishingRod) {
      sendChatMessage(player, `You don't have a fishing rod!`);
      return;
    }

    if (
      !player.equipItem({
        type: "inventory",
        source: "character",
        sourceId: player.character.id,
        inventorySlot: bestFishingRod.slot,
      })
    ) {
      sendChatMessage(player, `For some reason you couldn't equip fishing rod...`);
      return;
    }
  }

  const fishingRod = player.getEquipedItemInSlot("tool");

  if (!fishingRod || !isItemFishingRod(fishingRod)) {
    sendChatMessage(player, `You dont have a fishing rod!`);
    return;
  }

  if (!fishingRod.bait) {
    const firstBait = player.character.inventory.items.find(
      (item): item is InventoryItem<FishBaitItem> => isItemFishBait(item.item)
    );

    if (!firstBait) {
      sendChatMessage(player, `You don't have any bait!`);
      return;
    }

    if (
      !player.equipItem({
        type: "inventory",
        source: "character",
        sourceId: player.character.id,
        inventorySlot: firstBait.slot,
      })
    ) {
      sendChatMessage(player, `For some reason you can't use bait...`);
      return;
    }
  }

  player.gameState.flags.add(PlayerFlags.IsFishing);
  player.playScenario("WORLD_HUMAN_STAND_FISHING");
});

function fishingTick(player: alt.Player) {
  if (!isInGame(player)) {
    return;
  }

  if (!player.gameState.flags.has(PlayerFlags.IsFishing)) {
    return;
  }

  const fishingRod = player.getEquipedItemInSlot("tool");

  if (!fishingRod || !isItemFishingRod(fishingRod) || !fishingRod.bait) {
    stopFishing(player);
    return;
  }

  const shouldUseBait = Math.random() < 0.2;

  if (shouldUseBait) {
    const bait = fishingRod.bait;

    fishingRod.bait.amount--;

    if (fishingRod.bait.amount < 0) {
      fishingRod.bait = null;
      stopFishing(player);
      return;
    } else if (fishingRod.bait.amount === 0) {
      fishingRod.bait = null;
    }

    if (Math.random() < 0.3) {
      const fish = BAIT_TO_FISH_MAP.get(bait.key)!.at(0)!;

      sendChatMessage(player, `You caught a ${fish}!`);

      player.character.skills.fishing += ~~(Math.random() * 100) * 10 + 50;

      player.addItem(createItem(fish, { amount: 1 }));
    } else {
      sendChatMessage(player, `The fish escaped...`);
    }
  }
}

function stopFishing(player: alt.Player) {
  needsToBeInGame(player);

  player.gameState.flags.delete(PlayerFlags.IsFishing);
  player.clearTasks();

  player.applyEquipment();
}

alt.setInterval(() => {
  alt.Player.all.forEach(fishingTick);
}, 1000);

rpc.registerClient(ServerCall.FromClient.STOP_FISHING, stopFishing);
