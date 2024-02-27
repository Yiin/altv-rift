export enum ItemFlags {
  None = 0,
  IsStackable = 1 << 0,
  IsEquippable = 1 << 1,
  IsUsable = 1 << 2,
  DestroyOnDrop = 1 << 3,
  IsPreviewable = 1 << 4,
}

export enum ItemGrade {
  BASE = '',
  ONE = '+',
  TWO = '++',
  THREE = '+++',
  FOUR = '++++',
}

export enum ItemTier {
  S = 'S',
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
}
