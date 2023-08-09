export const Npc = {
  CAL_BURNETT: "CAL_BURNETT",
  DIEGO_MOREIRA: "DIEGO_MOREIRA",
} as const;

export type Npc = (typeof Npc)[keyof typeof Npc];
