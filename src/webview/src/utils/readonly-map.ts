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

interface ReadonlyMap<T extends readonly [PropertyKey, any], K extends T[0]>
  extends Map<K, Flatten<T[1]>> {
  get<S extends K>(k: S): Flatten<Extract<T, readonly [S, any]>[1]>;
}

export const ReadonlyMap = Map as new <
  T extends readonly [PropertyKey, any],
  K extends T[0]
>(
  entries: ReadonlyArray<T>
) => ReadonlyMap<T, K>;
