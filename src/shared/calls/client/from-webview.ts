import { z } from "zod";

export const FromWebview = {} as const;

export interface CallFromWebview { }

export const FromWebviewValidation = {
} satisfies Record<keyof typeof FromWebview, { args?: [z.ZodTypeAny, ...z.ZodTypeAny[]], returns?: z.ZodTypeAny }>;
