interface ReadonlyMap<T extends readonly [PropertyKey, any], K extends T[0]>
  extends Map<K, Flatten<T[1]>> {
  get<S extends K>(k: S): Flatten<Extract<T, readonly [S, any]>[1]>;
}

export const ReadonlyMap = Map as new <T extends readonly [PropertyKey, any], K extends T[0]>(
  entries: ReadonlyArray<T>,
) => ReadonlyMap<T, K>;
