import * as alt from "@altv/shared";
import { distance } from "./vector";

const DEFAULT_START_DISTANCE = 100;

export function getClosestOfType<T = { pos: alt.IVector3 }>(
  pos: alt.IVector3,
  elements: readonly (T & { pos: alt.IVector3 })[]
): T | undefined {
  let lastDistance = DEFAULT_START_DISTANCE;
  let lastClosest;

  for (const element of elements) {
    const dist = distance(pos, element.pos);
    if (dist < lastDistance) {
      lastClosest = element;
      lastDistance = dist;
    }
  }

  return lastClosest;
}
