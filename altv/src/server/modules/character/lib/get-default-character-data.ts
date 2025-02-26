import { Prisma } from "@prisma/client";
import _ from "lodash";
import { getRandomPointInCircle } from "@shared/utility/random";

type CharacterData = Omit<Prisma.CharacterCreateInput, "user" | "name" | "appearance">;

const defaultData = {
  money: 1000,
  inventory: {
    items: [],
    size: 24,
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
    quick1: null,
    quick2: null,
    quick3: null,
    quick4: null,
    quick5: null,
  },
  skills: {
    woodcutting: {
      exp: 0,
      learnedSkills: [],
    },
    fishing: {
      exp: 0,
      learnedSkills: [],
    },
    mining: {
      exp: 0,
      learnedSkills: [],
    },
    crafting: {
      exp: 0,
      learnedSkills: [],
    },
    medic: {
      exp: 0,
      learnedSkills: [],
    },
    engineer: {
      exp: 0,
      learnedSkills: [],
    },
    farmer: {
      exp: 0,
      learnedSkills: [],
    },
    foodDelivery: {
      exp: 0,
      learnedSkills: [],
    },
    cargoCarrier: {
      exp: 0,
      learnedSkills: [],
    },
    firefighter: {
      exp: 0,
      learnedSkills: [],
    },
    builder: {
      exp: 0,
      learnedSkills: [],
    },
    electrician: {
      exp: 0,
      learnedSkills: [],
    },
    plumber: {
      exp: 0,
      learnedSkills: [],
    },
    mechanic: {
      exp: 0,
      learnedSkills: [],
    },
    gardener: {
      exp: 0,
      learnedSkills: [],
    },
    mortician: {
      exp: 0,
      learnedSkills: [],
    },
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
