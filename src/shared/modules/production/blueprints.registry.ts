import { Blueprint } from "./types";

const blueprints = new Map<string, Blueprint>();

export function registerBlueprint(blueprint: Blueprint) {
  blueprints.set(blueprint.key, blueprint);
}

export function getBlueprint(key: string) {
  return blueprints.get(key);
}
