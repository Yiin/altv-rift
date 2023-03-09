type Asyncify<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => infer R
    ? R extends void
      ? (...args: Parameters<T[K]>) => any
      : T[K]
    : T[K];
};

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type IsPropOptional<T, P extends keyof T> = (
  T extends { [K in P]?: any } ? true : false
) extends true
  ? false
  : true;

type UnwrapLiteralType<T> = T extends object
  ? { [K in keyof T]: UnwrapLiteralType<T[K]> }
  : T extends string
  ? string
  : T extends number
  ? number
  : T extends boolean
  ? boolean
  : T extends symbol
  ? symbol
  : T;

type Flatten<T, A = UnwrapLiteralType<T>, B = UnionToIntersection<A>> = {
  // @ts-ignore-next-line
  [K in keyof B]: IsPropOptional<T, K> extends true ? B[K] | undefined : B[K];
};

declare const brand: unique symbol;
type Brand<T, U> = T & { [brand]: U };
