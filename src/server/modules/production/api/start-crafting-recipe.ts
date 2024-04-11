import alt from "@altv/server";
import { secondsToMilliseconds } from "date-fns";
import { BlueprintRecipe, craftRecipe } from "@shared/modules/production";
import { InGamePlayer } from "@/core/utility/assertions";

// 1. [] -> start crafting, add to queue while in progress -> [a]
// 2. [a] - craft new item, already crafting, add to queue -> [a,b]
// 3. [a,b] - a finished crafting -> [b] -> process next item in queue -> [b]
// 4. [b] -> b finished crafting -> []

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

function processNextItemInQueue(player: InGamePlayer) {
  const queue = player.gameState.workbench.queue;
  const recipe = queue[0];

  if (!recipe) {
    return;
  }

  alt.Timers.setTimeout(() => {
    if (!player.valid) {
      // Player is gone
      return;
    }

    const recipeIndex = queue.indexOf(recipe);

    if (recipeIndex === -1) {
      // The queue was cleared
      return;
    }

    if (!craftRecipe(recipe, player.character.inventory)) {
      // Either no space in the inventory or we don't have enough materials
      return;
    }

    // Crafting was successful
    player.addItem(recipe.item);

    queue.splice(recipeIndex, 1);

    if (queue.length > 0) {
      processNextItemInQueue(player);
    }
  }, secondsToMilliseconds(recipe.durationSeconds));
}
