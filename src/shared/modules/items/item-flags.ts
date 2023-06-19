export enum ItemFlags {
  None = 0,
  IsStackable = 1 << 0,
  IsEquippable = 1 << 1,
  IsConsumable = 1 << 2,
}
