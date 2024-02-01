import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { container } from "@shared/dependency-injection";

// Enhancing type safety in utility functions
export const isUnique = <Model extends keyof PrismaModels, Field extends keyof PrismaModels[Model]>(
  model: Model,
  field: Field,
  message: string
) =>
  z.string().refine(async (value) => {
    const delegate = container.get(PrismaClient)[model] as any;
    const result = await delegate.findUnique({
      where: { [field]: value },
    });
    return !result;
  }, { message });

export const exists = <Model extends keyof PrismaModels, Field extends keyof PrismaModels[Model]>(
  model: Model,
  field: Field,
  message: string
) =>
  z.string().refine(async (value) => {
    const delegate = container.get(PrismaClient)[model] as any;
    const result = await delegate.findFirst({
      where: { [field]: value },
    });
    return !!result;
  }, { message });
