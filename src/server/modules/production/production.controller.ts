import { getRecipeByKey } from "@shared/modules/production";
import { ServerCall } from "@shared/calls/server";
import { rpc } from "@/core/rpc";
import { needsToBeInGame } from "@/core/utility/assertions";
import { cancelCrafting, removeFromCraftingQueue, startCrafting } from "./api/crafting.api";
import { cancelUpgrading, upgradeItem } from "./api/upgrading.api";

rpc.registerWebview(ServerCall.FromWebview.CRAFT_ITEM, (player, recipeKey, amount) => {
  needsToBeInGame(player);

  const recipe = getRecipeByKey(recipeKey);

  if (!recipe) {
    console.log("Recipe not found");
    return false;
  }

  const hasBlueprint = player.character.blueprints.includes(recipe.blueprint.key);

  if (!hasBlueprint) {
    console.log("Player doesn't have the blueprint");
    return false;
  }

  amount = Math.min(99, Math.max(1, amount));

  for (let i = 0; i < amount; ++i) {
    startCrafting(player, recipe.recipe);
  }

  console.log("OK");
  return true;
});

rpc.registerWebview(ServerCall.FromWebview.CANCEL_CRAFTING, (player) => {
  needsToBeInGame(player);

  return cancelCrafting(player);
});

rpc.registerWebview(ServerCall.FromWebview.REMOVE_FROM_CRAFTING_QUEUE, (player, index) => {
  needsToBeInGame(player);

  return removeFromCraftingQueue(player, index);
});

rpc.registerWebview(ServerCall.FromWebview.UPGRADE_ITEM, (player, itemSource) => {
  needsToBeInGame(player);

  return upgradeItem(player, itemSource);
});

rpc.registerWebview(ServerCall.FromWebview.CANCEL_UPGRADING, (player) => {
  needsToBeInGame(player);

  return cancelUpgrading(player);
});
