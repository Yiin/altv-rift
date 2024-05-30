export function makeEnum<T extends { [index: string]: U }, U extends string>(x: T): T {
  return x;
}

export type MakeEnum<T> = T[keyof T];
