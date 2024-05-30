import { z } from "zod";

export const FromServer = {
  ENTITYSET_IS_ACTIVE: "ENTITYSET_IS_ACTIVE",
} as const;

export interface CallFromServer {
  [FromServer.ENTITYSET_IS_ACTIVE]: (interior: number, entitySetName: string) => boolean;
}

export const FromServerValidation = {
  [FromServer.ENTITYSET_IS_ACTIVE]: {
    args: [z.number(), z.string()],
    returns: z.boolean(),
  },
} satisfies Record<
  keyof typeof FromServer,
  { args?: [z.ZodTypeAny, ...z.ZodTypeAny[]]; returns?: z.ZodTypeAny }
>;
