import { canCraftRecipe, craftRecipe, getBlueprint } from "@shared/modules/production";
import { ServerCall } from "@shared/calls/server";
import { rpc } from "@/core/rpc";
import { needsToBeInGame } from "@/core/utility/assertions";
import { startCrafting } from "./api/start-crafting-recipe";

rpc.registerWebview(ServerCall.FromWebview.CRAFT_ITEM, (player, blueprintKey, recipeIndex) => {
  needsToBeInGame(player);

  const hasBlueprint = player.character.blueprints.includes(blueprintKey);

  if (!hasBlueprint) {
    return false;
  }

  const blueprint = getBlueprint(blueprintKey);

  if (!blueprint) {
    return false;
  }

  const recipe = blueprint.recipes.at(recipeIndex);

  if (!recipe) {
    return false;
  }

  if (!canCraftRecipe(recipe, player.character.inventory)) {
    return false;
  }

  startCrafting(player, recipe);

  return true;
});
