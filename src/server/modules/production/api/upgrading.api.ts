import alt from "@altv/server";
import { secondsToMilliseconds } from "date-fns";
import { PlayerItemSource } from "@shared/interfaces";
import {
  CraftingResult,
  canCraftRecipe,
  craftRecipe,
  getBlueprint,
  getUpgradeRecipe,
} from "@shared/modules/production";
import { InGamePlayer } from "@/core/utility/assertions";
import { findItem } from "@/modules/items-manager";

const upgradingTimer = new WeakMap<InGamePlayer, alt.Timers.Timeout>();

export function upgradeItem(player: InGamePlayer, itemSource: PlayerItemSource) {
  if (player.gameState.workbench.upgrading) {
    // Already upgrading
    alt.log(`Already upgrading`);
    return false;
  }

  if (upgradingTimer.has(player)) {
    // Already upgrading
    alt.log(`Already upgrading; Timer`);
    return false;
  }

  const item = findItem(itemSource, player);

  if (!item) {
    alt.log(`No item found`, itemSource);
    return false;
  }

  const availableBlueprints = player.character.blueprints
    .map((blueprint) => getBlueprint(blueprint)!)
    .filter(Boolean);

  const recipe = getUpgradeRecipe(item, availableBlueprints);

  if (!recipe) {
    alt.log(`No upgrade recipe found`);
    return false;
  }

  if (canCraftRecipe(recipe, player.character.inventory)) {
    alt.log(`Can't craft recipe`);
    return false;
  }

  player.gameState.workbench.upgrading = {
    itemSource,
    recipe,
    startedAt: Date.now(),
  };

  upgradingTimer.set(
    player,
    alt.Timers.setTimeout(() => {
      if (!player.gameState.workbench.upgrading) {
        return;
      }

      if (craftRecipe(recipe, player.character.inventory) !== CraftingResult.OK) {
        return;
      }

      // Assign items of upgraded item
      Object.assign(item, player.gameState.workbench.upgrading.recipe.item);

      player.gameState.workbench.upgrading = null;
      upgradingTimer.delete(player);
    }, secondsToMilliseconds(recipe.durationSeconds)),
  );

  return true;
}

export function cancelUpgrading(player: InGamePlayer) {
  const timer = upgradingTimer.get(player);

  if (!timer) {
    return false;
  }

  timer.destroy();
  upgradingTimer.delete(player);
  player.gameState.workbench.upgrading = null;

  return true;
}
