import alt from "@altv/shared";
import earcut from "earcut";

/**
 * Get a random number between min and max (max excluded)
 */
export function randomNumberBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Get a random number between min and max (max included)
 */
export function randomNumberBetweenInclusive(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Get a random color excluding alpha
 */
export function getRandomRGB(alpha = 255): alt.RGBA {
  const r = randomNumberBetween(0, 255);
  const g = randomNumberBetween(0, 255);
  const b = randomNumberBetween(0, 255);
  return new alt.RGBA(r, g, b, alpha);
}

/**
 * Get a random color including random alpha
 */
export function getRandomRGBA(): alt.RGBA {
  const r = randomNumberBetween(0, 255);
  const g = randomNumberBetween(0, 255);
  const b = randomNumberBetween(0, 255);
  const a = randomNumberBetween(0, 255);
  return new alt.RGBA(r, g, b, a);
}

export function randomPointInTriangle(a: alt.Vector3, b: alt.Vector3, c: alt.Vector3): alt.Vector3 {
  const r1 = Math.sqrt(Math.random());
  const r2 = Math.random();

  const x = (1 - r1) * a.x + r1 * (1 - r2) * b.x + r1 * r2 * c.x;
  const y = (1 - r1) * a.y + r1 * (1 - r2) * b.y + r1 * r2 * c.y;

  return new alt.Vector3(x, y, a.z);
}

export function randomPointInPolygon(polygon: alt.Vector3[]): alt.Vector3 {
  const triangles = earcut(polygon.flatMap(({ x, y }) => [x, y]));
  const areas: number[] = [];

  for (let i = 0; i < triangles.length; i += 3) {
    const a = polygon[triangles[i]];
    const b = polygon[triangles[i + 1]];
    const c = polygon[triangles[i + 2]];
    const areaOfTriangle = Math.abs(
      (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)) / 2.0,
    );
    areas.push(areaOfTriangle);
  }

  const totalArea = areas.reduce((acc, area) => acc + area, 0);
  const r = Math.random() * totalArea;
  let cumulativeArea = 0;

  for (let i = 0; i < triangles.length; i += 3) {
    cumulativeArea += areas[i / 3];
    if (r <= cumulativeArea) {
      return randomPointInTriangle(
        polygon[triangles[i]],
        polygon[triangles[i + 1]],
        polygon[triangles[i + 2]],
      );
    }
  }

  throw new Error("Failed to generate random point in polygon.");
}

export function rollItem<T>(items: [weight: number, item: T][], seed = Math.random()): T {
  if (items.length === 0) {
    return undefined as T;
  }

  const totalWeight = items.reduce((acc, [weight]) => acc + weight, 0);
  const randomNumber = seed * totalWeight;

  let partialSum = 0;

  for (const [weight, item] of items) {
    partialSum += weight;
    if (partialSum >= randomNumber) {
      return item;
    }
  }

  return items[items.length - 1][1];
}
