import alt from "@altv/shared";

export function distance(vector1: alt.IVector3, vector2: alt.IVector3): number {
  if (vector1 === undefined || vector2 === undefined) {
    throw new Error("AddVector => vector1 or vector2 is undefined");
  }

  return Math.sqrt(
    (vector1.x - vector2.x) ** 2 + (vector1.y - vector2.y) ** 2 + (vector1.z - vector2.z) ** 2,
  );
}

export function distance2d(vector1: alt.IVector2, vector2: alt.IVector2): number {
  if (vector1 === undefined || vector2 === undefined) {
    throw new Error("AddVector => vector1 or vector2 is undefined");
  }

  return Math.sqrt((vector1.x - vector2.x) ** 2 + (vector1.y - vector2.y) ** 2);
}

export function getClosestVector(
  pos: alt.IVector3,
  arrayOfPositions: alt.IVector3[],
): alt.IVector3 {
  arrayOfPositions.sort((a, b) => distance(pos, a) - distance(pos, b));

  return arrayOfPositions[0];
}

export function getClosestVectorByPos<T extends Record<string, alt.Vector3>>(
  pos: alt.IVector3,
  arrayOfPositions: T[],
  posVariable: string = "pos",
): T {
  arrayOfPositions.sort((a, b) => distance(pos, a[posVariable]!) - distance(pos, b[posVariable]!));

  return arrayOfPositions[0]!;
}

export function getClosest<T extends { pos: alt.IVector3 }>(
  pos: alt.Vector3,
  nodes: T[],
): T | null {
  let closest: T | null = null;
  let closestDistance = Infinity;

  for (const node of nodes) {
    const distance = pos.distanceTo(node.pos);
    if (distance < closestDistance) {
      closest = node;
      closestDistance = distance;
    }
  }

  return closest;
}

/**
 * Gets an array of the closest types.
 */
export function getClosestTypes<T extends { pos: alt.IVector3; valid: boolean }>(
  pos: alt.IVector3,
  elements: T[],
  maxDistance: number,
  mustHaveProperties: (keyof T)[] = [],
  positionName: keyof T = "pos",
): T[] {
  const newElements: T[] = [];

  for (const element of elements) {
    if (!element || !element.valid) {
      continue;
    }

    if (mustHaveProperties.length >= 1) {
      let isValid = true;
      for (const property of mustHaveProperties) {
        if (!element[property]) {
          isValid = false;
          break;
        }
      }

      if (!isValid) {
        continue;
      }
    }

    if (distance2d(pos, element[positionName] as alt.Vector2) > maxDistance) {
      continue;
    }

    newElements.push(element);
  }

  return newElements;
}

export function lerp(a: number, b: number, t: number): number {
  return (1 - t) * a + t * b;
}

export function vectorLerp(
  vector1: alt.IVector3,
  vector2: alt.IVector3,
  l: number,
  clamp: boolean,
) {
  if (clamp) {
    if (l < 0.0) {
      l = 0.0;
    }

    if (l > 0.0) {
      l = 1.0;
    }
  }

  const x = lerp(vector1.x, vector2.x, l);
  const y = lerp(vector1.y, vector2.y, l);
  const z = lerp(vector1.z, vector2.z, l);

  return { x, y, z };
}
