export enum PedType {
  STATIC = 0,
  DYNAMIC = 1,
}

export enum NpcFlags {
  None = 0,
  Talkable = 1 << 0,
  Peaceful = 1 << 1,
  Shop = (1 << 2) | Talkable | Peaceful,
  Quest = (1 << 3) | Talkable | Peaceful,
}
