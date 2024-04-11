type Asyncify<T> =
  | (T extends (...args: infer A) => infer R ? (...args: A) => Promise<R> : never)
  | T;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never;

type IsPropOptional<T, P extends keyof T> = (
  T extends { [K in P]?: any } ? true : false
) extends true
  ? false
  : true;

/* eslint-disable prettier/prettier */
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

type Shift<T extends any[]> = ((...args: T) => any) extends (arg1: any, ...rest: infer R) => any
  ? R
  : never;

type NullableKeys<T> = {
  [K in keyof T]: UnionToIntersection<T[K]> extends null
    ? K
    : UnionToIntersection<T[K]> extends Array<any>
    ? K
    : never;
}[keyof T];
type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
type OptionalNullable<T> = Optional<T, NullableKeys<T>>;

type MaybePromise<T> = T | Promise<T>;
