import { Prisma } from "@prisma/client";
import _ from "lodash";
import { getRandomPointInCircle } from "@shared/utility/random";

type CharacterData = Omit<Prisma.CharacterCreateInput, "user" | "name" | "appearance">;

const defaultData = {
  inventory: {
    items: [],
    size: 25,
  },
  equipment: {
    mask: null,
    glasses: null,
    headwear: null,
    earrings: null,
    top: null,
    armor: null,
    accessory: null,
    weapon: null,
    gloves: null,
    lefthand: null,
    pants: null,
    righthand: null,
    backpack: null,
    shoes: null,
    phone: null,
  },
  skills: {
    woodcutting: 0,
    fishing: 0,
    mining: 0,
  },
} as const satisfies Partial<CharacterData>;

export function getDefaultCharacterData() {
  const { x, y } = getRandomPointInCircle(4476.591796875, -4495.673828125, 25);

  return {
    ...defaultData,
    lastPosition: { x, y, z: 4.190207481384277 },
    rot: Math.random() * 360,
  };
}
