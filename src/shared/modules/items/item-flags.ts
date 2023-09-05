export enum ItemFlags {
  None = 0,
  IsStackable = 1 << 0,
  IsEquippable = 1 << 1,
  IsUsable = 1 << 2,
  IsEdible = 1 << 3,
}
