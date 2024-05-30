import { z } from "zod";

export const FromServer = {} as const;

export interface CallFromServer {}

export const FromServerValidation = {} as Record<
  keyof typeof FromServer,
  { args?: [z.ZodTypeAny, ...z.ZodTypeAny[]]; returns?: z.ZodTypeAny }
>;
