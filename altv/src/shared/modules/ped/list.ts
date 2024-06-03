export const PedKey = {
  CAL_BURNETT: "CAL_BURNETT",
  DIEGO_MOREIRA: "DIEGO_MOREIRA",
  FISHING_TUTOR: "GRACE_PORTER",
  MINING_TUTOR: "SAN_LEE",
  WOODCUTTING_TUTOR: "NATHAN_MONAHAN",
  CRAFTING_TUTOR: "SARA_MATTHEWS",

  JOHN_WICK: "JOHN_WICK",
} as const;

export type PedKey = (typeof PedKey)[keyof typeof PedKey];
