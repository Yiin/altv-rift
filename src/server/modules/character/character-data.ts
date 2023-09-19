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
  const { x, y } = getRandomPositionInsideCircle(4476.591796875, -4495.673828125, 25);

  return {
    ...defaultData,
    lastPosition: { x, y, z: 4.190207481384277 },
  };
}

function getRandomPositionInsideCircle(x: number, y: number, radius: number) {
  const angle = Math.random() * Math.PI * 2;
  const r = Math.random() * radius;

  return {
    x: x + r * Math.cos(angle),
    y: y + r * Math.sin(angle),
  };
}
