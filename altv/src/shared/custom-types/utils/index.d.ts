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

// Identify keys in T that have null in their type
type NullableKeys<T> = {
  [K in keyof T]: null extends T[K] ? K : never;
}[keyof T];

// Helper to check if type is an object (for recursion)
type IsObject<T> = T extends object ?
  T extends any[] ? false : true
  : false;

// Recursive type to add undefined to nullable fields
type OptionalNullable<T> = {
  [K in keyof T]:
  // Add undefined if field is nullable
  null extends T[K] ? T[K] | undefined :
  // Recursively process if it's an object
  IsObject<T[K]> extends true ? OptionalNullable<T[K]> :
  // Otherwise, keep the original type
  T[K];
};

type MaybePromise<T> = T | Promise<T>;

type WritableKeysOf<T> = {
  [K in keyof T]-?: IfEquals<{ [Q in K]: T[K] }, { -readonly [Q in K]: T[K] }, K, never> extends never
  ? never
  : T[K] extends Function
  ? never
  : K
}[keyof T];

type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? A : B;

type WritablePropertiesOf<T> = Pick<T, WritableKeysOf<T>>;

type Override<A, B> = Omit<A, keyof B> & B;
