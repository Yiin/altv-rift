import alt from "@altv/server";
import { secondsToMilliseconds } from "date-fns";
import { createItem, getItemName } from "@shared/modules/items";
import { BlueprintRecipe, CraftingResult, craftRecipe } from "@shared/modules/production";
import { InGamePlayer } from "@/core/utility/assertions";
import { sendChatMessage } from "@/modules/chat";

// 1. [] -> start crafting, add to queue while in progress -> [a]
// 2. [a] - craft new item, already crafting, add to queue -> [a,b]
// 3. [a,b] - a finished crafting -> [b] -> process next item in queue -> [b]
// 4. [b] -> b finished crafting -> []

const craftingTimers = new WeakMap<InGamePlayer, alt.Timers.Timeout>();

/**
 * Add recipe to crafting queue. Doesn't perform any initial checks.
 */
export function startCrafting(player: InGamePlayer, recipe: BlueprintRecipe) {
  const queue = player.gameState.workbench.queue;
  const noItemsInQueue = queue.length === 0;

  queue.push(recipe);

  if (noItemsInQueue) {
    processNextItemInQueue(player);
  }
}

export function cancelCrafting(player: InGamePlayer) {
  return removeFromCraftingQueue(player, 0);
}

export function removeFromCraftingQueue(player: InGamePlayer, index: number) {
  const queue = player.gameState.workbench.queue;

  if (queue.length === 0) {
    return false;
  }

  if (index === 0) {
    craftingTimers.get(player)?.destroy();
    craftingTimers.delete(player);
  }
  queue.splice(index, 1);

  if (index === 0) {
    processNextItemInQueue(player);
  }

  return true;
}

function processNextItemInQueue(player: InGamePlayer) {
  const queue = player.gameState.workbench.queue;
  const recipe = queue[0];

  if (!recipe) {
    return;
  }

  player.gameState.workbench.startedAt = Date.now();

  craftingTimers.set(
    player,
    alt.Timers.setTimeout(() => {
      if (!player.valid) {
        // Player is gone
        return;
      }

      const recipeIndex = queue.indexOf(recipe);

      if (recipeIndex === -1) {
        // Item was removed from the queue(?)
        processNextItemInQueue(player);
        return;
      }

      queue.splice(recipeIndex, 1);

      const result = craftRecipe(player.character, recipe);

      notifyPlayerOfCraftingResult(player, recipe, result);

      if (result !== CraftingResult.OK) {
        processNextItemInQueue(player);
        return;
      }

      // Crafting was successful
      player.addItem(createItem(recipe.item.key, recipe.item));

      processNextItemInQueue(player);
    }, secondsToMilliseconds(recipe.durationSeconds)),
  );
}

export function notifyPlayerOfCraftingResult(
  player: InGamePlayer,
  recipe: BlueprintRecipe,
  result: CraftingResult,
) {
  switch (result) {
    case CraftingResult.NOT_ENOUGH_MATERIALS:
      sendChatMessage(player, `Not enough materials to craft ${getItemName(recipe.item.key)}.`);
      break;
    case CraftingResult.NO_SPACE_IN_INVENTORY:
      sendChatMessage(
        player,
        `Not enough space in the inventory to craft ${getItemName(recipe.item.key)}.`,
      );
      break;
    case CraftingResult.OK:
      const levelRequired = recipe.levelRequired ?? 1;
      player.character.skills.crafting += levelRequired * 20;
      break;
  }
}
