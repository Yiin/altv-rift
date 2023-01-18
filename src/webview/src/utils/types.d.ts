type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type CheckOptionalProp<T, P extends keyof T> = T extends { [K in P]?: any }
  ? true
  : false;

type IsPropOptional<T, P extends keyof T> = CheckOptionalProp<T, P> extends true
  ? false
  : true;

type ToPrimitiveType<T> = T extends any[]
  ? { -readonly [K in keyof T]: ToPrimitiveType<T[K]> }
  : T extends object
  ? { -readonly [K in keyof T]: ToPrimitiveType<T[K]> }
  : T extends string
  ? string
  : T extends number
  ? number
  : T extends boolean
  ? boolean
  : T;

type FlattenPrimitive<T, I = UnionToIntersection<T>> = T extends any
  ? {
      [K in keyof I]: IsPropOptional<T, K> extends true
        ? I[K] | undefined
        : I[K];
    }
  : never;

type Flatten<T> = FlattenPrimitive<ToPrimitiveType<T>>;

type Foo = { a: 1 } | { a: 2; b: 3 };
type Result = Flatten<Foo>;

declare var result: Result;

const { a, b } = result;
