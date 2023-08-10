import { Prisma } from "@prisma/client";

type CharacterData = Omit<Prisma.CharacterCreateInput, "user" | "name" | "appearance">;

const defaultData: CharacterData = {
  health: 100,
  lastPosition: { x: 155, y: 6634.86, z: 31.62 },
  rot: 88.9,
} as CharacterData;

export function registerCharacterData(data: Partial<CharacterData>) {
  Object.assign(defaultData, data);
}

export function getDefaultCharacterData() {
  return defaultData;
}
