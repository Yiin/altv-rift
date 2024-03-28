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
