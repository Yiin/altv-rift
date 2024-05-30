import { isEqual } from "lodash";

export function findPath(obj: any, value: any, path: string[] = []): string[] | null {
  if (obj === value) {
    return path;
  }
  if (typeof obj === "object") {
    for (const key in obj) {
      const result = findPath(obj[key], value, path.concat(key));
      if (result) {
        return result;
      }
    }
  }
  return null;
}

export function findPathApproximate(obj: any, value: any, path: string[] = []): string[] | null {
  if (isEqual(obj, value)) {
    return path;
  }
  if (typeof obj === "object") {
    for (const key in obj) {
      const result = findPathApproximate(obj[key], value, path.concat(key));
      if (result) {
        return result;
      }
    }
  }
  return null;
}
