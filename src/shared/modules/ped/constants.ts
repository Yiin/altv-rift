export enum PedType {
  STATIC = 0,
  DYNAMIC = 1,
}

export enum PedFlags {
  None = 0,
  Peaceful = 1 << 0,
  ShopKeeper = 1 << 1,
}
