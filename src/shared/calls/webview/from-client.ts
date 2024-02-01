import { z } from "zod";

export const FromClient = {} as const;

export interface CallFromClient { }

export const FromClientValidation = {
} as Record<keyof typeof FromClient, { args?: [z.ZodTypeAny, ...z.ZodTypeAny[]], returns?: z.ZodTypeAny }>;