import { Blueprint } from "./types";

const blueprints = new Map<string, Blueprint>();

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
