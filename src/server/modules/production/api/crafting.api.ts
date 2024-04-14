import alt from "@altv/server";
import { secondsToMilliseconds } from "date-fns";
import { BlueprintRecipe, CraftingResult, craftRecipe } from "@shared/modules/production";
import { createItem, getItemName } from "@shared/modules/items";
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

  alt.log(`Adding recipe to queue`);
  queue.push(recipe);

  if (noItemsInQueue) {
    alt.log(`No items in queue, processing next item`);
    processNextItemInQueue(player);
  }
}

export function cancelCrafting(player: InGamePlayer) {
  return removeFromCraftingQueue(player, 0);
}

export function removeFromCraftingQueue(player: InGamePlayer, index: number) {
  alt.log(`Removing recipe from crafting queue`, { index });
  const queue = player.gameState.workbench.queue;

  if (queue.length === 0) {
    alt.log(`Can't remove recipe, no items in queue`)
    return false;
  }

  if (index === 0) {
    alt.log(`Destroying previous crafting timer`);
    craftingTimers.get(player)?.destroy();
  }
  queue.splice(index, 1);

  if (index === 0) {
    alt.log(`Because currently crafted item was removed, processing next item`);
    processNextItemInQueue(player);
  }

  return true;
}

function processNextItemInQueue(player: InGamePlayer) {
  const queue = player.gameState.workbench.queue;
  const recipe = queue[0];

  if (!recipe) {
    alt.log(`No items in queue, can't process further.`);
    return;
  }

  player.gameState.workbench.startedAt = Date.now();

  alt.log(`Starting crafting timer for recipe`, { recipe });

  craftingTimers.set(
    player,
    alt.Timers.setTimeout(() => {
      alt.log(`Crafting complete, trying to finalize`);

      if (!player.valid) {
        // Player is gone
        alt.log(`Player is no longer valid, abort`);
        return;
      }

      const recipeIndex = queue.indexOf(recipe);

      if (recipeIndex === -1) {
        // Item was removed from the queue(?)
        alt.log(`Can't find item in the queue, abort`);
        processNextItemInQueue(player);
        return;
      }

      alt.log(`Removing recipe from the queue`);

      queue.splice(recipeIndex, 1);

      alt.log(`Trying to validate crafting of the recipe`);
      const result = craftRecipe(recipe, player.character.inventory);

      if (result !== CraftingResult.OK) {
        alt.log(`Validation failed, can't craft, processing next item in queue`);
        notifyPlayerOfCraftingResult(player, recipe, result);
        processNextItemInQueue(player);
        return;
      }

      alt.log(`Crafting was successful, processing next item in queue`);
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
  }
}
