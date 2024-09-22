import { Item } from "../items";
import { isMatchingPart } from "./production.api";
import { Blueprint, BlueprintRecipe } from "./types";

const blueprints = new Map<string, Blueprint>();

export async function initializeBlueprints(fn: () => void) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  fn();
}

export function registerBlueprint(blueprint: Blueprint): void {
  blueprints.set(blueprint.key, blueprint);
}

export function getBlueprints(): Blueprint[] {
  return [...blueprints.values()];
}

export function getBlueprint(key: string): Blueprint | undefined {
  return blueprints.get(key);
}

export function getRecipeByKey(key: string) {
  for (const blueprint of blueprints.values()) {
    const recipe = blueprint.recipes.find((recipe) => recipe.key === key);

    if (recipe) {
      return {
        recipe,
        blueprint,
      };
    }
  }
  return null;
}

export function getUpgradeRecipe(
  item: Item,
  blueprints = getBlueprints(),
): BlueprintRecipe | undefined {
  return blueprints
    .flatMap((blueprint) => blueprint.recipes ?? [])
    .find(({ parts, isUpgrade }) => isUpgrade && isMatchingPart(parts[0], item));
}
