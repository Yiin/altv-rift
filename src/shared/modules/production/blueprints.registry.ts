import { Blueprint } from "./types";

const blueprints = new Map<string, Blueprint>();

export function registerBlueprint<T extends Blueprint>(blueprint: T) {
  blueprints.set(blueprint.key, blueprint);
}

export function getBlueprint(key: string) {
  return blueprints.get(key);
}
