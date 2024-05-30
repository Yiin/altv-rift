/**
 * Returns the elements present in A
 * but are not present in B.
 */
export function findMissingElements<T extends Record<any, any>>(
  a: T[],
  b: T[],
  propertyName: string,
): T[] {
  const missing: T[] = [];

  for (const y of b) {
    // If 'A' array has element from 'B' array then it is not missing.
    if (a.some((x) => x[propertyName] === y[propertyName])) {
      continue;
    }

    missing.push(y);
  }

  return missing;
}
