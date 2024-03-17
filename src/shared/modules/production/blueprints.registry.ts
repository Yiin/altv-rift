import { Blueprint } from "./types";

const blueprints = new Map<string, Blueprint>();

export function registerBlueprint(blueprint: Blueprint) {
  blueprints.set(blueprint.key, blueprint);
}

export function getBlueprints() {
  return [...blueprints.values()];
}

export function getBlueprint(key: string) {
  return blueprints.get(key);
}
