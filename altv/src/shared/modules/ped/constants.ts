export const PED_HEALTH_ZERO_DEFAULT = 99;
export const PED_HEALTH_ZERO = 0;

export enum PedType {
  STATIC = 0,
  DYNAMIC = 1,
}

export enum PedFlags {
  None = 0,
  Peaceful = 1 << 0,
  ShopKeeper = 1 << 1,
  Enemy = 1 << 2,
}
