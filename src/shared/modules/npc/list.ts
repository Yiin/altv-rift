export const Npc = {
  CAL_BURNETT: "CAL_BURNETT",
  DIEGO_MOREIRA: "DIEGO_MOREIRA",
  FISHING_TUTOR: "GRACE_PORTER",
  MINING_TUTOR: "SAN_LEE",
  WOODCUTTING_TUTOR: "NATHAN_MONAHAN",
  CRAFTING_TUTOR: "SARA_MATTHEWS",
} as const;

export type Npc = (typeof Npc)[keyof typeof Npc];
